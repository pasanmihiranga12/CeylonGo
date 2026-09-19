-- ============================================================================
-- CeylonGo — Web-based Tour Guide System for Sri Lanka
-- MySQL schema (matches the JPA entities in backend/src/.../*/model/*.java)
--
-- You do NOT have to run this manually: with spring.jpa.hibernate.ddl-auto=update
-- Hibernate will create these tables automatically on first run. This file is
-- provided so a team member can set up the schema by hand, inspect it, or
-- import it into a MySQL client/workbench without starting the backend.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS ceylongo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ceylongo;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS destinations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS guides;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- users — tourists, guides and admins all live in one table, split by "role"
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    email              VARCHAR(150) NOT NULL,
    password_hash      VARCHAR(255) NOT NULL,     -- BCrypt hash, never plain text
    phone              VARCHAR(20),
    role               VARCHAR(20)  NOT NULL,     -- TOURIST | GUIDE | ADMIN
    profile_image_url  VARCHAR(255),
    active             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at         DATETIME     NOT NULL,
    updated_at         DATETIME,
    UNIQUE KEY uk_users_email (email),
    CONSTRAINT chk_users_role CHECK (role IN ('TOURIST', 'GUIDE', 'ADMIN'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- password_reset_tokens — supports the "forgot password" flow
-- ----------------------------------------------------------------------------
CREATE TABLE password_reset_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    token       VARCHAR(255) NOT NULL,
    user_id     BIGINT       NOT NULL,
    expires_at  DATETIME     NOT NULL,
    used        BOOLEAN      NOT NULL DEFAULT FALSE,
    UNIQUE KEY uk_reset_token (token),
    CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- guides — one-to-one extension of users for role = GUIDE
-- ----------------------------------------------------------------------------
CREATE TABLE guides (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    bio               TEXT,
    languages         VARCHAR(255),               -- comma-separated, e.g. "English,Sinhala,German"
    specialities      VARCHAR(255),                -- comma-separated, e.g. "Wildlife,Hiking"
    experience_years  INT,
    hourly_rate       DOUBLE,
    verified          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        DATETIME NOT NULL,
    UNIQUE KEY uk_guides_user (user_id),
    CONSTRAINT fk_guides_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- categories — destination categories (Beaches, Wildlife, Heritage, ...)
-- ----------------------------------------------------------------------------
CREATE TABLE categories (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(500),
    UNIQUE KEY uk_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- destinations
-- ----------------------------------------------------------------------------
CREATE TABLE destinations (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT,
    category_id     BIGINT,
    location        VARCHAR(150),
    latitude        DOUBLE,
    longitude       DOUBLE,
    image_url       VARCHAR(255),
    opening_hours   VARCHAR(150),
    entry_fee       DOUBLE,
    average_rating  DOUBLE  NOT NULL DEFAULT 0,
    review_count    INT     NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL,
    KEY idx_destinations_category (category_id),
    KEY idx_destinations_location (location),
    CONSTRAINT fk_destinations_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- itineraries — a tourist's personal, multi-day travel plan
-- ----------------------------------------------------------------------------
CREATE TABLE itineraries (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    title       VARCHAR(150) NOT NULL,
    start_date  DATE,
    end_date    DATE,
    notes       VARCHAR(1000),
    created_at  DATETIME NOT NULL,
    updated_at  DATETIME,
    KEY idx_itineraries_user (user_id),
    CONSTRAINT fk_itineraries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- itinerary_items — destinations/guides/activities added to an itinerary
-- ----------------------------------------------------------------------------
CREATE TABLE itinerary_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id    BIGINT NOT NULL,
    destination_id  BIGINT,
    guide_id        BIGINT,
    day_number      INT,
    order_index     INT NOT NULL DEFAULT 0,
    activity        VARCHAR(500),
    notes           VARCHAR(1000),
    KEY idx_items_itinerary (itinerary_id),
    KEY idx_items_destination (destination_id),
    KEY idx_items_guide (guide_id),
    CONSTRAINT fk_items_itinerary   FOREIGN KEY (itinerary_id)   REFERENCES itineraries(id)  ON DELETE CASCADE,
    CONSTRAINT fk_items_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL,
    CONSTRAINT fk_items_guide       FOREIGN KEY (guide_id)       REFERENCES guides(id)       ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- bookings — tourist books a guide for a date/time; payment is simulated only
-- ----------------------------------------------------------------------------
CREATE TABLE bookings (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    tourist_id          BIGINT NOT NULL,
    guide_id            BIGINT NOT NULL,
    booking_date        DATE   NOT NULL,
    booking_time        TIME   NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING | CONFIRMED | CANCELLED
    notes               VARCHAR(1000),
    simulated_amount    DOUBLE,
    payment_simulated   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME,
    KEY idx_bookings_tourist (tourist_id),
    KEY idx_bookings_guide (guide_id),
    KEY idx_bookings_status (status),
    CONSTRAINT fk_bookings_tourist FOREIGN KEY (tourist_id) REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_bookings_guide   FOREIGN KEY (guide_id)   REFERENCES guides(id) ON DELETE CASCADE,
    CONSTRAINT chk_bookings_status CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- reviews — targets EXACTLY ONE of destination_id / guide_id
-- ----------------------------------------------------------------------------
CREATE TABLE reviews (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id     BIGINT NOT NULL,
    destination_id  BIGINT,
    guide_id        BIGINT,
    rating          INT NOT NULL,
    comment         VARCHAR(1000),
    flagged         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      DATETIME NOT NULL,
    KEY idx_reviews_reviewer (reviewer_id),
    KEY idx_reviews_destination (destination_id),
    KEY idx_reviews_guide (guide_id),
    CONSTRAINT fk_reviews_reviewer    FOREIGN KEY (reviewer_id)    REFERENCES users(id)        ON DELETE CASCADE,
    CONSTRAINT fk_reviews_destination FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_guide       FOREIGN KEY (guide_id)       REFERENCES guides(id)       ON DELETE CASCADE,
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT chk_reviews_target CHECK (
        (destination_id IS NOT NULL AND guide_id IS NULL) OR
        (destination_id IS NULL AND guide_id IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- messages — simple database-backed tourist <-> guide messaging
-- ----------------------------------------------------------------------------
CREATE TABLE messages (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id    BIGINT NOT NULL,
    receiver_id  BIGINT NOT NULL,
    content      VARCHAR(2000) NOT NULL,
    sent_at      DATETIME NOT NULL,
    read_at      DATETIME,
    KEY idx_messages_sender (sender_id),
    KEY idx_messages_receiver (receiver_id),
    CONSTRAINT fk_messages_sender   FOREIGN KEY (sender_id)   REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- notifications — booking updates, new messages, etc.
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    message       VARCHAR(500) NOT NULL,
    type          VARCHAR(50),               -- e.g. BOOKING_UPDATE, NEW_MESSAGE
    is_read       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    DATETIME NOT NULL,
    KEY idx_notifications_user (user_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
