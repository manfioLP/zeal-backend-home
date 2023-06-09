import { Request, Response } from 'express';
import {AccessCondition, QuestRequestBody, UserData} from '../types';

// todo: add response type
export function computeHandler(req: Request, res: Response): Response {
    const { questId, userId, access_condition, user_data, claimed_at }: QuestRequestBody = req.body;

    if (user_data.completed_quests.includes(questId)) {
        return res.status(400).json({ error: 'Quest already completed' });
    }

    if (!checkAccessConditions(access_condition, user_data, claimed_at)) {
        return res.status(400).json({ error: 'Access conditions not satisfied' });
    }

    const score = getScore();

    // Check if score is greater than or equal to 5
    if (score >= 5) {
        return res.status(200).json({ status: 'success', score });
    } else {
        return res.status(200).json({ status: 'failure', score });
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

function getScore() {
    // todo:
    return Math.floor(Math.random() * 10);
}