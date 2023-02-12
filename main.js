"use strict";

const Operators = Object.freeze({
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "x",
  DIVIDE: "/",
});

class Calculator {
  constructor() {
    this.displayPrevious = document.querySelector(".calculator__display__previous");
    this.displayCurrent = document.querySelector(".calculator__display__current");
    this.buttons = document.querySelectorAll(".calculator__btn");

    this.displayCurrent.textContent = "0";

    this.previousOperand = "";
    this.currentOperand = "";
    this.operator = "";

    this.initEventListeners();
  }

  initEventListeners() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.processInput(button.value);
      });
    });
  }

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

  isDigit(value) {
    return /[0-9\.]/.test(value);
  }

  isOperator(value) {
    return Object.values(Operators).includes(value);
  }

  processDigit(value) {
    if (value === "." && this.currentOperand.includes(".")) return;

    this.currentOperand = this.currentOperand + value;
    this.displayCurrent.textContent = this.currentOperand;

    if (this.operator) {
      this.displayPrevious.textContent = `${this.previousOperand} ${this.operator}`;
    }
  }

  processOperator(value) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.compute();
    }
    this.operator = value;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.displayCurrent.textContent = `${this.previousOperand} ${this.operator}`;
  }

  clear() {
    this.displayPrevious.textContent = "";
    this.displayCurrent.textContent = "0";

    this.previousOperand = "";
    this.currentOperand = "";
    this.operator = "";
  }

  changeSign() {
    if (this.currentOperand === "") return;

    this.currentOperand =
      this.currentOperand.charAt(0) === "-"
        ? this.currentOperand.slice(1)
        : "-" + this.currentOperand;

    this.displayCurrent.textContent = this.currentOperand;
  }

  percent() {
    if (this.currentOperand === "") return;

    this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    this.displayCurrent.textContent = this.currentOperand;
  }

  delete() {
    this.currentOperand = this.currentOperand.slice(0, -1);
    this.displayCurrent.textContent = this.currentOperand || "0";
  }

  compute() {
    let result;
    const prev = parseFloat(this.previousOperand);
    const curr = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operator) {
      case Operators.ADD:
        result = prev + curr;
        break;
      case Operators.SUBTRACT:
        result = prev - curr;
        break;
      case Operators.MULTIPLY:
        result = prev * curr;
        break;
      case Operators.DIVIDE:
        result = prev / curr;
        break;
      default:
        return;
    }

    this.displayPrevious.textContent = `${this.previousOperand} ${this.operator} ${this.currentOperand} =`;
    this.previousOperand = "";
    this.currentOperand = result;
    this.operator = "";
    this.displayCurrent.textContent = this.currentOperand;
  }
}

const calculator = new Calculator();
