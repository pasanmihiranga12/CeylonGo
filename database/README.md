# CeylonGo Database

MySQL schema and sample seed data for the CeylonGo Web-based Tour Guide System.

## Two ways to set this up

**Option A — let the backend do it (recommended for development)**
The backend's `application.properties` has `spring.jpa.hibernate.ddl-auto=update`,
so Hibernate creates/updates all tables automatically from the JPA entities the
first time you run `mvn spring-boot:run`. You only need an empty database to exist:
```sql
CREATE DATABASE ceylongo;
```
Then optionally run `seed/seed.sql` afterwards to get sample data.

**Option B — run the SQL files by hand**
Useful if you want to inspect the schema, use MySQL Workbench, or don't want
Hibernate managing your schema.
```bash
mysql -u root -p < schema/schema.sql
mysql -u root -p < seed/seed.sql
```
`schema.sql` creates the `ceylongo` database and all tables (with `DROP TABLE IF EXISTS`
at the top, so it's safe to re-run). `seed.sql` populates it with sample data.

## Seeded accounts

Every seeded user has the password **`Password123`** — log in via `POST /api/auth/login`.

| Email | Role |
|---|---|
| admin@ceylongo.lk | ADMIN |
| nadeesha@example.com | TOURIST |
| james@example.com | TOURIST |
| aiko@example.com | TOURIST |
| kasun.guide@example.com | GUIDE (verified) |
| dilani.guide@example.com | GUIDE (verified) |
| ruwan.guide@example.com | GUIDE (not yet verified — useful for testing the admin verification flow) |

Also seeded: 6 categories, 8 Sri Lankan destinations, 3 guide profiles, 1 sample
itinerary with items, 3 bookings (one of each status), 6 reviews, a short message
thread, and a few notifications.

## Entity-relationship overview

```
users (TOURIST/GUIDE/ADMIN)
 ├── guides            (1:1, only for role = GUIDE)
 ├── itineraries        (1:many)
 ├── bookings (as tourist)
 ├── reviews (as reviewer)
 ├── messages (as sender/receiver)
 └── notifications

guides
 ├── bookings
 ├── reviews
 └── itinerary_items (optional link)

destinations
 ├── category           (many:1)
 ├── itinerary_items
 └── reviews

itineraries
 └── itinerary_items    (destination and/or guide per item)
```

Full column-level detail is in `schema/schema.sql` — every table there has
comments explaining anything non-obvious.
