# San Bartolome High School LMS

A Next.js student-portal MVP backed by PostgreSQL and Prisma. The current dashboard uses clearly labeled preview data; it does not yet read from or write to the database.

## Use Supabase

Create a Supabase project, then open **Connect** in its dashboard to get the connection details. Copy the transaction-pooler URI into `DATABASE_URL` and the direct database URI into `DIRECT_URL` in `.env`. Replace the project reference, region, and password placeholders; append `pgbouncer=true&connection_limit=1&sslmode=require` to the pooled URI if those options are not already present.

Requirements: Node.js 20.9 or newer.

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Prisma Studio is available with `npm run db:studio`. Prisma uses the pooled URL for application connections and the direct URL for migrations.

### Use local PostgreSQL instead

For local development without Supabase, uncomment the local `DATABASE_URL` and `DIRECT_URL` values in `.env.example`, comment out the Supabase values, and start the Docker database before migrating:

```bash
docker compose up -d db
npm run db:migrate -- --name init
```

Stop it with `docker compose down`.

## MVP plan

1. Student portal: course overview, upcoming assignments, submission and grades views. The current interface is a navigable prototype with sample content.
2. Persisted learning workflow: connect the portal to PostgreSQL, save assignment submissions, and load grades and courses from the database.
3. Teacher workspace: manage classes, publish assignments, review submissions, and provide feedback.
4. School operations: approved sign-in, role-based access, roster import, auditability, backups, and deployment.

The Prisma schema in `prisma/schema.prisma` defines users, teacher-owned courses, student enrollments, assignments, and submissions. Create schema changes as migrations; do not edit a deployed database directly.

## Student-data safeguard

Use preview data only until the school approves its identity provider, access policies, hosting region, data-retention rules, and backup process. Do not add real student records or credentials to this prototype. Before production, add authentication and enforce authorization on the server for every student and teacher data request.
