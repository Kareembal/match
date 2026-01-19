import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Lock, Heart, Crown, Shield, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { icon: <Lock size={24} />, title: 'Anonymous Confessions', desc: 'Share secrets without revealing identity', link: '/confessions' },
  { icon: <Heart size={24} />, title: 'Confidential Matching', desc: 'Find connections privately via MPC', link: '/matching' },
  { icon: <Crown size={24} />, title: 'Premium Features', desc: 'Unlock exclusive encrypted perks', link: '/premium' },
];

export default function Home() {
  const { login, authenticated } = usePrivy();

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 60 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="badge" style={{ marginBottom: 24 }}>
              <Shield size={14} />
              <span>Powered by Arcium MPC</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Anonymous <span className="accent">Confessions</span>
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>& Confidential Matching</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Share secrets and find connections on-chain. Your identity protected by multi-party computation.
            </p>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              {authenticated ? (
                <Link to="/confessions" className="btn btn-primary btn-lg">
                  <Sparkles size={18} /> Start Confessing
                </Link>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={login}>
                  <Sparkles size={18} /> Get Started
                </button>
              )}
              <Link to="/docs" className="btn btn-secondary btn-lg">
                Learn More <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section style={{ paddingBottom: 60 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link to={f.link} style={{ textDecoration: 'none' }}>
                  <div className="card card-hover" style={{ padding: 32, textAlign: 'center', height: '100%' }}>
                    <div style={{ width: 56, height: 56, background: 'rgba(139, 92, 246, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--accent)' }}>
                      {f.icon}
                    </div>
                    <h3 style={{ marginBottom: 8, fontSize: '1.1rem' }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section style={{ paddingBottom: 60 }}>
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32 }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>100%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Anonymous</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>MPC</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Encrypted</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>Solana</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>On-Chain</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
