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
function bm(text, pattern) {
    var lengthText = text.length;
    var lengthPattern = pattern.length;
    var i = lengthPattern - 1;
    var j = lengthPattern - 1;
    var last = buildLast(pattern);
    if (i > lengthText - 1) {
        return -1;
    }
    do {
        if (text[i] == pattern[j]) {
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



let pattern = "APA YANG DIMAKSUD STIMA";
let text = "APA YANG ITUUUUU STIMA";

let pattern2 = "APA YANG ITUUUUU STIMA";

result = bm(text, pattern);
console.log(result);

result2 = bm(text, pattern2);
console.log(result2);