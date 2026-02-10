let currentExpression = "";
let currentResult = "0";
let history = [];

function updateDisplay() {
  document.getElementById("expression").textContent = currentExpression;
  document.getElementById("result").textContent = currentResult;
}

function appendNumber(num) {
  if (currentResult === "0" && num !== ".") {
    currentExpression = num;
  } else if (currentResult !== "0" && currentExpression === currentResult) {
    currentExpression = num;
  } else {
    currentExpression += num;
  }
  currentResult = currentExpression;
  updateDisplay();
}

function appendOperator(op) {
  const lastChar = currentExpression.slice(-1);
  if (["+", "-", "*", "/"].includes(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + op;
  } else if (currentExpression) {
    currentExpression += op;
  }
  updateDisplay();
}

function calculate() {
  try {
    const result = eval(
      currentExpression.replace("×", "*").replace("÷", "/").replace("−", "-"),
    );
    const roundedResult = Math.round(result * 100000000) / 100000000;

    history.unshift({
      expression: currentExpression,
      result: roundedResult,
    });

    if (history.length > 10) history.pop();
    updateHistory();

    currentResult = roundedResult.toString();
    currentExpression = currentResult;
    updateDisplay();
  } catch (error) {
    currentResult = "Error";
    updateDisplay();
    setTimeout(() => {
      clearAll();
    }, 1500);
  }
}

function clearAll() {
  currentExpression = "";
  currentResult = "0";
  updateDisplay();
}

function backspace() {
  if (currentExpression.length > 0) {
    currentExpression = currentExpression.slice(0, -1);
    currentResult = currentExpression || "0";
    updateDisplay();
  }
}

function updateHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = history
    .map(
      (item) =>
        `<div class="history-item">${item.expression} = ${item.result}</div>`,
    )
    .join("");
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    appendNumber(e.key);
  } else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
    appendOperator(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    calculate();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  }
});

// Initialize
updateDisplay();
