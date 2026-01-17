import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgram, BN, SystemProgram, PublicKey } from './useProgram';

export function useMatching() {
  const { publicKey } = useWallet();
  const { program } = useProgram();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const registerPreferences = useCallback(async (
    interests: number[],
    ageMin: number,
    ageMax: number,
    userAge: number,
    lookingFor: number
  ): Promise<string | null> => {
    if (!program || !publicKey) return null;

    setIsRegistering(true);
    try {
      // Pad interests to 10 elements
      const paddedInterests = [...interests];
      while (paddedInterests.length < 10) paddedInterests.push(0);

      const tx = await program.methods
        .registerPreferences(
          paddedInterests.slice(0, 10),
          ageMin,
          ageMax,
          userAge,
          lookingFor
        )
        .accounts({
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('✅ Preferences registered:', tx);
      return tx;
    } catch (err: any) {
      console.error('Registration failed:', err);
      return null;
    } finally {
      setIsRegistering(false);
    }
  }, [program, publicKey]);

  const requestMatch = useCallback(async (targetUser: string): Promise<string | null> => {
    if (!program || !publicKey) return null;

    setIsRequesting(true);
    try {
      const tx = await program.methods
        .requestMatch(new PublicKey(targetUser))
        .accounts({
          requester: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('✅ Match requested:', tx);
      return tx;
    } catch (err: any) {
      console.error('Match request failed:', err);
      return null;
    } finally {
      setIsRequesting(false);
    }
  }, [program, publicKey]);

  return { registerPreferences, requestMatch, isRegistering, isRequesting };
}
