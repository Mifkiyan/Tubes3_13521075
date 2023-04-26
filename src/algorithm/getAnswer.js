// import { getQna } from "../../lib/request.js";


// ini fungsi utamanya, harusnya regex di sini buat nentuin question fitur apa
export function getAnswer(question) {

  // if question itungaitungan :
  return calculator(question);

  // if question tanya waktu :
  // return date(question)

  // dst
}

export function calculator(expression) {
  try {
    // Remove any whitespace from the expression
    expression = expression.replace(/\s/g, '');

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
      throw new Error('Invalid expression');
    }
    
    const result = numStack[0];
    if (isNaN(result)) {
      throw new Error('Invalid expression');
    }
    
    return result.toString();
  } catch (error) {
    return error.message;
  }
}


console.log(calculator('(5*8)+3+s')); 
console.log(calculator('(3+2)*(x(8-5)*2)')); 
console.log(calculator('3*(2+5)-4/(1+1)'));

// const data = getQna();
// console.log(data);