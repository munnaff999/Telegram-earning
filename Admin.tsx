import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  where, 
  orderBy, 
  limit, 
  runTransaction,
  serverTimestamp 
} from 'firebase/firestore';

interface AdminViewProps {
  profile: UserProfile | null;
}

type AdminTab = 'WITHDRAWALS' | 'USERS' | 'ACTIVITY' | 'SYSTEM';

const AdminView: React.FC<AdminViewProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('WITHDRAWALS');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (profile?.isAdmin) fetchData();
  }, [profile, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'WITHDRAWALS') {
        const q = query(collection(db, 'withdrawals'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        setWithdrawals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else if (activeTab === 'USERS') {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        setUsers(snap.docs.map(d => d.data() as UserProfile));
      } else if (activeTab === 'ACTIVITY') {
        const q = query(collection(db, 'wallet_transactions'), orderBy('time', 'desc'), limit(100));
        const snap = await getDocs(q);
        setAuditLog(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleManualTx = async (userId: string, type: 'credit' | 'debit') => {
    const amountStr = prompt(`Enter amount to ${type}:`);
    const reason = prompt(`Enter reason for ${type}:`);
    if (!amountStr || isNaN(Number(amountStr)) || !reason) return;
    const amount = Math.abs(Number(amountStr));

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const snap = await transaction.get(userRef);
        if (!snap.exists()) return;
        const current = snap.data().balance || 0;
        const newBalance = type === 'credit' ? current + amount : current - amount;
        
        transaction.update(userRef, { balance: newBalance });
        transaction.set(doc(collection(db, 'wallet_transactions')), {
          userId,
          amount,
          type: type === 'credit' ? 'ADJUSTMENT' : 'WITHDRAWAL',
          status: 'COMPLETED',
          reason: `Admin: ${reason}`,
          time: serverTimestamp()
        });
      });
      alert("Transaction successful!");
      fetchData();
    } catch (e) {
      alert("Operation failed.");
    }
  };

  const approveWithdrawal = async (w: any) => {
    if (!confirm(`Confirm payout of ₹${w.amount} to ${w.upiId}?`)) return;
    try {
      await updateDoc(doc(db, 'withdrawals', w.id), { status: 'approved' });
      await updateDoc(doc(db, 'wallet_transactions'), { status: 'COMPLETED' }); // This logic needs a specific txId lookup or link
      alert("Disbursement approved.");
      fetchData();
    } catch (e) {
      alert("Error approving.");
    }
  };

  const toggleBan = async (uid: string, current: boolean) => {
    await updateDoc(doc(db, 'users', uid), { isBanned: !current });
    fetchData();
  };

  if (!profile?.isAdmin) return <div className="p-12 text-center font-bold text-red-600">UNAUTHORIZED ACCESS</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Master Control Panel</p>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        {(['WITHDRAWALS', 'USERS', 'ACTIVITY', 'SYSTEM'] as AdminTab[]).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${activeTab === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'WITHDRAWALS' && (
        <div className="space-y-4">
          {withdrawals.map(w => (
            <div key={w.id} className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-black text-slate-900">₹{w.amount}</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter mt-1">{w.method}: {w.upiId}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {w.status}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 p-3 rounded-2xl">
                <p>Bank: <span className="text-slate-800">{w.bankName}</span></p>
                <p>IFSC: <span className="text-slate-800">{w.ifsc}</span></p>
                <p className="col-span-2">A/C: <span className="text-slate-800">{w.accountNumber}</span></p>
                <p className="col-span-2">Mob: <span className="text-slate-800">{w.mobile}</span></p>
              </div>
              {w.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => approveWithdrawal(w)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-green-600/20">Approve</button>
                  <button onClick={() => updateDoc(doc(db, 'withdrawals', w.id), { status: 'rejected' })} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-xs uppercase">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="space-y-3">
          <input type="text" placeholder="Search by UID or Device..." className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {users.filter(u => u.uid.includes(searchQuery) || u.deviceId.includes(searchQuery)).map(u => (
            <div key={u.uid} className="bg-white border border-slate-200 p-5 rounded-[28px] flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 text-sm">{u.displayName}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">₹{u.balance} • Dev: {u.deviceId.substring(0,8)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleManualTx(u.uid, 'credit')} className="bg-blue-50 text-blue-600 w-8 h-8 rounded-lg font-black">+</button>
                <button onClick={() => toggleBan(u.uid, !!u.isBanned)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${u.isBanned ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{u.isBanned ? 'Unban' : 'Ban'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="space-y-2">
          {auditLog.map(tx => (
            <div key={tx.id} className="bg-white border border-slate-100 p-4 rounded-2xl text-[10px] flex justify-between items-center">
              <div>
                <span className={`font-black uppercase mr-2 ${tx.type === 'EARNING' ? 'text-green-600' : 'text-blue-600'}`}>{tx.type}</span>
                <span className="text-slate-600 font-medium">{tx.reason}</span>
                <p className="text-slate-400 mt-1 font-mono">{tx.userId.substring(0,10)}...</p>
              </div>
              <p className="font-black text-slate-900">₹{tx.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;