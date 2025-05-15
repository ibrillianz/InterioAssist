# DecoBot – AI Interior Design Assistant 🤖✨

**A lightweight, embeddable chatbot that helps interior design firms capture leads, understand client preferences, and book consultations.**

---

## 🌐 Live Demo
Try it now: [https://YOUR_USERNAME.github.io/deco-bot/](https://YOUR_USERNAME.github.io/deco-bot/)

---

## 🚀 Features
- Conversational UI with 6 onboarding steps  
- Lead capture: room type, style, budget, location, name & contact  
- Quick FAQs and price estimation prompts  
- Mobile-first, responsive design  
- Embeddable via iframe in any website  
- Fully configurable through `config.js`

---

## 🛠 Technology Stack
- **Frontend:** HTML5, CSS3 (CSS variables), Vanilla JavaScript  
- **Configuration:** `config.js` for branding, sizes, and behavior  
- **Shared Logic:** `bot-engine` submodule for OpenAI calls, context retrieval, and session management  
- **Hosting:** GitHub Pages or Netlify for the widget; serverless/backend API for chat logic

---

## 🔧 Installation & Setup
1. **Clone the repo:**  
   ```bash
   git clone https://github.com/ibrillianz/deco-bot.git
   ```
2. **Add the shared engine:**  
   ```bash
   cd deco-bot
   git submodule add https://github.com/ibrillianz/bot-engine.git engine
   ```
3. **Customize `config.js`:** Update `botName`, colors, sizes, and asset paths.  
4. **Deploy:** Host `deco-bot/` on GitHub Pages or Netlify.  
5. **Embed:** Use an `<iframe src="https://YOUR_USERNAME.github.io/deco-bot/index.html"></iframe>` on your site.

---

## 📂 File Structure
```
deco-bot/
├── engine/              # Shared bot-engine logic (submodule)
├── assets/              # Bot avatar and other static assets
├── config.js            # Branding & widget settings
├── index.html           # Chat widget container and loader
├── style.css            # Scoped styles with CSS variables
├── main.js              # Widget logic and dynamic config application
└── README.md            # Project overview, usage, and version history
```

---

## 📄 Version History
- **v0.1.0** — Initial inline prototype  
- **v0.2.0** — Refactored UI to external `style.css` & `main.js`  
- **v0.3.0** — Externalized settings into `config.js` with CSS variables  
- **v0.4.0** — Added `bot-engine` submodule for shared chat logic

---

> **Note:** Do **not** delete `index.html`; it remains the UI shell that loads `style.css` and `main.js`. Adjust branding or behavior only in `config.js`.
