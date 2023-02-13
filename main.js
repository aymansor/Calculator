"use strict";

const Operators = Object.freeze({
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "x",
  DIVIDE: "÷",
});

class Calculator {
  constructor() {
    this.displayPrevious = document.querySelector(".calculator__display__previous");
    this.displayCurrent = document.querySelector(".calculator__display__current");
    this.buttons = document.querySelectorAll(".calculator__btn");

    this.displayCurrent.textContent = "0";

    this.leftOperand = "";
    this.rightOperand = "";
    this.operator = "";
    this.canReset = false;

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

  processOperator(value) {
    if (this.operator) {
      this.operator = value;
      this.rightOperand = "";
      this.displayPrevious.textContent = `${this.leftOperand} ${this.operator}`;
    } else {
      this.operator = value;
      this.leftOperand = this.rightOperand === "" ? "0" : this.rightOperand;
      this.rightOperand = "";
      this.displayPrevious.textContent = `${this.leftOperand} ${this.operator}`;
    }
  }

  clear() {
    this.displayPrevious.textContent = "";
    this.displayCurrent.textContent = "0";

    this.leftOperand = "";
    this.rightOperand = "";
    this.operator = "";
  }

  changeSign() {
    if (this.rightOperand === "") {
      if (this.leftOperand === "") return;
      this.rightOperand = this.leftOperand;
    }

    this.rightOperand =
      this.rightOperand.charAt(0) === "-" ? this.rightOperand.slice(1) : "-" + this.rightOperand;

    this.displayCurrent.textContent = this.rightOperand;
  }

  percent() {
    if (this.rightOperand === "") return;

    this.rightOperand = (parseFloat(this.rightOperand) / 100).toString();
    this.displayCurrent.textContent = this.rightOperand;
  }

  delete() {
    this.rightOperand = this.rightOperand.slice(0, -1);
    this.displayCurrent.textContent = this.rightOperand || "0";
  }

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

    this.displayPrevious.textContent = `${this.leftOperand} ${this.operator} ${this.rightOperand} =`;
    this.leftOperand = result;
    this.displayCurrent.textContent = this.leftOperand;
    this.canReset = true;
  }
}

const calculator = new Calculator();
