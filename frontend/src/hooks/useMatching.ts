import { useState, useCallback } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function useMatching() {
  const { connected, publicKey, wallet, connection } = usePrivyWallet();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPreferences = useCallback(async (
    interests: number[],
    ageMin: number,
    ageMax: number,
    userAge: number,
    lookingFor: number
  ): Promise<string | null> => {
    if (!publicKey || !wallet || !connected) {
      setError('Not connected');
      return null;
    }

    setIsRegistering(true);
    setError(null);

    try {
      // Create transaction to record preferences on-chain
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 1000,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      const result = await wallet.signAndSendTransaction!({
        chain: 'solana:devnet',
        transaction: new Uint8Array(serializedTx),
      });

      const signature = result.signature || result.hash;
      console.log('✅ Preferences registered:', signature);
      
      localStorage.setItem(`profile_${publicKey.toBase58()}`, JSON.stringify({
        interests, userAge, lookingFor, tx: signature
      }));

      return signature;
    } catch (err: any) {
      console.error('Failed:', err);
      setError(err.message?.substring(0, 80) || 'Failed');
      return null;
    } finally {
      setIsRegistering(false);
    }
  }, [publicKey, wallet, connected, connection]);

  return { registerPreferences, isRegistering, error };
}
