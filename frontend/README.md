# CeylonGo Frontend

React + Vite + Tailwind frontend for the CeylonGo Web-based Tour Guide System.

## Tech stack
- React 18, Vite 5
- React Router v6
- Tailwind CSS
- Axios (API layer in `src/services/`)
- lucide-react (icons)

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env file and point it at your backend:
   ```bash
   cp .env.example .env
   # VITE_API_BASE_URL=http://localhost:8080/api
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:5173`. Make sure the backend is running on
   `http://localhost:8080` (or whatever you set `VITE_API_BASE_URL` to) and
   that CORS on the backend allows `http://localhost:5173`
   (`app.cors.allowed-origins` in `application.properties` — matches by default).

## Project structure

```
src/
├── components/   shared UI (Navbar, cards, StarRating, ProtectedRoute, …)
├── context/      AuthContext (JWT + current user)
├── layouts/      MainLayout (navbar + footer shell)
├── pages/        one file per route
├── services/     axios wrappers, one per backend feature area
└── utils/        formatting helpers
```

`src/services/api.js` is the only place that talks to axios directly — it
attaches the JWT to every request and unwraps the backend's
`{ success, message, data }` response envelope. Every other service file
just calls methods on it.

## Pages / routes

| Route | Access | Notes |
|---|---|---|
| `/` | public | hero, featured destinations & guides |
| `/login`, `/register` | public | |
| `/forgot-password`, `/reset-password` | public | token shown directly (no email service wired up) |
| `/destinations`, `/destinations/:id` | public | search/filter/sort, reviews, add-to-itinerary |
| `/guides`, `/guides/:id` | public | filter by language, request booking, send message |
| `/itinerary` | TOURIST | create/edit itineraries, reorder stops |
| `/bookings` | TOURIST, GUIDE | different view depending on role |
| `/messages` | TOURIST, GUIDE | conversation list + thread |
| `/reviews` | any logged-in user | reviews you've written |
| `/profile` | any logged-in user | edit profile; guides also edit their guide profile |
| `/admin` | ADMIN | stats, users, guide verification, destinations, flagged reviews |

## Notes

- Destination/guide photos are placeholder images from picsum.photos, seeded
  by name/id so they're at least stable per item — swap in real photography
  before using this for anything beyond the student project demo.
- Payments are simulated only, matching the backend's declared scope — the
  "Simulate payment" button just flips a flag, no real payment gateway.
