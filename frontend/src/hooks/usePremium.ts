import { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useProgram, BN, SystemProgram, PublicKey } from './useProgram';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const PREMIUM_PRICE = 0.1; // SOL
const PREMIUM_LAMPORTS = PREMIUM_PRICE * LAMPORTS_PER_SOL;

export function usePremium() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { program, programId } = useProgram();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const getStatePDA = useCallback(() => {
    if (!programId) return null;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('state')],
      programId
    );
    return pda;
  }, [programId]);

  // Check if program is initialized
  useEffect(() => {
    const check = async () => {
      if (!program) return;
      try {
        const statePDA = getStatePDA();
        if (!statePDA) return;
        const state = await program.account.programState.fetchNullable(statePDA);
        setIsInitialized(!!state);
      } catch (e) {
        setIsInitialized(false);
      }
    };
    check();
  }, [program, getStatePDA]);

  // Initialize program if needed
  const initializeProgram = useCallback(async () => {
    if (!program || !publicKey) return false;
    
    try {
      const statePDA = getStatePDA();
      if (!statePDA) return false;

      const tx = await program.methods
        .initialize()
        .accounts({
          state: statePDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('✅ Program initialized:', tx);
      setIsInitialized(true);
      return true;
    } catch (err: any) {
      if (err.message?.includes('already in use')) {
        setIsInitialized(true);
        return true;
      }
      console.error('Init failed:', err);
      return false;
    }
  }, [program, publicKey, getStatePDA]);

  const purchasePremium = useCallback(async (): Promise<string | null> => {
    if (!program || !publicKey) return null;

    setIsPurchasing(true);
    try {
      // Initialize if needed
      if (!isInitialized) {
        const success = await initializeProgram();
        if (!success) {
          setIsPurchasing(false);
          return null;
        }
      }

      const statePDA = getStatePDA();
      if (!statePDA) return null;

      // Use program authority as treasury for now
      const treasury = publicKey; // In production, use a separate treasury

      const tx = await program.methods
        .purchasePremium()
        .accounts({
          state: statePDA,
          buyer: publicKey,
          treasury: treasury,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('✅ Premium purchased:', tx);
      return tx;
    } catch (err: any) {
      console.error('Purchase failed:', err);
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [program, publicKey, getStatePDA, isInitialized, initializeProgram]);

  return { purchasePremium, isPurchasing, premiumPrice: PREMIUM_PRICE, isInitialized };
}
