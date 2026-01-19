import { NavLink } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Shield, Home, MessageCircle, Heart, Crown, Book, LogOut, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: <Home size={16} />, label: 'Home' },
  { to: '/confessions', icon: <MessageCircle size={16} />, label: 'Confess' },
  { to: '/matching', icon: <Heart size={16} />, label: 'Match' },
  { to: '/premium', icon: <Crown size={16} />, label: 'Premium' },
  { to: '/docs', icon: <Book size={16} />, label: 'Docs' },
];

export default function Navigation() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  const displayAddress = user?.wallet?.address 
    ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-4)}`
    : user?.email?.address?.split('@')[0] || 'User';

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={12} />
                {displayAddress}
              </span>
              <button className="btn btn-ghost" onClick={logout} style={{ padding: 8 }}>
                <LogOut size={16} />
              </button>
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
