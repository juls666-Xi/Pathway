# San Bartolome High School LMS

A Next.js school portal backed by Supabase Auth, PostgreSQL, and Prisma. The public homepage is open to everyone; role dashboards and their sections are server-protected.

## Use Supabase

Create a Supabase project. In **Project Settings → API**, copy the project URL and anon key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are the project URL and anon key, not a service-role key. In **Connect**, copy the transaction-pooler URI into `DATABASE_URL` and the direct database URI into `DIRECT_URL` in `.env`. Replace the project reference, region, and password placeholders; URL-encode special characters in the database password.

Requirements: Node.js 20.9 or newer.

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Prisma Studio is available with `npm run db:studio`. Prisma uses the pooled URL for application connections and the direct URL for migrations.

In Supabase Auth, disable public sign-ups and invite school accounts through an approved process. After the Prisma migration, provision a matching `User` row for each invited account with its Supabase Auth UUID in `authUserId`, its email, name, assigned role, and `active: true`. The server rejects authenticated identities without an active matching row. Do not store roles in Supabase user metadata. Grant staff access by creating `UserPermission` rows with permission codes such as `ANNOUNCEMENTS_MANAGE`, `STUDENT_RECORDS_READ`, or `OPERATIONS_ACCESS`; administrator accounts bypass those staff-specific grants. Use Prisma Studio only with approved administrator access.

Protected routes are `/student`, `/teacher`, `/staff`, and `/admin`; the server checks the database role on every dashboard and section request. Staff section permissions are checked again on the server. `/api/auth/me` is also authenticated. Add the same `authorizeApiRequest`, `requireRole`, or `requirePermission` checks to every future route handler or server action before it reads or changes records. The current section pages are protected scaffolding; course, grade, attendance, announcement, and administration data workflows still need implementation. Public announcements are sample copy and should be replaced with school-approved content before deployment.

### Use local PostgreSQL instead

For local development without Supabase, uncomment the local `DATABASE_URL` and `DIRECT_URL` values in `.env.example`, comment out the Supabase values, and start the Docker database before migrating:

```bash
docker compose up -d db
npm run db:migrate -- --name init
```

Stop it with `docker compose down`.

## Current scope

The public homepage contains school-wide information only. Role-specific links are generated from server-verified account roles; staff links are filtered by assigned permissions. Supabase sessions are refreshed in `src/proxy.ts`, while data-access authorization lives in server-only helpers in `src/lib/auth.ts`.

The Prisma schema in `prisma/schema.prisma` defines users, teacher-owned courses, student enrollments, assignments, and submissions. Create schema changes as migrations; do not edit a deployed database directly.

## Student-data safeguard

Before production, the school must approve its identity provider, account-provisioning process, hosting region, data-retention rules, permission policy, and backup process. Do not add real student records or credentials until those controls and the remaining data workflows have been reviewed.
