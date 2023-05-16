const { add, subtract, multiply, divide } = require("./calc");

function setupUi() {
    const addButton = document.getElementById("add");
    const subtractButton = document.getElementById("subtract");
    const multiplyButton = document.getElementById("multiply");
    const divideButton = document.getElementById("divide");

    addButton.onclick = doAdd;
    subtractButton.onclick = doSubtract;
    multiplyButton.onclick = doMultiply;
    divideButton.onclick = doDivide;
}

function doAdd() {
    const one = getNumberOne();
    const two = getNumberTwo();
    const result = add(one, two);
    setResult(`${one} + ${two} = ${result}`);
}

function doSubtract() {
    const one = getNumberOne();
    const two = getNumberTwo();
    const result = subtract(one, two);
    setResult(`${one} - ${two} = ${result}`);
}

function doMultiply() {
    const one = getNumberOne();
    const two = getNumberTwo();
    const result = multiply(one, two);
    setResult(`${one} * ${two} = ${result}`);
}

function doDivide() {
    const one = getNumberOne();
    const two = getNumberTwo();
    const result = divide(one, two);
    setResult(`${one} / ${two} = ${result}`);
}

function setResult(result) {
    const resultEl = document.getElementById("result");
    resultEl.innerText = result;
}

function getNumberOne() {
    return getInputNumber("number-one");
}

function getNumberTwo() {
    return getInputNumber("number-two");
}

function getInputNumber(id) {
    const num = Number(document.getElementById(id).value);

    if (Number.isNaN(num)) {
        throw new Error(`Invalid number: ${num}`);
    }

    return num;
}

module.exports = { setupUi };
