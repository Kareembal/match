use arcis::*;

#[encrypted]
mod circuits {
    use arcis::*;

    #[derive(Copy, Clone)]
    pub struct MemberProfile {
        pub member_id: u64,
        pub tier: u8,
        pub reputation: u8,
        pub active: bool,
    }

    #[instruction]
    pub fn verify_tier_eligibility(
        member: Enc<Shared, MemberProfile>,
        required_tier: Enc<Shared, u8>,
        verifier: Shared,
    ) -> Enc<Shared, bool> {
        let profile = member.to_arcis();
        let min_tier = required_tier.to_arcis();
        
        let is_eligible = profile.tier >= min_tier && profile.active;
        
        verifier.from_arcis(is_eligible)
    }

    #[instruction]
    pub fn verify_reputation(
        member: Enc<Shared, MemberProfile>,
        min_reputation: Enc<Shared, u8>,
        verifier: Shared,
    ) -> Enc<Shared, bool> {
        let profile = member.to_arcis();
        let min_rep = min_reputation.to_arcis();
        
        let meets_req = profile.reputation >= min_rep && profile.active;
        
        verifier.from_arcis(meets_req)
    }
}
