import React, { useState, useEffect } from 'react';
import { OFFERS } from '../constants';
import { UserProfile, CompletedOffer } from '../types';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

interface EarnViewProps {
  profile: UserProfile | null;
}

const EarnView: React.FC<EarnViewProps> = ({ profile }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'APPS' | 'SURVEYS'>('APPS');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedOffers();
  }, [profile]);

  const fetchCompletedOffers = async () => {
    if (!profile) return;
    const q = query(collection(db, 'completedOffers'), where('userId', '==', profile.uid));
    const querySnapshot = await getDocs(q);
    const ids = querySnapshot.docs.map(doc => (doc.data() as CompletedOffer).offerId);
    setCompletedIds(ids);
    setLoading(false);
  };

  const handleOfferClick = (offer: any) => {
    if (completedIds.includes(offer.id)) return;
    window.open(offer.link, '_blank');
    setVerifyingId(offer.id);
  };

  const handleVerify = async (offer: any) => {
    if (!profile) return;

    // Use deterministic ID: userId_offerId to block repeats at the DB level
    const completionDocId = `${profile.uid}_${offer.id}`;
    
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', profile.uid);
        const completionRef = doc(db, 'completedOffers', completionDocId);
        const txRef = doc(collection(db, 'wallet_transactions'));
        
        const userSnap = await transaction.get(userRef);
        const completionSnap = await transaction.get(completionRef);
        
        if (!userSnap.exists()) throw "User profile missing";
        if (completionSnap.exists()) throw "Offer already completed";

        // 1. Record completion
        transaction.set(completionRef, {
          userId: profile.uid,
          offerId: offer.id,
          amount: offer.reward,
          timestamp: Date.now()
        });

        // 2. Add to transaction history
        transaction.set(txRef, {
          userId: profile.uid,
          amount: offer.reward,
          type: 'EARNING',
          status: 'COMPLETED',
          reason: `Offer: ${offer.title}`,
          time: serverTimestamp()
        });

        // 3. Update Balance
        const data = userSnap.data();
        transaction.update(userRef, {
          balance: (data.balance || 0) + offer.reward,
          todayEarnings: (data.todayEarnings || 0) + offer.reward,
          lifetimeEarnings: (data.lifetimeEarnings || 0) + offer.reward
        });
      });
      
      setCompletedIds([...completedIds, offer.id]);
      setVerifyingId(null);
      alert(`Success! ₹${offer.reward} added to wallet.`);
    } catch (e) {
      console.error(e);
      alert(typeof e === 'string' ? e : "Verification failed. Rules blocked duplicate install.");
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button 
          onClick={() => setActiveCategory('APPS')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === 'APPS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          App Installs
        </button>
        <button 
          onClick={() => setActiveCategory('SURVEYS')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === 'SURVEYS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
        >
          Surveys
        </button>
      </div>

      {activeCategory === 'APPS' ? (
        <div className="space-y-4">
          {OFFERS.map((offer) => {
            const isCompleted = completedIds.includes(offer.id);
            return (
              <div key={offer.id} className={`bg-slate-900 border border-slate-800 p-4 rounded-3xl transition-all ${isCompleted ? 'opacity-50 grayscale' : 'hover:border-blue-500/50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={offer.icon} alt={offer.title} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-lg leading-tight">{offer.title}</h4>
                    <p className="text-slate-400 text-xs line-clamp-1">{offer.description}</p>
                    <div className="flex gap-2 mt-2">
                      {offer.steps.map((step, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">{step}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-500 font-black text-xl">₹{offer.reward}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Reward</p>
                  </div>
                </div>
                
                {verifyingId === offer.id ? (
                  <button 
                    onClick={() => handleVerify(offer)}
                    className="w-full bg-yellow-500 text-black font-black py-3 rounded-2xl active:scale-95 transition-transform animate-pulse"
                  >
                    CONFIRM COMPLETION
                  </button>
                ) : (
                  <button 
                    disabled={isCompleted}
                    onClick={() => handleOfferClick(offer)}
                    className={`w-full font-black py-3 rounded-2xl active:scale-95 transition-transform ${isCompleted ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'}`}
                  >
                    {isCompleted ? 'COMPLETED' : 'INSTALL NOW'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-xl">No Surveys Available</h3>
            <p className="text-slate-400 text-sm">Check back later for high-paying surveys.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnView;