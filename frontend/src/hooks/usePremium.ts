import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const PREMIUM_PRICE = 0.1; // SOL
const TREASURY = new PublicKey('BycRJnXXAHuCMNUR9xY67rKkAvGqf4Z9KwPuRbYExKos'); // Your program ID as treasury

export function usePremium() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Check premium status on mount
  useEffect(() => {
    if (publicKey) {
      const stored = localStorage.getItem(`premium_${publicKey.toBase58()}`);
      setIsPremium(stored === 'true');
    }
  }, [publicKey]);

  const purchasePremium = useCallback(async (): Promise<string | null> => {
    if (!publicKey) return null;

    setIsPurchasing(true);
    try {
      // Create a simple SOL transfer transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY,
          lamports: PREMIUM_PRICE * LAMPORTS_PER_SOL,
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      console.log('✅ Premium purchased:', signature);
      
      // Save premium status
      localStorage.setItem(`premium_${publicKey.toBase58()}`, 'true');
      setIsPremium(true);

      return signature;
    } catch (err: any) {
      console.error('Purchase failed:', err);
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [publicKey, connection, sendTransaction]);

  return { 
    purchasePremium, 
    isPurchasing, 
    isPremium,
    premiumPrice: PREMIUM_PRICE 
  };
}
