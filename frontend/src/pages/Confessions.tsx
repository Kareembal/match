import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Lock, Heart, Sparkles, Shield, Loader2, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { useConfessions } from '../hooks/useConfessions';

const categories = ['All', 'Love', 'Secret', 'Funny', 'Vent', 'Dream'];

export default function Confessions() {
  const { connected, publicKey } = useWallet();
  const { confessions, isSubmitting, isLoading, error, submitConfession, likeConfession, refetch } = useConfessions();
  
  const [confession, setConfession] = useState('');
  const [category, setCategory] = useState('Secret');
  const [isPremium, setIsPremium] = useState(false);
  const [filter, setFilter] = useState('All');
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!confession.trim() || !connected) return;
    setTxStatus('pending');
    
    const signature = await submitConfession(confession, category, isPremium);
    
    if (signature) {
      setTxStatus('success');
      setTxSignature(signature);
      setConfession('');
      setTimeout(() => { setTxStatus('idle'); setTxSignature(null); }, 5000);
    } else {
      setTxStatus('error');
      setTimeout(() => setTxStatus('idle'), 3000);
    }
  };

  const filteredConfessions = filter === 'All' 
    ? confessions 
    : confessions.filter(c => c.category === filter);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="page-title">Anonymous <span className="accent">Confessions</span></h1>
            <p className="page-subtitle">Share secrets on-chain. Identity protected by cryptography.</p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)', alignItems: 'start' }}>
          <div>
            {/* Submit Form */}
            {connected ? (
              <motion.div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="status-indicator" style={{ marginBottom: 'var(--space-4)' }}>
                  <span className="status-dot"></span>
                  <Shield size={12} />
                  <span>MPC Protected</span>
                </div>

                <textarea 
                  placeholder="Share your confession..." 
                  value={confession} 
                  onChange={(e) => setConfession(e.target.value)} 
                  style={{ marginBottom: 'var(--space-4)' }}
                  disabled={isSubmitting}
                  maxLength={280}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span className="font-mono">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</span>
                  <span>{confession.length}/280</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto' }} disabled={isSubmitting}>
                    {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} disabled={isSubmitting} />
                    <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                    Premium
                  </label>

                  <button className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={handleSubmit} disabled={isSubmitting || !confession.trim()}>
                    {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Lock size={16} /> Submit</>}
                  </button>
                </div>

                {txStatus === 'success' && txSignature && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="badge badge-success" style={{ marginTop: 'var(--space-4)', width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Confirmed!</span>
                    <a href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'inherit' }}>
                      View <ExternalLink size={12} />
                    </a>
                  </motion.div>
                )}

                {txStatus === 'error' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: 'var(--radius-md)', fontSize: '13px', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={14} /> {error || 'Transaction failed'}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <Lock size={32} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                <h4 style={{ marginBottom: 'var(--space-2)' }}>Connect Wallet</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 'var(--space-4)' }}>Connect to submit confessions on-chain</p>
                <WalletMultiButton />
              </div>
            )}

            {/* Filter + Refresh */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {categories.map(c => (
                  <button key={c} className={`badge ${filter === c ? 'badge-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setFilter(c)}>
                    {c}
                  </button>
                ))}
              </div>
              <button className="btn btn-ghost" onClick={refetch} disabled={isLoading} style={{ padding: 'var(--space-2)' }}>
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Feed */}
            {isLoading ? (
              <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto' }} />
                <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-4)', fontSize: '14px' }}>Loading confessions...</p>
              </div>
            ) : filteredConfessions.length === 0 ? (
              <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No confessions yet. Be the first!</p>
              </div>
            ) : (
              filteredConfessions.map((conf, i) => (
                <motion.div key={conf.id} className="card card-hover" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-3)' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <span className="badge">{conf.category}</span>
                      {conf.isPremium && <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', borderColor: 'rgba(139, 92, 246, 0.3)' }}><Sparkles size={10} /></span>}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{conf.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p style={{ marginBottom: 'var(--space-3)', lineHeight: 1.6, fontSize: '14px' }}>{conf.content}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: '13px' }} onClick={() => likeConfession(conf.id)}>
                      <Heart size={14} /> {conf.likes}
                    </button>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>#{conf.id}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)' }}>
              <h4 style={{ marginBottom: 'var(--space-3)', fontSize: '14px' }}>Network</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px' }}>
                <span className="status-dot"></span>
                Solana Devnet
              </div>
              <p className="font-mono" style={{ marginTop: 'var(--space-2)', fontSize: '11px', color: 'var(--text-muted)' }}>BycR...Kos</p>
            </div>

            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <h4 style={{ marginBottom: 'var(--space-3)', fontSize: '14px' }}>Stats</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Total Confessions</span>
                <span className="accent">{confessions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
