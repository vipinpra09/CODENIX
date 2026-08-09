# CODENIX

Codenix is a full-stack C learning platform with guest mode and Google OAuth-ready account mode.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind + React Router
- Backend: Spring Boot + Spring Security + OAuth2 + JPA + Validation
- Database: PostgreSQL + Flyway migrations

## Repository Structure
- `/frontend` — UI, static lessons/problems/quizzes, guest progress, responsive dashboard
- `/backend` — layered REST API (`controller`, `service`, `repository`, `entity`, `dto`, `mapper`, `security`, `config`, `exception`)

## Core Features Implemented
- Dashboard layout with left nav, main workspace, right progress panel
- Pages: Home, Learn C, Lesson, Practice, Problem Detail, Compiler, Daily Challenge, Progress, Profile, Auth callback, Not Found
- Guest mode progress in `localStorage`
- Guest → account merge flow on profile load with duplicate prevention
- XP, level, streak, badge logic services
- REST APIs for auth/profile, lessons, problems, quizzes, progress sync, badges, daily challenge, xp/streak
- PostgreSQL normalized schema migration with unique constraints and indexes
- SEO meta tags and accessible semantic structure

## Admin Panel

A compact admin panel is included at `/admin` for managing users, MCQs, and quizzes.

- Route: `/admin` (frontend), guarded so only `ADMIN` users can access it.
- APIs: all `/api/admin/**` endpoints require `ROLE_ADMIN` (Spring Security, enforced on the backend).
- Guest access to `/api/admin/**` returns `401`; signed-in students return `403`.
- Backend quiz endpoints (`/api/quizzes/**`) only serve `PUBLISHED` MCQs; draft/archived content is never exposed to students.

### Features

- Dashboard with live PostgreSQL statistics (users, MCQs, quizzes, published counts).
- User management: search, paginated list, promote/demote STUDENT ↔ ADMIN.
- MCQ management: create, edit, delete, search, publish/unpublish/archive.
- Quiz management: create, edit, delete, publish/unpublish, add/remove MCQs.

### Creating the first ADMIN

The application does not expose a public "make admin" endpoint. Promote your first Google
account directly in the database after signing in once with Google:

```bash
# Start the backend, sign in with Google once (so a user row exists), then run:
psql $SPRING_DATASOURCE_URL -c "UPDATE users SET role = 'ADMIN' WHERE email = 'you@gmail.com';"
```

or using psql directly against the local database:

```bash
psql -h localhost -U postgres -d codenix -c "UPDATE users SET role = 'ADMIN' WHERE email = 'you@gmail.com';"
```

After promotion, sign out and sign back in (or restart the session) so the new `ROLE_ADMIN`
authority is loaded, then visit `/admin`.

### Accessing /admin

1. Sign in with Google using the account promoted to ADMIN.
2. Navigate to `http://localhost:5173/admin` (or `/admin` in the deployed preview).
3. Non-admins see an access-denied screen; guests are asked to sign in.

## Environment Variables
### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`

### Backend (`backend/.env`)
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `JWT_SECRET` (reserved if JWT mode is enabled)

## Local Run
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
mvn spring-boot:run
```

## Tests
```bash
cd backend
mvn test
```

## Notes / Limitations
- Compiler page uses safe placeholder output; secure sandbox execution is intentionally not enabled yet.
- OAuth callback flow is implemented and backend is Google OAuth-ready; credentials are required to activate login.
