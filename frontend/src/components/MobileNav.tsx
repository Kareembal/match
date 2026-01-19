import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Heart, Crown, Book } from 'lucide-react';

const navItems = [
  { to: '/', icon: <Home size={20} />, label: 'Home' },
  { to: '/confessions', icon: <MessageCircle size={20} />, label: 'Confess' },
  { to: '/matching', icon: <Heart size={20} />, label: 'Match' },
  { to: '/premium', icon: <Crown size={20} />, label: 'Premium' },
  { to: '/docs', icon: <Book size={20} />, label: 'Docs' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {navItems.map(item => (
        <NavLink 
          key={item.to} 
          to={item.to} 
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
