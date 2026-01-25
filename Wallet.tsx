import React, { useState, useEffect } from 'react';
import { UserProfile, WithdrawalRequest } from '../types';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { MIN_WITHDRAWAL } from '../constants';

interface WalletViewProps {
  profile: UserProfile | null;
}

const WalletView: React.FC<WalletViewProps> = ({ profile }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [withdrawDetails, setWithdrawDetails] = useState({
    amount: '',
    method: 'UPI' as const,
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    mobile: ''
  });

  useEffect(() => {
    fetchHistory();
    checkPendingWithdrawal();
  }, [profile]);

  const checkPendingWithdrawal = async () => {
    if (!profile) return;
    const q = query(collection(db, 'withdrawals'), 
      where('userId', '==', profile.uid),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    setHasPending(!snap.empty);
  };

  const fetchHistory = async () => {
    if (!profile) return;
    try {
      const q = query(
        collection(db, 'wallet_transactions'), 
        where('userId', '==', profile.uid),
        orderBy('time', 'desc')
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (hasPending) {
      alert("You already have a pending withdrawal request.");
      return;
    }

    const amountNum = Number(withdrawDetails.amount);
    if (amountNum < MIN_WITHDRAWAL) {
      alert(`Min. withdrawal ₹${MIN_WITHDRAWAL}`);
      return;
    }
    if (amountNum > (profile.balance || 0)) {
      alert("Insufficient funds!");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', profile.uid);
        const userSnap = await transaction.get(userRef);
        if (!userSnap.exists()) return;

        const currentBalance = userSnap.data().balance || 0;
        if (currentBalance < amountNum) throw "Balance updated remotely. Insufficient funds.";

        // 1. Withdrawal Doc
        const withdrawRef = doc(collection(db, 'withdrawals'));
        transaction.set(withdrawRef, {
          userId: profile.uid,
          amount: amountNum,
          method: withdrawDetails.method,
          upiId: withdrawDetails.upiId,
          bankName: withdrawDetails.bankName,
          accountNumber: withdrawDetails.accountNumber,
          ifsc: withdrawDetails.ifsc,
          mobile: withdrawDetails.mobile,
          status: 'pending',
          createdAt: serverTimestamp()
        });

        // 2. Transaction Log (Immutable)
        const txRef = doc(collection(db, 'wallet_transactions'));
        transaction.set(txRef, {
          userId: profile.uid,
          amount: amountNum,
          type: 'WITHDRAWAL',
          status: 'PENDING',
          reason: `Withdrawal Request: ${withdrawDetails.method}`,
          time: serverTimestamp()
        });

        // 3. Atomic Debit
        transaction.update(userRef, {
          balance: currentBalance - amountNum
        });
      });

      alert("Withdrawal submitted for admin review.");
      setShowWithdrawForm(false);
      setHasPending(true);
      fetchHistory();
    } catch (e) {
      alert(typeof e === 'string' ? e : "Submission failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 text-center shadow-sm">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Available for Withdrawal</p>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-8">₹{profile?.balance || 0}</h2>
        <button 
          onClick={() => setShowWithdrawForm(true)}
          disabled={hasPending}
          className={`w-full py-5 rounded-[22px] font-black text-lg shadow-xl transition-all active:scale-95 ${hasPending ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 text-white shadow-blue-500/20'}`}
        >
          {hasPending ? 'PENDING APPROVAL' : 'WITHDRAW NOW'}
        </button>
        <p className="text-[10px] text-slate-400 font-bold mt-5 uppercase tracking-widest">Withdrawal Limit: ₹{MIN_WITHDRAWAL}+</p>
      </div>

      {showWithdrawForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 border-t border-slate-100 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Withdraw Funds</h3>
              <button onClick={() => setShowWithdrawForm(false)} className="text-slate-400 p-2 bg-slate-50 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Amount (₹)</label>
                  <input type="number" required min={MIN_WITHDRAWAL} placeholder="Min ₹499" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none focus:ring-2 focus:ring-blue-600" value={withdrawDetails.amount} onChange={e => setWithdrawDetails({...withdrawDetails, amount: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">UPI ID</label>
                  <input type="text" required placeholder="example@upi" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none" value={withdrawDetails.upiId} onChange={e => setWithdrawDetails({...withdrawDetails, upiId: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Bank Name</label>
                  <input type="text" required placeholder="ICICI, SBI..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none" value={withdrawDetails.bankName} onChange={e => setWithdrawDetails({...withdrawDetails, bankName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">IFSC Code</label>
                  <input type="text" required placeholder="HDFC000..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none" value={withdrawDetails.ifsc} onChange={e => setWithdrawDetails({...withdrawDetails, ifsc: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Account Number</label>
                  <input type="text" required placeholder="1234 5678 9012" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none" value={withdrawDetails.accountNumber} onChange={e => setWithdrawDetails({...withdrawDetails, accountNumber: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mobile Number</label>
                  <input type="tel" required placeholder="+91 00000 00000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-1 font-bold outline-none" value={withdrawDetails.mobile} onChange={e => setWithdrawDetails({...withdrawDetails, mobile: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-transform">REQUEST DISBURSEMENT</button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 text-lg">Transaction History</h3>
        {loading ? (
          <div className="space-y-3">
             {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-[24px] skeleton" />)}
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white border border-slate-100 p-12 rounded-[32px] text-center">
            <p className="text-slate-400 font-medium">No activity recorded yet.</p>
          </div>
        ) : (
          history.map(tx => (
            <div key={tx.id} className="bg-white border border-slate-100 p-5 rounded-[28px] flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'WITHDRAWAL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  {tx.type === 'WITHDRAWAL' ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm leading-tight">{tx.reason || 'Reward Credit'}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                    {tx.time?.seconds ? new Date(tx.time.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Processing...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg ${tx.type === 'WITHDRAWAL' ? 'text-red-500' : 'text-blue-600'}`}>
                  {tx.type === 'WITHDRAWAL' ? '-' : '+'}₹{tx.amount}
                </p>
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletView;