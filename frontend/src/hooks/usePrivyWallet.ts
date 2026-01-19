import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';

export function usePrivyWallet() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const solanaWallet = useMemo(() => {
    // Find Solana wallet (embedded or external)
    return wallets.find((w: any) => 
      w.walletClientType === 'privy' || 
      w.type === 'solana' ||
      w.address?.length === 44 // Solana addresses are 44 chars
    );
  }, [wallets]);

  const publicKey = useMemo(() => {
    if (!solanaWallet?.address) return null;
    try {
      return new PublicKey(solanaWallet.address);
    } catch {
      return null;
    }
  }, [solanaWallet]);

  const connection = useMemo(() => new Connection(DEVNET_RPC), []);

  const connected = ready && authenticated && !!solanaWallet;

  return {
    ready,
    connected,
    authenticated,
    publicKey,
    wallet: solanaWallet as any,
    connection,
    user,
  };
}
