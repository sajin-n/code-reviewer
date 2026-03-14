# AI Code Reviewer

An AI-powered web application where you paste code and receive instant feedback on bugs, complexity, code quality, optimization suggestions, and auto-generated unit tests — powered by **Groq LLM**.

## Architecture

```
Frontend (React + Vite)
       │
       │  REST API  (proxied via Vite in dev)
       ▼
Backend (Node.js + Express)
       │
       │  Groq SDK
       ▼
  Groq LLM API (llama-3.3-70b-versatile)
       
Database: MongoDB
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS v4, Monaco Editor, React Router |
| Backend | Node.js, Express, Mongoose, JWT Auth |
| AI | Groq API (llama-3.3-70b-versatile / mixtral-8x7b-32768) |
| Database | MongoDB |

## Features

- **Full AI Code Review** — logic errors, clean code suggestions, optimized rewrite
- **Complexity Analyzer** — time & space complexity with optimal comparison
- **Code Quality Score** — readability, efficiency, structure (0-10) + overall (0-100)
- **Unit Test Generation** — edge-case-aware test generation
- **AI Hint Mode** — progressive hints without spoiling the solution
- **Similar Problem Suggestions** — practice recommendations
- **Multi-language Support** — JavaScript, Python, Java, C++, C, TypeScript, Go, Rust
- **History Dashboard** — past submissions, scores, rank progression
- **SSE Streaming** — real-time streamed AI responses
- **Auth System** — JWT-based register/login with rank system

## Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reviewController.js
│   │   └── submissionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Submission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── submissionRoutes.js
│   ├── services/
│   │   └── groqService.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   └── reviewApi.js
│   │   ├── components/
│   │   │   ├── CodeEditor.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ReviewResult.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReviewPage.jsx
│   │   │   └── SubmissionDetailPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI
- A [Groq API key](https://console.groq.com)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd ai-code-reviewer

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-code-reviewer
GROQ_API_KEY=gsk_YOUR_KEY_HERE
GROQ_MODEL=llama-3.3-70b-versatile
JWT_SECRET=pick-a-strong-random-secret
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/profile` | Get current user (auth required) |

### Code Review
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/review` | Full AI review |
| POST | `/api/review/stream` | Streaming review (SSE) |
| POST | `/api/review/hints` | Get progressive hints |
| POST | `/api/review/complexity` | Complexity analysis only |
| POST | `/api/review/unit-tests` | Generate unit tests |

### Submissions
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/submissions` | List history (paginated) |
| GET | `/api/submissions/:id` | Single submission detail |
| DELETE | `/api/submissions/:id` | Delete a submission |

## Future Improvements

- Code diff view (before/after optimization)
- GitHub OAuth login
- Collaborative review rooms
- VS Code extension
- Leaderboard system
- Export reports as PDF
