# CeylonGo Backend

Spring Boot REST API for the CeylonGo Web-based Tour Guide System (SE2030 project).

## Tech stack
- Java 21, Spring Boot 3.3
- Spring Web, Spring Data JPA, Spring Security (JWT)
- MySQL
- Maven

## Getting started

1. **Create the database** (or let Hibernate create it - see below):
   ```sql
   CREATE DATABASE ceylongo;
   ```
   The `database/` folder at the project root also has a full `schema.sql`
   and `seed.sql` if you'd rather set the tables up by hand and skip
   Hibernate auto-DDL.

2. **Configure credentials** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. **Run it**:
   ```bash
   mvn spring-boot:run
   ```
   The API starts on `http://localhost:8080`. With `spring.jpa.hibernate.ddl-auto=update`,
   Hibernate will create/update tables automatically from the entity classes the
   first time it starts, so step 1 above just needs an empty database to exist.

## Project structure

Each feature lives in its own package with the same internal layout:

```
feature/
├── controller/   HTTP endpoints
├── service/      business logic
├── repository/   Spring Data JPA interfaces
├── model/        JPA entities
└── dto/          request/response objects
```

Features: `auth`, `guide`, `destination`, `itinerary`, `booking`, `review`,
`messaging`, `notification`, `admin`. Shared error handling and the generic
API response wrapper live in `common/`. JWT + Spring Security setup lives in
`config/`.

## Authentication

- `POST /api/auth/register` and `POST /api/auth/login` return a JWT.
- Send it on every subsequent request: `Authorization: Bearer <token>`.
- Roles: `TOURIST`, `GUIDE`, `ADMIN`. Admin accounts aren't self-registrable -
  seed one directly in the database (see `database/seed.sql`) or promote a
  user's `role` column manually.

## API overview

| Area | Base path | Notes |
|---|---|---|
| Auth | `/api/auth/*` | register, login, logout, forgot/reset password |
| Users | `/api/users/me` | view/update own profile |
| Destinations | `/api/destinations` | search/filter/sort, public GET, admin write |
| Categories | `/api/categories` | public GET |
| Guides | `/api/guides` | public list/detail, guide manages own profile |
| Itineraries | `/api/itineraries` | tourist-owned, CRUD + reorder items |
| Bookings | `/api/bookings` | create, accept/reject/cancel, simulated payment |
| Reviews | `/api/reviews` | for destinations or guides, flagging |
| Messages | `/api/messages` | simple DB-backed messaging between users |
| Notifications | `/api/notifications` | booking/message notifications |
| Admin | `/api/admin/*` | stats, manage users/guides/destinations, moderate reviews |

All responses are wrapped as `{ "success": bool, "message": string, "data": ... }`.

## Notes

- Payments are **simulated only** — `POST /api/bookings/{id}/pay` just flips a
  flag, no real payment gateway is used, per the project's declared scope.
- Password reset returns the token directly in the API response since no
  email service is wired up; swap `AuthService.forgotPassword` to send an
  email instead if you want that for real.
