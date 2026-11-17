#  PlacePrep AI

**Prepare for placements with one portal for coding, aptitude, company research, interviews, resumes, and progress tracking.**

PlacePrep AI is a placement preparation portal with a static HTML, CSS, and JavaScript frontend, backed by an Express API and MongoDB.

>  **Want to try it?** Follow the [Quick start](#-quick-start) below. The app will be available at `http://localhost:3000` when `PORT=3000`.

---

##  Contents

- [What you can do](#-what-you-can-do)
- [Tech stack](#-tech-stack)
- [Quick start](#-quick-start)
- [Demo accounts](#-demo-accounts)
- [Environment variables](#-environment-variables)
- [Project structure](#-project-structure)
- [API areas](#-api-areas)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

##  What you can do

| Area | What it’s for |
| --- | --- |
|  Dashboard and analytics | Review preparation activity and progress |
|  Coding practice | Practice coding questions and track progress |
|  Aptitude practice | Practice aptitude questions |
|  Company preparation | Explore company information and role preparation material |
|  Interview practice | Prepare with interview sessions and questions |
|  Resume analysis | Upload a resume for analysis |
|  AI assistant | Ask placement preparation questions |
|  Profile | Manage your student profile |
|  Admin dashboard | Access administrative features and manage portal content |

AI features can use Google Gemini when an API key is configured. When it isn’t configured, the app uses built-in fallback responses.

---

##  Tech stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt
- **AI integration:** Google Gemini API, optional
- **Resume parsing:** PDF and DOCX parsing libraries

---

##  Quick start

### Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm
- MongoDB, either a local installation or a MongoDB Atlas cluster

### 1. Get the project

```bash
git clone <your-repository-url>
cd Placeprep-Ai
```

Replace `<your-repository-url>` with the clone URL shown on your GitHub repository page.

### 2. Install dependencies

```bash
npm install
```

On Windows, if PowerShell does not recognize `npm`, try:

```powershell
npm.cmd install
```

### 3. Configure your environment

Copy `.env.example` to `.env` in the project root.

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Open `.env` and replace the placeholders with your own values:

```env
PORT=3000
MONGODB_URI=replace_with_your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

- Set `MONGODB_URI` to your own local MongoDB or MongoDB Atlas connection string.
- Set `JWT_SECRET` to a long, randomly generated private value.
- `GEMINI_API_KEY` is optional. Leave it blank to use the built-in fallback responses.

>  Keep `.env` private. Never commit API keys, database credentials, or production secrets to GitHub. The placeholder values above are examples; replace them before running the app.

### 4. Start the app

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** if your `PORT` is set to `3000`.

The Express server serves the frontend from `frontend/public`, so you don’t need a separate frontend server. You can also launch the server with:

```bash
npm start
```

---

##  Demo accounts

To create demo data, run:

```bash
npm run seed
```

Then sign in with either account:

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@placeprep.ai` | `Student@123` |
| Admin | `admin@placeprep.ai` | `Admin@123` |

>  **Seeding resets data.** This command deletes existing users, companies, coding questions, aptitude questions, progress, interview sessions, and resume analyses before recreating demo records. Run it only against a fresh development database or when you intend to erase that data.

---

##  Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| `PORT` | Port used by the web server | No; defaults to `5000` if unset |
| `MONGODB_URI` | Your MongoDB connection string | Yes |
| `JWT_SECRET` | Secret used to sign authentication tokens | Yes for secure use |
| `GEMINI_API_KEY` | Google Gemini API key for AI-backed responses | No |

Use your own values in `.env`. Don’t commit that file.

---

##  Project structure

```text
Placeprep-Ai/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API request handlers
│   ├── middleware/      # Authentication and admin checks
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── seed/            # Demo data setup
│   └── server.js        # Express app and server
├── frontend/
│   └── public/
│       ├── css/         # Stylesheets
│       ├── js/          # Browser scripts
│       └── *.html       # App pages
├── .env.example         # Environment template
├── package.json         # Root npm workspace and scripts
└── README.md
```

---

##  API areas

The API is organized into these areas:

`/api/auth` · `/api/users` · `/api/coding` · `/api/companies` · `/api/aptitude` · `/api/resume` · `/api/interview` · `/api/ai` · `/api/analytics` · `/api/admin`

---

## Troubleshooting

<details>
<summary><strong>MongoDB connection errors</strong></summary>

Make sure MongoDB is running and that `MONGODB_URI` in the root `.env` file contains your own valid connection string. It can point to a local MongoDB instance or a MongoDB Atlas cluster.

For a local MongoDB instance using the default settings:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/placeprep_db
```

</details>

<details>
<summary><strong>The app is using the wrong port</strong></summary>

Check the `PORT` value in the root `.env` file. Open the matching address in your browser. For example, use `http://localhost:3000` when `PORT=3000`. If `PORT` is unset, the server defaults to port `5000`.

</details>

<details>
<summary><strong>AI responses are using fallback behavior</strong></summary>

Gemini-backed responses require your own valid `GEMINI_API_KEY` in the root `.env` file. The key is optional. If it is blank, the app uses its built-in fallback responses.

</details>

<details>
<summary><strong>PowerShell cannot find npm</strong></summary>

On Windows, try invoking npm through its command shim:

```powershell
npm.cmd install
npm.cmd run dev
```

</details>

---

##  Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make your changes and verify them locally.
4. Open a pull request with a clear summary.

Please don’t include `.env`, API keys, database credentials, or `node_modules` in commits.

---