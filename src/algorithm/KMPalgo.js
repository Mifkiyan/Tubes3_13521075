function computeFail(pattern) {
    let fail = [0];
    let m = pattern.length;
    let j = 0;
    let i = 1;
    while (i < m) {
        if (pattern[j] == pattern[i]) {
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

function kmp(text, pattern) {
    let n = text.length;
    let m = pattern.length;
    let fail = computeFail(pattern);
    let i = 0;
    let j = 0;
    while (i < n) {
        if (pattern[j] == text[i]) {
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