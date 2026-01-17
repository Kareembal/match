import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { clusterApiUrl } from '@solana/web3.js';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Confessions from './pages/Confessions';
import Matching from './pages/Matching';
import Premium from './pages/Premium';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="app">
              <Navigation />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/confessions" element={<Confessions />} />
                  <Route path="/matching" element={<Matching />} />
                  <Route path="/premium" element={<Premium />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
