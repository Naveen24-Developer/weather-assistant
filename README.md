# SkyCast AI - Weather Assistant

A modern, responsive weather assistant application powered by Google's Gemini AI and real-time weather data, built with Next.js.

## 🌟 Features

- **AI-Powered Chat**: Interact with SkyCast, a specialized weather assistant powered by Gemini
- **Real-time Weather Data**: Get current weather information for any location worldwide
- **Streaming Responses**: Experience smooth, real-time AI responses with function calling
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Weather Cards**: Detailed weather information including temperature, humidity, wind speed, and "feels like" temperature
- **Emojis & Personality**: Friendly, engaging assistant with emoji support

## 📋 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **AI**: Google Generative AI (Gemini 2.5 Flash)
- **Weather API**: OpenWeatherMap
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikeys))
- OpenWeatherMap API key (embedded in weatherService.ts - update if needed)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Copy the example file and update with your API keys:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
skycast-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles & Tailwind
│   ├── components/
│   │   ├── ChatInterface.tsx   # Main chat interface
│   │   ├── ChatMessage.tsx     # Message bubble component
│   │   └── WeatherCard.tsx     # Weather display card
│   └── lib/
│       ├── geminiService.ts    # Gemini AI integration
│       ├── weatherService.ts   # Weather API integration
│       └── types.ts            # TypeScript types
├── public/                      # Static assets
├── next.config.js              # Next.js config
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🎯 How It Works

1. **User Query**: Type weather questions in the chat
2. **AI Processing**: Gemini analyzes the query and calls the weather tool
3. **Data Fetching**: Gets real-time weather from OpenWeatherMap
4. **Streaming Response**: AI responds with formatted weather information
5. **Beautiful Display**: Weather data rendered in an attractive card

## 🛠️ Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key |

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize the sky blue theme.

### Weather Provider
Modify `src/lib/weatherService.ts` to use a different weather API.

### AI Model
Change the model in `src/lib/geminiService.ts` (currently: gemini-2.5-flash)

## 📝 Important Notes

- All components use `'use client'` directive (client-side rendering)
- Next.js App Router is used (not Pages Router)
- Path aliases configured: `@/components`, `@/lib`, etc.
- Tailwind CSS with custom sky color palette

## 🆘 Troubleshooting

**"API key not found" error**
- Ensure `.env.local` exists with `NEXT_PUBLIC_GEMINI_API_KEY`
- Restart dev server after adding environment variables

**Weather not displaying**
- Verify OpenWeatherMap API key in `src/lib/weatherService.ts`
- Try with explicit location format: "Paris, France"

**Build errors**
- Clear cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React 19](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Google AI](https://ai.google.dev)
- [OpenWeatherMap API](https://openweathermap.org/api)

## 📄 License

Open source - feel free to use and customize!
