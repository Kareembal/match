import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Heart, Users, Sparkles, Lock, Check, MapPin, Star, ChevronRight, Shield } from 'lucide-react';

const interestOptions = ['Music', 'Art', 'Travel', 'Food', 'Gaming', 'Fitness', 'Reading', 'Movies', 'Tech', 'Nature'];
const sampleMatches = [
  { id: 1, name: 'User #7a3f', compatibility: 87, interests: 4, isPremium: true },
  { id: 2, name: 'User #9b2c', compatibility: 74, interests: 3, isPremium: false },
];

export default function Matching() {
  const { connected } = useWallet();
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState({ interests: [] as string[], lookingFor: 'dating', location: '' });

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowResults(true);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="gradient-text" style={{ marginBottom: 'var(--space-4)' }}>Confidential Matching</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Find compatible people. Only mutual matches are revealed.</p>
          </motion.div>
        </div>

        {!connected ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', maxWidth: '500px', margin: '0 auto' }}>
            <Heart size={48} style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Connect to Start Matching</h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>Connect your wallet to create your encrypted profile</p>
            <WalletMultiButton />
          </div>
        ) : showResults ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2>Your Matches</h2>
                <p style={{ color: 'var(--text-tertiary)' }}>{sampleMatches.length} compatible profiles found</p>
              </div>
              <button className="btn btn-secondary" onClick={() => { setShowResults(false); setStep(1); }}>Update Preferences</button>
            </div>
            <div className="encryption-indicator" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="encryption-dot"></span>
              <Shield size={14} />
              <span>Match results encrypted — only you can see these</span>
            </div>
            {sampleMatches.map((match, i) => (
              <motion.div key={match.id} className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-4)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div className="match-avatar">{match.name.slice(-2).toUpperCase()}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="match-name">{match.name}</span>
                        {match.isPremium && <span className="badge badge-premium"><Sparkles size={10} /> Premium</span>}
                      </div>
                      <div className="match-compatibility"><Star size={12} /> {match.interests} shared interests</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: match.compatibility >= 80 ? 'var(--success)' : 'var(--warning)' }}>{match.compatibility}%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Compatibility</div>
                    </div>
                    <button className="btn btn-primary btn-icon"><ChevronRight size={20} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-8)' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step >= s ? 'var(--gradient-primary)' : 'var(--surface)', border: step >= s ? 'none' : '1px solid var(--border)', color: step >= s ? 'white' : 'var(--text-muted)', fontWeight: 600 }}>
                    {step > s ? <Check size={16} /> : s}
                  </div>
                  {s < 3 && <div style={{ width: '60px', height: '2px', background: step > s ? 'var(--primary)' : 'var(--border)', margin: '0 var(--space-2)' }} />}
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 'var(--space-8)' }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                      <Users size={40} style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)' }} />
                      <h3>What are you looking for?</h3>
                    </div>
                    {['dating', 'friends', 'networking'].map(opt => (
                      <div key={opt} className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-3)', cursor: 'pointer', border: profile.lookingFor === opt ? '2px solid var(--primary)' : undefined }} onClick={() => setProfile({ ...profile, lookingFor: opt })}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </div>
                    ))}
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }} onClick={() => setStep(2)}>Continue</button>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                      <Star size={40} style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)' }} />
                      <h3>Select Your Interests</h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                      {interestOptions.map(interest => (
                        <button key={interest} className={`badge ${profile.interests.includes(interest) ? 'badge-premium' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleInterestToggle(interest)}>
                          {profile.interests.includes(interest) && <Check size={12} />} {interest}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                      <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)} disabled={profile.interests.length < 3}>Continue</button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                      <MapPin size={40} style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)' }} />
                      <h3>Almost Done!</h3>
                    </div>
                    <input placeholder="Location (optional)" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} style={{ marginBottom: 'var(--space-6)' }} />
                    <div className="encryption-indicator" style={{ marginBottom: 'var(--space-6)' }}>
                      <span className="encryption-dot"></span>
                      <Lock size={14} />
                      <span>Preferences will be encrypted before submission</span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                      <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
                        <Heart size={18} /> Find Matches
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
