import Qna from "../../models/qna.model.js";
import { updateQna, createQna, deleteQna, getQna } from "../../controller/qna.controller.js";
import * as sm from "./stringMatching.js";

// ini fungsi utamanya, harusnya regex di sini buat nentuin question fitur apa
export async function getAnswer(question, option) {
  const data = await getQna();
  // buat debugging
  console.log(option);
  console.log(data);
  const dateRegex = /^.*(\d{1,2})\/(\d{1,2})\/(\d{4}).*$/;
  const mathRegex = /^.*(\d+\.\d+|\d+)(\s*)((\+|\-|\*|\/|\^)(\s*)((\d+\.\d+|\d+)|(\((\s*)\-(\s*)(\d+(\.\d+)?)(\s*)\)))+).*$/;
  const addQuestionRegex = /^Tambah(kan)? pertanyaan \[([^\]]+)\] dengan jawaban \[([^\]]+)\]$/i;
  const deleteQuestionRegex = /^Hapus(kan)? pertanyaan \[([^\]]+)\]$/i;

  const isDate = dateRegex.test(question);
  const isMath = mathRegex.test(question);
  const isAddQuestion = addQuestionRegex.test(question);
  const isDeleteQuestion = deleteQuestionRegex.test(question);

  if (isDate) {
    return date(question);
  }

  if (isMath) {
    return calculator(question);
  }

  if (isAddQuestion) {
    const questionToAdd = question.match(addQuestionRegex)[2];
    const answer = question.match(addQuestionRegex)[3];
    return addQuestiontoDatabase(option, data, questionToAdd, answer); 
  }

  if (isDeleteQuestion) {
    const questionToDel = question.match(deleteQuestionRegex)[2];
    return deleteQuestiontoDatabase(option, data, questionToDel);
  }

  // Fitur pertanyaan teks
  else {
    const exactMatch = [];
    const similarityList = [];
    if (option == "KMP") {
      for (let i = 0; i < data.length; i++) {
        if (sm.kmpSearch(data[i].userQuestion, question) != -1 || sm.kmpSearch(question, data[i].userQuestion) != -1) {
          if (sm.computeLCS(data[i].userQuestion, question)[1] > 50) {
            exactMatch.push(i);
          }
        }
        similarityList.push(sm.computeLCS(data[i].userQuestion, question)[1]);
      }
    }
    else if (option == "BM") {
      for (let i = 0; i < data.length; i++) {
        if (sm.bmSearch(data[i].userQuestion, question) != -1 || sm.bmSearch(question, data[i].userQuestion) != -1) {
          if (sm.computeLCS(data[i].userQuestion, question)[1] > 50) {
            exactMatch.push(i);
          }
        }
        similarityList.push(sm.computeLCS(data[i].userQuestion, question)[1]);
      }
    }
    if (exactMatch.length == 1) {
      return data[exactMatch[0]].botAnswer;
    }
    else if (exactMatch.length > 1) {
      let maxExactMatch = exactMatch[0];
      for (let i = 1; i < exactMatch.length; i++) {
        if (similarityList[exactMatch[i]] > similarityList[maxExactMatch]) {
          maxExactMatch = exactMatch[i];
        }
      }
      return data[maxExactMatch].botAnswer;
    }

    if (similarityList.some((element) => element >= 90)) {
      const max = Math.max(...similarityList);
      const index = similarityList.indexOf(max);
      return data[index].botAnswer;
    }
    else if (similarityList.some((element) => element >= 70 && element < 90)) {
      const indexList = [];
      for (let i = 0; i < 3; i++) {
        const max = Math.max(...similarityList);
        if (max >= 70) {
          const index = similarityList.indexOf(max);
          indexList.push(index);
          similarityList[index] = -1;
        }
      }
      var text = "Pertanyaan tidak ditemukan di database.\nApakah maksud Anda:\n";
      for (let i = 0; i < indexList.length; i++) {
        text += `${i + 1}. ${data[indexList[i]].userQuestion}\n`;
      }
      return text;
    }
    else {
      return "Pertanyaan tidak dapat diproses";
    }
  }
}

