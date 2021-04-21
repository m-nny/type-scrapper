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
    "followeeUsername" as username,
    -- id,
    -- COUNT(*) as followers
    "followerUsername"
FROM
    instagram_user_follow
WHERE "followerUsername" = 'madiyar.k'
;