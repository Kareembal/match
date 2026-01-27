import { useState, useCallback, useEffect } from 'react';
import { usePrivyWallet } from './usePrivyWallet';
import { useSendTransaction } from '@privy-io/react-auth/solana';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

const PREMIUM_PRICE = 0.1;
const TREASURY = new PublicKey('2AFn54CFEVb2Wt3oFMpdXsLifgvQ1ri71ewcA2Xf12ra');
const COLLECTION_MINT = 'Ehk8MjWwiJRwK5fdVCtzgjG9Nh3iqZYdymFvs9x28Win';

async function checkNFTOwnership(walletAddress: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.devnet.solana.com`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAssetsByOwner',
        params: { ownerAddress: walletAddress, page: 1, limit: 100 },
      }),
    });
    const data = await response.json();
    if (data.result?.items) {
      return data.result.items.some((item: any) => 
        item.grouping?.some((g: any) => 
          g.group_key === 'collection' && g.group_value === COLLECTION_MINT
        )
      );
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function usePremium() {
  const { connected, publicKey, wallet, connection, address } = usePrivyWallet();
  const { sendTransaction } = useSendTransaction();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (!address) { setIsPremium(false); return; }
      setIsChecking(true);
      const stored = localStorage.getItem(`premium_${address}`);
      if (stored === 'true') { setIsPremium(true); setIsChecking(false); return; }
      const hasNFT = await checkNFTOwnership(address);
      if (hasNFT) { localStorage.setItem(`premium_${address}`, 'true'); setIsPremium(true); }
      setIsChecking(false);
    };
    checkPremium();
  }, [address]);

  const purchasePremium = useCallback(async (): Promise<string | null> => {
    if (!publicKey || !wallet || !connected) return null;
    setIsPurchasing(true);
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TREASURY,
          lamports: PREMIUM_PRICE * LAMPORTS_PER_SOL,
        })
      );
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Pass as object with transaction and connection
      const result = await sendTransaction({ transaction, connection });
      const signature = result.signature;

      localStorage.setItem(`premium_${publicKey.toBase58()}`, 'true');
      setIsPremium(true);
      return signature;
    } catch (err: any) {
      console.error('Purchase failed:', err);
      return null;
    } finally {
      setIsPurchasing(false);
    }
  }, [publicKey, wallet, connected, connection, sendTransaction]);

  const refreshPremiumStatus = useCallback(async () => {
    if (address) {
      setIsChecking(true);
      const hasNFT = await checkNFTOwnership(address);
      if (hasNFT) { localStorage.setItem(`premium_${address}`, 'true'); setIsPremium(true); }
      setIsChecking(false);
    }
  }, [address]);

  return { purchasePremium, isPurchasing, isPremium, isChecking, premiumPrice: PREMIUM_PRICE, refreshPremiumStatus, collectionMint: COLLECTION_MINT };
}
