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
