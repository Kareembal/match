import { useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Connection, Transaction, PublicKey, SystemProgram } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';
const connection = new Connection(DEVNET_RPC, 'confirmed');

export function useSolanaTransaction() {
    const { wallets } = useWallets();

    const getSolanaWallet = useCallback(() => {
        return wallets.find((w: any) => {
            const addr = w.address;
            return addr && !addr.startsWith('0x') && addr.length >= 32 && addr.length <= 44;
        });
    }, [wallets]);

    const sendTransaction = useCallback(async (
        recipientAddress: string,
        lamports: number
    ): Promise<string | null> => {
        const wallet = getSolanaWallet();
        if (!wallet?.address) {
            console.error('No Solana wallet found');
            return null;
        }

        try {
            console.log('🔄 Preparing transaction...');
            const fromPubkey = new PublicKey(wallet.address);
            const toPubkey = new PublicKey(recipientAddress);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports,
                })
            );

            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            console.log('🔑 Getting wallet provider...');
            const provider = await (wallet as any).getEthereumProvider?.() 
                || await (wallet as any).getSolanaProvider?.()
                || await (wallet as any).getProvider?.();

            if (!provider) {
                console.error('Could not get wallet provider');
                return null;
            }

            console.log('✍️ Signing and sending transaction...');
            let signature: string | null = null;

            if (provider.signAndSendTransaction) {
                const result = await provider.signAndSendTransaction(transaction);
                signature = result.signature || result;
            } else if (provider.signTransaction) {
                const signedTx = await provider.signTransaction(transaction);
                const rawTx = signedTx.serialize();
                signature = await connection.sendRawTransaction(rawTx, {
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
                });
            }

            if (signature) {
                console.log('✅ Transaction sent:', signature);
                await connection.confirmTransaction({
                    signature,
                    blockhash,
                    lastValidBlockHeight,
                }, 'confirmed');
                console.log('✅ Transaction confirmed!');
                return signature;
            }

            console.error('No supported transaction method found');
            return null;
        } catch (err: any) {
            console.error('Transaction failed:', err);
            return null;
        }
    }, [getSolanaWallet]);

    const sendSelfTransaction = useCallback(async (): Promise<string | null> => {
        const wallet = getSolanaWallet();
        if (!wallet?.address) return null;
        return sendTransaction(wallet.address, 1000);
    }, [getSolanaWallet, sendTransaction]);

    return { sendTransaction, sendSelfTransaction, getSolanaWallet, connection };
}
