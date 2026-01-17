import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useProgram, BN, SystemProgram, PublicKey } from './useProgram';

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

// Store content locally (in production, use IPFS or indexer)
const contentStore: Map<string, string> = new Map();

export function useConfessions() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { program, programId } = useProgram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getStatePDA = useCallback(() => {
    if (!programId) return null;
    return PublicKey.findProgramAddressSync([Buffer.from('state')], programId)[0];
  }, [programId]);

  const getConfessionPDA = useCallback((id: number) => {
    if (!programId) return null;
    return PublicKey.findProgramAddressSync(
      [Buffer.from('confession'), new BN(id).toArrayLike(Buffer, 'le', 8)],
      programId
    )[0];
  }, [programId]);

  // Fetch all confessions from chain
  const fetchConfessions = useCallback(async () => {
    if (!program) return;
    
    setIsLoading(true);
    try {
      const statePDA = getStatePDA();
      if (!statePDA) return;

      // Get confession count
      let count = 0;
      try {
        const state = await program.account.programState.fetch(statePDA);
        count = (state as any).confessionCount?.toNumber() || 0;
      } catch (e) {
        console.log('No confessions yet');
        setIsLoading(false);
        return;
      }

      // Fetch each confession
      const fetched: Confession[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const pda = getConfessionPDA(i);
          if (!pda) continue;
          
          const data = await program.account.confession.fetch(pda);
          const confData = data as any;
          
          // Get content from local store or show placeholder
          const storedContent = contentStore.get(i.toString()) || localStorage.getItem(`confession_${i}`);
          
          fetched.push({
            id: i.toString(),
            content: storedContent || '(Encrypted confession)',
            category: CATEGORIES[confData.category] || 'Secret',
            likes: confData.likes || 0,
            isPremium: confData.isPremium || false,
            timestamp: new Date(confData.timestamp * 1000),
          });
        } catch (e) {
          console.log(`Confession ${i} not found`);
        }
      }

      setConfessions(fetched.reverse()); // Newest first
    } catch (err) {
      console.error('Failed to fetch confessions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [program, getStatePDA, getConfessionPDA]);

  // Auto-fetch on mount
  useEffect(() => {
    fetchConfessions();
  }, [program]);

  // Initialize program
  const initializeProgram = useCallback(async () => {
    if (!program || !publicKey) return false;
    
    try {
      const statePDA = getStatePDA();
      if (!statePDA) return false;

      await program.methods
        .initialize()
        .accounts({
          state: statePDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return true;
    } catch (err: any) {
      if (err.message?.includes('already in use')) return true;
      return false;
    }
  }, [program, publicKey, getStatePDA]);

  // Submit confession
  const submitConfession = useCallback(async (
    content: string,
    category: string,
    isPremium: boolean
  ): Promise<string | null> => {
    if (!program || !publicKey) {
      setError('Wallet not connected');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const statePDA = getStatePDA();
      if (!statePDA) return null;

      // Get current count
      let confessionId = 0;
      try {
        const state = await program.account.programState.fetch(statePDA);
        confessionId = (state as any).confessionCount?.toNumber() || 0;
      } catch (e) {
        await initializeProgram();
      }

      const confessionPDA = getConfessionPDA(confessionId);
      if (!confessionPDA) return null;

      // Simple hash (first 32 bytes)
      const contentBytes = new TextEncoder().encode(content);
      const contentHash = Array.from(contentBytes.slice(0, 32));
      while (contentHash.length < 32) contentHash.push(0);

      const categoryIndex = Math.max(1, CATEGORIES.indexOf(category));

      const tx = await program.methods
        .submitConfession(contentHash, categoryIndex, isPremium)
        .accounts({
          state: statePDA,
          confession: confessionPDA,
          submitter: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // Store content locally & in localStorage for persistence
      contentStore.set(confessionId.toString(), content);
      localStorage.setItem(`confession_${confessionId}`, content);

      const newConfession: Confession = {
        id: confessionId.toString(),
        content,
        category,
        likes: 0,
        isPremium,
        timestamp: new Date(),
        txSignature: tx,
      };
      
      setConfessions(prev => [newConfession, ...prev]);
      return tx;
    } catch (err: any) {
      console.error('Transaction failed:', err);
      setError(err.message || 'Transaction failed');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [program, publicKey, getStatePDA, getConfessionPDA, initializeProgram]);

  // Like confession
  const likeConfession = useCallback(async (confessionId: string): Promise<string | null> => {
    if (!program || !publicKey) return null;

    try {
      const confessionPDA = getConfessionPDA(parseInt(confessionId));
      if (!confessionPDA) return null;

      const tx = await program.methods
        .likeConfession()
        .accounts({
          confession: confessionPDA,
          liker: publicKey,
        })
        .rpc();

      setConfessions(prev => 
        prev.map(c => c.id === confessionId ? { ...c, likes: c.likes + 1 } : c)
      );
      
      return tx;
    } catch (err: any) {
      console.error('Like failed:', err);
      return null;
    }
  }, [program, publicKey, getConfessionPDA]);

  return { 
    confessions, 
    isSubmitting,
    isLoading,
    error, 
    submitConfession, 
    likeConfession,
    refetch: fetchConfessions,
  };
}
