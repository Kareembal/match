import { useMemo } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { usePrivyWallet } from './usePrivyWallet';

// Import the IDL
import idl from '../idl/confessions.json';

const PROGRAM_ID = new PublicKey('BycRJnXXAHuCMNUR9xY67rKkAvGqf4Z9KwPuRbYExKos');
const DEVNET_RPC = 'https://api.devnet.solana.com';

export { BN, SystemProgram, PublicKey };

export function useProgram() {
  const { connected, publicKey, wallet } = usePrivyWallet();
  const connection = useMemo(() => new Connection(DEVNET_RPC), []);

  const program = useMemo(() => {
    if (!connected || !publicKey || !wallet) return null;

    try {
      // Create a simple wallet adapter for Anchor
      const walletAdapter = {
        publicKey,
        signTransaction: async (tx: any) => {
          // Privy handles signing
          return tx;
        },
        signAllTransactions: async (txs: any[]) => {
          return txs;
        },
      };

      const provider = new AnchorProvider(
        connection,
        walletAdapter as any,
        { commitment: 'confirmed' }
      );

      return new Program(idl as any, provider);
    } catch (e) {
      console.error('Failed to create program:', e);
      return null;
    }
  }, [connected, publicKey, wallet, connection]);

  return { program, programId: PROGRAM_ID, connection };
}
