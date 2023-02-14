"use strict";

/**
 * Enum for the supported operators in the calculator.
 * @readonly
 * @enum {string}
 */
const Operators = Object.freeze({
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "x",
  DIVIDE: "÷",
});

/* ---------------------------- Calculator Class --------------------------- */

/**
 * The Calculator class that performs the mathematical operations.
 * @class
 */
class Calculator {
  /**
   * Creates an instance of Calculator.
   * @constructor
   */
  constructor() {
    this.displayPrevious = document.querySelector(".calculator__display__previous");
    this.displayCurrent = document.querySelector(".calculator__display__current");
    this.buttons = document.querySelectorAll(".calculator__btn");

    this.displayCurrent.textContent = "0";

    this.leftOperand = "";
    this.rightOperand = "";
    this.operator = "";
    this.canReset = false;

    this.keyboardSupport = new KeyboardSupport(this);

    this.initEventListeners();
  }

  /**
   * Initializes event listeners needed for the calculator.
   * @function
   */
  initEventListeners() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.processInput(button.value);
      });
    });
  }

  /**
   * Processes input from user.
   *
   * @param {string} value - The value of the button clicked.
   * @returns {void}
   */
  processInput(value) {
    if (this.isDigit(value)) {
      this.processDigit(value);
    } else if (this.isOperator(value)) {
      this.processOperator(value);
    } else if (value === "AC") {
      this.clear();
    } else if (value === "+/-") {
      this.changeSign();
    } else if (value === "%") {
      this.percent();
    } else if (value === "del") {
      this.delete();
    } else if (value === "=") {
      this.compute();
    }
  }

  /**
   * Determines if the given value is a digit.
   * @function
   * @param {string} value - The value to check.
   * @returns {boolean} - Whether the value is a digit.
   */
  isDigit(value) {
    return /[0-9\.]/.test(value);
  }

  /**
   * Determines if the given value is an operator.
   * @function
   * @param {string} value - The value to check.
   * @returns {boolean} - Whether the value is an operator.
   */
  isOperator(value) {
    return Object.values(Operators).includes(value);
  }

  /**
   * Processes a digit input.
   * @function
   * @param {string} value - The digit value.
   */
  processDigit(value) {
    if (this.canReset) {
      this.clear();
      this.canReset = false;
    }

    if (this.rightOperand.length >= 9) return;

    if (value === "." && this.rightOperand === "") {
      this.rightOperand = "0.";
    } else if (value === "0" && this.rightOperand === "0") {
      return;
    } else if (value === "." && this.rightOperand.includes(".")) {
      return;
    } else {
      this.rightOperand = this.rightOperand + value;
    }

    this.displayCurrent.textContent = this.rightOperand;
  }

  /**
   * Processes an operator input.
   * @function
   * @param {string} value - The operator value.
   */
  processOperator(value) {
    if (this.operator) {
      this.operator = value;
      this.rightOperand = "";
      this.displayPrevious.textContent = `${this.leftOperand} ${this.operator}`;
      this.canReset = false;
    } else {
      this.operator = value;
      this.leftOperand = this.rightOperand === "" ? "0" : this.rightOperand;
      this.rightOperand = "";
      this.displayPrevious.textContent = `${this.leftOperand} ${this.operator}`;
    }
  }

  /**
   * Clears the calculator display and state.
   * @function
   */
  clear() {
    this.displayPrevious.textContent = "";
    this.displayCurrent.textContent = "0";

    this.leftOperand = "";
    this.rightOperand = "";
    this.operator = "";
  }

  /**
   * Changes the sign of the right operand.
   * @function
   */
  changeSign() {
    if (this.rightOperand === "") {
      if (this.leftOperand === "") return;
      this.rightOperand = this.leftOperand;
    }

    this.rightOperand =
      this.rightOperand.charAt(0) === "-" ? this.rightOperand.slice(1) : "-" + this.rightOperand;

    this.displayCurrent.textContent = this.rightOperand;
  }

  /**
   * Converts the right operand to a percentage.
   * @function
   */
  percent() {
    if (this.rightOperand === "") return;

    this.rightOperand = (parseFloat(this.rightOperand) / 100).toString();
    this.displayCurrent.textContent = this.rightOperand;
  }

  /**
   * Deletes the last digit from the right operand.
   * @function
   */
  delete() {
    this.rightOperand = this.rightOperand.slice(0, -1);
    this.displayCurrent.textContent = this.rightOperand || "0";
  }

  /**
   * Rounds a number to a specified number of decimal places.
   * @function
   * @param {number} number - The number to round.
   * @param {number} decimalPlaces - The number of decimal places to round to.
   * @returns {number} - The rounded number.
   */
  roundNumber(number, decimalPlaces) {
    return Number(number.toFixed(decimalPlaces));
  }

  /**
   * Adds two numbers.
   *
   * @param {number} a - The first number to add.
   * @param {number} b - The second number to add.
   * @returns {number} The sum of `a` and `b`.
   */
  add(a, b) {
    return a + b;
  }

  /**
   * Subtracts two numbers.
   *
   * @param {number} a - The number to subtract from.
   * @param {number} b - The number to subtract.
   * @returns {number} The difference of `a` and `b`.
   */
  subtract(a, b) {
    return a - b;
  }

  /**
   * Multiplies two numbers.
   *
   * @param {number} a - The first number to multiply.
   * @param {number} b - The second number to multiply.
   * @returns {number} The product of `a` and `b`.
   */
  multiply(a, b) {
    return a * b;
  }

  /**
   * Divides two numbers.
   *
   * @param {number} a - The number to be divided.
   * @param {number} b - The number to divide by.
   * @returns {number} The quotient of `a` and `b`.
   */
  divide(a, b) {
    return a / b;
  }

  /**
   * Computes the result of the current calculation.
   * @function
   */
  compute() {
    let result;
    let prev = parseFloat(this.leftOperand);
    let curr = parseFloat(this.rightOperand);

    if (isNaN(prev)) return;

    if (isNaN(curr)) {
      this.rightOperand = this.leftOperand;
      curr = parseFloat(this.leftOperand);
    }

    switch (this.operator) {
      case Operators.ADD:
        result = this.add(prev, curr);
        break;
      case Operators.SUBTRACT:
        result = this.subtract(prev, curr);
        break;
      case Operators.MULTIPLY:
        result = this.multiply(prev, curr);
        break;
      case Operators.DIVIDE:
        result = this.divide(prev, curr);
        break;
      default:
        return;
    }

    result = this.roundNumber(result, 8);

    if (result.toString().length > 10) {
      result = result.toExponential(4);
    }

    this.displayPrevious.textContent = `${this.leftOperand} ${this.operator} ${this.rightOperand} =`;
    this.leftOperand = result;
    this.displayCurrent.textContent = this.leftOperand;
    this.canReset = true;
  }
}

