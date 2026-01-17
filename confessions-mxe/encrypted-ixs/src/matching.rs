use arcis::*;

#[encrypted]
mod circuits {
    use arcis::*;

    const MAX_INTERESTS: usize = 10;

    #[derive(Copy, Clone)]
    pub struct UserPreferences {
        pub user_id: u64,
        pub interests: [u8; MAX_INTERESTS],
        pub age_min: u8,
        pub age_max: u8,
        pub user_age: u8,
        pub looking_for: u8,
        pub is_premium: bool,
    }

    #[derive(Copy, Clone)]
    pub struct MatchResult {
        pub is_mutual_match: bool,
        pub compatibility_score: u8,
        pub matched_user_id: u64,
    }

    #[instruction]
    pub fn check_match(
        prefs_a: Enc<Shared, UserPreferences>,
        prefs_b: Enc<Shared, UserPreferences>,
        user_a: Shared,
        user_b: Shared,
    ) -> (Enc<Shared, MatchResult>, Enc<Shared, MatchResult>) {
        let p_a = prefs_a.to_arcis();
        let p_b = prefs_b.to_arcis();
        
        let mut score: u8 = 0;
        
        // Interest overlap
        for i in 0..MAX_INTERESTS {
            for j in 0..MAX_INTERESTS {
                let both_have = p_a.interests[i] != 0 
                    && p_a.interests[i] == p_b.interests[j];
                if both_have {
                    score = score + 5;
                }
            }
        }
        
        // Age compatibility
        let a_age_ok = p_a.user_age >= p_b.age_min && p_a.user_age <= p_b.age_max;
        let b_age_ok = p_b.user_age >= p_a.age_min && p_b.user_age <= p_a.age_max;
        if a_age_ok && b_age_ok {
            score = score + 20;
        }
        
        // Same intent
        let same_intent = p_a.looking_for == p_b.looking_for;
        if same_intent {
            score = score + 10;
        }
        
        let is_match = score >= 30;
        
        let result_a = MatchResult {
            is_mutual_match: is_match,
            compatibility_score: score,
            matched_user_id: p_b.user_id,
        };
        
        let result_b = MatchResult {
            is_mutual_match: is_match,
            compatibility_score: score,
            matched_user_id: p_a.user_id,
        };
        
        (user_a.from_arcis(result_a), user_b.from_arcis(result_b))
    }
}
