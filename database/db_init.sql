CREATE TABLE parents (
  user_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  password TEXT,
  email TEXT
);

CREATE TABLE children (
  child_id INTEGER PRIMARY KEY,
  parent_id INTEGER,
  kid_a_i_eye_color TEXT,
  kid_a_ii_hair_type TEXT,
  kid_a_iii_hair_color TEXT,
  kid_a_iv_skin_tone TEXT,
  kid_b_i_name TEXT,
  kid_b_ii_age_range TEXT,
  kid_b_iii_sex TEXT,
  kid_b_iv_sibling_relationship TEXT,
  kid_c_i_fav_animals TEXT,
  kid_c_ii_fav_activities TEXT,
  kid_c_iii_fav_shows TEXT,
  FOREIGN KEY (parent_id) REFERENCES parents(user_id)
);

CREATE TABLE stories (
  story_id INTEGER PRIMARY KEY,
  author_id INTEGER,
  story_a_topic TEXT,
  story_b_image_style BLOB,
  FOREIGN KEY (author_id) REFERENCES parents(user_id)
);