/* ------------------------- KeyboardSupport Class ------------------------- */

/**
 * Class to handle keyboard support for the calculator.
 */
class KeyboardSupport {
  /**
   * Creates an instance of KeyboardSupport.
   * @param {Calculator} calculator - The calculator object
   */
  constructor(calculator) {
    this.calculator = calculator;
    this.initEventListeners();
  }

  /**
   * Initializes event listeners for keyboard inputs.
   * @returns {void}
   */
  initEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === "=") {
        this.calculator.compute();
      } else if (event.key === "Escape") {
        this.calculator.clear();
      } else if (event.key === "Backspace") {
        this.calculator.delete();
      } else if (event.key === "*") {
        this.calculator.processOperator("x");
      } else if (event.key === "/") {
        this.calculator.processOperator("÷");
      } else if (event.key === "+") {
        this.calculator.processOperator("+");
      } else if (event.key === "-") {
        this.calculator.processOperator("-");
      } else if (/^[0-9\.]$/.test(event.key)) {
        this.calculator.processDigit(event.key);
      }
    });
  }
}

/* --------------------------- Utility Functions --------------------------- */

/**
 * Copies the content of the calculator display to the clipboard
 * @function
 */

const CopyToClipboard = (calculator) => {
  const displayCurrent = calculator.displayCurrent;
  navigator.clipboard
    .writeText(displayCurrent.textContent)
    .then(function () {})
    .catch(function () {
      alert("error copying to clipboard");
    });

  displayCurrent.classList.add("active");

  setTimeout(() => {
    displayCurrent.classList.remove("active");
  }, 1000);
};

/* ------------------------------ Entry point ------------------------------ */

// Initialize a new instance of the Calculator class
const calculator = new Calculator();

// Attach click event listener to calculator display current element to copy
// its text content to clipboard using CopyToClipboard function
calculator.displayCurrent.addEventListener("click", () => {
  CopyToClipboard(calculator);
});