async function addQuestiontoDatabase(option, data, questionToAdd, answer) {
  if (option == "KMP") {
    for (let i = 0; i < data.length; i++) {
      if (sm.kmpSearch(data[i].userQuestion, questionToAdd) != -1 || sm.kmpSearch(questionToAdd, data[i].userQuestion) != -1) {
        if (sm.computeLCS(data[i].userQuestion, questionToAdd)[1] > 50) {
          const sameAnswer = await Qna.findOne({ userQuestion: data[i].userQuestion, botAnswer: answer });
          if (sameAnswer) {
            return "Pertanyaan " + questionToAdd + " dengan jawaban yang sama sudah ada di database";
          } else {
            return updateQna(data[i].userQuestion, answer);
          }
        }
      }
    }
    return createQna(questionToAdd, answer);
  }
  else if (option == "BM") {
    for (let i = 0; i < data.length; i++) {
      if (sm.bmSearch(data[i].userQuestion, questionToAdd) != -1 || sm.bmSearch(questionToAdd, data[i].userQuestion) != -1) {
        if (sm.computeLCS(data[i].userQuestion, questionToAdd)[1] > 50) {
          const sameAnswer = await Qna.findOne({ userQuestion: data[i].userQuestion, botAnswer: answer });
          if (sameAnswer) {
            return "Pertanyaan " + questionToAdd + " dengan jawaban yang sama sudah ada di database";
          } else {
            return updateQna(data[i].userQuestion, answer);
          }
        }
      }
    }
    return createQna(questionToAdd, answer);
  }
}

export function deleteQuestiontoDatabase(option, data, questionToDel) {
  if (option == "KMP") {
    for (let i = 0; i < data.length; i++) {
      if (sm.kmpSearch(data[i].userQuestion, questionToDel) != -1 || sm.kmpSearch(questionToDel, data[i].userQuestion) != -1) {
        if (sm.computeLCS(data[i].userQuestion, questionToDel)[1] > 50) {
          return deleteQna(data[i].userQuestion);
        }
      }
    }
    return "Tidak ada pertanyaan [" + questionToDel + "] di database";
  }
  else if (option == "BM") {
    for (let i = 0; i < data.length; i++) {
      if (sm.bmSearch(data[i].userQuestion, questionToDel) != -1 || sm.bmSearch(questionToDel, data[i].userQuestion) != -1) {
        if (sm.computeLCS(data[i].userQuestion, questionToDel)[1] > 50) {
          return deleteQna(data[i].userQuestion);
        }
      }
    }
    return "Tidak ada pertanyaan [" + questionToDel + "] di database";
  }
}

