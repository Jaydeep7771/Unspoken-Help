# Unspoken Help

A production-oriented full-stack mental health counselling platform.

Unspoken Help connects clients with verified counsellors, supports wallet-based bookings, protects private journals with encryption, and gives admins revenue/moderation controls.

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Hook Form + Zod
- Axios
- Zustand

### Backend
- Next.js Route Handlers (API routes)
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT (HTTP-only cookie)
- bcrypt password hashing

### Payments
- Razorpay (primary)
- Stripe (optional)
- Webhook-based wallet crediting

---

## Core Roles

- **USER** (client)
- **COUNSELLOR**
- **ADMIN**

---

## Implemented Modules

### Authentication
- Email/password signup & login
- Google token login endpoint
- JWT auth cookie handling
- Role-aware route/API guards
- Forgot-password and verify-email API route scaffolds

### User Features
- Browse verified counsellors
- Book sessions using wallet balance
- Cancel sessions with refund transaction flow
- Read blogs
- Write encrypted private journals
- Submit post-session reviews

### Counsellor Features
- Register as counsellor
- Profile entity with specialization, rate, availability, verification state
- Session lifecycle actions (accept/decline/complete)
- Withdrawal request creation

### Admin Features
- View analytics summary
- Approve/reject counsellors
- View and process withdrawal requests
- Publish/manage blogs via API

### Payments + Wallet
- Create Razorpay orders for wallet top-up
- Verify Razorpay webhook signatures (HMAC)
- Credit wallet only after successful webhook event
- Optional Stripe payment-intent endpoint

### Security
- Password hashing (`bcryptjs`)
- JWT verification + role checks
- API + dashboard middleware protection
- In-memory request rate limiting middleware
- Journal encryption (AES-256-CBC)
- Prisma transactions for money-sensitive flows
- Slot collision check to reduce double booking

---

## Monorepo / Folder Structure

```text
app/
  api/                # Route handlers (auth, sessions, payments, admin, etc.)
  dashboard/          # User/counsellor/admin pages
  explore/ blogs/ ... # Public pages
components/           # UI + forms + layout
lib/                  # Auth, env parsing, crypto, payments, db helpers
prisma/               # schema.prisma + seed.ts
middleware.ts         # rate limit + protected route checks
Dockerfile            # containerized deployment
.env.example          # required environment variables
```

---

## Database Models (Prisma)

- `User`
- `CounsellorProfile`
- `Session`
- `Transaction`
- `Journal`
- `Blog`
- `Review`
- `WithdrawalRequest`
- `PlatformSetting`

Schema source: `prisma/schema.prisma`.

---

## Quick Start

1. Install dependencies
```bash
npm install
```

2. Configure environment
```bash
cp .env.example .env
```

3. Generate Prisma client and run migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed admin and default platform settings
```bash
npm run prisma:seed
```

5. Start dev server
```bash
npm run dev
```

---

## Required Environment Variables

See `.env.example` for full list.

Key values:
- `DATABASE_URL`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- Optional Stripe + Google OAuth keys

---

## Deployment

### Vercel
- Add all env vars in project settings
- Ensure Postgres is reachable
- Run `prisma migrate deploy` during deploy pipeline

### Railway
- Deploy via Dockerfile or native builder
- Provision PostgreSQL and wire env vars
- Set public webhook URL for Razorpay

---

## Notes & Next Steps

This codebase provides a strong production scaffold, but you should still add before launch:
- Robust email delivery (verification/reset tokens)
- Stronger distributed rate limiting (e.g., Redis)
- Stripe webhook branch in `/api/payments/webhook`
- Real-time chat + reminders worker/cron
- End-to-end tests and observability (logging/tracing)

---

## License

Private / Proprietary (update as needed).
