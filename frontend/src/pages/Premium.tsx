import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Crown, Check, Loader2, ExternalLink, Sparkles, Shield, Zap, Eye } from 'lucide-react';
import { usePremium } from '../hooks/usePremium';

const benefits = [
  { icon: <Zap size={18} />, title: 'Unlimited Access', desc: 'No daily limits' },
  { icon: <Eye size={18} />, title: 'See Likes', desc: 'Know who liked you' },
  { icon: <Shield size={18} />, title: 'Priority Privacy', desc: 'Enhanced encryption' },
  { icon: <Sparkles size={18} />, title: 'Premium Badge', desc: 'Stand out' },
];

export default function Premium() {
  const { connected, publicKey } = useWallet();
  const { purchasePremium, isPurchasing, isPremium, premiumPrice } = usePremium();
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handlePurchase = async () => {
    const sig = await purchasePremium();
    if (sig) {
      setTxSignature(sig);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge" style={{ marginBottom: 'var(--space-4)' }}>
              <Crown size={14} />
              Premium
            </div>
            <h1 className="page-title">
              {isPremium ? (
                <>You're <span className="accent">Premium</span></>
              ) : (
                <>Upgrade to <span className="accent">Premium</span></>
              )}
            </h1>
            <p className="page-subtitle">
              {isPremium ? 'Enjoy unlimited access and exclusive features' : 'Unlock unlimited access for ' + premiumPrice + ' SOL'}
            </p>
          </motion.div>
        </div>

        {/* Status Card */}
        <motion.div 
          className={`card ${isPremium ? 'card-accent' : ''}`}
          style={{ padding: 'var(--space-8)', textAlign: 'center', maxWidth: '500px', margin: '0 auto var(--space-8)' }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {isPremium ? (
            <>
              <div style={{ width: '64px', height: '64px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                <Crown size={28} color="white" />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Premium Active</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: 'var(--space-4)' }}>
                You have full access to all features
              </p>
              <div className="badge badge-success">
                <Check size={12} /> Verified
              </div>
            </>
          ) : !connected ? (
            <>
              <Crown size={40} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Connect Wallet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 'var(--space-6)' }}>
                Connect to purchase premium
              </p>
              <WalletMultiButton />
            </>
          ) : (
            <>
              <Crown size={40} style={{ color: 'var(--accent)', marginBottom: 'var(--space-4)' }} />
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Get Premium</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: 'var(--space-2)' }}>
                One-time payment
              </p>
              <p style={{ fontSize: '32px', fontWeight: 700, marginBottom: 'var(--space-6)', fontFamily: 'var(--font-display)' }}>
                {premiumPrice} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>SOL</span>
              </p>
              
              <button 
                className="btn btn-primary btn-lg"
                onClick={handlePurchase}
                disabled={isPurchasing}
                style={{ width: '100%', marginBottom: 'var(--space-4)' }}
              >
                {isPurchasing ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <><Crown size={18} /> Purchase Premium</>
                )}
              </button>

              <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
              </p>

              {txSignature && (
                <motion.a 
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge badge-success"
                  style={{ marginTop: 'var(--space-4)', width: '100%', justifyContent: 'center' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Check size={12} /> View Transaction <ExternalLink size={12} />
                </motion.a>
              )}
            </>
          )}
        </motion.div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', maxWidth: '800px', margin: '0 auto' }}>
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              className="card"
              style={{ padding: 'var(--space-5)', textAlign: 'center' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div style={{ color: 'var(--accent)', marginBottom: 'var(--space-2)' }}>{b.icon}</div>
              <h4 style={{ fontSize: '14px', marginBottom: 'var(--space-1)' }}>{b.title}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
