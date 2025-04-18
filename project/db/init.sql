drop table FEEDBACK_RATING cascade constraints;
drop table DELIVERY cascade constraints;
drop table PICKUP cascade constraints;
drop table FEEDBACK_LINK cascade constraints;
drop table ACCOUNT cascade constraints;
drop table UBC_STUDENT cascade constraints;
drop table COUPON cascade constraints;
drop table SELLS cascade constraints;
drop table FOOD cascade constraints;
drop table BRANCH cascade constraints;
drop table RESTAURANT cascade constraints;
drop table FOOD_INFORMATION cascade constraints;
drop table CONSISTS_DELIVERY cascade constraints;
drop table CONSISTS_PICKUP cascade constraints;
drop table RestaurantOTD cascade constraints;


CREATE TABLE Restaurant (
    name VARCHAR(1000) PRIMARY KEY,
    type VARCHAR(1000)
);
CREATE TABLE Branch (
    branch_id CHAR(5) PRIMARY KEY,
    street_address VARCHAR(1000),
    restaurant_name VARCHAR(1000) NOT NULL,
    FOREIGN KEY (restaurant_name) REFERENCES Restaurant(name) ON DELETE CASCADE
);
CREATE TABLE Food_Information (
    calories INTEGER,
    type VARCHAR(1000),
    f_size VARCHAR(1000),
    nutritional_score INTEGER,
    cost DECIMAL(4,2),
    PRIMARY KEY(type, calories, f_size)
);
CREATE TABLE Food (
    food_name VARCHAR(1000) PRIMARY KEY,
    type VARCHAR(1000),
    calories INTEGER,
    f_size VARCHAR(1000),
    branch_id CHAR(5) NOT NULL,
    Cost DECIMAL(4,2),
    FOREIGN KEY (type, calories, f_size) REFERENCES Food_Information (type, calories, f_size) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch (branch_id) ON DELETE CASCADE
);
CREATE TABLE Coupon (
    coupon_id CHAR(8) PRIMARY KEY,
    branch_id CHAR(5) NOT NULL,
    dc_percent FLOAT,
    number_of_uses INTEGER,
    FOREIGN KEY(branch_id) REFERENCES Branch ON DELETE CASCADE
);
CREATE TABLE Sells (
    food_name VARCHAR(1000),
    branch_id CHAR(5),
    PRIMARY KEY (food_name, branch_id),
    FOREIGN KEY (food_name) REFERENCES Food(food_name) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)  ON DELETE CASCADE
);
-- Create UBC_Student table
CREATE TABLE UBC_Student (
     sid CHAR(8) PRIMARY KEY,
     cwl VARCHAR(100)
);

-- Create Account table
CREATE TABLE Account (
                         account_id VARCHAR(20) PRIMARY KEY,  -- Assuming account_id is a unique identifier
                         year INTEGER,
                         major VARCHAR(100),  -- Changed from INTEGER to allow for major names
                         password VARCHAR(100),
                         sid CHAR(8),
                         cwl VARCHAR(100),
                         FOREIGN KEY (sid) REFERENCES UBC_Student(sid) ON DELETE CASCADE
);

-- Create Feedback_Rating table
CREATE TABLE Feedback_Rating (
     account_id VARCHAR(20) NOT NULL,
     sid CHAR(8) NOT NULL,
     order_date DATE NOT NULL,
     branch_id CHAR(5) NOT NULL,
     rating INTEGER NOT NULL,
     PRIMARY KEY (account_id, sid, order_date, branch_id),
     FOREIGN KEY (account_id) REFERENCES Account (account_id) ON DELETE CASCADE,
     FOREIGN KEY (sid) REFERENCES UBC_Student (sid) ON DELETE CASCADE,
     FOREIGN KEY (branch_id) REFERENCES Branch (branch_id) ON DELETE CASCADE
);

