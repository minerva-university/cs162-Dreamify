-- Create the "parents" table
CREATE TABLE parents (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name TEXT,
    password TEXT,
    email TEXT
);

-- Create the "children" table
CREATE TABLE children (
    child_id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    kid_eye_color TEXT,
    kid_hair_type TEXT,
    kid_hair_color TEXT,
    kid_skin_tone TEXT,
    kid_name TEXT,
    kid_age_range TEXT,
    kid_sex TEXT,
    kid_sibling_relationship TEXT,
    kid_fav_animals TEXT,
    kid_fav_activities TEXT,
    kid_fav_shows TEXT,
    FOREIGN KEY (parent_id) REFERENCES parents(user_id)
);

-- Create the "stories" table
CREATE TABLE stories (
    story_id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER,
    story_a_topic TEXT,
    story_b_image_style TEXT, -- Assuming use of URL or reference; adjust if using BLOB for binary data
    FOREIGN KEY (child_id) REFERENCES children(child_id)
);

-- Create the "chapters" table
CREATE TABLE chapters (
    chapter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER,
    content TEXT,
    image TEXT, -- Assuming use of URL or reference; adjust if using BLOB for binary data
    order INTEGER,
    FOREIGN KEY (story_id) REFERENCES stories(story_id)
);
