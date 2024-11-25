-- Insert feedback
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES (:accountId, :sid, :order_date, :branchId, :rating);

-- Update feedback
UPDATE Feedback_Rating
SET rating = :newRating
WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId;

-- View feedback (for a specific user)
SELECT *
FROM Feedback_Rating
WHERE account_id = :accountId;

-- Nested aggregation with GROUP BY (to find the best average rating)
SELECT branch_id
FROM Feedback_Rating
GROUP BY branch_id
HAVING AVG(rating) >= (
    SELECT MAX(avg_rating)
    FROM (
             SELECT AVG(rating) AS avg_rating
             FROM Feedback_Rating
             GROUP BY branch_id
         )
);

-- Delete feedback
DELETE FROM Feedback_Rating
WHERE account_id = :accountId AND sid = :sid AND order_date = :order_date AND branch_id = :branchId;

-- Projection query to select names of restaurants that have a branch located on a street
-- address that matches the user's input
SELECT R.name
FROM Restaurant R JOIN Branch B ON R.name = B.restaurant_name
WHERE B.street_address LIKE '%' || :input_address || '%';