-- Create Delivery Table
CREATE TABLE Delivery(
                         order_id INTEGER PRIMARY KEY,
                         total_cost DECIMAL(10,2),
                         order_date DATE,
                         payment_method VARCHAR(111),
                         coupon_id CHAR(8) DEFAULT NULL,
                         branch_id CHAR(5) NOT NULL,
                         account_id VARCHAR(111) NOT NULL,
                         sid CHAR(8) NOT NULL,
                         delivery_cost DECIMAL(4,2),
                         delivery_status VARCHAR(111),
                         delivery_time FLOAT,
                         FOREIGN KEY (coupon_id) REFERENCES Coupon
                             ON DELETE SET NULL,
                         FOREIGN KEY (branch_id) REFERENCES Branch
                             ON DELETE CASCADE,
                         FOREIGN KEY (account_id) REFERENCES Account
                             ON DELETE CASCADE,
                         FOREIGN KEY (sid) REFERENCES UBC_Student
                             ON DELETE CASCADE
);

-- Create Pickup Table
CREATE TABLE Pickup
(
    order_id INTEGER PRIMARY KEY,
    total_cost DECIMAL(10,2),
    order_date DATE,
    payment_method VARCHAR(111),
    coupon_id CHAR(8) DEFAULT NULL,
    branch_id CHAR(5) NOT NULL,
    account_id VARCHAR(111) NOT NULL,
    sid CHAR(8) NOT NULL,
    pickup_time FLOAT,
    pickup_status VARCHAR(111),
    FOREIGN KEY (coupon_id) REFERENCES Coupon
        ON DELETE SET NULL,
    FOREIGN KEY (branch_id) REFERENCES Branch
        ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES Account
        ON DELETE CASCADE,
    FOREIGN KEY (sid) REFERENCES UBC_Student
        ON DELETE CASCADE
);


-- Create Feedback_Link table
CREATE TABLE Feedback_Link (
   fid INTEGER PRIMARY KEY,
   account_id VARCHAR(20) NOT NULL,
   sid CHAR(8) NOT NULL,
   order_date DATE NOT NULL,
   branch_id CHAR(5) NOT NULL,
   FOREIGN KEY (account_id) REFERENCES Account (account_id) ON DELETE CASCADE,
   FOREIGN KEY (sid) REFERENCES UBC_Student (sid) ON DELETE CASCADE,
   FOREIGN KEY (branch_id) REFERENCES Branch (branch_id) ON DELETE CASCADE
);

CREATE TABLE Consists_Delivery (
    order_id INTEGER,
    food_name VARCHAR(1000) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, food_name),
    FOREIGN KEY (order_id) REFERENCES Delivery (order_id) ON DELETE CASCADE,
    FOREIGN KEY (food_name) REFERENCES Food (food_name) ON DELETE CASCADE
);

CREATE TABLE Consists_Pickup (
    order_id INTEGER,
    food_name VARCHAR(1000) NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, food_name),
    FOREIGN KEY (order_id) REFERENCES Pickup (order_id) ON DELETE CASCADE,
    FOREIGN KEY (food_name) REFERENCES Food (food_name) ON DELETE CASCADE
);

CREATE TABLE RestaurantOTD (
    name VARCHAR(1000) NOT NULL,
    FOREIGN KEY (name) REFERENCES Restaurant (name) ON DELETE CASCADE
);

-- ASSERTIONS SEEMINGLY NOT SUPPORTED
-- ----------------------------------------------
-- CREATE ASSERTION OrderHasFood
-- CHECK (Not Exists(Select food_name from Food
--                     Except
--                     Select food_name from Consists));

--Insert statements to populate the db
INSERT INTO Restaurant VALUES('Starbucks', 'cafe');
INSERT INTO Restaurant VALUES('Triple_Os', 'restaurant');
INSERT INTO Restaurant VALUES('Harvest', 'grocery_store');
INSERT INTO Restaurant VALUES('Subway', 'restaurant');
INSERT INTO Restaurant VALUES('Pacific_Poke', 'restaurant');

