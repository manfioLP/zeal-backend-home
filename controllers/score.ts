export function getScore(submissionText: string) {
    let score = 0;

    const punctuationChars = [",", ".", "?", "!"];
    // for sake of simplicity we are considering only one point for 1 or more punctuationchars
    if (submissionText.split('').some((char) => punctuationChars.includes(char))) {
        score += 1;
    }

    if (containsPalindrome(submissionText)) {
        score += 2;
    }

    const joyfulWords = ['joyful', 'happy', 'vibrant', 'thrilled', 'euphoric', 'cheerful', 'delighted'];
    const joyCounter = removeSpecialChars(submissionText).split(' ').filter((word) => joyfulWords.includes(word.toLowerCase())).length;
    score += Math.min(joyCounter, 3)*3;

    if (containsRepetitiveWords(submissionText)) {
        score += 3;
    }

    if (isOffensive(submissionText)) {
        return 0;
    }

    return score;
}

function removeSpecialChars(word: string) {
    return word.replace(/[^a-zA-Z0-9]/g, " ");
}

function containsPalindrome(text: string): boolean {
    const regex = /[\W_]/g;
    // const regex = /[^a-zA-Z0-9]/g;
    const sanitized = text.replace(regex, "").toLowerCase();
    const reverse = sanitized.split('').reverse().join('');
    return reverse === sanitized && sanitized.length !== 0;
}

function containsRepetitiveWords(text: string): boolean {
    const regex = /(.+)\1/;
    return regex.test(text);
}

// todo: implement offensiveness
function isOffensive(text: string): boolean {
    const hateWords = ['fuck', 'bad', 'stupid']
    const found = removeSpecialChars(text).toLowerCase().split(' ').filter((word) => hateWords.includes(word));
    return found.length > 0;
}