-- @block create company table
-- @conn brain
SELECT
    "followeeUsername" as username,
    id,
    COUNT(*) as followers
    -- "followerUsername"
FROM
    instagram_user_follow
LEFT JOIN instagram_user
ON "followeeUsername" = username
WHERE "id" IS NULL
GROUP BY "followeeUsername", "id"
ORDER BY "followers" DESC
;


-- @block create company table
-- @conn brain
SELECT
COUNT(*)
    -- "followeeUsername" as username,
    -- -- id,
    -- -- COUNT(*) as followers
    -- "followerUsername"
FROM
    instagram_user_follow
WHERE "followeeUsername" = 'illyarkyn'
;
-- @block imported_users
-- @conn brain
SELECT
    username,
    id
FROM
    instagram_user
WHERE
    id IS NOT NULL
-- WHERE "followeeUsername" = 'illyarkyn'
;