import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWallet } from '../hooks/usePrivyWallet';
import { Heart, Users, Loader2, CheckCircle, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import { useMatching } from '../hooks/useMatching';

const interests = ['Music', 'Art', 'Tech', 'Sports', 'Travel', 'Food', 'Gaming', 'Fitness'];
const lookingForOptions = ['Friends', 'Dating', 'Networking', 'Any'];

export default function Matching() {
  const { login } = usePrivy();
  const { connected, publicKey } = usePrivyWallet();
  const { registerPreferences, isRegistering, error } = useMatching();
  
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState('Any');
  const [age, setAge] = useState(25);
  const [registered, setRegistered] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : prev.length < 5 ? [...prev, interest] : prev
    );
  };

  const handleRegister = async () => {
    setTxError(null);
    
    const interestIndexes = selectedInterests.map(i => interests.indexOf(i) + 1);
    const lookingForIndex = lookingForOptions.indexOf(lookingFor) + 1;
    
    const sig = await registerPreferences(interestIndexes, 18, 99, age, lookingForIndex);
    
    if (sig) {
      setTxSignature(sig);
      setRegistered(true);
    } else {
      setTxError(error || 'Transaction failed. Please try again.');
    }
  };

  if (!connected) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto', paddingTop: 60 }}>
            <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: 24 }} />
            <h2 style={{ marginBottom: 8 }}>Sign In Required</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              Sign in to set up matching preferences
            </p>
            <button className="btn btn-primary" onClick={login}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 500, margin: '0 auto', paddingTop: 40 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div style={{ width: 80, height: 80, background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} style={{ color: 'var(--success)' }} />
              </div>
              <h2 style={{ marginBottom: 8 }}>Success!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                Your preferences are now encrypted on-chain.
              </p>
              
              {txSignature && (
                <a 
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge badge-success"
                  style={{ marginBottom: 24, padding: '10px 16px' }}
                >
                  <CheckCircle size={14} /> Transaction Confirmed <ExternalLink size={12} />
                </a>
              )}

              <div className="card" style={{ padding: 24, textAlign: 'left', marginTop: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Your Profile</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {selectedInterests.map(i => (
                    <span key={i} className="badge badge-active">{i}</span>
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Looking for: <strong>{lookingFor}</strong> • Age: <strong>{age}</strong>
                </p>
              </div>

              <div className="card" style={{ padding: 24, marginTop: 16, textAlign: 'center' }}>
                <Shield size={24} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  No matches yet. Matches will appear when compatible users join.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Confidential <span className="accent">Matching</span></h1>
          <p className="page-subtitle">Find compatible connections privately</p>
        </div>

        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? 'var(--accent)' : 'var(--border)' }} />
            ))}
          </div>

          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            {step === 1 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Select Interests</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Choose up to 5 interests ({selectedInterests.length}/5)
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {interests.map(i => (
                    <button key={i} className={`badge ${selectedInterests.includes(i) ? 'badge-active' : ''}`} style={{ cursor: 'pointer', padding: '8px 16px' }} onClick={() => toggleInterest(i)}>
                      {i}
                    </button>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)} disabled={selectedInterests.length === 0}>
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Looking For</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>What type of connections?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {lookingForOptions.map(o => (
                    <button key={o} className={`card ${lookingFor === o ? 'card-accent' : ''}`} style={{ padding: 16, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)' }} onClick={() => setLookingFor(o)}>
                      {o}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Your Age</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>For age-appropriate matches</p>
                <div style={{ marginBottom: 24 }}>
                  <input type="number" value={age} onChange={(e) => setAge(parseInt(e.target.value) || 18)} min={18} max={99} style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700 }} />
                </div>

                {txError && (
                  <div style={{ marginBottom: 16, padding: 12, background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={16} /> {txError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRegister} disabled={isRegistering}>
                    {isRegistering ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Heart size={16} /> Save</>}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="card" style={{ padding: 16, marginTop: 24, textAlign: 'center' }}>
            <div className="status-indicator" style={{ marginBottom: 8 }}>
              <span className="status-dot"></span>
              <Shield size={12} />
              <span>Encrypted</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Preferences encrypted on-chain via Arcium MPC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
