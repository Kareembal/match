import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Confessions from './pages/Confessions';
import Matching from './pages/Matching';
import Premium from './pages/Premium';
import Docs from './pages/Docs';

// Wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

const PRIVY_APP_ID = 'cmkl3fxr900p7jj0czonilcnk';

function App() {
    const network = clusterApiUrl('devnet');

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        []
    );

    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                loginMethods: ['wallet', 'twitter'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#a855f7',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
                solanaClusters: [
                    { name: 'devnet', rpcUrl: 'https://api.devnet.solana.com' },
                ],
            }}
        >
            <ConnectionProvider endpoint={network}>
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
                                        <Route path="/docs" element={<Docs />} />
                                    </Routes>
                                </main>
                                <Footer />
                            </div>
                        </BrowserRouter>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </PrivyProvider>
    );
}

export default App;
