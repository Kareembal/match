use arcis::*;

#[encrypted]
mod circuits {
    use arcis::*;

    const MAX_CONFESSION_LEN: usize = 32;

    #[derive(Copy, Clone)]
    pub struct Confession {
        pub content: [u8; MAX_CONFESSION_LEN],
        pub category: u8,
        pub timestamp: u64,
        pub id: u64,
        pub active: bool,
        pub likes: u32,
        pub is_premium: bool,
    }

    #[derive(Copy, Clone)]
    pub struct ConfessionInput {
        pub content: [u8; MAX_CONFESSION_LEN],
        pub category: u8,
        pub timestamp: u64,
        pub is_premium: bool,
    }

    #[derive(Copy, Clone)]
    pub struct ConfessionResult {
        pub success: bool,
        pub confession_id: u64,
    }

    #[instruction]
    pub fn submit_confession(
        input: Enc<Shared, ConfessionInput>,
    ) -> Enc<Shared, ConfessionResult> {
        let confession_input = input.to_arcis();
        
        let result = ConfessionResult {
            success: true,
            confession_id: confession_input.timestamp,
        };
        
        input.owner.from_arcis(result)
    }

    #[instruction]
    pub fn like_confession(
        confession_id: Enc<Shared, u64>,
    ) -> Enc<Shared, bool> {
        let _target_id = confession_id.to_arcis();
        confession_id.owner.from_arcis(true)
    }
}
