import { getScore } from "../controllers/score";

describe("Score Test", () => {
    describe("Punctuation", () => {
        it('should return a score 1 for string with only punctuation chars', () => {
            const score = getScore(". , ? !");

            expect(score).toBe(1);
        });

        it('should return a score 1 for punctuation', () => {
            const score = getScore("with punctuation.");

            expect(score).toBe(1);
        });
    })

    describe("Palindrome", () => {
        it('should return a score 2 for palindrome word', () => {
            const score = getScore("wow");

            expect(score).toBe(2);
        });

        it('should return a score 2 for palindrome text', () => {
            const score = getScore("Step on no pets");

            expect(score).toBe(2);
        });

        it('should return a score 3 for palindrome text + punctuation', () => {
            const score = getScore("Was it a cat I saw?");

            expect(score).toBe(3);
        });

        it('should return a score 5 for palindrome word with repetitive sequence', () => {
            const score = getScore("Anna");

            expect(score).toBe(5);
        });
    })

    describe("Repetitive sequences", () => {
        it('should return a score 3 for repetitive sequence', () => {
            const score = getScore("abaala");

            expect(score).toBe(3);
        });

        it('should return a score 3 for repetitive sequence', () => {
            const score = getScore("abaaba test");

            expect(score).toBe(3);
        });

        it('should return a score 5 for repetitive sequence that are a palindrome', () => {
            const score = getScore("aaa");

            expect(score).toBe(5);
        });

        it('should return a score 5 for repetitive sequence that are a palindrome', () => {
            const score = getScore("abaaba");

            expect(score).toBe(5);
        });

    })

    describe ("Joyful words", () => {
        it('should return a score 3 for one joy word', () => {
            const score = getScore("Joyful");

            expect(score).toBe(3);
        });

        it('should return a score 6 for two joy word', () => {
            const score = getScore("Joyful Joyful");

            expect(score).toBe(6);
        });

        it('should return a score 9 for three joy word', () => {
            const score = getScore("Vibrant Joyful Euphoric");

            expect(score).toBe(9);
        });

        it('should return max joy score for more than 3 joy words', () => {
            const score = getScore("Joyful Vibrant Euphoric Delighted");

            expect(score).toBe(9);
        });
    })

    describe ("Complex", () => {
        it('should return max joy score for all joy words + repetitive sequence', () => {
            const score = getScore("Joyful Happy Vibrant Thrilled Euphoric Cheerful Delighted");

            expect(score).toBe(12);
        });


        it('should return a score 6 for one joy word that has repetitive sequence', () => {
            const score = getScore("Happy");

            expect(score).toBe(6);
        });
    })

    describe ("offensive", () => {
        it('offensive word UPPERCASE', () => {
            const score = getScore("Joyful Happy Vibrant Thrilled Euphoric Cheerful Delighted FUCK");

            expect(score).toBe(0);
        });

        it('offensive word lowercase', () => {
            const score = getScore("Joyful Happy Vibrant Thrilled Euphoric Cheerful Delighted fuck");

            expect(score).toBe(0);
        });
    })



})