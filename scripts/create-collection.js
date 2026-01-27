const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createNft, mplTokenMetadata } = require('@metaplex-foundation/mpl-token-metadata');
const { generateSigner, keypairIdentity, percentAmount } = require('@metaplex-foundation/umi');
const fs = require('fs');
const path = require('path');

async function main() {
  // Load keypair
  const keypairPath = '/home/codespace/.config/solana/id.json';
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  
  // Create Umi instance
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata());
  
  // Create keypair from secret
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));
  
  console.log('Wallet:', keypair.publicKey);
  
  // Create collection NFT
  const collectionMint = generateSigner(umi);
  
  console.log('Creating Whispr Premium Pass collection...');
  
  await createNft(umi, {
    mint: collectionMint,
    name: 'Whispr Premium Pass',
    symbol: 'WHISPR',
    uri: 'https://arweave.net/placeholder', // You can update this later
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi);
  
  console.log('\n✅ Collection created!');
  console.log('Collection Mint:', collectionMint.publicKey);
  
  // Save to file
  const config = {
    collectionMint: collectionMint.publicKey,
    supply: 2000,
    minted: 0,
    price: 0.1,
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'collection-config.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('\nConfig saved to collection-config.json');
  console.log('\nNext: Update frontend/src/hooks/usePremium.ts with this collection mint!');
}

main().catch(console.error);
