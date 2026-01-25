import React, { useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { DAILY_CHECKIN_REWARD } from '../constants';

interface HomeViewProps {
  profile: UserProfile | null;
  setActiveTab: (tab: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ profile, setActiveTab }) => {
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState('');

  const handleDailyCheckIn = async () => {
    if (!profile) return;
    
    const now = Date.now();
    const lastCheckIn = profile.lastDailyCheckIn || 0;
    const cooldown = 24 * 60 * 60 * 1000;

    if (now - lastCheckIn < cooldown) {
      const remaining = cooldown - (now - lastCheckIn);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      setMessage(`Locked for ${hours}h`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setCheckingIn(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', profile.uid);
        const userSnapshot = await transaction.get(userRef);
        if (!userSnapshot.exists()) return;

        const data = userSnapshot.data();
        transaction.update(userRef, {
          balance: (data.balance || 0) + DAILY_CHECKIN_REWARD,
          todayEarnings: (data.todayEarnings || 0) + DAILY_CHECKIN_REWARD,
          lifetimeEarnings: (data.lifetimeEarnings || 0) + DAILY_CHECKIN_REWARD,
          lastDailyCheckIn: now
        });
      });
      setMessage('₹1.00 Received!');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Premium Wallet Card */}
      <div className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-[0_20px_50px_rgba(37,99,235,0.08)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <div className="w-16 h-16 bg-blue-50 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Current Balance</p>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-8 flex items-baseline">
            <span className="text-2xl text-blue-600 mr-1">₹</span>
            {profile?.balance || 0}<span className="text-slate-300 text-2xl font-bold">.00</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-0.5">Today</p>
              <p className="font-extrabold text-lg text-slate-800">₹{profile?.todayEarnings || 0}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mb-0.5">Lifetime</p>
              <p className="font-extrabold text-lg text-slate-800">₹{profile?.lifetimeEarnings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleDailyCheckIn}
          disabled={checkingIn}
          className="bg-white border border-slate-100 p-5 rounded-[28px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-center">
            <span className="block font-extrabold text-slate-900 text-sm">Check-in</span>
            <span className="text-[10px] text-blue-600 font-black uppercase">+₹1.00 Reward</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('earn')}
          className="bg-blue-600 border border-blue-500 p-5 rounded-[28px] flex flex-col items-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div className="text-center">
            <span className="block font-extrabold text-white text-sm">Hot Offers</span>
            <span className="text-[10px] text-blue-100 font-black uppercase">₹20.00 / App</span>
          </div>
        </button>
      </div>

      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-2xl animate-bounce">
          {message}
        </div>
      )}

      {/* Trust & Guide Section */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-7 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          Quick Start Guide
        </h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600">01</div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Browse Apps</p>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">Select high-payout verified CPA offers.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600">02</div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Follow Steps</p>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">Install, open, and register as required.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center font-black text-blue-600">03</div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Instant Credit</p>
              <p className="text-slate-400 text-xs mt-0.5 font-medium">Earned ₹ is added to your wallet instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;