export interface QuestRequestBody {
    questId: string;
    userId: string;
    claimed_at: string;
    access_condition: AccessCondition[];
    user_data: UserData;
    submission_text: string;
}

export interface AccessCondition {
    type: 'nft' | 'date' | 'level';
    operator: '>' | '<' | 'contains' | 'notContains';
    value: string;
}

export interface UserData {
    completed_quests: string[];
    nfts: string[];
    level: number;
}
