import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';

export function usePrivyWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets, ready: walletsReady } = useSolanaWallets();

  // Get the first Solana wallet (embedded or external)
  const solanaWallet = useMemo(() => {
    if (!wallets || wallets.length === 0) return null;
    // Prefer embedded wallet
    const embedded = wallets.find(w => w.walletClientType === 'privy');
    return embedded || wallets[0] || null;
  }, [wallets]);

  const address = solanaWallet?.address || '';

  const publicKey = useMemo(() => {
    if (!address) return null;
    try {
      return new PublicKey(address);
    } catch {
      return null;
    }
  }, [address]);

  const connection = useMemo(() => new Connection(DEVNET_RPC, 'confirmed'), []);

  const connected = ready && walletsReady && authenticated && !!publicKey;

  return {
    ready: ready && walletsReady,
    connected,
    authenticated,
    publicKey,
    wallet: solanaWallet,
    connection,
    user,
    address,
    login,
    logout,
  };
}
