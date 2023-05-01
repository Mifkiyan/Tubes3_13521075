function computeFail(pattern) {
    let fail = [0];
    let m = pattern.length;
    let j = 0;
    let i = 1;
    while (i < m) {
        if (pattern[j].toLowerCase() == pattern[i].toLowerCase()) {
            fail[i] = j + 1;
            i++;
            j++;
        }
        else if (j > 0) {
            j = fail[j - 1];
        }
        else {
            fail[i] = 0;
            i++;
        }
    }
    return fail;
}

function kmpSearch(text, pattern) {
    let n = text.length;
    let m = pattern.length;
    let fail = computeFail(pattern);
    let i = 0;
    let j = 0;
    while (i < n) {
        if (pattern[j].toLowerCase() == text[i].toLowerCase()) {
            if (j == m - 1) {
                return i - m + 1;
            }
            i++;
            j++;
        }
        else if (j > 0) {
            j = fail[j - 1];
        }
        else {
            i++;
        }
    }
    return -1;
}

//Implementasi fungsi buildLast
function buildLast(pattern) {
    var last = new Array(128);
    //Inisialisasi semua karakter last index kemunculannya adalah -1
    for (var i = 0; i < 128; i++) {
        last[i] = -1;
    }
    for (var j = 0; j < pattern.length; j++) {
        last[pattern[j]] = j;
    }
    return last;
}
//Implementasi string machine dengan boyer Moore
function bmSearch(text, pattern) {
    var lengthText = text.length;
    var lengthPattern = pattern.length;
    var i = lengthPattern - 1;
    var j = lengthPattern - 1;
    var last = buildLast(pattern);
    if (i > lengthText - 1) {
        return -1;
    }
    do {
        if (text[i].toLowerCase() == pattern[j].toLowerCase()) {
            if (j == 0) {
                return i;
            } else {
                i--;
                j--;
            }
        } else {
            var lo = last[text[i]];
            i = i + lengthPattern - Math.min(j, 1 + lo);
            j = lengthPattern - 1;
        }
    } while (i <= lengthText - 1);
    return -1;
}

function computeLCS(str1, str2) {
    let str1Len = str1.length;
    let str2Len = str2.length;
    let dpMatrix = [];

    for (let i = 0; i <= str1Len; i++) {
        dpMatrix.push([]);
        for (let j = 0; j <= str2Len; j++) {
            dpMatrix[i].push(0);
        }
    }

    for (let i = 1; i <= str1Len; i++) {
        for (let j = 1; j <= str2Len; j++) {
            if (str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase()) {
                dpMatrix[i][j] = 1 + dpMatrix[i - 1][j - 1];
            } else {
                dpMatrix[i][j] = Math.max(dpMatrix[i - 1][j], dpMatrix[i][j - 1]);
            }
        }
    }

    let lcsLen = dpMatrix[str1Len][str2Len];
    let lcsArr = [];
    let i = str1Len;
    let j = str2Len;

    while (i > 0 && j > 0) {
        if (str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase()) {
            lcsArr[lcsLen - 1] = str1[i - 1];
            i--;
            j--;
            lcsLen--;
        } else if (dpMatrix[i - 1][j] > dpMatrix[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    let lcsStr = lcsArr.join("");
    let similarityPercentage = (lcsStr.length * 200) / (str1Len + str2Len);
    return [lcsStr, similarityPercentage.toFixed(2)];
}

let text = [];
text.push("Apa ibukota Indonesia?");
text.push("Apa ibukota Italy?");
text.push("Apa ibukota India?");

const pattern = "apa ibukota indo"
let index = [];

for (let i = 0; i < text.length; i++) {
    console.log(computeLCS(text[i], pattern));
    console.log(kmpSearch(text[i], pattern));
    console.log(bmSearch(text[i], pattern));
}

// console.log(index);