-- ============================================================================
-- CeylonGo — sample seed data
--
-- Every user below has the password:  Password123
-- (BCrypt hash below was generated with the same algorithm Spring Security's
-- BCryptPasswordEncoder uses, so you can log in with these accounts directly
-- through POST /api/auth/login once the backend is running.)
-- ============================================================================

USE ceylongo;

SET @PW := '$2b$10$SP5VpT1eQORNDDLdPbAPROEPMAUj3YpSX4pXYYJwbR5aQu1DI4phq';

-- ----------------------------------------------------------------------------
-- Users: 1 admin, 3 tourists, 3 guides
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password_hash, phone, role, profile_image_url, active, created_at, updated_at) VALUES
('CeylonGo Admin',      'admin@ceylongo.lk',     @PW, '+94770000001', 'ADMIN',   NULL, TRUE, NOW(), NOW()),
('Nadeesha Fernando',   'nadeesha@example.com',  @PW, '+94770000002', 'TOURIST', NULL, TRUE, NOW(), NOW()),
('James Whitfield',     'james@example.com',     @PW, '+44700000003', 'TOURIST', NULL, TRUE, NOW(), NOW()),
('Aiko Tanaka',         'aiko@example.com',      @PW, '+81700000004', 'TOURIST', NULL, TRUE, NOW(), NOW()),
('Kasun Jayawardena',   'kasun.guide@example.com', @PW, '+94770000005', 'GUIDE', NULL, TRUE, NOW(), NOW()),
('Dilani Wickramasinghe','dilani.guide@example.com', @PW, '+94770000006', 'GUIDE', NULL, TRUE, NOW(), NOW()),
('Ruwan Perera',        'ruwan.guide@example.com', @PW, '+94770000007', 'GUIDE', NULL, TRUE, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Guide profiles (linked to the three GUIDE users above)
-- ----------------------------------------------------------------------------
INSERT INTO guides (user_id, bio, languages, specialities, experience_years, hourly_rate, verified, created_at) VALUES
((SELECT id FROM users WHERE email = 'kasun.guide@example.com'),
 'Born and raised in Kandy, I love showing visitors the cultural heart of Sri Lanka - temples, tea estates and everything in between.',
 'English,Sinhala,German', 'Heritage Sites,Hill Country', 8, 25.00, TRUE, NOW()),

((SELECT id FROM users WHERE email = 'dilani.guide@example.com'),
 'Marine biologist turned tour guide. I specialise in whale watching, snorkelling trips and coastal wildlife tours around the south coast.',
 'English,Sinhala,French', 'Wildlife,Beaches', 5, 30.00, TRUE, NOW()),

((SELECT id FROM users WHERE email = 'ruwan.guide@example.com'),
 'Experienced trekking guide covering Ella, Horton Plains and the central highlands. Early starts, great views, guaranteed.',
 'English,Sinhala,Tamil', 'Hill Country,Adventure', 10, 22.00, FALSE, NOW());

-- ----------------------------------------------------------------------------
-- Categories
-- ----------------------------------------------------------------------------
INSERT INTO categories (name, description) VALUES
('Beaches', 'Coastal destinations for sun, surf and relaxation'),
('Heritage Sites', 'Ancient cities, temples and UNESCO World Heritage sites'),
('Wildlife', 'National parks and nature reserves'),
('Waterfalls', 'Scenic waterfalls across the island'),
('Hill Country', 'Tea estates, mountains and cool-climate towns'),
('Adventure', 'Hiking, trekking and outdoor activities');

-- ----------------------------------------------------------------------------
-- Destinations
-- ----------------------------------------------------------------------------
INSERT INTO destinations (name, description, category_id, location, latitude, longitude, image_url, opening_hours, entry_fee, average_rating, review_count, created_at) VALUES
('Sigiriya Rock Fortress',
 'An ancient rock fortress and palace ruin, one of Sri Lanka''s most iconic UNESCO World Heritage Sites, with frescoes and sweeping views from the summit.',
 (SELECT id FROM categories WHERE name = 'Heritage Sites'),
 'Sigiriya, Central Province', 7.9570, 80.7603, NULL, '7:00 AM - 5:30 PM', 30.00, 0, 0, NOW()),

('Ella Rock',
 'A scenic hike through tea plantations to a viewpoint overlooking the Ella Gap, one of the best sunrise spots in the hill country.',
 (SELECT id FROM categories WHERE name = 'Hill Country'),
 'Ella, Uva Province', 6.8667, 81.0466, NULL, 'Daylight hours', 0.00, 0, 0, NOW()),

('Yala National Park',
 'Sri Lanka''s most visited national park, famous for having one of the highest leopard densities in the world alongside elephants and birdlife.',
 (SELECT id FROM categories WHERE name = 'Wildlife'),
 'Yala, Southern Province', 6.3728, 81.5183, NULL, '6:00 AM - 6:00 PM', 25.00, 0, 0, NOW()),

('Mirissa Beach',
 'A laid-back beach town on the south coast, popular for whale watching, surfing and relaxing by the coconut-lined shore.',
 (SELECT id FROM categories WHERE name = 'Beaches'),
 'Mirissa, Southern Province', 5.9483, 80.4589, NULL, 'Open 24 hours', 0.00, 0, 0, NOW()),

('Galle Fort',
 'A well-preserved colonial-era fort with cobblestone streets, boutique shops, cafes and ocean-facing ramparts.',
 (SELECT id FROM categories WHERE name = 'Heritage Sites'),
 'Galle, Southern Province', 6.0300, 80.2167, NULL, 'Open 24 hours', 0.00, 0, 0, NOW()),

('Nuwara Eliya Tea Estates',
 'Rolling green tea plantations in the cool hill country, often called "Little England" for its colonial architecture and climate.',
 (SELECT id FROM categories WHERE name = 'Hill Country'),
 'Nuwara Eliya, Central Province', 6.9497, 80.7891, NULL, '8:00 AM - 4:00 PM', 5.00, 0, 0, NOW()),

('Diyaluma Falls',
 'Sri Lanka''s second-highest waterfall, with natural infinity pools at the top that are a rewarding (and steep) hike away.',
 (SELECT id FROM categories WHERE name = 'Waterfalls'),
 'Koslanda, Uva Province', 6.7328, 81.0333, NULL, 'Daylight hours', 0.00, 0, 0, NOW()),

('Temple of the Sacred Tooth Relic',
 'A sacred Buddhist temple in Kandy housing a relic believed to be the tooth of the Buddha, and the site of the annual Esala Perahera.',
 (SELECT id FROM categories WHERE name = 'Heritage Sites'),
 'Kandy, Central Province', 7.2936, 80.6414, NULL, '5:30 AM - 8:00 PM', 10.00, 0, 0, NOW());

-- ----------------------------------------------------------------------------
-- A sample itinerary for one tourist (Nadeesha) with a few items
-- ----------------------------------------------------------------------------
INSERT INTO itineraries (user_id, title, start_date, end_date, notes, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email = 'nadeesha@example.com'),
 'Hill Country & South Coast — 5 Days',
 '2026-11-10', '2026-11-14',
 'Slow travel, mix of nature and relaxation.', NOW(), NOW());

