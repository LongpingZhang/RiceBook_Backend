let followingData = {
    user1: ['user2', 'user3'],
    user2: ['user3'],
    user3: [],
};

// GET /following/:user?
function getFollowing(req, res) {
    const username = req.params.user;
    const targetUser = username || req.username;

    if (!followingData[targetUser]) {
        return res.status(404).send({ error: 'User not found' });
    }

    res.send({ username: targetUser, following: followingData[targetUser] });
}

// PUT /following/:user
function addFollowing(req, res) {
    const username = req.params.user;

    if (!username) {
        return res.status(400).send({ error: 'Username to follow is required' });
    }

    if (username === req.username) {
        return res.status(400).send({ error: 'Cannot follow yourself' });
    }

    // Ensure the logged-in user has an entry in the following data
    if (!followingData[req.username]) {
        followingData[req.username] = [];
    }

    // Add the user to the following list if not already followed
    if (!followingData[req.username].includes(username)) {
        followingData[req.username].push(username);
    }

    res.send({ username: req.username, following: followingData[req.username] });
}

// DELETE /following/:user
function removeFollowing(req, res) {
    const username = req.params.user;

    if (!username) {
        return res.status(400).send({ error: 'Username to unfollow is required' });
    }

    if (!followingData[req.username] || !followingData[req.username].includes(username)) {
        return res.status(400).send({ error: 'User not in following list' });
    }

    // Remove the user from the following list
    followingData[req.username] = followingData[req.username].filter(u => u !== username);

    res.send({ username: req.username, following: followingData[req.username] });
}

module.exports = (app) => {
    app.get('/following', getFollowing);
    app.put('/following', addFollowing);
    app.delete('/following', removeFollowing);
}