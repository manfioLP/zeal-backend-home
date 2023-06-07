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

    describe("Access conditions", () => {
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

        it('should return status 400 if user has saved on db that he already completed the quest', () => {
            req.body = {
                questId: '123',
                userId: 'john',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [],
                user_data: {
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

        it('should return status 400 if NFT access conditions isnt satisfied', () => {
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

        it('should return status 400 if date access conditions is before (lower) than claimed_at', () => {
            req.body = {
                questId: '4569bee2-8f42-4054-b432-68f6ddbc20b5',
                userId: 'cb413e98-44a4-4bb1-aaa1-0b91ab1707e7',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [
                    {
                        "type": "date",
                        "value": "2023-02-15T10:44:22+0000",
                        "operator": "<"
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

        it('should return status 400 if level condition is lower than user level', () => {
            req.body = {
                questId: '4569bee2-8f42-4054-b432-68f6ddbc20b5',
                userId: 'cb413e98-44a4-4bb1-aaa1-0b91ab1707e7',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [
                    {
                        "type": "level",
                        "value": "2",
                        "operator": "<"
                    }
                ],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 3,
                },
                submission_text: 'test test test',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'Access conditions not satisfied'});
        });

        it('should return status 400 if one of the conditions isnt satisfied', () => {
            req.body = {
                questId: '4569bee2-8f42-4054-b432-68f6ddbc20b5',
                userId: 'cb413e98-44a4-4bb1-aaa1-0b91ab1707e7',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [
                    {
                        "type": "nft",
                        "operator": "contains",
                        "value": "0x1"
                    },
                    {
                        "type": "date",
                        "value": "2023-02-15T10:44:22+0000",
                        "operator": ">"
                    },
                    {
                        "type": "level",
                        "value": "5",
                        "operator": ">"
                    }
                ],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 3,
                },
                submission_text: 'test test test',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'Access conditions not satisfied'});
        });
    })

    describe("Compute Score and complete quest", () => {
        it ("should fail because score is insufficient", () => {
            req.body = {
                questId: '0x',
                userId: 'a1b2',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [
                    {
                        "type": "nft",
                        "operator": "contains",
                        "value": "0x1"
                    },
                    {
                        "type": "date",
                        "value": "2023-02-15T10:44:22+0000",
                        "operator": ">"
                    },
                    {
                        "type": "level",
                        "value": "5",
                        "operator": ">"
                    }
                ],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 6,
                },
                submission_text: 'test test test',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({score: 3, status: "failure"});
        })

        it ("should get sufficient score to complete quest", () => {
            req.body = {
                questId: '0x',
                userId: 'a1b2',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [
                    {
                        "type": "nft",
                        "operator": "contains",
                        "value": "0x1"
                    },
                    {
                        "type": "date",
                        "value": "2023-02-15T10:44:22+0000",
                        "operator": ">"
                    },
                    {
                        "type": "level",
                        "value": "5",
                        "operator": ">"
                    }
                ],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 6,
                },
                submission_text: 'Im more than happy to complete this quest! it was cheerful',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({score: 10, status: "success"});
        })

        it ("should fail to complete quest after having it successful", () => {
            req.body = {
                questId: '0x',
                userId: 'a1b2',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 6,
                },
                submission_text: 'Im more than happy to complete this quest! it was cheerful',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error:"Quest already completed"});
        })

        it ("should get score zero for successful quest because of bad word", () => {
            req.body = {
                questId: 'new0x',
                userId: 'a1b2',
                claimed_at: '2023-03-15T10:44:22+0000',
                access_condition: [],
                user_data: {
                    completed_quests: [],
                    nfts: ["0x1"],
                    level: 6,
                },
                submission_text: 'Im more than happy to complete this quest! fuck it was so cheerful',
            };

            computeHandler(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({score: 0, status: "failure"});
        })
    })

});
