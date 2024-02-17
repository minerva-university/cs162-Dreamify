-- EXAMPLES OF QUERIES

-- Creating new accounts
INSERT INTO parents (user_id, first_name, last_name, password, email) 
VALUES (DEFAULT, 'John', 'Doe', 'password123', 'john.doe@example.com');

-- Creating new children 
INSERT INTO children (child_id, parent_id, kid_eye_color, kid_hair_type, kid_hair_color, kid_skin_tone, kid_name, kid_age_range, kid_sex, kid_sibling_relationship, kid_fav_animals, kid_fav_activities, kid_fav_shows) 
VALUES (DEFAULT, 1, 'blue', 'curly', 'blonde', 'fair', 'Jane Doe', '5-7', 'F', 'only child', 'dogs, cats', 'drawing, playing', 'cartoon X, Y');

-- Creating new stories
INSERT INTO stories (story_id, child_id, story_a_topic, story_b_image_style) 
VALUES (DEFAULT, 1, 'Adventure', '/path/to/image/style.png');

-- Creating new chapters
INSERT INTO chapters (chapter_id, story_id, content, image, order) 
VALUES (DEFAULT, 1, 'Once upon a time...', '/path/to/chapter/image.png', 1);