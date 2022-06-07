import crypto from "crypto";

async function randomStringSequence(length: number, sequence: string[]) {
    let promises: Promise<string>[] = [];

    for (let i = 0; i < length; i++) {
        const pr = new Promise<string>((resolve, reject) => {
            crypto.randomInt(sequence.length, (err, n) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(sequence[n]);
                }
            });
        });
        promises.push(pr);
    }

    return (await Promise.all(promises)).join("");
}

async function randomBase64(length: number) {
    const BASE64 = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "-",
        "_",
    ];

    return randomStringSequence(length, BASE64);
}

export { randomStringSequence, randomBase64 };