INSERT INTO itinerary_items (itinerary_id, destination_id, guide_id, day_number, order_index, activity, notes) VALUES
((SELECT id FROM itineraries WHERE title = 'Hill Country & South Coast — 5 Days'),
 (SELECT id FROM destinations WHERE name = 'Ella Rock'),
 (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'ruwan.guide@example.com'),
 1, 0, 'Sunrise hike', 'Start at 5:00 AM to catch the sunrise'),

((SELECT id FROM itineraries WHERE title = 'Hill Country & South Coast — 5 Days'),
 (SELECT id FROM destinations WHERE name = 'Nuwara Eliya Tea Estates'),
 NULL, 1, 1, 'Tea factory tour', NULL),

((SELECT id FROM itineraries WHERE title = 'Hill Country & South Coast — 5 Days'),
 (SELECT id FROM destinations WHERE name = 'Mirissa Beach'),
 (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'dilani.guide@example.com'),
 3, 0, 'Whale watching trip', 'Early morning boat departure');

-- ----------------------------------------------------------------------------
-- Sample bookings
-- ----------------------------------------------------------------------------
INSERT INTO bookings (tourist_id, guide_id, booking_date, booking_time, status, notes, simulated_amount, payment_simulated, created_at, updated_at) VALUES
((SELECT id FROM users WHERE email = 'nadeesha@example.com'),
 (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'ruwan.guide@example.com'),
 '2026-11-10', '05:00:00', 'CONFIRMED', 'Sunrise hike at Ella Rock', 22.00, TRUE, NOW(), NOW()),

((SELECT id FROM users WHERE email = 'nadeesha@example.com'),
 (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'dilani.guide@example.com'),
 '2026-11-13', '06:00:00', 'PENDING', 'Whale watching - flexible on exact time', 30.00, FALSE, NOW(), NOW()),

