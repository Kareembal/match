import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Confessions from './pages/Confessions';
import Matching from './pages/Matching';
import Premium from './pages/Premium';
import Docs from './pages/Docs';

export default function App() {
  return (
    <PrivyProvider
      appId="cmkl3fxr900p7jj0czonilcnk"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6',
          logo: '/favicon.svg',
        },
        loginMethods: ['email', 'wallet'],
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      <BrowserRouter>
        <div className="app">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/confessions" element={<Confessions />} />
              <Route path="/matching" element={<Matching />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/docs" element={<Docs />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
        </div>
      </BrowserRouter>
    </PrivyProvider>
  );
}
