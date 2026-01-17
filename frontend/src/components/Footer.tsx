import { Link } from 'react-router-dom';
import { Shield, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-8)' }}>
          <div>
            <Link to="/" className="nav-logo" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              <span className="gradient-text">Whispr</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>
              Anonymous confessions & confidential matchmaking powered by Arcium MPC.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-12)' }}>
            <div>
              <h4 style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/confessions" style={{ color: 'var(--text-muted)' }}>Confessions</Link>
                <Link to="/matching" style={{ color: 'var(--text-muted)' }}>Matching</Link>
                <Link to="/premium" style={{ color: 'var(--text-muted)' }}>Premium</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Built with Arcium on Solana
          </p>
          <div className="encryption-indicator">
            <Shield size={12} />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
