# Project Structure Overview

## Complete File Tree

```
skycast-ai/
│
├── 📁 src/                          # Main source directory
│   │
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── layout.tsx               # Root layout wrapper
│   │   ├── page.tsx                 # Home page (/)
│   │   └── globals.css              # Global styles & Tailwind
│   │
│   ├── 📁 components/               # React components
│   │   ├── ChatInterface.tsx        # Main chat UI component
│   │   ├── ChatMessage.tsx          # Message bubble component
│   │   └── WeatherCard.tsx          # Weather display component
│   │
│   └── 📁 lib/                      # Utilities & services
│       ├── geminiService.ts         # Gemini AI integration
│       ├── weatherService.ts        # OpenWeatherMap API
│       └── types.ts                 # TypeScript interfaces
│
├── 📁 public/                       # Static files (if any)
│
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS config
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 .eslintrc.json                # ESLint configuration
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 package-lock.json             # Dependency lock file
│
├── 📄 .env.local                    # Environment variables (local)
├── 📄 .env.example                  # Environment template
├── 📄 .gitignore                    # Git ignore rules
│
├── 📄 README.md                     # Main documentation
├── 📄 QUICKSTART.md                 # 5-minute setup guide
├── 📄 MIGRATION.md                  # Vite→Next.js migration details
│
└── 📄 vite.config.ts                # Old (deprecated - can delete)
```

---

## Directory Explanations

### `src/`
All source code lives here. Clean separation of concerns.

### `src/app/`
Next.js App Router directory. Handles routing and layouts.
- `layout.tsx` - Wraps all pages, imports global styles
- `page.tsx` - Home page content
- `globals.css` - Tailwind directives and custom styles

### `src/components/`
Reusable React components.
- All components marked with `'use client'` (client-side)
- Imported and used in `src/app/page.tsx`

### `src/lib/`
Non-React code: services, utilities, types.
- `geminiService.ts` - Handles AI chat with Gemini
- `weatherService.ts` - Fetches weather data from API
- `types.ts` - Shared TypeScript interfaces

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js app settings, image optimization, plugins |
| `tailwind.config.js` | Tailwind CSS customization (colors, fonts, spacing) |
| `postcss.config.js` | PostCSS plugins (Tailwind, autoprefixer) |
| `tsconfig.json` | TypeScript compiler options and path aliases |
| `.eslintrc.json` | Code quality and linting rules |

---

## Environment Files

| File | Purpose |
|------|---------|
| `.env.local` | Actual secrets (not in git) |
| `.env.example` | Template showing required variables |
| `.gitignore` | Files to exclude from git |

---

## Development Files

| File | Purpose |
|------|---------|
| `package.json` | Project metadata and dependencies |
| `package-lock.json` | Locked dependency versions |
| `README.md` | Full project documentation |
| `QUICKSTART.md` | Quick setup guide (start here!) |
| `MIGRATION.md` | Technical migration details |

---

## Key Path Aliases

Configured in `tsconfig.json`:

```typescript
@/*              → ./src/*
@/components/*   → ./src/components/*
@/lib/*          → ./src/lib/*
@/types/*        → ./src/lib/types/*
```

**Usage Example:**
```typescript
// Instead of:
import { ChatInterface } from '../../components/ChatInterface'

// Use:
import { ChatInterface } from '@/components/ChatInterface'
```

---

## How Everything Connects

```
📱 User Opens App
    ↓
🌐 Browser loads http://localhost:3000
    ↓
📄 Next.js loads src/app/page.tsx
    ↓
🎨 Renders <ChatInterface /> component
    ↓
💬 User types message
    ↓
🤖 ChatInterface calls geminiService.sendMessageToGemini()
    ↓
🔧 Gemini calls get_current_weather tool
    ↓
🌧️ geminiService calls weatherService.getWeather()
    ↓
📡 Gets data from OpenWeatherMap API
    ↓
💾 Returns <WeatherCard /> component
    ↓
✨ Display message + weather in chat
```

---

## File Sizes & Complexity

- **Total Source Code**: ~800 lines
- **Components**: 3 files (~300 lines)
- **Services**: 2 files (~250 lines)
- **Types**: 1 file (~50 lines)
- **Config**: ~200 lines

**Complexity**: Low - Easy to understand and modify

---

## Next.js Best Practices Implemented

✅ `'use client'` directive on interactive components
✅ Proper use of App Router (not Pages Router)
✅ TypeScript for type safety
✅ Path aliases for clean imports
✅ Tailwind CSS for styling
✅ ESLint for code quality
✅ Metadata for SEO
✅ Environment variables for secrets

---

## Deprecated Files (Safe to Delete)

- `vite.config.ts` - Old Vite config (no longer used)
- `index.html` - Next.js generates this
- `index.tsx` - Next.js handles entry point
- `App.tsx` - Functionality moved to `src/app/`
- `components/` - Migrated to `src/components/`
- `services/` - Migrated to `src/lib/`
- `types.ts` - Migrated to `src/lib/types.ts`
- `metadata.json` - No longer needed

These are safe to remove after verifying everything works!

---

## Production Deployment

When deploying:

1. Build: `npm run build`
2. The `.next/` folder is created (don't commit to git)
3. Deploy to Vercel, Netlify, or any Node.js host
4. Set environment variables in hosting platform
5. Run: `npm start`

---

## Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Production build
npm start            # Run production

# Quality
npm run lint         # Check code

# Cleanup
rm -rf .next         # Clear Next.js cache
rm -rf node_modules  # Remove dependencies
npm install          # Reinstall dependencies
```

---

**Total Setup Time**: ~5 minutes
**Code Quality**: ✅ Production-ready
**Scalability**: ✅ Ready for growth