INSERT INTO Branch VALUES('S0002', '6138 Student Union Blvd', 'Starbucks');
INSERT INTO Branch VALUES('T0001', '2015 Main Mall', 'Triple_Os');
INSERT INTO Branch VALUES('H0001', '6445 University Blvd', 'Harvest');
INSERT INTO Branch VALUES('S0001', '6138 Student Union Blvd', 'Subway');
INSERT INTO Branch VALUES('P0001', '6138 Student Union Blvd', 'Pacific_Poke');
INSERT INTO Food_Information VALUES(10, 'beverage', 'small', 1, 5.45);
INSERT INTO Food_Information VALUES(930, 'food', 'large', 3, 12.00);
INSERT INTO Food_Information VALUES(316, 'food', 'regular', 8, 8.00);
INSERT INTO Food_Information VALUES(207, 'food', 'foot_long',  6, 8.79);
INSERT INTO Food_Information VALUES(850, 'food', 'regular',  7, 18.00);
INSERT INTO Food VALUES('americano', 'beverage', 10, 'small', 'S0002', 5.45);
INSERT INTO Food VALUES('cheese_burger', 'food', 930, 'large', 'T0001', 12.00);
INSERT INTO Food VALUES('caesar_salad', 'food', 316,'regular', 'H0001', 8.00);
INSERT INTO Food VALUES('roasted_chicken_sub', 'food', 207, 'foot_long', 'S0001', 8.79);
INSERT INTO Food VALUES('main_bowl', 'food', 850,'regular', 'P0001', 18.00);
INSERT INTO Coupon VALUES('2G2303D3', 'S0002', 0.15, 4);
INSERT INTO Coupon VALUES('B152R99G', 'T0001', 0.25, 2);
INSERT INTO Coupon VALUES('K0E5G001', 'H0001', 0.02, 1);
INSERT INTO Coupon VALUES('B0F13D01', 'H0001', 0.05, 10);
INSERT INTO Coupon VALUES('P0F33N20', 'P0001', 0.10, 9);
INSERT INTO Sells VALUES('americano', 'S0002');
INSERT INTO Sells VALUES('cheese_burger', 'T0001');
INSERT INTO Sells VALUES('caesar_salad', 'H0001');
INSERT INTO Sells VALUES('roasted_chicken_sub', 'S0001');
INSERT INTO Sells VALUES('main_bowl', 'P0001');
-- Insert data into UBC_Student table
INSERT INTO UBC_Student (sid, cwl) VALUES('12345678', 'john.doe');
INSERT INTO UBC_Student (sid, cwl) VALUES('87654321', 'jane.smith');
INSERT INTO UBC_Student (sid, cwl) VALUES('11223344', 'peter.pan');
INSERT INTO UBC_Student (sid, cwl) VALUES('44332211', 'alice.wonder');
INSERT INTO UBC_Student (sid, cwl) VALUES('99887766', 'bob.builder');
INSERT INTO UBC_Student (sid, cwl) VALUES('66778899', 'wendy.bird');
INSERT INTO UBC_Student (sid, cwl) VALUES('55443322', 'captain.hook');
INSERT INTO UBC_Student (sid, cwl) VALUES('22334455', 'tinker.bell');
INSERT INTO UBC_Student (sid, cwl) VALUES('10101010', 'robin.hood');
INSERT INTO UBC_Student (sid, cwl) VALUES('90909090', 'maid.marian');
INSERT INTO UBC_Student (sid, cwl) VALUES('13579246', 'little.john');
-- INSERT INTO UBC_Student (sid, cwl) VALUES('24681354', 'friar.tuck');
INSERT INTO UBC_Student (sid, cwl) VALUES('18273645', 'sheriff.mathew');
INSERT INTO UBC_Student (sid, cwl) VALUES('54321098', 'prince.john');
INSERT INTO UBC_Student (sid, cwl) VALUES('86420975', 'alan.a.dale');

