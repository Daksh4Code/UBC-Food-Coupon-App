async function deliveryGenTest() {


    try {

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];

        const response = await fetch('/delivery/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                total_cost: 100.00,
                order_date: formattedDate,
                payment_method: 'Credit Card',
                promo_code: 'DISCOUNT10',
                coupon_id: '2G2303D3',
                branch_id: 'S0002',
                account_id: 'acc001',
                sid: 12345678,
                delivery_cost: 10.00,
                delivery_status: 'Pending',
                delivery_time: 1.0
            })
        });


    } catch (error) {
        console.error("unable to fetch table")
    }
}

deliveryGenTest();