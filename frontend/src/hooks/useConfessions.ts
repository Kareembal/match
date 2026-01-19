import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface Confession {
  id: string;
  content: string;
  category: string;
  likes: number;
  isPremium: boolean;
  timestamp: Date;
  txSignature?: string;
}

const CATEGORIES = ['', 'Love', 'Secret', 'Funny', 'Vent', 'Dream'];

export function useConfessions() {
  const { connected, publicKey, wallet, connection } = usePrivyWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('confessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfessions(parsed.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
      } catch (e) {}
    }
  }, []);

  const refetch = useCallback(() => {
    // Reload from localStorage
    const stored = localStorage.getItem('confessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfessions(parsed.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })));
      } catch (e) {}
    }
  }, []);

  const submitConfession = useCallback(async (
    content: string, category: string, isPremium: boolean
  ): Promise<string | null> => {
    if (!publicKey || !wallet || !connected) {
      setError('Not connected');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create a simple transaction to record on-chain
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey, // Self-transfer to record
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
      console.log('✅ Confession submitted:', signature);

      const newConfession: Confession = {
        id: Date.now().toString(),
        content,
        category,
        likes: 0,
        isPremium,
        timestamp: new Date(),
        txSignature: signature,
      };

      const updated = [newConfession, ...confessions];
      setConfessions(updated);
      localStorage.setItem('confessions', JSON.stringify(updated));

      return signature;
    } catch (err: any) {
      console.error('Failed:', err);
      setError(err.message || 'Failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [publicKey, wallet, connected, connection, confessions]);

  const likeConfession = useCallback(async (confessionId: string): Promise<string | null> => {
    setConfessions(prev => {
      const updated = prev.map(c => c.id === confessionId ? { ...c, likes: c.likes + 1 } : c);
      localStorage.setItem('confessions', JSON.stringify(updated));
      return updated;
    });
    return 'local';
  }, []);

  return { confessions, isSubmitting, isLoading, error, submitConfession, likeConfession, refetch };
}
