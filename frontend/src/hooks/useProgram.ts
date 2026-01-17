import { useMemo } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl/confessions.json';

export const PROGRAM_ID = new PublicKey('BycRJnXXAHuCMNUR9xY67rKkAvGqf4Z9KwPuRbYExKos');

export function useProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as unknown as Idl, provider);
  }, [provider]);

  return { program, provider, programId: PROGRAM_ID };
}

export function stringToBytes32(str: string): number[] {
  const bytes = new TextEncoder().encode(str);
  const result = new Array(32).fill(0);
  for (let i = 0; i < Math.min(bytes.length, 32); i++) {
    result[i] = bytes[i];
  }
  return result;
}

export { BN, SystemProgram, PublicKey };
