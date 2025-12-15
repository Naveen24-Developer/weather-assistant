# 🚀 Quick Start Guide - SkyCast AI (Next.js Edition)

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd skycast-ai
npm install
```

### Step 2: Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikeys)
2. Click "Create API Key"
3. Copy your Gemini API key

### Step 3: Configure Environment
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and paste your Gemini API key
# NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Step 4: Run the App
```bash
npm run dev
```

Open your browser to **http://localhost:3000** 🎉

---

## 📝 Project Structure

```
src/
├── app/              # Next.js app directory (routes)
│   ├── page.tsx      # Home page
│   ├── layout.tsx    # Root layout
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   └── WeatherCard.tsx
└── lib/              # Services and utilities
    ├── geminiService.ts    # AI chat
    ├── weatherService.ts   # Weather API
    └── types.ts            # TypeScript types
```

---

## 🎯 Key Features

✅ **AI Weather Assistant** - Ask about weather anywhere
✅ **Real-time Data** - Current conditions from OpenWeatherMap
✅ **Beautiful UI** - Tailwind CSS styling
✅ **Streaming Chat** - Real-time AI responses
✅ **Function Calling** - AI fetches weather automatically
✅ **Responsive Design** - Works on mobile, tablet, desktop

---

## 🛠️ Available Commands

```bash
npm run dev       # Start dev server (default: port 3000)
npm run build     # Build for production
npm start         # Run production build
npm run lint      # Check code quality
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
extend: {
  colors: {
    sky: {
      50: '#f0f9ff',
      // Change these values...
    }
  }
}
```

### Change AI Model
Edit `src/lib/geminiService.ts`:
```typescript
model: "gemini-2.5-flash",  // ← Change this
```

### Change Weather API Key
Edit `src/lib/weatherService.ts`:
```typescript
const API_KEY = 'your_key_here';  // ← Add your OpenWeatherMap key
```

---

## ❓ FAQ

**Q: Where do I get the API keys?**
- Gemini: https://makersuite.google.com/app/apikeys
- OpenWeatherMap: https://openweathermap.org/api (already included)

**Q: Can I deploy this?**
- Yes! Deploy to Vercel, Netlify, etc. using `npm run build && npm start`

**Q: What if weather isn't showing?**
- Check API key in `.env.local`
- Try city name with country: "Paris, France"

**Q: How do I change the chatbot's personality?**
- Edit the system prompt in `src/lib/geminiService.ts` (systemInstruction)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Google AI API](https://ai.google.dev)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module" | `rm -rf .next && npm run dev` |
| API key not working | Check `.env.local` exists and restart dev server |
| Styles not loading | Import `globals.css` in layout.tsx ✅ |
| Port 3000 in use | Use `npm run dev -- -p 3001` for different port |

---

## ✅ What's Changed from the Original?

- ✅ Migrated from **Vite** to **Next.js**
- ✅ Reorganized files into **src/** directory
- ✅ Added proper **TypeScript** paths
- ✅ Integrated **Tailwind CSS** officially
- ✅ Set up **ESLint** configuration
- ✅ No UI changes - looks exactly the same!
- ✅ No functionality changes - works exactly the same!

---

## 🎉 You're All Set!

Start chatting with SkyCast AI and ask about the weather! 🌤️

For more details, see:
- [README.md](./README.md) - Full documentation
- [MIGRATION.md](./MIGRATION.md) - Technical migration details
