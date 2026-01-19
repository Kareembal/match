import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const PREMIUM_PRICE = 0.1;
const TREASURY = new PublicKey('BycRJnXXAHuCMNUR9xY67rKkAvGqf4Z9KwPuRbYExKos');

export function usePremium() {
  const { connected, publicKey, wallet, connection } = usePrivyWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const stored = localStorage.getItem(`premium_${publicKey.toBase58()}`);
      setIsPremium(stored === 'true');
    } else {
      setIsPremium(false);
    }
  }, [publicKey]);

  const purchasePremium = useCallback(async (): Promise<string | null> => {
    if (!publicKey || !wallet || !connected) return null;

    setIsPurchasing(true);
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY,
          lamports: PREMIUM_PRICE * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      let signature: string;
      if (typeof wallet.sendTransaction === 'function') {
        signature = await wallet.sendTransaction(transaction, connection);
      } else if (typeof (wallet as any).signAndSendTransaction === 'function') {
        const result = await (wallet as any).signAndSendTransaction({
          chain: 'solana:devnet',
          transaction: new Uint8Array(transaction.serialize({ requireAllSignatures: false, verifySignatures: false })),
        });
        signature = result.signature || result.hash || result;
      } else {
        throw new Error('Wallet does not support transactions');
      }

      console.log('✅ Premium purchased:', signature);
      
      localStorage.setItem(`premium_${publicKey.toBase58()}`, 'true');
      setIsPremium(true);

      return signature;
    } catch (err: any) {
      console.error('Purchase failed:', err);
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [publicKey, wallet, connected, connection]);

  return { purchasePremium, isPurchasing, isPremium, premiumPrice: PREMIUM_PRICE };
}
