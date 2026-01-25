import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot, writeBatch } from 'firebase/firestore';
import { UserProfile } from './types';

// Views
import HomeView from './views/Home';
import EarnView from './views/Earn';
import WalletView from './views/Wallet';
import ProfileView from './views/Profile';
import AdminView from './views/Admin';

// Components
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [deviceError, setDeviceError] = useState<string | null>(null);

  // Simple Device Fingerprint
  const getFingerprint = () => {
    const nav = window.navigator;
    const screen = window.screen;
    const signature = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      nav.hardwareConcurrency
    ].join('|');
    let hash = 0;
    for (let i = 0; i < signature.length; i++) {
      hash = ((hash << 5) - hash) + signature.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncUserProfile(firebaseUser);
      } else {
        await signInAnonymously(auth);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const syncUserProfile = async (firebaseUser: User) => {
    const fingerprint = getFingerprint();
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Use device_bindings collection for secure, permission-friendly check
      const deviceBindingRef = doc(db, 'device_bindings', fingerprint);
      const deviceBindingDoc = await getDoc(deviceBindingRef);
      
      if (deviceBindingDoc.exists() && deviceBindingDoc.data().userId !== firebaseUser.uid) {
        setDeviceError("Device already linked to another account. Contact support to change devices.");
        return;
      }

      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'User_' + fingerprint.substring(0, 4),
        balance: 0,
        todayEarnings: 0,
        lifetimeEarnings: 0,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        createdAt: Date.now(),
        isAdmin: false,
        isBanned: false,
        deviceId: fingerprint
      };

      const batch = writeBatch(db);
      batch.set(userRef, newProfile);
      batch.set(deviceBindingRef, { userId: firebaseUser.uid, createdAt: Date.now() });
      
      await batch.commit();
      setProfile(newProfile);
    } else {
      setProfile(userDoc.data() as UserProfile);
    }
  };

  if (loading) return <LoadingScreen />;

  if (deviceError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-white">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Security Block</h1>
        <p className="text-slate-500 mb-8">{deviceError}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Retry Login</button>
      </div>
    );
  }

  if (profile?.isBanned) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-white">
        <h1 className="text-3xl font-black text-red-600 mb-4">ACCOUNT FROZEN</h1>
        <p className="text-slate-500">Your account has been suspended due to suspicious activity or policy violation.</p>
        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support ID</p>
          <p className="font-mono text-sm text-slate-600">{profile.uid}</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView profile={profile} setActiveTab={setActiveTab} />;
      case 'earn': return <EarnView profile={profile} />;
      case 'wallet': return <WalletView profile={profile} />;
      case 'profile': return <ProfileView profile={profile} setUser={setUser} />;
      case 'admin': return <AdminView profile={profile} />;
      default: return <HomeView profile={profile} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 text-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/30 transform -rotate-3">X</div>
          <span className="font-extrabold text-xl tracking-tighter text-slate-900">XDEVIL<span className="text-blue-600 italic">EARN</span></span>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-blue-100">
          <span className="text-blue-600 font-extrabold text-lg">₹</span>
          <span className="font-black text-slate-900 text-lg">{(profile?.balance || 0).toLocaleString()}</span>
        </div>
      </header>

      <main className="pt-24 px-5 max-w-lg mx-auto">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={profile?.isAdmin} />
    </div>
  );
};

export default App;