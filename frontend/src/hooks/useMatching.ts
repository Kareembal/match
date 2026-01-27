import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { Transaction, SystemProgram } from '@solana/web3.js';
import { database, ref, push, onValue, query, orderByChild, limitToLast, DataSnapshot } from '../lib/firebase';

export interface MatchProfile {
  id: string;
  wallet: string;
  interests: number[];
  userAge: number;
  lookingFor: number;
  timestamp: number;
}

export function useMatching() {
  const { connected, publicKey, wallet, connection, address } = usePrivyWallet();
  const { sendTransaction } = useSendTransaction();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [myProfile, setMyProfile] = useState<MatchProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load profiles from Firebase
  useEffect(() => {
    const profilesRef = query(
      ref(database, 'profiles'),
      orderByChild('timestamp'),
      limitToLast(100)
    );

    const unsubscribe = onValue(profilesRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: MatchProfile[] = Object.entries(data).map(([id, val]) => {
          const v = val as MatchProfile;
          return { ...v, id };
        });
        setProfiles(list);
        
        // Find my profile
        if (address) {
          const mine = list.find(p => p.wallet === address);
          setMyProfile(mine || null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [address]);

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

      const result = await sendTransaction({ transaction, connection });
      const signature = result.signature;

      // Save to Firebase
      const profilesRef = ref(database, 'profiles');
      await push(profilesRef, {
        wallet: address,
        interests,
        userAge,
        lookingFor,
        timestamp: Date.now(),
        txSignature: signature,
      });

      console.log('✅ Preferences registered:', signature);
      return signature;
    } catch (err: unknown) {
      console.error('Failed:', err);
      setError(err instanceof Error ? err.message?.substring(0, 80) : 'Failed');
      return null;
    } finally {
      setIsRegistering(false);
    }
  }, [publicKey, wallet, connected, connection, address, sendTransaction]);

  // Find potential matches
  const findMatches = useCallback(() => {
    if (!myProfile) return [];
    return profiles.filter(p => 
      p.wallet !== address && 
      p.interests.some(i => myProfile.interests.includes(i))
    );
  }, [profiles, myProfile, address]);

  return { registerPreferences, isRegistering, isLoading, profiles, myProfile, findMatches, error };
}
