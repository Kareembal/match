# Whispr

Anonymous confessions and confidential matchmaking on Solana using Arcium MPC encryption.

## Live Demo

**Frontend:** [https://whispr.vercel.app](https://whispr.vercel.app) *(update with your URL)*

**Solana Program:** `8kUxrbtzcR5fJe46C23tmtN3LKYhRdKJ9r7R5sSecbnE` ([Explorer](https://explorer.solana.com/address/8kUxrbtzcR5fJe46C23tmtN3LKYhRdKJ9r7R5sSecbnE?cluster=devnet))

---

## How It Works

User data is encrypted and split across 4 MPC nodes. No single node sees the full data. Computations happen on encrypted shares, only results are revealed.

![Architecture](./docs/architecture.png)

---

## Tech Stack

- **Blockchain:** Solana (devnet)
- **Privacy:** Arcium MPC (v0.6.3)
- **Smart Contracts:** Anchor
- **Frontend:** React + Vite
- **Auth:** Privy (embedded wallets)
- **Database:** Firebase Realtime Database
- **NFTs:** Metaplex

---

## Project Structure

```
├── confessions-mxe/          # Arcium program
│   ├── encrypted-ixs/        # MPC circuits (Rust)
│   ├── programs/confessions/ # Solana program
│   └── Arcium.toml
├── frontend/                 # React app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── lib/firebase.ts
│   └── package.json
└── scripts/                  # NFT minting scripts
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- Rust + Cargo
- Solana CLI
- Arcium CLI (`cargo install arcium-cli`)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Arcium Program

```bash
cd confessions-mxe

# Build
arcium build

# Deploy to devnet
arcium deploy --cluster devnet

# Run tests
arcium test --cluster devnet
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Confessions** | Post anonymous messages, stored on Firebase with on-chain proof |
| **Matchmaking** | Find compatible users without revealing preferences |
| **Premium** | 0.1 SOL for NFT that unlocks premium features |
| **Wallet-less Login** | Email/Google login via Privy, embedded Solana wallet |



| Contract | Address |
|----------|---------|
| Program | `8kUxrbtzcR5fJe46C23tmtN3LKYhRdKJ9r7R5sSecbnE` |
| MXE Account | `3J2hrrEfTCdJY7mQjGfYqaMqocridFbx7rGCAAv4pgawy5fYggMuqUQzL7rRK28wc5dhn4cfKssiwc3JK8XWPy2g` |
| NFT Collection | `Ehk8MjWwiJRwK5fdVCtzgjG9Nh3iqZYdymFvs9x28Win` |

---

## License

MIT
