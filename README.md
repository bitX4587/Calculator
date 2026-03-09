# CALC — AI Edition 🧮✦

A sleek, AI-powered calculator built with vanilla HTML, CSS, and JavaScript. Features a dark glassmorphic design with a built-in Claude AI assistant for natural language math queries.

🔗 **Live Demo**: [https://bitx4587.github.io/Calculator](https://bitx4587.github.io/Calculator)

---

## ✨ Features

- **AI Assistant** — Ask math questions in plain English (e.g. _"what's 15% of 340?"_) powered by Claude
- **Live Expression Preview** — See your full expression update as you type
- **Calculation History** — Stores up to 20 past calculations; click any to recall it
- **Keyboard Support** — Full keyboard input (numbers, operators, Enter, Backspace, Escape)
- **Ripple Animations** — Tactile button feedback with ripple effects
- **Error Handling** — Shake animation on invalid expressions, graceful recovery
- **Mobile Responsive** — Fluid layout down to 320px (iPhone SE 1st gen)
- **No Dependencies** — Pure vanilla JS, no frameworks or build tools required

---

## 📁 Project Structure

```
├── index.html      # App markup & layout
├── style.css       # Styling, animations, responsive tokens
└── index.js        # Calculator logic + AI integration
```

---

## 🎨 Design

Built with a dark sci-fi aesthetic using:

- **Fonts**: [Orbitron](https://fonts.google.com/specimen/Orbitron) (display) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) (body)
- **Glassmorphism**: `backdrop-filter: blur(30px)` on the main card
- **Animated background**: Radial gradients + subtle CSS grid overlay
- **Color palette**:

| Token       | Value                  | Usage           |
| ----------- | ---------------------- | --------------- |
| `--accent`  | `#00f5c4` (cyan-green) | Equals, results |
| `--accent2` | `#7b61ff` (violet)     | Operators, AI   |
| `--accent3` | `#ff6b6b` (coral)      | Clear button    |
| `--bg`      | `#060912` (near-black) | Page background |

---

## 🤖 AI Integration

The AI input box sends your question to the **Anthropic Claude API** (`claude-sonnet-4-20250514`).

- If Claude returns a numeric answer formatted as `RESULT: [number]`, it's automatically loaded into the calculator display.
- The explanation is shown below the input field.
- The API call is made client-side — you'll need a valid Anthropic API key configured server-side or via a proxy.

### Example prompts:

- `what's 15% of 340?`
- `how many seconds in a week?`
- `square root of 1764`

---

## 📱 Responsive Breakpoints

| Breakpoint | Button Height | Font Size | Padding |
| ---------- | ------------- | --------- | ------- |
| Default    | 62px          | 18px      | 24px    |
| ≤ 390px    | 52px          | 16px      | 14px    |
| ≤ 340px    | 46px          | 14px      | 12px    |

---

## ⌨️ Keyboard Shortcuts

| Key                | Action           |
| ------------------ | ---------------- |
| `0–9`, `.`         | Input number     |
| `+`, `-`, `*`, `/` | Operators        |
| `Enter` or `=`     | Calculate        |
| `Backspace`        | Delete last char |
| `Escape`           | Clear all        |

---

## 🚀 Getting Started

1. Clone or download the repo
2. Open `index.html` in any modern browser
3. No build step needed — it just works

### Deploy for free:

- **GitHub Pages** — push to a repo and enable Pages in settings
- **Netlify** — drag and drop the folder
- **Vercel** — connect your Git repo

---

## 🌐 Browser Compatibility

| Browser                | Supported |
| ---------------------- | --------- |
| Chrome / Edge (latest) | ✅        |
| Firefox (latest)       | ✅        |
| Safari (latest)        | ✅        |
| Mobile (iOS & Android) | ✅        |

---

## 🔧 Customization

**Change accent colors** — edit the CSS variables in `:root` inside `style.css`

**Adjust history limit** — change `20` in `index.js`:

```js
if (history.length > 20) history.pop();
```

**Modify AI behavior** — edit the `system` prompt inside `askAI()` in `index.js`

---

_Built with vanilla JavaScript — no frameworks required._
