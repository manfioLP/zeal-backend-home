import {Request, Response} from 'express';
import { computeHandler } from '../controllers/quest';

describe('Quest test', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        // Initialize the req and res objects for each test
        req = {body: {}};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return status 400 if quest has already been completed by the user', () => {
        req.body = {
            questId: '4569bee2-8f42-4054-b432-68f6ddbc20b5',
            userId: 'cb413e98-44a4-4bb1-aaa1-0b91ab1707e7',
            claimed_at: '2023-03-15T10:44:22+0000',
            access_condition: [],
            user_data: {
                // completed_quests: ['94e2e33e-07e9-4750-8cea-c033d7706057'],
                completed_quests: ['4569bee2-8f42-4054-b432-68f6ddbc20b5'],
                nfts: [],
                level: 3,
            },
            submission_text: 'test test test',
        };

        computeHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: 'Quest already completed'});
    });

    it('should return status 400 if access conditions are not satisfied', () => {
        req.body = {
            questId: '4569bee2-8f42-4054-b432-68f6ddbc20b5',
            userId: 'cb413e98-44a4-4bb1-aaa1-0b91ab1707e7',
            claimed_at: '2023-03-15T10:44:22+0000',
            access_condition: [
                {
                    "type": "nft",
                    "operator": "contains",
                    "value": "0x1"
                }
            ],
            user_data: {
                completed_quests: [],
                nfts: [],
                level: 3,
            },
            submission_text: 'test test test',
        };

        computeHandler(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({error: 'Access conditions not satisfied'});
    });
});
