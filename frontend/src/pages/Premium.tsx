import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWallet } from '../hooks/usePrivyWallet';
import { Crown, Check, Loader2, ExternalLink, Zap, Eye, Shield, Sparkles } from 'lucide-react';
import { usePremium } from '../hooks/usePremium';

const benefits = [
  { icon: <Zap size={20} />, title: 'Unlimited', desc: 'No daily limits' },
  { icon: <Eye size={20} />, title: 'See Likes', desc: 'Know who liked you' },
  { icon: <Shield size={20} />, title: 'Priority', desc: 'Better encryption' },
  { icon: <Sparkles size={20} />, title: 'Badge', desc: 'Premium status' },
];

export default function Premium() {
  const { login } = usePrivy();
  const { connected, publicKey } = usePrivyWallet();
  const { purchasePremium, isPurchasing, isPremium, premiumPrice } = usePremium();
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    setError(null);
    const sig = await purchasePremium();
    if (sig) {
      setTxSignature(sig);
    } else {
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              <Crown size={14} /> Premium
            </div>
            <h1 className="page-title">
              {isPremium ? <>You're <span className="accent">Premium</span></> : <>Get <span className="accent">Premium</span></>}
            </h1>
            <p className="page-subtitle">
              {isPremium ? 'Enjoy unlimited access' : 'Unlock all features'}
            </p>
          </motion.div>
        </div>

        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <motion.div 
            className={`card ${isPremium ? 'card-accent' : ''}`}
            style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isPremium ? (
              <>
                <div style={{ width: 72, height: 72, background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Crown size={32} color="white" />
                </div>
                <h3 style={{ marginBottom: 8 }}>Premium Active</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                  You have full access to all features
                </p>
                <div className="badge badge-success">
                  <Check size={12} /> Verified
                </div>
              </>
            ) : !connected ? (
              <>
                <Crown size={48} style={{ color: 'var(--text-muted)', marginBottom: 20 }} />
                <h3 style={{ marginBottom: 8 }}>Sign In Required</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
                  Sign in to purchase premium
                </p>
                <button className="btn btn-primary" onClick={login}>Sign In</button>
              </>
            ) : (
              <>
                <Crown size={48} style={{ color: 'var(--accent)', marginBottom: 16 }} />
                
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                    {premiumPrice}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>SOL (one-time)</div>
                </div>
                
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  style={{ width: '100%', marginBottom: 16 }}
                >
                  {isPurchasing ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Crown size={18} /> Buy Premium</>
                  )}
                </button>

                <p className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-6)}
                </p>

                {error && (
                  <div style={{ marginTop: 16, padding: 12, background: 'rgba(244, 63, 94, 0.1)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--error)' }}>
                    {error}
                  </div>
                )}

                {txSignature && (
                  <motion.a 
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-success"
                    style={{ marginTop: 16, width: '100%', justifyContent: 'center', padding: '10px 16px' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Check size={14} /> Success! View TX <ExternalLink size={12} />
                  </motion.a>
                )}
              </>
            )}
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="card"
                style={{ padding: 16, textAlign: 'center' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: 8 }}>{b.icon}</div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: 2 }}>{b.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
