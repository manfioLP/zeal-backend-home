import { Request, Response } from 'express';
import { AccessCondition, QuestRequestBody, UserData } from '../types';
import { getScore } from "./score";

// for simplicity, we are using id as any string
const questMap: { [key: string]: string[] } = {
    "cb413e98-44a4-4bb1-aaa1-0b91ab1707e7": ["123", "234x"],
    "a1b2": ["000"],
    "john": ["123", "000"],
};

// todo: add response type
export function computeHandler(req: Request, res: Response): Response {
    const { questId, userId, access_condition, user_data, claimed_at, submission_text }: QuestRequestBody = req.body;

    if (user_data.completed_quests.includes(questId) || questMap[userId].includes(questId)) {
        return res.status(400).json({ error: 'Quest already completed' });
    }

    if (!checkAccessConditions(access_condition, user_data, claimed_at)) {
        return res.status(400).json({ error: 'Access conditions not satisfied' });
    }

    const score = getScore(submission_text);

    // Check if score is greater than or equal to 5
    if (score >= 5) {
        if (questMap[userId]) questMap[userId].push(questId)
        else questMap[userId] = [questId]

        return res.status(200).json({ status: 'success', score });
    } else {
        return res.status(400).json({ status: 'failure', score });
    }

}

function checkAccessConditions(accessConditions: AccessCondition[], userData: UserData, claimed_at: string): boolean {
    for (const condition of accessConditions) {
        if (!checkCondition(condition, userData, claimed_at)) {
            return false;
        }
    }
    return true;
}

function checkCondition(condition: AccessCondition, userData: UserData, claimed_at: string): boolean {
    switch (condition.type) {
        case 'nft': {
            const hasNFT = userData.nfts.includes(condition.value);
            return condition.operator === 'contains' ? hasNFT : !hasNFT;
        }
        case 'date': {
            const claimedDate = new Date(claimed_at);
            const conditionDate = new Date(condition.value);
            return condition.operator === '>' ? claimedDate > conditionDate : claimedDate < conditionDate;
        }
        case 'level': {
            const userLevel = userData.level;
            const conditionLevel = Number(condition.value);
            return condition.operator === '>' ? userLevel > conditionLevel : userLevel < conditionLevel;
        }
        default:
            return false;
    }
}
