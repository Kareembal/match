const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createNft, mplTokenMetadata, fetchDigitalAsset } = require('@metaplex-foundation/mpl-token-metadata');
const { generateSigner, keypairIdentity, percentAmount, publicKey } = require('@metaplex-foundation/umi');
const fs = require('fs');

const COLLECTION_MINT = 'Ehk8MjWwiJRwK5fdVCtzgjG9Nh3iqZYdymFvs9x28Win';

async function mintPremiumNFT(recipientAddress) {
  const keypairPath = '/home/codespace/.config/solana/id.json';
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
  
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata());
  
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));
  
  const config = JSON.parse(fs.readFileSync('./collection-config.json', 'utf-8'));
  
  if (config.minted >= config.supply) {
    console.log('❌ Max supply reached!');
    return;
  }
  
  const nftMint = generateSigner(umi);
  const edition = config.minted + 1;
  
  console.log(`Minting Premium Pass #${edition} to ${recipientAddress}...`);
  
  await createNft(umi, {
    mint: nftMint,
    name: `Whispr Premium Pass #${edition}`,
    symbol: 'WHISPR',
    uri: 'https://arweave.net/placeholder',
    sellerFeeBasisPoints: percentAmount(0),
    collection: { key: publicKey(COLLECTION_MINT), verified: false },
    tokenOwner: publicKey(recipientAddress),
  }).sendAndConfirm(umi);
  
  config.minted = edition;
  fs.writeFileSync('./collection-config.json', JSON.stringify(config, null, 2));
  
  console.log('✅ NFT Minted!');
  console.log('NFT Mint:', nftMint.publicKey);
  console.log('Total minted:', edition, '/', config.supply);
}

const recipient = process.argv[2];
if (!recipient) {
  console.log('Usage: node mint-nft.js <wallet-address>');
  process.exit(1);
}

mintPremiumNFT(recipient).catch(console.error);
