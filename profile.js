const md5 = require('md5');

const { userObjs} = require('./auth.js');

// GET /headline/:user?
function getHeadline(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, email: userObjs[targetUser].headline });
}

// PUT /headline
function updateHeadline(req, res) {
    const { headline } = req.body;

    if (!headline) {
        return res.status(400).send({ error: 'Headline is required' });
    }

    // Update the headline for the logged-in user
    userObjs[req.username].headline = headline;

    res.send({ username: req.username, headline });
}

// Helper function to validate user existence
function validateUser(targetUser, res) {
    if (!userObjs[targetUser]) {
        return res.status(404).send({ error: 'User not found' });
    }
    return true;
}

// GET /email/:user?
function getEmail(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, email: userObjs[targetUser].email });
}

// PUT /email
function updateEmail(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: 'Email is required' });
    }

    userObjs[req.username].email = email;
    res.send({ username: req.username, email });
}

// GET /zipcode/:user?
function getZipcode(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, zipcode: userObjs[targetUser].zipcode });
}

// PUT /zipcode
function updateZipcode(req, res) {
    const { zipcode } = req.body;

    if (!zipcode) {
        return res.status(400).send({ error: 'Zipcode is required' });
    }

    userObjs[req.username].zipcode = zipcode;
    res.send({ username: req.username, zipcode });
}

// GET /dob/:user?
function getDob(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, dob: userObjs[targetUser].dob });
}

// GET /avatar/:user?
function getAvatar(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, avatar: userObjs[targetUser].avatar });
}

// PUT /avatar
function updateAvatar(req, res) {
    const { avatar } = req.body;

    if (!avatar) {
        return res.status(400).send({ error: 'Avatar URL is required' });
    }

    userObjs[req.username].avatar = avatar;
    res.send({ username: req.username, avatar });
}

// PUT /password
function updatePassword(req, res) {
    const newPassword = req.body.password;
    const username = req.username;

    if (!newPassword) {
        return res.status(400).send({ error: 'Password is required' });
    }

    // Placeholder for real password hashing
    const newSalt = username + newPassword;
    const newHash = md5(newSalt + newPassword);
    userObjs[username].salt = newSalt;
    userObjs[username].hash = newHash;

    res.send({ username: req.username, result: 'success' });
}

// GET /phone/:user?
function getPhone(req, res) {
    const targetUser = req.params.user || req.username;

    if (!validateUser(targetUser, res)) return;

    res.send({ username: targetUser, phone: userObjs[targetUser].phone });
}

// PUT /phone
function updatePhone(req, res) {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).send({ error: 'Phone number is required' });
    }

    userObjs[req.username].phone = phone;
    res.send({ username: req.username, phone });
}

module.exports = (app) => {
    app.get('/headline', getHeadline);
    app.put('/headline', updateHeadline);

    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);

    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);

    app.get('/dob/:user?', getDob);

    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', updateAvatar);

    app.put('/password', updatePassword);

    app.get('/phone/:user?', getPhone);
    app.put('/phone', updatePhone);
}