import { NavLink } from 'react-router-dom';
import { usePrivy, useWallets } from '@privy-io/react-auth';
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
  const { wallets } = useWallets();
  const [showWallet, setShowWallet] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const address = useMemo(() => {
    const solWallet = wallets.find((w: any) => w.address && !w.address.startsWith('0x'));
    if (solWallet) return solWallet.address;
    if (user?.wallet?.address && !user.wallet.address.startsWith('0x')) {
      return user.wallet.address;
    }
    return '';
  }, [wallets, user]);

  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';

  useEffect(() => {
    if (address && !address.startsWith('0x')) {
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

  const closeMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <nav className="nav">
        <div className="container nav-container">
          <NavLink to="/" className="nav-logo">
            Whisp<span>r</span>
          </NavLink>

          {/* Desktop nav */}
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
              <div className="status-indicator hide-mobile">
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
                  <span className="hide-mobile">{shortAddress || user?.email?.address?.split('@')[0] || 'Account'}</span>
                </button>
                
                {showWallet && (
                  <div className="wallet-dropdown">
                    <div className="wallet-header">
                      <span>Your Wallet</span>
                      <button className="btn btn-ghost" onClick={logout} style={{ padding: 4 }}>
                        <LogOut size={14} />
                      </button>
                    </div>
                    
                    {address ? (
                      <>
                        {balance !== null ? (
                          <div className="wallet-balance">
                            <span className="balance-amount">{balance.toFixed(4)}</span>
                            <span className="balance-label">SOL (Devnet)</span>
                          </div>
                        ) : (
                          <div className="wallet-balance">
                            <span className="balance-amount">--</span>
                            <span className="balance-label">Loading...</span>
                          </div>
                        )}
                        
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
                        No Solana wallet detected.<br/>Link one in Privy settings.
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

            {/* Mobile hamburger */}
            <button 
              className="btn btn-ghost mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            {navItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
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
