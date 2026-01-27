import { useSolanaWallets, useSendTransaction } from '@privy-io/react-auth/solana';
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { useMemo, useCallback } from 'react';

const DEVNET_RPC = 'https://api.devnet.solana.com';

export function useSolanaTransaction() {
  const { wallets, ready } = useSolanaWallets();
  const { sendTransaction: privySendTransaction } = useSendTransaction();
  
  const connection = useMemo(() => new Connection(DEVNET_RPC, 'confirmed'), []);
  
  const wallet = useMemo(() => {
    return wallets.find(w => w.walletClientType === 'privy') || wallets[0] || null;
  }, [wallets]);
  
  const publicKey = useMemo(() => {
    if (!wallet?.address) return null;
    try {
      return new PublicKey(wallet.address);
    } catch {
      return null;
    }
  }, [wallet]);
  
  const connected = ready && !!wallet && !!publicKey;
  
  const sendTransaction = useCallback(async (transaction: Transaction | VersionedTransaction) => {
    if (!wallet) throw new Error('No wallet connected');
    
    const result = await privySendTransaction(transaction as any, {
      wallet,
      connection,
    });
    
    return result.signature;
  }, [wallet, connection, privySendTransaction]);
  
  return {
    connected,
    publicKey,
    wallet,
    connection,
    sendTransaction,
    ready,
  };
}
