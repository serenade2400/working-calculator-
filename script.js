// Get the screen element
const screen = document.getElementById('screen');

// Variables to store calculator state
let currentExpression = '0';
let currentNumber = '0';
let shouldResetScreen = false;
let lastInputWasOperator = false;

// Add event listeners to number buttons
for (let i = 0; i <= 9; i++) {
    document.getElementById(i.toString()).addEventListener('click', () => appendNumber(i.toString()));
}

// Add event listeners to operation buttons
document.getElementById('add').addEventListener('click', () => appendOperator('+'));
document.getElementById('subtract').addEventListener('click', () => appendOperator('-'));
document.getElementById('multiply').addEventListener('click', () => appendOperator('×'));
document.getElementById('divide').addEventListener('click', () => appendOperator('÷'));
document.getElementById('power').addEventListener('click', () => appendOperator('^'));
document.getElementById('equal').addEventListener('click', calculate);
document.getElementById('clear').addEventListener('click', clear);
document.getElementById('decimal').addEventListener('click', appendDecimal);
document.getElementById('sign').addEventListener('click', changeSign);
document.getElementById('backspace').addEventListener('click', backspace);

function appendNumber(number) {
    if (currentExpression === '0' || shouldResetScreen) {
        currentExpression = number;
        currentNumber = number;
        shouldResetScreen = false;
    } else {
        currentExpression += number;
        currentNumber += number;
    }
    lastInputWasOperator = false;
    updateDisplay();
}

function appendOperator(operator) {
    if (lastInputWasOperator) {
        // Replace the last operator
        currentExpression = currentExpression.slice(0, -1) + operator;
    } else {
        currentExpression += ' ' + operator + ' ';
        currentNumber = '';
    }
    lastInputWasOperator = true;
    shouldResetScreen = false;
    updateDisplay();
}

function calculate() {
    if (lastInputWasOperator) {
        currentExpression = currentExpression.slice(0, -3); // Remove trailing operator
    }
    
    // Replace × and ÷ with * and / for evaluation
    let expressionToEvaluate = currentExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
    
    try {
        let result = eval(expressionToEvaluate);
        
        // Handle division by zero
        if (!isFinite(result)) {
            currentExpression = 'Error';
            currentNumber = 'Error';
        } else {
            // Format the result
            result = Number(result.toPrecision(12)).toString();
            currentExpression = result;
            currentNumber = result;
        }
    } catch (error) {
        currentExpression = 'Error';
        currentNumber = 'Error';
    }
    
    shouldResetScreen = true;
    lastInputWasOperator = false;
    updateDisplay();
}

function clear() {
    currentExpression = '0';
    currentNumber = '0';
    shouldResetScreen = false;
    lastInputWasOperator = false;
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentExpression = '0';
        currentNumber = '0';
        shouldResetScreen = false;
    }
    if (!currentNumber.includes('.')) {
        currentExpression += '.';
        currentNumber += '.';
    }
    lastInputWasOperator = false;
    updateDisplay();
}

function changeSign() {
    if (lastInputWasOperator || currentNumber === '0') return;
    
    let parts = currentExpression.split(' ');
    let lastPart = parts[parts.length - 1];
    
    if (lastPart.startsWith('-')) {
        lastPart = lastPart.substring(1);
    } else {
        lastPart = '-' + lastPart;
    }
    
    parts[parts.length - 1] = lastPart;
    currentExpression = parts.join(' ');
    currentNumber = lastPart;
    
    updateDisplay();
}

function backspace() {
    if (currentExpression === '0' || currentExpression === 'Error') {
        return;
    }
    
    if (lastInputWasOperator) {
        // Remove operator and spaces
        currentExpression = currentExpression.slice(0, -3);
        lastInputWasOperator = false;
        // Get the last number from expression
        let parts = currentExpression.split(' ');
        currentNumber = parts[parts.length - 1];
    } else {
        currentExpression = currentExpression.slice(0, -1);
        currentNumber = currentNumber.slice(0, -1);
        
        if (currentExpression === '' || currentExpression === '-') {
            currentExpression = '0';
            currentNumber = '0';
        }
    }
    
    updateDisplay();
}

function updateDisplay() {
    screen.textContent = currentExpression;
}