-- Insert data into Account table
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc001', 2024, 'Computer Science', 'password123', '12345678', 'john.doe');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc002', 2023, 'Biology', 'securepass', '87654321', 'jane.smith');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc003', 2025, 'Mathematics', 'mathlover', '11223344', 'peter.pan');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc004', 2022, 'Physics', 'physics101', '44332211', 'alice.wonder');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc005', 2024, 'Chemistry', 'ilovechem', '99887766', 'bob.builder');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc006', 2023, 'English', 'bookworm', '66778899', 'wendy.bird');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc007', 2025, 'History', 'historybuff', '55443322', 'captain.hook');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc008', 2022, 'Economics', 'moneymatters', '22334455', 'tinker.bell');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc009', 2024, 'Psychology', 'mindreader', '10101010', 'robin.hood');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc010', 2023, 'Sociology', 'socialbee', '90909090', 'maid.marian');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc011', 2025, 'Political Science', 'govnerd', '13579246', 'little.john');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc019', 2022, 'Earth Science', 'gogreenman', '18273645', 'sheriff.mathew');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc014', 2023, 'Music', 'musiclover', '54321098', 'prince.john');
INSERT INTO Account (account_id, year, major, password, sid, cwl) VALUES ('acc017', 2021, 'History', 'history111', '86420975', 'alan.dale');

-- Insert data into Feedback_Rating table
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES ('acc001', '12345678', TO_DATE('2024-11-08', 'YYYY-MM-DD'), 'S0002', 4);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc002', '87654321', TO_DATE('2024-11-07', 'YYYY-MM-DD'), 'T0001', 5);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc003', '11223344', TO_DATE('2024-11-06', 'YYYY-MM-DD'), 'H0001', 3);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc004', '44332211', TO_DATE('2024-11-05', 'YYYY-MM-DD'), 'S0001', 2);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc005', '99887766', TO_DATE('2024-11-04', 'YYYY-MM-DD'), 'P0001', 5);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc006', '66778899', TO_DATE('2024-11-03', 'YYYY-MM-DD'), 'S0002', 4);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc007', '55443322', TO_DATE('2024-11-02', 'YYYY-MM-DD'), 'T0001', 3);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc008', '22334455', TO_DATE('2024-11-01', 'YYYY-MM-DD'), 'H0001', 5);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc009', '10101010', TO_DATE('2024-10-31', 'YYYY-MM-DD'), 'S0001', 4);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc010', '90909090', TO_DATE('2024-10-30', 'YYYY-MM-DD'), 'P0001', 2);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc001', '12345678', TO_DATE('2024-10-29', 'YYYY-MM-DD'), 'S0002', 3);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc002', '87654321', TO_DATE('2024-10-28', 'YYYY-MM-DD'), 'T0001', 4);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc003', '11223344', TO_DATE('2024-10-27', 'YYYY-MM-DD'), 'H0001', 5);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc004', '44332211', TO_DATE('2024-10-26', 'YYYY-MM-DD'), 'S0001', 3);
INSERT INTO Feedback_Rating (account_id, sid, order_date, branch_id, rating) VALUES('acc005', '99887766', TO_DATE('2024-10-25', 'YYYY-MM-DD'), 'P0001', 4);
-- Insert data into Feedback_Link table
INSERT INTO Feedback_Link (fid, account_id, sid, order_date, branch_id) VALUES (1, 'acc001', '12345678', TO_DATE('2024-11-08', 'YYYY-MM-DD'), 'S0002');
INSERT INTO Feedback_Link (fid, account_id, sid, order_date, branch_id) VALUES (2, 'acc002', '87654321', TO_DATE('2024-11-07', 'YYYY-MM-DD'), 'T0001');
INSERT INTO Feedback_Link (fid, account_id, sid, order_date, branch_id) VALUES (3, 'acc003', '11223344', TO_DATE('2024-11-06', 'YYYY-MM-DD'), 'H0001');



INSERT INTO Delivery VALUES (1, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit','2G2303D3', 'S0002','acc001','12345678',2.99, 'Complete', 1.2
                            );
