# API Route Overview

API URL prefix: `/api`

## Auth Routes

Auth Route URL prefix: `/auth`

### Register

Endpoint URL suffix: `/register`

- POST: Register a new parent.
  - Input: JSON with first_name (str), last_name (str), email (str, unique), password (str)

### Login

Endpoint URL suffix: `/login`

- POST: Log in a parent.
  - Input: JSON with email (str), password (str)

### Get Current Parent

Endpoint URL suffix: `/current_parent`

- GET: Get the current authenticated parent.
  - Input: None
  - Output: None

## Children Routes

Auth Route URL prefix: `/children`

### Child

Endpoint URL suffix: `/`

- GET: Get a child by ID.
  - Input: Parameter child_id
- POST: Add a child.
  - Input: JSON with name (str), age_range (str), sex (str), eye_color (str), hair_type (str), hair_type (str), hair_color (str), ethnicity (str), fav_animals (str or null), fav_activities (str or null), fav_shows (str or null)
- PATCH: Modify a child's attributes.
  - Input: JSON with child_id (str), name (str), age_range (str), sex (str), eye_color (str), hair_type (str), hair_type (str), hair_color (str), ethnicity (str), fav_animals (str or null), fav_activities (str or null), fav_shows (str or null)

### AllChildren

Endpoint URL suffix: `/all`

- GET: Get all children for a parent.
  - Input: None

## Story Routes

Auth Route URL prefix: `/auth`

### GenerateStory

Endpoint URL suffix: `/generate`

- POST: Generate a story based on the provided data asynchronously.
  - Input: JSON with child_id (str), topic (str), image_style (str), story_genre (str)

### ChildStories

Endpoint URL suffix: `/child_stories`

- GET: Get all stories for a child.
  - Input: Parameter child_id

### StoryChapters

Endpoint URL suffix: `/chapters`

- GET: Get all chapters for a story.
  - Input: Parameter story_id
