//script to set up environment derived from CPSC304 Javascript/Oracle Tutorial
const express = require('express');
const path = require('path');

const appController = require('./controllers/appController');
const couponController = require('./controllers/couponController')
//const userController = require('./controllers/userController')
//const feedbackController = require('./controllers/feedbackController')
//const feedbackController = require('./controllers/feedbackController')
//const deliveryController = require('./controllers/deliveryController')
//const pickupController = require('./controllers/pickupController')


// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');



const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)
app.use(express.static(path.join(__dirname, 'public'), {index: 'main.html'}));

// Middleware setup
app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads
// If you prefer some other file as default page other than 'index.html',
//      you can adjust and use the bellow line of code to
//      route to send 'DEFAULT_FILE_NAME.html' as default for root URL

// mount the router
app.use('/', appController);
app.use('/coupons', couponController);
//app.use('/delivery', deliveryController);
//app.use('/pickup', pickupController);
//app.use('/users', userController);
//app.use('/feedbacks', feedbackController);
//app.use('/coupons', couponController);
// app.use('/users', userController);
// app.use('/feedbacks', feedbackController);

// ----------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});