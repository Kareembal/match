import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { Transaction, SystemProgram } from '@solana/web3.js';
import { database, ref, push, onValue, update, query, orderByChild, limitToLast } from '../lib/firebase';

export interface Confession {
  id: string;
  content: string;
  category: string;
  likes: number;
  isPremium: boolean;
  timestamp: number;
  txSignature?: string;
}

export function useConfessions() {
  const { connected, publicKey, wallet, connection } = usePrivyWallet();
  const { sendTransaction } = useSendTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase for real-time updates
  useEffect(() => {
    const confessionsRef = query(
      ref(database, 'confessions'),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribe = onValue(confessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Confession[] = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          content: val.content,
          category: val.category,
          likes: val.likes || 0,
          isPremium: val.isPremium || false,
          timestamp: val.timestamp,
          txSignature: val.txSignature,
        }));
        // Sort newest first
        list.sort((a, b) => b.timestamp - a.timestamp);
        setConfessions(list);
      } else {
        setConfessions([]);
      }
      setIsLoading(false);
    }, (err) => {
      console.error('Firebase error:', err);
      setError('Failed to load confessions');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refetch = useCallback(() => {
    // Firebase handles real-time updates, but we can trigger a re-render
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
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
      // Create on-chain transaction
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

      const result = await sendTransaction({ transaction, connection });
      const signature = result.signature;

      // Save to Firebase
      const confessionsRef = ref(database, 'confessions');
      await push(confessionsRef, {
        content,
        category,
        likes: 0,
        isPremium,
        timestamp: Date.now(),
        txSignature: signature,
      });

      console.log('✅ Confession submitted:', signature);
      return signature;
    } catch (err: any) {
      console.error('Failed:', err);
      setError(err.message || 'Failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [publicKey, wallet, connected, connection, sendTransaction]);

  const likeConfession = useCallback(async (confessionId: string): Promise<string | null> => {
    try {
      const confessionRef = ref(database, `confessions/${confessionId}`);
      const current = confessions.find(c => c.id === confessionId);
      if (current) {
        await update(confessionRef, { likes: (current.likes || 0) + 1 });
      }
      return 'liked';
    } catch (err) {
      console.error('Like failed:', err);
      return null;
    }
  }, [confessions]);

  return { confessions, isSubmitting, isLoading, error, submitConfession, likeConfession, refetch };
}