INSERT INTO Delivery VALUES (2, 50.49, TO_DATE('13/10/2024', 'DD/MM/YYYY'), 'Credit','B152R99G', 'T0001','acc002','87654321',2.99, 'Complete', 0.2
                            );
INSERT INTO Delivery VALUES (3, 29.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit','K0E5G001', 'H0001','acc003','11223344',2.99, 'Placed', 2
                            );
INSERT INTO Delivery VALUES (4, 100000.99, TO_DATE('15/10/2024', 'DD/MM/YYYY'), 'Cash','2G2303D3', 'S0002','acc004','44332211',4.99, 'Delivering', 1
                            );
INSERT INTO Delivery VALUES (5, 3.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Credit','B0F13D01', 'H0001','acc005','99887766',0.99, 'Placed', 777
                            );



INSERT INTO Pickup VALUES (6, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'S0002','acc001','12345678',1, 'Complete'
                          );
INSERT INTO Pickup VALUES (7, 50.49, TO_DATE('13/10/2024', 'DD/MM/YYYY'), 'Credit','B152R99G', 'T0001','acc002','87654321',0.9, 'Complete'
                          );
INSERT INTO Pickup VALUES (8, 29.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit','2G2303D3', 'S0002','acc003','11223344',0.2, 'Placed'
                          );
INSERT INTO Pickup VALUES (9, 100000.99, TO_DATE('15/10/2024', 'DD/MM/YYYY'), 'Cash','2G2303D3', 'S0002','acc004','44332211',1, 'Delivering'
                          );
INSERT INTO Pickup VALUES (10, 3.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Credit','B0F13D01', 'H0001','acc005','99887766',0.12, 'Placed'
                          );

INSERT INTO Pickup VALUES (11, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'S0002','acc006','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (12, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'T0001','acc006','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (13, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'P0001','acc006','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (14, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'S0002','acc007','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (15, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'T0001','acc007','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (16, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'P0001','acc007','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (17, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'S0002','acc008','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (18, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'T0001','acc008','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (19, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'P0001','acc008','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (20, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'S0002','acc009','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (21, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'T0001','acc009','12345678',1, 'Complete'
                          );

INSERT INTO Pickup VALUES (22, 10.99, TO_DATE('17/12/2015', 'DD/MM/YYYY'), 'Debit', NULL, 'P0001','acc009','12345678',1, 'Complete'
                          );




-- Consists: Delivery
INSERT INTO Consists_Delivery (order_id, food_name, quantity) VALUES (1, 'americano', 1);

INSERT INTO Consists_Delivery (order_id, food_name, quantity) VALUES (2, 'cheese_burger', 2);

INSERT INTO Consists_Delivery (order_id, food_name, quantity) VALUES (3, 'caesar_salad', 3);

INSERT INTO Consists_Delivery (order_id, food_name, quantity) VALUES (4, 'roasted_chicken_sub', 4);

INSERT INTO Consists_Delivery (order_id, food_name, quantity) VALUES (5, 'main_bowl', 1);

-- Consists: Pickup
INSERT INTO Consists_Pickup (order_id, food_name, quantity) VALUES (6, 'americano', 2);

INSERT INTO Consists_Pickup (order_id, food_name, quantity) VALUES (7, 'cheese_burger', 3);

INSERT INTO Consists_Pickup (order_id, food_name, quantity) VALUES (8, 'caesar_salad', 4);

INSERT INTO Consists_Pickup (order_id, food_name, quantity) VALUES (9, 'roasted_chicken_sub', 1);

INSERT INTO Consists_Pickup (order_id, food_name, quantity) VALUES (10, 'main_bowl', 2);


INSERT INTO RestaurantOTD VALUES('Starbucks');
INSERT INTO RestaurantOTD VALUES('Pacific_Poke');
INSERT INTO RestaurantOTD VALUES('Triple_Os');

COMMIT;