import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Confessions from './pages/Confessions';
import Matching from './pages/Matching';
import Premium from './pages/Premium';
import Docs from './pages/Docs';

const PRIVY_APP_ID = 'cmkl3fxr900p7jj0czonilcnk';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

function App() {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                loginMethods: ['email', 'google', 'apple'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#a855f7',
                },
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'off',
                    },
                    solana: {
                        createOnLogin: 'all-users',
                    },
                },
                externalWallets: {
                    solana: {
                        connectors: solanaConnectors,
                    },
                },
                solanaClusters: [
                    { name: 'devnet', rpcUrl: 'https://api.devnet.solana.com' },
                ],
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
                </div>
            </BrowserRouter>
        </PrivyProvider>
    );
}

export default App;
