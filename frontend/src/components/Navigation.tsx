import { NavLink } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Shield, Home, MessageCircle, Heart, Crown, Book, LogOut, Wallet, Copy, Check, ExternalLink, Menu, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

const navItems = [
  { to: '/', icon: <Home size={16} />, label: 'Home' },
  { to: '/confessions', icon: <MessageCircle size={16} />, label: 'Confess' },
  { to: '/matching', icon: <Heart size={16} />, label: 'Match' },
  { to: '/premium', icon: <Crown size={16} />, label: 'Premium' },
  { to: '/docs', icon: <Book size={16} />, label: 'Docs' },
];

const connection = new Connection('https://api.devnet.solana.com');

export default function Navigation() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets, ready: walletsReady } = useSolanaWallets();
  const [showWallet, setShowWallet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const solanaWallet = useMemo(() => {
    if (!wallets || wallets.length === 0) return null;
    return wallets.find(w => w.walletClientType === 'privy') || wallets[0] || null;
  }, [wallets]);

  const address = solanaWallet?.address || '';
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

  useEffect(() => {
    if (address) {
      try {
        const pk = new PublicKey(address);
        connection.getBalance(pk).then(bal => {
          setBalance(bal / LAMPORTS_PER_SOL);
        }).catch(() => setBalance(null));
      } catch {
        setBalance(null);
      }
    }
  }, [address]);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isConnected = ready && walletsReady && authenticated && !!address;

  return (
    <>
      <nav className="nav">
        <div className="container nav-container">
          <NavLink to="/" className="nav-logo" onClick={() => setShowMobileMenu(false)}>
            Whisp<span>r</span>
          </NavLink>

          <div className="nav-links">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            {isConnected && (
              <div className="status-indicator hide-mobile">
                <span className="status-dot"></span>
                <Shield size={12} />
                <span>MPC</span>
              </div>
            )}
            
            {!ready ? (
              <button className="btn btn-secondary" disabled>...</button>
            ) : authenticated ? (
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowWallet(!showWallet)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Wallet size={14} />
                  <span className="hide-mobile">{shortAddress || 'Wallet'}</span>
                </button>
                
                {showWallet && (
                  <div className="wallet-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="wallet-header">
                      <span>Your Wallet</span>
                      <button className="btn btn-ghost" onClick={() => { logout(); setShowWallet(false); }} style={{ padding: 4 }}>
                        <LogOut size={14} />
                      </button>
                    </div>
                    
                    {address ? (
                      <>
                        <div className="wallet-balance">
                          <span className="balance-amount">{balance !== null ? balance.toFixed(4) : '--'}</span>
                          <span className="balance-label">SOL (Devnet)</span>
                        </div>
                        <div className="wallet-address">
                          <code>{shortAddress}</code>
                          <button onClick={copyAddress} className="btn btn-ghost" style={{ padding: 4 }}>
                            {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <a 
                          href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: '0.8rem' }}
                        >
                          Explorer <ExternalLink size={12} />
                        </a>
                      </>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: 12 }}>
                        Loading wallet...
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary" onClick={login}>
                Sign In
              </button>
            )}

            <button className="btn btn-ghost mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
