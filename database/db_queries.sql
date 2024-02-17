-- EXAMPLES OF QUERIES

-- Fetching all the children of a parent
SELECT c.*
FROM children c
WHERE p.parent_id = ?; 

-- Fetching all the stories related to a child
SELECT s.*
FROM stories s
WHERE s.child_id = ?;

-- Fetching all the chapters of a story
SELECT c.*
FROM chapters c
WHERE c.story_id = ?; -- Replace ? with the story's story_id
ORDER BY c.order ASC;
