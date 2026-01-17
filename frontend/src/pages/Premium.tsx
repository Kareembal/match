import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Crown, Check, Loader2, ExternalLink, Sparkles, Shield, Zap, Eye } from 'lucide-react';
import { usePremium } from '../hooks/usePremium';

const plans = [
  { 
    id: 'free', 
    name: 'Free', 
    price: '0', 
    period: 'forever', 
    features: ['5 confessions/day', 'Basic matching', 'Standard encryption'],
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: '0.1', 
    period: 'one-time', 
    features: ['Unlimited confessions', 'Advanced matching', 'See who likes you', 'Premium badge', 'Priority visibility'],
    popular: true,
  },
];

const benefits = [
  { icon: <Zap size={20} />, title: 'Unlimited Access', desc: 'No daily limits on confessions' },
  { icon: <Eye size={20} />, title: 'See Likes', desc: 'Know who liked your content' },
  { icon: <Shield size={20} />, title: 'Priority Privacy', desc: 'Enhanced encryption options' },
  { icon: <Sparkles size={20} />, title: 'Premium Badge', desc: 'Stand out in the community' },
];

export default function Premium() {
  const { connected, publicKey } = useWallet();
  const { purchasePremium, isPurchasing, premiumPrice } = usePremium();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [purchased, setPurchased] = useState(false);

  const handlePurchase = async () => {
    const sig = await purchasePremium();
    if (sig) {
      setTxSignature(sig);
      setPurchased(true);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge badge-accent mb-4" style={{ margin: '0 auto var(--space-4)' }}>
              <Crown size={14} />
              <span>Premium</span>
            </div>
            <h1 className="page-title">
              Upgrade to <span className="accent-text">Premium</span>
            </h1>
            <p className="page-subtitle">
              Unlock unlimited access and exclusive features
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', maxWidth: '700px', margin: '0 auto var(--space-12)' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              className={`card card-hover`}
              style={{ 
                padding: 'var(--space-8)', 
                cursor: 'pointer',
                border: selectedPlan === plan.id ? '2px solid var(--accent)' : undefined,
                position: 'relative'
              }}
              onClick={() => setSelectedPlan(plan.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.popular && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  Recommended
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>{plan.name}</h3>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>
                  {plan.price === '0' ? 'Free' : `${plan.price} SOL`}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{plan.period}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {plan.features.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Check size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Purchase Section */}
        <motion.div 
          className="card" 
          style={{ padding: 'var(--space-8)', textAlign: 'center', maxWidth: '500px', margin: '0 auto var(--space-12)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {!connected ? (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                Connect wallet to purchase premium
              </p>
              <WalletMultiButton />
            </>
          ) : purchased ? (
            <>
              <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                <Check size={24} style={{ color: 'var(--success)' }} />
              </div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>Purchase Successful!</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)', fontSize: '14px' }}>
                You now have Premium access
              </p>
              {txSignature && (
                <a 
                  href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ gap: 'var(--space-2)' }}
                >
                  <span>View Transaction</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </>
          ) : (
            <>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                Connected: <span className="font-mono">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
              </p>
              <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)', fontSize: '14px' }}>
                {selectedPlan === 'free' ? 'You already have free access' : `Pay ${premiumPrice} SOL for Premium`}
              </p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={handlePurchase}
                disabled={isPurchasing || selectedPlan === 'free'}
                style={{ width: '100%' }}
              >
                {isPurchasing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : selectedPlan === 'free' ? (
                  'Current Plan'
                ) : (
                  <>
                    <Crown size={18} />
                    <span>Purchase Premium</span>
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>

        {/* Benefits */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>Premium Benefits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="card"
                style={{ padding: 'var(--space-5)', textAlign: 'center' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: 'var(--space-3)' }}>{b.icon}</div>
                <h4 style={{ fontSize: '14px', marginBottom: 'var(--space-1)' }}>{b.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
