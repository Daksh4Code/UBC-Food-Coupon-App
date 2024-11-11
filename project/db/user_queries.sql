-- User Creation (allowing multiple accounts with the same CWL)
-- The primary key is on account_id, so multiple accounts with the same CWL are allowed.
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES (:account_id, :year, :major, :password, :sid, :cwl);

-- Edit Password
UPDATE Account
SET password = :newPassword
WHERE account_id = :accountId;

-- Sign in with an existing account (Selection Query)
SELECT account_id, year, major, sid, cwl
FROM Account
WHERE cwl = :cwl AND password = :password;