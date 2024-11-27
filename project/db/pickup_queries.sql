-- Insert order
INSERT INTO Pickup (order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,pickup_time,pickup_status)
VALUES (:order_id, :total_cost, :order_date, :payment_method, :promo_code, :coupon_id, :branch_id, :account_id, :sid, :pickup_time, :pickup_status);

-- Update order to be picked up
UPDATE Pickup
SET pickup_status = :delivery_status
WHERE order_id = :order_id;

-- View delivery order details
SELECT *
FROM Pickup
WHERE order_id = :order_id;
