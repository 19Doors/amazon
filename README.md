# Arrow 🏹

Arrow is a voice-first AI assistant for rural India. Users speak in their local language — Arrow understands, thinks, searches live data, reads documents, and speaks the answer back. No typing, no menus, no literacy barrier.

Built with LiveKit, AWS, and Sarvam AI.

---

## What It Does

- Speaks and understands 16+ Indian languages — Hindi, Tamil, Telugu, Bengali, Marathi, and more
- Answers live questions about mandi prices, government schemes, weather, and farming
- Reads uploaded documents — Aadhaar, PM-KISAN forms, land records, prescriptions, bank passbooks
- Responds in the user's own language automatically
- Keeps answers short and spoken — designed for the ear, not the screen

---

## Repositories

| Part | Repo |
|---|---|
| Frontend (this repo) | `ArrowFrontend` |
| Backend (Agent + LiveKit) | [ArrowBackend](https://github.com/19Doors/ArrowBackend) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Voice (WebRTC) | LiveKit Client SDK |
| Auth Token | LiveKit JWT via `/api/token` |
| Hosting | AWS Amplify |
| CI/CD | GitHub Actions → Amplify auto-deploy |

---

## Project Structure

```
arrow-frontend/
├── app/
│   ├── page.tsx               # Main voice UI
│   ├── layout.tsx             # Root layout
│   └── api/
│       └── token/
│           └── route.ts       # Mints LiveKit JWT, returns wss:// URL
├── components/
│   ├── VoiceRoom.tsx          # LiveKit room + mic stream
│   └── FileUpload.tsx         # Document upload → data channel
├── public/
├── .env.local                 # Environment variables (never commit)
├── next.config.ts
└── package.json
```

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# LiveKit
LIVEKIT_URL=wss://your-livekit-server.nip.io
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
```

> Never commit `.env.local`. It is already in `.gitignore`.

---

## How the Token Route Works

When the frontend loads, it calls `/api/token`. This server-side route:

1. Receives the participant name and room name as query params
2. Signs a **LiveKit JWT** using `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`
3. Returns the signed token and the `wss://` server URL to the client
4. The client uses these to open a WebRTC room via the LiveKit SDK

---

## Getting Started

### Prerequisites

- Bun
- A running LiveKit server (see [ArrowBackend](https://github.com/19Doors/ArrowBackend))

### Install

```bash
git clone https://github.com/19Doors/ArrowFrontend
cd ArrowFrontend
bun install
```

### Run locally

```bash
cp .env.local.example .env.local
# Fill in your LiveKit credentials
bun run dev
```

App runs at `http://localhost:3000`

---

## Deployment (AWS Amplify)

1. Push repo to GitHub
2. Connect repo to AWS Amplify console
3. Add environment variables in Amplify → App Settings → Environment Variables:
   - `LIVEKIT_URL`
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
4. Every push to `main` triggers an automatic redeploy

---

## How Document Upload Works

1. User taps the attach button and selects a file (PDF, image, Excel, CSV)
2. File bytes are sent over the **LiveKit data channel** to the backend agent
3. The agent's `FileProcessor` routes it to Sarvam Document Intelligence (PDF/image) or stdlib parsers (Excel/CSV)
4. Extracted text is injected into Claude's context
5. Arrow reads out the document in plain spoken language

---

## Full Data Flow

```
Phone (Arrow frontend on Amplify)
  │
  ├── HTTPS /api/token → LiveKit JWT
  │
  ├── WSS → LiveKit Server (ArrowBackend EC2)
  │     └── dispatches job to Agent worker
  │
  └── Agent Pipeline (ArrowBackend)
        ├── Silero VAD → Amazon Transcribe (STT)
        ├── Claude Haiku on AWS Bedrock (LLM)
        │     ├── Exa MCP (live web search)
        │     └── Sarvam Doc Intelligence (OCR)
        └── Amazon Polly (TTS) → audio back to phone
```

---

## Backend

All voice pipeline logic — VAD, STT, LLM, TTS, document OCR, and web search — lives in the backend agent. See [ArrowBackend](https://github.com/19Doors/ArrowBackend) for setup instructions.

---

## License

MIT
