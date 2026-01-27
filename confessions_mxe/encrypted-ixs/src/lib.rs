//! Anonymous Confessions & Confidential Matchmaking

use arcis::*;

#[encrypted]
mod circuits {
    use arcis::*;

    // ============ CONFESSIONS ============
    
    pub struct ConfessionInput {
        pub content_hash: u64,
        pub category: u8,
    }

    pub struct ConfessionResult {
        pub success: bool,
        pub confession_id: u64,
    }

    #[instruction]
    pub fn submit_confession(
        input: Enc<Shared, ConfessionInput>,
        current_id: Enc<Mxe, u64>,
    ) -> (Enc<Mxe, u64>, Enc<Shared, ConfessionResult>) {
        let _confession = input.to_arcis();
        let id = current_id.to_arcis();
        let new_id = id + 1;
        
        let result = ConfessionResult {
            success: true,
            confession_id: new_id,
        };
        
        (current_id.owner.from_arcis(new_id), input.owner.from_arcis(result))
    }

    // ============ MATCHMAKING ============

    pub struct UserPreferences {
        pub interest_category: u8,
        pub age_min: u8,
        pub age_max: u8,
        pub looking_for: u8,
    }

    pub struct MatchResult {
        pub is_match: bool,
        pub compatibility_score: u8,
    }

    #[instruction]
    pub fn check_match(
        user_a: Enc<Shared, UserPreferences>,
        user_b: Enc<Shared, UserPreferences>,
    ) -> (Enc<Shared, MatchResult>, Enc<Shared, MatchResult>) {
        let prefs_a = user_a.to_arcis();
        let prefs_b = user_b.to_arcis();
        
        let mut score: u8 = 0;
        
        if prefs_a.interest_category == prefs_b.interest_category {
            score = score + 40;
        }
        
        let age_ok = prefs_a.age_min <= prefs_b.age_max && prefs_b.age_min <= prefs_a.age_max;
        if age_ok {
            score = score + 30;
        }
        
        if prefs_a.looking_for == prefs_b.looking_for {
            score = score + 30;
        }
        
        let is_match = score >= 60;
        
        let result_a = MatchResult { is_match, compatibility_score: score };
        let result_b = MatchResult { is_match, compatibility_score: score };
        
        (user_a.owner.from_arcis(result_a), user_b.owner.from_arcis(result_b))
    }
}
