<div align="center">

# 🏺 Skills Reliquary

**Teach your AI agents once. Reuse everywhere.**

A place to write, collect, and share the reusable skills that make AI agents good at specific jobs, from code review checklists to release workflows.

[**Live site →**](https://skills-reliquary.vercel.app) &nbsp;·&nbsp;
[Browse skills](https://skills-reliquary.vercel.app/skills) &nbsp;·&nbsp;
[Sign up](https://skills-reliquary.vercel.app/register)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

</div>

---

## What it does

A **skill** is a plain-text set of instructions, with a name, a short description, and the content an agent should follow. Skills Reliquary lets you:

- 🔎 **Discover**: browse public skills other people have written and reuse what already works.
- ✍️ **Write**: capture a workflow once as a skill, starting from a ready-made template.
- 🔒 **Share or keep private**: publish a skill for everyone, or keep it private in your dashboard.
- 🛠️ **Manage**: edit and delete your own skills from a personal dashboard.

## Live demo

| Page | Link |
| --- | --- |
| Home | https://skills-reliquary.vercel.app |
| Browse skills | https://skills-reliquary.vercel.app/skills |
| Register | https://skills-reliquary.vercel.app/register |
| Log in | https://skills-reliquary.vercel.app/login |
| Dashboard (after login) | https://skills-reliquary.vercel.app/dashboard |

Every push to `main` deploys to production on Vercel, and every pull request gets its own preview deployment.

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) App Router with Cache Components (`"use cache"` + `cacheLife`) and Server Actions
- **UI:** React 19, [Tailwind CSS 4](https://tailwindcss.com), [daisyUI 5](https://daisyui.com)
- **Database:** PostgreSQL via [Prisma 7](https://www.prisma.io) with the `pg` driver adapter
- **Auth:** email and password hashed with bcrypt, and an HMAC-signed session in an httpOnly cookie
- **Hosting:** [Vercel](https://vercel.com) with Prisma Postgres

## Getting started locally

**Prerequisites:** Node.js 20+ and Docker (for the local database).

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Point the app at it
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skills_db"' > .env
echo "AUTH_SECRET=\"$(openssl rand -base64 48)\"" >> .env

# 4. Create the tables
npx prisma migrate dev

# 5. Run the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgres://…`). |
| `AUTH_SECRET` | Yes | Random string of 32+ characters used to sign login cookies. Generate one with `openssl rand -base64 48`. |
| `AUTH_TOKEN_EXPIRY_HOURS` | No | How long a login lasts. Defaults to `24`. |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Apply pending migrations, then build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
├── (auth)/            Login and register pages
├── api/               Route handlers for auth and skills
├── actions/           Server Actions for creating, updating, deleting skills
├── components/        Header, Footer, Providers
├── dashboard/         Your skills, plus create and edit forms
├── hooks/             useAuth client hook
├── skills/            Public skill list and detail pages
├── lib/               Prisma client and auth helpers
└── page.tsx           Landing page
prisma/
├── schema.prisma      User and Skill models
└── migrations/        SQL migrations
```

## Deployment

The app runs on Vercel and is connected to this repository:

1. Import the repo on [vercel.com/new](https://vercel.com/new).
2. Add a Postgres database (for example Prisma Postgres from **Storage**) and make sure `DATABASE_URL` is a `postgres://…` connection string. Add `AUTH_SECRET` as well.
3. Push to `main`. The build runs `prisma migrate deploy` before `next build`, so the database schema stays in sync automatically.