((SELECT id FROM users WHERE email = 'james@example.com'),
 (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'kasun.guide@example.com'),
 '2026-12-02', '09:00:00', 'PENDING', 'Interested in Kandy temple + tea estate combo', 25.00, FALSE, NOW(), NOW());

-- ----------------------------------------------------------------------------
-- Sample reviews (destinations and guides)
-- ----------------------------------------------------------------------------
INSERT INTO reviews (reviewer_id, destination_id, guide_id, rating, comment, flagged, created_at) VALUES
((SELECT id FROM users WHERE email = 'james@example.com'), (SELECT id FROM destinations WHERE name = 'Sigiriya Rock Fortress'), NULL, 5, 'Absolutely breathtaking. Go early to beat both the heat and the crowds.', FALSE, NOW()),
((SELECT id FROM users WHERE email = 'aiko@example.com'),  (SELECT id FROM destinations WHERE name = 'Sigiriya Rock Fortress'), NULL, 4, 'Steep climb but so worth it for the view from the top.', FALSE, NOW()),
((SELECT id FROM users WHERE email = 'nadeesha@example.com'), (SELECT id FROM destinations WHERE name = 'Ella Rock'), NULL, 5, 'One of the best sunrises I have ever seen.', FALSE, NOW()),
((SELECT id FROM users WHERE email = 'james@example.com'), (SELECT id FROM destinations WHERE name = 'Mirissa Beach'), NULL, 4, 'Great beach, a bit crowded during whale watching season.', FALSE, NOW()),
((SELECT id FROM users WHERE email = 'aiko@example.com'),  NULL, (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'kasun.guide@example.com'), 5, 'Kasun was incredibly knowledgeable about Kandyan history and culture.', FALSE, NOW()),
((SELECT id FROM users WHERE email = 'nadeesha@example.com'), NULL, (SELECT g.id FROM guides g JOIN users u ON g.user_id = u.id WHERE u.email = 'ruwan.guide@example.com'), 5, 'Ruwan set a great pace for the hike and knew all the best photo spots.', FALSE, NOW());

-- Recalculate destination rating aggregates to match the seeded reviews above
-- (the backend normally does this automatically whenever a review is created).
UPDATE destinations d
SET average_rating = (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.destination_id = d.id),
    review_count    = (SELECT COUNT(*) FROM reviews r WHERE r.destination_id = d.id)
WHERE d.id IN (SELECT DISTINCT destination_id FROM reviews WHERE destination_id IS NOT NULL);

-- ----------------------------------------------------------------------------
-- Sample messages (tourist <-> guide conversation)
-- ----------------------------------------------------------------------------
INSERT INTO messages (sender_id, receiver_id, content, sent_at, read_at) VALUES
((SELECT id FROM users WHERE email = 'nadeesha@example.com'), (SELECT id FROM users WHERE email = 'ruwan.guide@example.com'),
 'Hi Ruwan! Is the Ella Rock hike suitable for beginners?', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 1 HOUR),
((SELECT id FROM users WHERE email = 'ruwan.guide@example.com'), (SELECT id FROM users WHERE email = 'nadeesha@example.com'),
 'Yes, definitely! It''s a moderate hike, about 2-3 hours round trip. I''ll set an easy pace.', NOW() - INTERVAL 2 DAY + INTERVAL 30 MINUTE, NOW() - INTERVAL 1 DAY),
((SELECT id FROM users WHERE email = 'nadeesha@example.com'), (SELECT id FROM users WHERE email = 'ruwan.guide@example.com'),
 'Perfect, looking forward to it!', NOW() - INTERVAL 1 DAY, NULL);

-- ----------------------------------------------------------------------------
-- Sample notifications
-- ----------------------------------------------------------------------------
INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES
((SELECT id FROM users WHERE email = 'ruwan.guide@example.com'), 'Nadeesha Fernando requested a booking on 2026-11-10', 'BOOKING_UPDATE', TRUE, NOW() - INTERVAL 3 DAY),
((SELECT id FROM users WHERE email = 'nadeesha@example.com'), 'Your booking on 2026-11-10 is now CONFIRMED', 'BOOKING_UPDATE', FALSE, NOW() - INTERVAL 2 DAY),
((SELECT id FROM users WHERE email = 'ruwan.guide@example.com'), 'Nadeesha Fernando sent you a message', 'NEW_MESSAGE', TRUE, NOW() - INTERVAL 2 DAY);
