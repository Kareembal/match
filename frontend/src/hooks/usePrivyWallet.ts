import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
const DEVNET_RPC = 'https://api.devnet.solana.com';
export function usePrivyWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  // Find Solana wallet - check if address looks like Solana (44 chars, base58)
  const solanaWallet = useMemo(() => {
    const wallet = wallets.find((w: any) => {
      const addr = w.address;
      // Solana addresses are 32-44 chars base58
      return addr && addr.length >= 32 && addr.length <= 44 && !addr.startsWith('0x');
    });
    return wallet || null;
  }, [wallets]);
  // Fallback to user.wallet if available
  const address = solanaWallet?.address || user?.wallet?.address || '';
  const publicKey = useMemo(() => {
    if (!address || address.startsWith('0x')) return null;
    try {
      return new PublicKey(address);
    } catch {
      return null;
    }
  }, [address]);
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
    address,
  };
}
