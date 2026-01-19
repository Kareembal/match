import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="nav-logo">
              Whisp<span>r</span>
            </Link>
            <p className="footer-desc">Anonymous confessions & confidential matchmaking powered by Arcium MPC.</p>
          </div>
          
          <div className="footer-links">
            <Link to="/confessions">Confessions</Link>
            <Link to="/matching">Matching</Link>
            <Link to="/premium">Premium</Link>
            <Link to="/docs">Docs</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <Shield size={12} />
            <span>End-to-end encrypted</span>
          </div>
          <span className="footer-credit">Built with Arcium on Solana</span>
        </div>
      </div>
    </footer>
  );
}
