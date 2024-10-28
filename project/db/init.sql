`
SQL script for testing:

`

CREATE TABLE Food (
	food_name VARCHAR PRIMARY KEY, 
	type VARCHAR,
    calories INTEGER,
    size VARCHAR,
    branch_id CHAR(5) NOT NULL,
    FOREIGN KEY (type, calories, size) REFERENCES Food_Information (cost, calories) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch (branch_id) ON DELETE CASCADE
);

CREATE TABLE Food_Information (
    calories INTEGER,
	type VARCHAR,
    size VARCHAR,
    nutritional_score INTEGER,
    PRIMARY KEY (type, calories, size)
);


CREATE TABLE Food_Cost (
    size VARCHAR PRIMARY KEY,
    cost DECIMAL(4,2)
    FOREIGN KEY (size) REFERENCES Food_Information(size)
);

CREATE TABLE Restaurant (
	name VARCHAR PRIMARY KEY, 
	type VARCHAR,
);

CREATE TABLE Branch (
	branch_id CHAR(5) PRIMARY KEY, 
	street_address VARCHAR,
	restaurant_name VARCHAR NOT NULL,
	FOREIGN KEY (restaurant_name) REFERENCES Restaurant ON DELETE CASCADE
);

CREATE TABLE Sells (
	food_name CHAR(8),
    branch_id CHAR(5),
    PRIMARY KEY (food_name, branch_id)
    FOREIGN KEY (food_name) REFERENCES Food ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES Branch ON DELETE CASCADE
);


CREATE TABLE Coupon (
	coupon_id CHAR(8) PRIMARY KEY, 
	branch_id CHAR(5) NOT NULL,
	dc_percent FLOAT,
	number_of_uses INTEGER,
	FOREIGN KEY(branch_id) REFERENCES Branch ON DELETE CASCADE
);




`
Insert statements to populate the db
`

INSERT INTO Restaurant VALUES(‘Starbucks’, ‘cafe’)
INSERT INTO Restaurant VALUES(‘Triple_Os’, ‘restaurant’)
INSERT INTO Restaurant VALUES(‘Harvest’, ‘grocery_store’)
INSERT INTO Restaurant VALUES(‘Subway’, ‘restaurant’)
INSERT INTO Restaurant VALUES(‘Pacific_Poke’, ‘restaurant’)

INSERT INTO Branch VALUES(‘S0002’, ‘6138 Student Union Blvd’, ‘Starbucks’)
INSERT INTO Branch VALUES(‘T0001’, ‘2015 Main Mall’, ‘Triple_Os’)
INSERT INTO Branch VALUES(‘H0001’, ‘6445 University Blvd’, ‘Harvest’)
INSERT INTO Branch VALUES(‘S0001’, ‘6138 Student Union Blvd’, ‘Subway’)
INSERT INTO Branch VALUES(‘P0001’, ‘6138 Student Union Blvd’, ‘Pacific_Poke’)

INSERT INTO Sells VALUES(‘americano’, ‘S0002’)
INSERT INTO Sells VALUES(‘cheese_burger’, ‘T0001’)
INSERT INTO Sells VALUES(‘ceasar_salad’, ‘H0001’)
INSERT INTO Sells VALUES(‘roasted_chicken_sub’, ‘S0001’)
INSERT INTO Sells VALUES(‘main_bowl’, ‘P0001’)

INSERT INTO Coupon VALUES(‘2G2303D3’, ‘S0002’, 0.15, 4)
INSERT INTO Coupon VALUES(‘B152R99G’, ‘T0001’, 0.25, 2)
INSERT INTO Coupon VALUES(‘K0E5G001’, ‘H0001’, 0.02, 1)
INSERT INTO Coupon VALUES(‘B0F13D01’, ‘H0001’, 0.05, 0)
INSERT INTO Coupon VALUES(‘P0F33N20’, ‘P0001’, 0.10, 0)

INSERT INTO Food_Information VALUES(10, ‘beverage’, ‘small’, 1)
INSERT INTO Food_Information VALUES(930, ‘food’, ‘large’, 3)
INSERT INTO Food_Information VALUES(316, ‘food’, ‘regular’, 8)
INSERT INTO Food_Information VALUES(207, ‘food’, ‘foot_long’,  6)
INSERT INTO Food_Information VALUES(850, ‘food’, ‘regular’,  7)


INSERT INTO Food_Cost VALUES(‘small’, 5.45)
INSERT INTO Food_Cost VALUES(‘large’, 12.00)
INSERT INTO Food_Cost VALUES(‘regular’, 8.00)
INSERT INTO Food_Cost VALUES(‘foot_long’, 8.79)
INSERT INTO Food_Cost VALUES(‘regular’, 18.00)


INSERT INTO Food VALUES(‘americano’, ’food’, 10, ‘small’, ‘S0002’)
INSERT INTO Food VALUES(‘cheese_burger’, ’food’, 930, ‘large’, ‘T0001’)
INSERT INTO Food VALUES(‘ceasar_salad’, ’food’, 316,‘regular’, ‘H0001’)
INSERT INTO Food VALUES(‘roasted_chicken_sub’, ’food’, 207, ‘foot_long’, ‘S0001’)
INSERT INTO Food VALUES(‘main_bowl’, ’food’, 850,‘regular’, ‘P0001’)

