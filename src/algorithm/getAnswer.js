import Qna from "../../models/qna.model.js";
import { useSelector } from "react-redux";
import { updateQna, createQna, deleteQna, getQna } from "../../controller/qna.controller.js";
import * as sm from "./stringMatching.js";

// ini fungsi utamanya, harusnya regex di sini buat nentuin question fitur apa
export async function getAnswer(question, option) {
  const data = await getQna();
  // buat debugging
  console.log(option);
  console.log(data);

  const dateRegex = /^.*(\d{1,2})\/(\d{1,2})\/(\d{4}).*$/;
  const mathRegex = /^.*(\d+)(\s*)(\+|\-|\*|\/)(\s*)(\d+).*$/;
  const addQuestionRegex = /^Tambah pertanyaan \[([^\]]+)\] dengan jawaban \[([^\]]+)\]$/i;
  const deleteQuestionRegex = /^Hapus pertanyaan \[([^\]]+)\]$/i;

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
    const questionToAdd = question.match(addQuestionRegex)[1];
    const answer = question.match(addQuestionRegex)[2];
    return addQuestiontoDatabase(option, data, questionToAdd, answer); 
  }

  if (isDeleteQuestion) {
    const questionToDel = question.match(deleteQuestionRegex)[1];
    return deleteQuestiontoDatabase(option, data, questionToDel);
  }

  // Fitur pertanyaan teks
  else {
    const exactMatch = [];
    const similarityList = [];
    if (option == "KMP") {
      for (let i = 0; i < data.length; i++) {
        if (sm.kmpSearch(data[i].userQuestion, question) != -1 || sm.kmpSearch(question, data[i].userQuestion) != -1) {
          exactMatch.push(i);
        }
        similarityList.push(sm.computeLCS(data[i].userQuestion, question)[1]);
      }
    }
    else if (option == "BM") {
      for (let i = 0; i < data.length; i++) {
        if (sm.bmSearch(data[i].userQuestion, question) != -1 || sm.bmSearch(question, data[i].userQuestion) != -1) {
          exactMatch.push(i);
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
        const sameAnswer = await Qna.findOne({ userQuestion: data[i].userQuestion, botAnswer: answer });
        if (sameAnswer) {
          return "Pertanyaan " + questionToAdd + " dengan jawaban yang sama sudah ada di database";
        } else {
          return updateQna(data[i].userQuestion, answer);
        }
      }
    }
    return createQna(questionToAdd, answer);
  }
  else if (option == "BM") {
    for (let i = 0; i < data.length; i++) {
      if (sm.bmSearch(data[i].userQuestion, questionToAdd) != -1 || sm.bmSearch(questionToAdd, data[i].userQuestion) != -1) {
        const sameAnswer = await Qna.findOne({ userQuestion: data[i].userQuestion, botAnswer: answer });
        if (sameAnswer) {
          return "Pertanyaan " + questionToAdd + " dengan jawaban yang sama sudah ada di database";
        } else {
          return updateQna(data[i].userQuestion, answer);
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
        return deleteQna(data[i].userQuestion);
      }
    }
    return "Tidak ada pertanyaan [" + questionToDel + "] di database";
  }
  else if (option == "BM") {
    for (let i = 0; i < data.length; i++) {
      if (sm.bmSearch(data[i].userQuestion, questionToDel) != -1 || sm.bmSearch(questionToDel, data[i].userQuestion) != -1) {
        return deleteQna(data[i].userQuestion);
      }
    }
    return "Tidak ada pertanyaan [" + questionToDel + "] di database";
  }
}

export function calculator(question) {
  try {
    // Remove any whitespace 
    question = question.replace(/\s/g, '');

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
        default:
          return 0;
      }
    }

    const output = [];
    const opStack = [];

    for (let i = 0; i < question.length; i++) {
      const char = question[i];

      // jika character adalah digit, masukkan ke output queue
      if (/\d/.test(char)) {
        let num = char;
        while (i < question.length - 1 && /\d/.test(question[i + 1])) {
          num += question[++i];
        }
        output.push(Number(num));
      }

      // jika character adalah operator, re-assign operator yang lebih tinggi precedencenya ke output queue
      else if (/[+\-*/]/.test(char)) {
        while (opStack.length > 0 && precedence(opStack[opStack.length - 1]) >= precedence(char)) {
          output.push(opStack.pop());
        }
        opStack.push(char);
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
        throw new Error('Pertanyaan tidak dapat diproses');
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
    return "Hasilnya adalah " + stack[0].toString();

  } catch (error) {
    return error.message;
  }
}


export function date(question) {
  try {
    const dateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;
    const match = question.match(dateRegex);

    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);

    const date = new Date(year, month - 1, day);

    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      throw new Error('Masukan tanggal tidak sesuai');
    }

    const dayOfWeek = date.getDay();
    const dayOfWeekString = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'][dayOfWeek];

    return "Hari " + dayOfWeekString;
  } catch (error) {
    return error.message;
  }
}

// console.log(getAnswer('Apa ibukota Indonesia?'));
// console.log(getAnswer('Apa mata kuliah IF semester 4 yang paling keos?'));
// console.log(getAnswer('Apa ibukota Indonsa'));
// console.log(getAnswer('Apa ibukota la'));
// console.log(getAnswer('Coba hitung 1 * ( 2 + 29 )'));
// console.log(getAnswer('5+2*5+?'));
// console.log(getAnswer('Hari apa 25/02/2023'));
// console.log(getAnswer('31/01/2050'));
// console.log(getAnswer('31/02/2050'));
// console.log(getAnswer('Tambah pertanyaan [Apa ibukota Indonesia?] dengan jawaban [Jakarta]'));
// console.log(getAnswer('Hapus pertanyaan [Apa ibukota Indonesia?]'));

// const data = getQna();
// console.log(data);