import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { path: '/', label: 'Home' },
    { path: '/confessions', label: 'Confessions' },
    { path: '/matching', label: 'Matching' },
    { path: '/premium', label: 'Premium' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="gradient-text">Whispr</span>
        </Link>
        <div className="nav-links">
          {links.map(link => (
            <Link key={link.path} to={link.path} style={{ color: location.pathname === link.path ? 'var(--primary)' : undefined }}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <div className="encryption-indicator">
            <span className="encryption-dot"></span>
            <Shield size={12} />
            <span>Encrypted</span>
          </div>
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
