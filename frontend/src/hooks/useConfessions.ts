import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { Transaction, SystemProgram } from '@solana/web3.js';

export interface Confession {
  id: string;
  content: string;
  category: string;
  likes: number;
  isPremium: boolean;
  timestamp: Date;
  txSignature?: string;
}

export function useConfessions() {
  const { connected, publicKey, wallet, connection } = usePrivyWallet();
  const { sendTransaction } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [error, setError] = useState<string | null>(null);

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

      // Pass as object with transaction and connection
      const result = await sendTransaction({ transaction, connection });
      const signature = result.signature;

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
  }, [publicKey, wallet, connected, connection, confessions, sendTransaction]);

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
