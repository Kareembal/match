import { NavLink } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { usePrivyWallet } from '../hooks/usePrivyWallet';
import { Shield, Home, MessageCircle, Heart, Crown, Book, LogOut, Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
const navItems = [
  { to: '/', icon: <Home size={16} />, label: 'Home' },
  { to: '/confessions', icon: <MessageCircle size={16} />, label: 'Confess' },
  { to: '/matching', icon: <Heart size={16} />, label: 'Match' },
  { to: '/premium', icon: <Crown size={16} />, label: 'Premium' },
  { to: '/docs', icon: <Book size={16} />, label: 'Docs' },
];
export default function Navigation() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { publicKey, connection } = usePrivyWallet();
  const [showWallet, setShowWallet] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const address = publicKey?.toBase58() || '';
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';
  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then(bal => {
        setBalance(bal / 1e9);
      }).catch(() => setBalance(null));
    }
  }, [publicKey, connection]);
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <nav className="nav">
      <div className="container nav-container">
        <NavLink to="/" className="nav-logo">
          Whisp<span>r</span>
        </NavLink>
        <div className="nav-links">
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="nav-actions">
          {authenticated && (
            <div className="status-indicator">
              <span className="status-dot"></span>
              <Shield size={12} />
              <span>MPC</span>
            </div>
          )}
          
          {!ready ? (
            <button className="btn btn-secondary" disabled>Loading...</button>
          ) : authenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowWallet(!showWallet)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Wallet size={14} />
                {shortAddress || 'Wallet'}
              </button>
              
              {showWallet && (
                <div className="wallet-dropdown">
                  <div className="wallet-header">
                    <span>Wallet</span>
                    <button className="btn btn-ghost" onClick={logout} style={{ padding: 4 }}>
                      <LogOut size={14} />
                    </button>
                  </div>
                  
                  {balance !== null && (
                    <div className="wallet-balance">
                      <span className="balance-amount">{balance.toFixed(4)}</span>
                      <span className="balance-label">SOL</span>
                    </div>
                  )}
                  
                  <div className="wallet-address">
                    <code>{shortAddress}</code>
                    <button onClick={copyAddress} className="btn btn-ghost" style={{ padding: 4 }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  
                  <a 
                    href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                  >
                    View on Explorer <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={login}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
