# CeylonGo

## Web-based Tour Guide System for Sri Lanka

CeylonGo is a web-based tour guide system developed for the SE2030 Software Engineering module. The system is designed to help tourists discover destinations in Sri Lanka, plan trips, find local tour guides, make bookings and communicate with guides.

The system has three main types of users:

- Tourists
- Local Tour Guides
- Administrators

## Main Features

### 1. Destination Search & Discovery

- Search and browse destinations in Sri Lanka
- Filter destinations by category, location and popularity
- View destination information, images, opening hours, entry fees and map locations

### 2. Itinerary Planner

- Create personalised travel plans
- Add destinations, guides and activities
- Edit, reorder, save and delete itinerary items

### 3. Booking & Reservation Management

- Select a tour guide, date and time
- Send booking requests
- View booking status
- Guides can accept or reject booking requests

### 4. Reviews & Ratings

- Tourists can rate and review destinations and guides
- Display ratings and reviews
- Allow inappropriate reviews to be flagged for admin review

### 5. Local Guide Connect / Messaging

- Tourists can communicate with local guides
- View guide information such as languages, specialities and experience

### 6. Admin Dashboard & Content Management

- Manage users, guides and destinations
- Verify tour guide accounts
- Manage and moderate reviews
- View basic booking and platform statistics

## Other Features

- User registration and login
- Logout
- Password reset / forgot password
- User profile management
- Profile photos
- Booking notifications
- Search filters and sorting
- Basic form validation

## Technologies

- Frontend: Web technologies
- Backend: Java-based web technologies
- Database: MySQL

## Project Structure

```text
CeylonGo/
│
├── frontend/
│
├── backend/
│   └── src/
│       └── main/
│           └── java/
│               ├── auth/
│               ├── destination/
│               ├── itinerary/
│               ├── booking/
│               ├── reviews/
│               ├── messaging/
│               └── admin/
│
├── database/
│
└── README.md
