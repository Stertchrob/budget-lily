# Budget App

Budgeting and spending analysis web app with:

- Next.js (frontend, JavaScript)
- Tailwind CSS
- Node.js + Express backend
- Supabase (Auth, Postgres, Storage)

## Setup

1. Install dependencies:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

2. Add environment variables:

- Copy `.env.example` values into:
  - `backend/.env.local` (backend keys)
  - `frontend/.env.local` (frontend public keys)

3. Run database schema in Supabase:

- `docs/schema.sql`

4. Start both apps: 

```bash
npm run dev 
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:4000/health` 
