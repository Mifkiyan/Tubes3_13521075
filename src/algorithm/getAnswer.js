// import { getQna } from "../../lib/request.js";

const { get } = require("mongoose");


// ini fungsi utamanya, harusnya regex di sini buat nentuin question fitur apa
export function getAnswer(question) {
  const dateRegex = /^.*(\d{1,2})\/(\d{1,2})\/(\d{4}).*$/;
  // math regex with whitespace
  const mathRegex = /^.*(\d+)(\s*)(\+|\-|\*|\/)(\s*)(\d+).*$/;

  // Disini harusnya pake algoritma KMP sama BM nya (kayaknya)
  const isDate = dateRegex.test(question);
  const isMath = mathRegex.test(question);
  if (isDate) {
    return date(question);
  }

  if (isMath) {
    return calculator(question);
  }

  else { // Masukin KMP sama BM pake database
    return "Undefined Question"
  }

  // dst
}

export function calculator(question) {
  try {
    // if theres a number followed by a space and another number, throw an error
    if (/[0-9]\s+[0-9]/.test(question)) {
      throw new Error('Sintaks persamaan tidak sesuai');
    }

    // Remove any whitespace from the expression
    question = question.replace(/\s/g, '');

    // cut the expression to only contain numbers and operators
    const expressionRegex = /[0-9()+\-*/].*[0-9()+\-*/]/;
    const expression = question.match(expressionRegex)[0];

    // Initialize the stack for numbers and operators
    const numStack = [];
    const opStack = [];

    // Define a function to perform the calculation of two numbers and an operator
    function calculate() {
      const num2 = numStack.pop();
      const num1 = numStack.pop();
      const op = opStack.pop();

      switch (op) {
        case '+':
          numStack.push(num1 + num2);
          break;
        case '-':
          numStack.push(num1 - num2);
          break;
        case '*':
          numStack.push(num1 * num2);
          break;
        case '/':
          numStack.push(num1 / num2);
          break;
      }
    }

    // Iterate over each character in the expression
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      // If the character is a digit, add it to the current number being parsed
      if (/\d/.test(char)) {
        let num = char;
        while (i < expression.length - 1 && /\d/.test(expression[i + 1])) {
          num += expression[++i];
        }
        numStack.push(Number(num));
      }

      // If the character is an opening parenthesis, push it onto the operator stack
      else if (char === '(') {
        opStack.push(char);
      }

      // If the character is a closing parenthesis, perform calculations until the matching opening parenthesis is found
      else if (char === ')') {
        while (opStack[opStack.length - 1] !== '(') {
          calculate();
        }
        opStack.pop();
      }

      // If the character is an operator, perform calculations until an operator with lower precedence is found or the operator stack is empty
      else if (/[+\-*/]/.test(char)) {
        while (opStack.length > 0 && /[+\-*/]/.test(opStack[opStack.length - 1])) {
          const topOp = opStack[opStack.length - 1];
          if ((char === '+' || char === '-') && (topOp === '*' || topOp === '/')) {
            break;
          }
          calculate();
        }
        opStack.push(char);
      }

      // If the character is not a digit, opening parenthesis, closing parenthesis, or operator, throw an error
      else {
        throw new Error(`Unexpected character "${char}"`);
      }
    }

    // Perform any remaining calculations in the operator stack
    while (opStack.length > 0) {
      calculate();
    }

    // The final result will be the only element left in the number stack
    if (numStack.length !== 1) {
      throw new Error('Sintaks persamaan tidak sesuai');
    }

    const result = numStack[0];
    if (isNaN(result)) {
      throw new Error('Sintaks persamaan tidak sesuai');
    }

    return "Hasilnya adalah " + result.toString();
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
  }
  catch (error) {
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

// const data = getQna();
// console.log(data);