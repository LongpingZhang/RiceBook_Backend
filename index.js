const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {authRoutes} = require('./auth.js');
const articlesRoutes = require('./articles');
const profileRoutes = require('./profile.js');
const followingRoutes = require('./following.js');

let corsOptions = {
    origin: ['http://localhost:3000'],
}

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Authorization required except for login and registration
authRoutes(app);
articlesRoutes(app);
profileRoutes(app);
followingRoutes(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});