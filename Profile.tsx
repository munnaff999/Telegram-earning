
import React from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, setUser }) => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (e) {
      console.error(e);
      alert("Login failed.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      alert("Referral code copied!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mb-4 border-4 border-slate-800 shadow-xl">
          {profile?.displayName?.[0] || 'U'}
        </div>
        <h2 className="text-2xl font-black">{profile?.displayName || 'User'}</h2>
        <p className="text-slate-500 text-sm mb-6">{profile?.email || 'Anonymous Account'}</p>
        
        {!profile?.email && (
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Link Google Account
          </button>
        )}
      </div>

      {/* Referral System */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold text-lg mb-2">Refer & Earn</h3>
        <p className="text-slate-400 text-xs mb-4">Invite friends and earn ₹5 per friend + 10% lifetime commission.</p>
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-mono font-bold text-blue-500 text-lg">{profile?.referralCode || '------'}</span>
          <button 
            onClick={copyReferralCode}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl font-bold flex items-center justify-between text-slate-300">
          <span>Contact Support</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button className="w-full bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl font-bold flex items-center justify-between text-slate-300">
          <span>Terms & Conditions</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl font-bold text-center"
        >
          Logout
        </button>
      </div>

      <div className="text-center pb-6">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Version 1.0.4 PRODUCTION</p>
      </div>
    </div>
  );
};

export default ProfileView;
