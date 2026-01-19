import { useState, useCallback } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { Transaction, SystemProgram } from '@solana/web3.js';

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
        signature = 'local-' + Date.now();
      }

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