export function calculator(question) {
  try {
    // Remove any whitespace 
    question = question.replace(/\s/g, '');
    const expressionRegex =/[0-9()+\-*/].*[0-9()+\-*/]/;
    const expression = question.match(expressionRegex)[0];

    const stack = [];

    function calculate(op) {
      const num2 = stack.pop();
      const num1 = stack.pop();

      switch (op) {
        case '+':
          stack.push(num1 + num2);
          break;
        case '-':
          stack.push(num1 - num2);
          break;
        case '*':
          stack.push(num1 * num2);
          break;
        case '/':
          if (num2 === 0) {
            throw new Error('Pembagian dengan nol tidak terdefinisi');
          }
          stack.push(num1 / num2);
          break;
        case '^':
          stack.push(Math.pow(num1, num2));
      }
    }

    function precedence(op) {
      switch (op) {
        case '+':
        case '-':
          return 1;
        case '*':
        case '/':
          return 2;
        case '^':
          return 3;
        default:
          return 0;
      }
    }

    const output = [];
    const opStack = [];

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      // jika character adalah digit, masukkan ke output queue
      if (/\d/.test(char) || char === '.' || (char === '-' && i === 0 && /\d/.test(expression[i + 1]))) {
        let num = char;
        while (i < expression.length - 1 && (/\d/.test(expression[i + 1]) || expression[i + 1] === '.') ) {
          num += expression[++i];
        }
        output.push(Number(num));
      }

      // jika character adalah operator, re-assign operator yang lebih tinggi precedencenya ke output queue
      else if (/[+\-*/^]/.test(char)) {
        while (opStack.length > 0 && precedence(opStack[opStack.length - 1]) >= precedence(char)) {
          output.push(opStack.pop());
        }
        opStack.push(char);
      }
      
      // jika character adalah kurung buka, dan karakter setelahnya adalah minus dan digit, masukkan ke output queue
      else if (char === '(' && expression[i + 1] === '-' && /\d/.test(expression[i + 2])) {
        opStack.push('(');
        let j  = i+2;
        let num = expression[j];
        while (j < expression.length - 1 && (/\d/.test(expression[j + 1]) || expression[j + 1] === '.') ) {
          num += expression[++j];
        }
        output.push(Number(num) * -1);
        i = j;
      }
      
      // jika character adalah kurung buka, masukkan ke operator stack
      else if (char === '(') {
        opStack.push(char);
      }

      // jika character adalah kurung tutup, masukkan operator stack ke output queue sampai menemukan kurung buka
      else if (char === ')') {
        while (opStack[opStack.length - 1] !== '(') {
          output.push(opStack.pop());
        }
        opStack.pop();
      }

      // jika character bukan digit, operator, kurung buka, atau kurung tutup, throw error
      else {
        throw new Error('Sintaks error');
      }
    }

    // push semua operator yang tersisa ke output queue
    while (opStack.length > 0) {
      const op = opStack.pop();
      if (op === '(') {
        throw new Error('Sintaks persamaan tidak sesuai');
      }
      output.push(op);
    }

    // evaluasi output queue
    for (let i = 0; i < output.length; i++) {
      const token = output[i];
      if (typeof token === 'number') {
        stack.push(token);
      } else {
        calculate(token);
      }
    }

    if (stack[0] === undefined || stack[0].toString() === "NaN") {
      throw new Error('Error :(');
    }

    return "Hasilnya adalah " + stack[0].toString();

  } catch (error) {
    return error.message;
  }
}


export function date(question) {
  const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
  const match = question.match(dateRegex);

  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  const year = parseInt(match[3]);

  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1) {
    return "Masukan tanggal tidak sesuai";
  }

  if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) {
    return "Masukan tanggal tidak sesuai";
  }

  if (month == 2) {
    if (isYearKabisat(year) && day > 29) {
      return "Masukan tanggal tidak sesuai";
    }
    else if (!isYearKabisat(year) && day > 28) {
      return "Masukan tanggal tidak sesuai";
    }
  }

  const totalDay = countDay(day, month, year);
  const dayOfWeek = totalDay % 7;
  const dayOfWeekString = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek];

  return "Hari " + dayOfWeekString;
}

function isYearKabisat(year) {
  if (year % 4 === 0) {
    if (year % 100 === 0) {
      return year % 400 === 0;
    }
    return true;
  }
  return false;
}

function countDay(day, month, year) {
  let totalDay = 0;
  for (let i = 1; i < year; i++) {
    if (isYearKabisat(i)) {
      totalDay += 366;
    }
    else {
      totalDay += 365;
    }
  }
  for (let i = 1; i < month; i++) {
    if (i == 4 || i == 6 || i == 9 || i == 11) {
      totalDay += 30;
    }
    else if (i == 2) {
      if (isYearKabisat(year)) {
        totalDay += 29;
      }
      else {
        totalDay += 28;
      }
    }
    else {
      totalDay += 31;
    }
  }
  totalDay += day;
  return totalDay;
}