-- Insert order
INSERT INTO Delivery (order_id,total_cost,order_date,payment_method,promo_code,coupon_id,branch_id,account_id,sid,delivery_cost,delivery_status,delivery_time)
VALUES (:order_id, :total_cost, :order_date, :payment_method, :promo_code, :coupon_id, :branch_id, :account_id, :sid, :delivery_cost, :delivery_status, :delivery_time);

-- Update order to be delivered
UPDATE Delivery
SET delivery_status = :delivery_status
WHERE order_id = :order_id;

-- View delivery order details
SELECT *
FROM Delivery
WHERE order_id = :order_id;

