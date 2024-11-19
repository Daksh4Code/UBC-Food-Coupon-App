async function deliveryGenTest() {
    // const tableElement = document.getElementById('couponTable');
    // const tableBody = tableElement.querySelector('tbody');

    try {

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];  // Extracts the date part (YYYY-MM-DD)

        const response = await fetch('/delivery/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Set the content type to JSON
            },
            body: JSON.stringify({
                total_cost: 100.00,  // Example value
                order_date: formattedDate,  // Example ISO 8601 date
                payment_method: 'Credit Card',  // Example value
                promo_code: 'DISCOUNT10',  // Example promo code
                coupon_id: '2G2303D3',  // Example coupon ID
                branch_id: 'S0002',  // Example branch ID
                account_id: 'acc001',  // Example account ID
                sid: 12345678,  // Example sid
                delivery_cost: 10.00,  // Example delivery cost
                delivery_status: 'Pending',  // Example delivery status
                delivery_time: 1.0  // Example delivery time
            })
        });


    } catch (error) {
        console.error("unable to fetch table")
    }
}

deliveryGenTest();