const md5 = require('md5');

let sessionUser = {};
let cookieKey = "sid";
let userObjs = {
    'user1': {
        username: 'user1',
        email: 'user1@example.com',
        dob: 987654321000, // Milliseconds since epoch (e.g., Jan 1, 2001)
        phone: '555-555-5555',
        zipcode: '90210',
        avatar: 'https://www.example.com/avatar.jpg',
        salt: 'user1',
        hash: '7d1b5a4329b6478e976508ab9a49ee3d', // Hash of password (MD5): user1
    },
    'user2': {
        username: 'user2',
        email: 'user2@example.com',
        dob: 987654321000, // Milliseconds since epoch (e.g., Jan 1, 2001)
        phone: '555-555-5555',
        zipcode: '90210',
        avatar: 'https://www.example.com/avatar.jpg',
        salt: 'user2',
        hash: '72881e285cdb0f9370dcdf1db0d9a869', // Hash of password (MD5): user2
    },
    'user3': {
        username: 'user3',
        email: 'user3@example.com',
        dob: 987654321000, // Milliseconds since epoch (e.g., Jan 1, 2001)
        phone: '555-555-5555',
        zipcode: '90210',
        avatar: 'https://www.example.com/avatar.jpg',
        salt: 'user3',
        hash: '16bd93afc66e593f3aeedecdf1201ee6', // Hash of password (MD5): user3
    }
};

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let user = userObjs[username];

    if (!user) {
        return res.sendStatus(401)
    }

    // Create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user.salt + password);

    if (hash === user.hash) {
        // TODO: create session id, use sessionUser to map sid to user username
        // let sid = md5(username + new Date().getTime());
        let sid = md5(username);
        sessionUser[sid] = username;

        // Adding cookie for session id
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true });
        let msg = {username: username, result: 'success'};
        res.send(msg);
    }
    else {
        res.sendStatus(401);
    }
}

function register(req, res) {
    const { username, email, dob, phone, zipcode, password } = req.body;

    // Validate input
    if (!username || !email || !dob || !phone || !zipcode || !password) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    if (userObjs[username]) {
        return res.status(400).send({ error: 'User already exists' });
    }

    // TODO: Change this to use md5 to create a hash
    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    // TODO: Change this to store object with username, salt, hash
    userObjs[username] =  {
        username,
        email,
        dob,
        phone,
        zipcode,
        salt,
        hash,
    };

    res.send({username: username, result: 'success'});
}

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    let username = sessionUser[sid];

    // no username mapped to sid
    if (username) {
        req.username = username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}

function logout(req, res) {
    const sid = req.cookies[cookieKey];

    if (sessionUser[sid]) {
        delete sessionUser[sid];
    }

    res.clearCookie(cookieKey); // Remove the session cookie
    res.send({ result: 'success' });
}


module.exports = {
    userObjs,
    authRoutes: (app) => {
        app.post('/login', login);
        app.post('/register', register);
        app.use(isLoggedIn);
        app.put('/logout', logout);
        // app.put('/password', password);
    },
};
