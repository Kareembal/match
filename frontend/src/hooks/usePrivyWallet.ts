import { usePrivy, useSolanaWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
const DEVNET_RPC = 'https://api.devnet.solana.com';
export function usePrivyWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets: solanaWallets } = useSolanaWallets();
  const solanaWallet = useMemo(() => {
    // Get first Solana wallet
    if (solanaWallets && solanaWallets.length > 0) {
      return solanaWallets[0];
    }
    return null;
  }, [solanaWallets]);
  const publicKey = useMemo(() => {
    const addr = solanaWallet?.address || user?.wallet?.address;
    if (!addr) return null;
    try {
      return new PublicKey(addr);
    } catch {
      return null;
    }
  }, [solanaWallet, user]);
  const connection = useMemo(() => new Connection(DEVNET_RPC), []);
  const connected = ready && authenticated && !!publicKey;
  return {
    ready,
    connected,
    authenticated,
    publicKey,
    wallet: solanaWallet as any,
    connection,
    user,
    address: solanaWallet?.address || user?.wallet?.address || '',
  };
}
