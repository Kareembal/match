use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("BycRJnXXAHuCMNUR9xY67rKkAvGqf4Z9KwPuRbYExKos");

// Premium NFT collection address (update after deployment)
pub const PREMIUM_COLLECTION: &str = "11111111111111111111111111111111";
pub const PREMIUM_PRICE_LAMPORTS: u64 = 100_000_000; // 0.1 SOL

#[program]
pub mod confessions {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.confession_count = 0;
        state.total_premium_sold = 0;
        msg!("Confessions program initialized!");
        Ok(())
    }

    pub fn submit_confession(
        ctx: Context<SubmitConfession>,
        content_hash: [u8; 32],
        category: u8,
        is_premium: bool,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let confession = &mut ctx.accounts.confession;
        
        confession.id = state.confession_count;
        confession.content_hash = content_hash;
        confession.category = category;
        confession.is_premium = is_premium;
        confession.likes = 0;
        confession.timestamp = Clock::get()?.unix_timestamp;
        confession.submitter = ctx.accounts.submitter.key();
        
        state.confession_count += 1;

        emit!(ConfessionSubmitted {
            id: confession.id,
            category,
            is_premium,
            timestamp: confession.timestamp as u64,
        });

        Ok(())
    }

    pub fn like_confession(ctx: Context<LikeConfession>) -> Result<()> {
        let confession = &mut ctx.accounts.confession;
        confession.likes += 1;

        emit!(ConfessionLiked {
            confession_id: confession.id,
            new_likes: confession.likes,
            liker: ctx.accounts.liker.key(),
        });

        Ok(())
    }

    pub fn purchase_premium(ctx: Context<PurchasePremium>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        
        // Transfer SOL from buyer to treasury
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.treasury.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, PREMIUM_PRICE_LAMPORTS)?;

        state.total_premium_sold += 1;

        emit!(PremiumPurchased {
            buyer: ctx.accounts.buyer.key(),
            amount: PREMIUM_PRICE_LAMPORTS,
            total_sold: state.total_premium_sold,
        });

        msg!("Premium purchased! NFT will be sent by backend.");
        Ok(())
    }

    pub fn register_preferences(
        ctx: Context<RegisterPreferences>,
        interests: [u8; 10],
        age_min: u8,
        age_max: u8,
        user_age: u8,
        looking_for: u8,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        
        profile.user = ctx.accounts.user.key();
        profile.interests = interests;
        profile.age_min = age_min;
        profile.age_max = age_max;
        profile.user_age = user_age;
        profile.looking_for = looking_for;
        profile.is_active = true;

        emit!(PreferencesRegistered {
            user: profile.user,
            interests,
            looking_for,
        });

        Ok(())
    }

    pub fn request_match(ctx: Context<RequestMatch>) -> Result<()> {
        emit!(MatchRequested {
            requester: ctx.accounts.requester.key(),
            target: ctx.accounts.target_profile.user,
        });

        Ok(())
    }
}

// ============================================================================
// STATE ACCOUNTS
// ============================================================================

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub confession_count: u64,
    pub total_premium_sold: u64,
}

#[account]
pub struct Confession {
    pub id: u64,
    pub content_hash: [u8; 32],
    pub category: u8,
    pub is_premium: bool,
    pub likes: u32,
    pub timestamp: i64,
    pub submitter: Pubkey,
}

#[account]
pub struct UserProfile {
    pub user: Pubkey,
    pub interests: [u8; 10],
    pub age_min: u8,
    pub age_max: u8,
    pub user_age: u8,
    pub looking_for: u8,
    pub is_active: bool,
}

// ============================================================================
// INSTRUCTION ACCOUNTS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8,
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ProgramState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitConfession<'info> {
    #[account(mut, seeds = [b"state"], bump)]
    pub state: Account<'info, ProgramState>,
    #[account(
        init,
        payer = submitter,
        space = 8 + 8 + 32 + 1 + 1 + 4 + 8 + 32,
        seeds = [b"confession", state.confession_count.to_le_bytes().as_ref()],
        bump
    )]
    pub confession: Account<'info, Confession>,
    #[account(mut)]
    pub submitter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LikeConfession<'info> {
    #[account(mut)]
    pub confession: Account<'info, Confession>,
    pub liker: Signer<'info>,
}

#[derive(Accounts)]
pub struct PurchasePremium<'info> {
    #[account(mut, seeds = [b"state"], bump)]
    pub state: Account<'info, ProgramState>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Treasury wallet
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterPreferences<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 10 + 1 + 1 + 1 + 1 + 1,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RequestMatch<'info> {
    pub requester: Signer<'info>,
    pub target_profile: Account<'info, UserProfile>,
}

// ============================================================================
// EVENTS
// ============================================================================

#[event]
pub struct ConfessionSubmitted {
    pub id: u64,
    pub category: u8,
    pub is_premium: bool,
    pub timestamp: u64,
}

#[event]
pub struct ConfessionLiked {
    pub confession_id: u64,
    pub new_likes: u32,
    pub liker: Pubkey,
}

#[event]
pub struct PremiumPurchased {
    pub buyer: Pubkey,
    pub amount: u64,
    pub total_sold: u64,
}

#[event]
pub struct PreferencesRegistered {
    pub user: Pubkey,
    pub interests: [u8; 10],
    pub looking_for: u8,
}

#[event]
pub struct MatchRequested {
    pub requester: Pubkey,
    pub target: Pubkey,
}
