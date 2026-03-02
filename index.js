let expression = "";
let justCalculated = false;
let history = [];

const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const historyEl = document.getElementById("historyList");

function ripple(btn, e) {
  if (!btn || !e) return;
  const r = document.createElement("span");
  r.className = "ripple-effect";
  const rect = btn.getBoundingClientRect();
  const clientX =
    e.clientX ?? e.touches?.[0]?.clientX ?? rect.left + rect.width / 2;
  const clientY =
    e.clientY ?? e.touches?.[0]?.clientY ?? rect.top + rect.height / 2;
  r.style.left = clientX - rect.left - 20 + "px";
  r.style.top = clientY - rect.top - 20 + "px";
  btn.appendChild(r);
  setTimeout(() => r.remove(), 500);
}

function appendNumber(num, btn) {
  ripple(btn, event);
  if (justCalculated && num !== ".") {
    expression = "";
    justCalculated = false;
  }
  if (
    num === "." &&
    expression
      .split(/[\+\-\*\/]/)
      .pop()
      .includes(".")
  )
    return;
  expression += num;
  update();
}

function appendOperator(op, btn) {
  ripple(btn, event);
  justCalculated = false;
  if (expression === "" && op !== "-") return;
  const last = expression.slice(-1);
  if (["+", "-", "*", "/"].includes(last)) {
    expression = expression.slice(0, -1);
  }
  expression += op;
  update();
}

function clearAll(btn) {
  ripple(btn, event);
  expression = "";
  justCalculated = false;
  expressionEl.textContent = "";
  resultEl.textContent = "0";
  resultEl.classList.remove("glow");
}

function backspace() {
  expression = expression.slice(0, -1);
  update();
}

function toggleSign(btn) {
  ripple(btn, event);
  if (!expression) return;
  if (expression.startsWith("-")) expression = expression.slice(1);
  else expression = "-" + expression;
  update();
}

function percent(btn) {
  ripple(btn, event);
  try {
    const val = eval(expression);
    expression = String(val / 100);
    update();
  } catch (e) {}
}

function calculate(btn) {
  ripple(btn, event);
  if (!expression) return;
  try {
    const expr = expression.replace(/×/g, "*").replace(/÷/g, "/");
    const result = Function('"use strict"; return (' + expr + ")")();
    if (!isFinite(result)) throw new Error("Infinity");
    const display = parseFloat(result.toFixed(10));
    addHistory(expression, display);
    expressionEl.textContent = expression + " =";
    resultEl.textContent = display;
    resultEl.classList.add("glow");
    expression = String(display);
    justCalculated = true;
  } catch (e) {
    resultEl.textContent = "Error";
    resultEl.classList.remove("glow");
    document.getElementById("display").classList.add("shake");
    setTimeout(
      () => document.getElementById("display").classList.remove("shake"),
      400,
    );
    expression = "";
  }
}

function update() {
  expressionEl.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷");
  if (!expression) {
    resultEl.textContent = "0";
    resultEl.classList.remove("glow");
    return;
  }
  try {
    const val = Function('"use strict"; return (' + expression + ")")();
    if (isFinite(val)) {
      resultEl.textContent = parseFloat(val.toFixed(10));
      resultEl.classList.remove("glow");
    }
  } catch (e) {}
}

function addHistory(expr, val) {
  history.unshift({ expr: expr.replace(/\*/g, "×").replace(/\//g, "÷"), val });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyEl.innerHTML =
      '<div class="empty-history">no calculations yet</div>';
    return;
  }
  historyEl.innerHTML = history
    .map(
      (h, i) => `
    <div class="history-item" onclick="recallHistory(${i})">
      <span class="history-expr">${h.expr}</span>
      <span class="history-val">${h.val}</span>
    </div>
  `,
    )
    .join("");
}

function recallHistory(i) {
  expression = String(history[i].val);
  resultEl.textContent = history[i].val;
  expressionEl.textContent = history[i].expr + " =";
  resultEl.classList.add("glow");
  justCalculated = true;
}

function clearHistory() {
  history = [];
  renderHistory();
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (document.getElementById("aiInput") === document.activeElement) return;
  if ("0123456789.".includes(e.key)) appendNumber(e.key);
  else if ("+-*/".includes(e.key)) appendOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearAll();
});

// AI Integration
async function askAI() {
  const input = document.getElementById("aiInput");
  const btn = document.getElementById("aiBtn");
  const responseEl = document.getElementById("aiResponse");
  const query = input.value.trim();
  if (!query) return;

  btn.textContent = "⟳";
  btn.classList.add("loading");
  responseEl.classList.remove("show");

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are an AI assistant embedded in a calculator app. 
When asked a math question, explain briefly and give the numeric answer on the last line formatted as: RESULT: [number]
If someone asks to calculate something, provide the answer. Be concise (2-3 sentences max). 
If they ask a general question, answer conversationally but briefly.`,
        messages: [{ role: "user", content: query }],
      }),
    });

    const data = await resp.json();
    const text = data.content.map((b) => b.text || "").join("");

    // Extract result if present
    const match = text.match(/RESULT:\s*([\d\.\-\,]+)/i);
    if (match) {
      const num = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(num)) {
        expression = String(num);
        resultEl.textContent = num;
        resultEl.classList.add("glow");
        expressionEl.textContent = query;
        justCalculated = true;
      }
    }

    const display = text.replace(/RESULT:\s*[\d\.\-\,]+/i, "").trim();
    responseEl.textContent = display || text;
    responseEl.classList.add("show");
    input.value = "";
  } catch (err) {
    responseEl.textContent = "AI unavailable. Try again later.";
    responseEl.classList.add("show");
  }

  btn.textContent = "✦";
  btn.classList.remove("loading");
}
