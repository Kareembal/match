import { motion } from 'framer-motion';
import { Book, Shield, ExternalLink, Copy, Check, Server, Lock, Users, Cpu, Key } from 'lucide-react';
import { useState } from 'react';

const contracts = {
  programId: '8kUxrbtzcR5fJe46C23tmtN3LKYhRdKJ9r7R5sSecbnE',
  mxeAccount: '3J2hrrEfTCdJY7mQjGfYqaMqocridFbx7rGCAAv4pgawy5fYggMuqUQzL7rRK28wc5dhn4cfKssiwc3JK8XWPy2g',
  deployTx: '4YNDea5nxa412DCv1TybPP1zJ94Wk2qULdcaXc3cgUVQsnqoLTiTTtLabHEawSXBJceBZvhK57SqWAjVXDgH5gaS',
  clusterOffset: 456,
};

const encryptedInstructions = [
  { name: 'submit_confession', desc: 'Encrypt confession content via MPC' },
  { name: 'like_confession', desc: 'Anonymous encrypted like counters' },
  { name: 'check_match', desc: 'Private matching without revealing preferences' },
  { name: 'verify_eligibility', desc: 'Prove premium status privately' },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button onClick={copy} className="btn btn-ghost" style={{ padding: 4, minWidth: 28 }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function Docs() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              <Book size={14} /> Documentation
            </div>
            <h1 className="page-title">How <span className="accent">Whispr</span> Works</h1>
            <p className="page-subtitle">Verify our security on-chain</p>
          </motion.div>
        </div>

        {/* Security Proof Section */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.2rem' }}>
            <Key size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Proof of Encryption
          </h2>
          
          {/* Solana Program */}
          <div className="card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(139, 92, 246, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Server size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Solana Program</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart contract on Solana Devnet</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Program ID</span>
              <CopyButton text={contracts.programId} />
            </div>
            <code className="font-mono" style={{ fontSize: '0.7rem', wordBreak: 'break-all', display: 'block', marginBottom: 12 }}>{contracts.programId}</code>
            <a 
              href={`https://explorer.solana.com/address/${contracts.programId}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Verify on Solana Explorer <ExternalLink size={12} />
            </a>
          </div>

          {/* Arcium MXE */}
          <div className="card card-accent" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={18} style={{ color: 'var(--success)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: 2 }}>Arcium MXE Account</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ MPC Encryption Active</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              This account proves our app uses Arcium's Multi-Party Computation. All encrypted instructions run through this MXE (Multi-party eXecution Environment).
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MXE Account</span>
              <CopyButton text={contracts.mxeAccount} />
            </div>
            <code className="font-mono" style={{ fontSize: '0.6rem', wordBreak: 'break-all', display: 'block', marginBottom: 12, color: 'var(--text-secondary)' }}>{contracts.mxeAccount}</code>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="badge">Cluster Offset: {contracts.clusterOffset}</span>
              <span className="badge badge-success">4 MPC Nodes</span>
            </div>
            
            <a 
              href={`https://explorer.solana.com/tx/${contracts.deployTx}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              View Deployment TX <ExternalLink size={12} />
            </a>
          </div>
        </section>

        {/* How MPC Works */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.2rem' }}>How MPC Encryption Works</h2>
          <div className="card" style={{ padding: 20 }}>
            <div className="mpc-flow">
              <div className="mpc-step">
                <div className="mpc-step-num">1</div>
                <div>
                  <strong>You submit data</strong>
                  <p>Confession, preferences, etc.</p>
                </div>
              </div>
              <div className="mpc-step">
                <div className="mpc-step-num">2</div>
                <div>
                  <strong>Data is split & encrypted</strong>
                  <p>Split across 4 MPC nodes</p>
                </div>
              </div>
              <div className="mpc-step">
                <div className="mpc-step-num">3</div>
                <div>
                  <strong>Nodes compute together</strong>
                  <p>No single node sees your data</p>
                </div>
              </div>
              <div className="mpc-step">
                <div className="mpc-step-num">4</div>
                <div>
                  <strong>Only result is revealed</strong>
                  <p>Original data stays encrypted</p>
                </div>
              </div>
            </div>
            <div className="badge badge-success" style={{ marginTop: 16 }}>
              <Shield size={12} /> Zero-knowledge: nobody sees your raw data
            </div>
          </div>
        </section>

        {/* Encrypted Instructions */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 16, fontSize: '1.2rem' }}>
            <Cpu size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Encrypted Instructions
          </h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {encryptedInstructions.map((ix, i) => (
              <div key={i} style={{ padding: 16, borderBottom: i < encryptedInstructions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <code className="font-mono accent" style={{ fontSize: '0.85rem' }}>{ix.name}</code>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{ix.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 style={{ marginBottom: 16, fontSize: '1.2rem' }}>Tech Stack</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Solana', 'Anchor', 'Arcium MPC', 'React', 'TypeScript', 'Privy'].map(tech => (
              <span key={tech} className="badge">{tech}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
