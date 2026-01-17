import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Heart, Lock, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { icon: <Shield size={24} />, title: 'Anonymous Confessions', description: 'Share secrets without revealing identity. MPC ensures complete anonymity.' },
  { icon: <Heart size={24} />, title: 'Private Matching', description: 'Find compatible connections. Only mutual matches are revealed.' },
  { icon: <Lock size={24} />, title: 'Zero-Knowledge Proofs', description: 'Verify eligibility without exposing sensitive data.' },
];

const stats = [
  { value: '100%', label: 'Anonymous' },
  { value: 'ZK', label: 'Verified' },
  { value: 'MPC', label: 'Secured' },
];

export default function Home() {
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <motion.div 
            style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="badge"
              style={{ marginBottom: 'var(--space-6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles size={14} />
              Powered by Arcium MPC
            </motion.div>

            <h1 style={{ marginBottom: 'var(--space-5)' }}>
              Share Secrets.{' '}
              <span className="accent">Stay Anonymous.</span>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', marginBottom: 'var(--space-8)', lineHeight: 1.7 }}>
              Anonymous confessions and confidential matchmaking powered by 
              multi-party computation. Privacy guaranteed by cryptography.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
              <Link to="/confessions" className="btn btn-primary btn-lg">
                Start Confessing <ArrowRight size={18} />
              </Link>
              <Link to="/matching" className="btn btn-secondary btn-lg">
                Find Matches
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-10)', justifyContent: 'center' }}>
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  style={{ textAlign: 'center' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="accent" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span className="section-label">Features</span>
            <h2>Privacy-First <span className="accent">Platform</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="card card-hover"
                style={{ padding: 'var(--space-8)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h4 style={{ marginBottom: 'var(--space-2)' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="card card-accent"
            style={{ padding: 'var(--space-12)', textAlign: 'center' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Ready to Start?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
              Connect your wallet and start sharing with cryptographic privacy.
            </p>
            <Link to="/confessions" className="btn btn-primary btn-lg">
              Launch App <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
