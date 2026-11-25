# ZONE A Learning Platform

**Developed by Eng. Angelo Rezq**

ZONE A is a bilingual learning platform for programming, graphic design, and language courses. Students can browse the course catalog, access lessons, and follow their course progress. Administrators can manage courses, lessons, and student access.

## Features

- Arabic and English interface text.
- Public course catalog and individual course pages.
- Student sign-up and sign-in.
- Lesson pages with enrollment-aware access.
- Student dashboard with enrolled courses and lesson progress.
- Admin dashboard for course, lesson, and student management.
- Supabase-backed authentication, database, and protected course media.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, and Storage

## Local development

Install dependencies:

```bash
npm install
```

Create a local `.env.local` file and set the Supabase project URL and publishable key:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Apply the SQL migrations in `supabase/migrations/` in filename order to the Supabase project. Configure the project's authentication URLs for the local and production site before testing sign-in and account confirmation. Keep credentials and private keys out of source control.

Run the development server:

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

## Build and lint

```bash
npm run lint
npm run build
npm start
```

## Repository layout

- `src/app/` - public pages, course and lesson routes, student dashboard, authentication, and admin pages
- `src/components/` - reusable interface components
- `src/lib/` - Supabase clients, shared types, and language support
- `supabase/migrations/` - database schema and access policies
