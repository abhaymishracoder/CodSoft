const display = document.querySelector('.current');
const history = document.querySelector('.history');
let currentExpression = '';
let lastResult = '';
let isNewCalculation = true;

// Button Animation
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 150);
    });
});

function appendNumber(num) {
    if (isNewCalculation) {
        currentExpression = '';
        isNewCalculation = false;
    }
    currentExpression += num;
    updateDisplay();
}

function handleOperator(operator) {
    if (isNewCalculation) {
        currentExpression = lastResult;
        isNewCalculation = false;
    }
    currentExpression += operator;
    updateDisplay();
}

function handleFunction(func) {
    if (isNewCalculation) {
        currentExpression = lastResult;
        isNewCalculation = false;
    }
    switch(func) {
        case 'sin':
        case 'cos':
        case 'tan':
        case 'log':
        case 'ln':
            currentExpression += func + '(';
            break;
        case 'sqrt':
            currentExpression += 'sqrt(';
            break;
        case 'pow':
            currentExpression += '^2';
            break;
        case 'exp':
            currentExpression += 'exp(';
            break;
        case 'fact':
            currentExpression += '!';
            break;
        case 'pi':
            currentExpression += 'π';
            break;
        case 'e':
            currentExpression += 'e';
            break;
    }
    updateDisplay();
}

function toggleSign() {
    if (currentExpression.startsWith('-')) {
        currentExpression = currentExpression.slice(1);
    } else {
        currentExpression = '-' + currentExpression;
    }
    updateDisplay();
}

function clearDisplay() {
    currentExpression = '';
    history.textContent = '';
    updateDisplay();
}

function deleteChar() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentExpression || '0';
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
}

function calculate() {
    try {
        let expression = currentExpression
            .replace(/π/g, Math.PI)
            .replace(/e/g, Math.E)
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/\^/g, '**');

        // Handle factorial
        while (expression.includes('!')) {
            const factRegex = /(\d+)!/;
            const match = expression.match(factRegex);
            if (match) {
                expression = expression.replace(
                    match[0],
                    factorial(parseInt(match[1]))
                );
            } else break;
        }

        history.textContent = currentExpression + ' =';
        lastResult = eval(expression).toString();
        display.textContent = lastResult;
        currentExpression = lastResult;
        isNewCalculation = true;
    } catch (error) {
        display.textContent = 'Error';
        currentExpression = '';
    }
}

// Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/\d|\./.test(key)) {
        appendNumber(key);
    } else if (['+', '-', '*', '/', '(', ')', '%', '^'].includes(key)) {
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteChar();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});