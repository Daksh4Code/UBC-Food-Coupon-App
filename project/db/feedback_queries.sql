-- Insert feedback
INSERT INTO FEEDBACK_RATING (ACCOUNT_ID, SID, ORDER_DATE, BRANCH_ID, RATING)
                 VALUES (:accountId, :sid, TO_DATE(:order_date, 'YYYY-MM-DD'), :branchId, :rating);

-- Update feedback
UPDATE FEEDBACK_RATING
                 SET RATING = :newRating
                 WHERE ACCOUNT_ID = :accountId
                   AND SID = :sid
                   AND ORDER_DATE = TO_DATE(:order_date, 'YYYY-MM-DD')
                   AND BRANCH_ID = :branchId;

-- View feedback (for a specific user)
SELECT * FROM FEEDBACK_RATING WHERE ACCOUNT_ID = :accountId;

-- Nested aggregation with GROUP BY (to get the best branch by finding the best average rating)
SELECT BRANCH_ID
                FROM FEEDBACK_RATING
                GROUP BY BRANCH_ID
                HAVING AVG(RATING) = (SELECT MAX(AVG(RATING)) FROM FEEDBACK_RATING GROUP BY BRANCH_ID);

-- Delete feedback
DELETE FROM FEEDBACK_RATING
                 WHERE ACCOUNT_ID = :accountId
                   AND SID = :sid
                   AND ORDER_DATE = TO_DATE(:order_date, 'YYYY-MM-DD')
                   AND BRANCH_ID = :branchId;