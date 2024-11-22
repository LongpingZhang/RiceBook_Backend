let articles = [
    { id: 0, author: 'user1', body: 'Post 1', comments: [] },
    { id: 1, author: 'user2', body: 'Post 2', comments: [] },
    { id: 2, author: 'user3', body: 'Post 3', comments: [] },
];

// GET /articles/:id?
function getArticles (req, res) {
    const { id } = req.params;

    // Fetch a specific article by ID (either articleId or username)
    if (id) {
        const article = articles.filter(a => a.id == id || a.author === id);
        if (!article) {
            return res.status(404).send({ error: 'Article not found' });
        }
        return res.send({ articles: [article] });
    }

    // Fetch all articles for logged-in user
    const userArticles = articles.filter(a => a.author === req.username);
    res.send({ articles: userArticles });
}

// PUT /articles/:id
function updateArticles(req, res) {
    const { id } = req.params;
    const { text, commentId } = req.body;

    const article = articles.find(a => a.id == id);

    if (!article) {
        return res.status(404).send({ error: 'Article not found' });
    }

    // If the user is not the owner of the article, they cannot edit it
    if (article.author !== req.username) {
        return res.sendStatus(403);
    }

    if (commentId === undefined) {
        // Update the article text
        article.body = text || article.body;
    } else if (commentId === -1) {
        // Add a new comment
        const newComment = {
            id: article.comments.length,
            author: req.username,
            text,
        };
        article.comments.push(newComment);
    } else {
        // Update an existing comment
        const comment = article.comments.find(c => c.id == commentId);
        // Check if the author of the comment
        if (!comment || comment.author !== req.username) {
            return res.sendStatus(403);
        }
        comment.text = text || comment.text;
    }

    res.send({ articles: [article] });
}

// POST /article
function addArticle(req, res) {
    const { text } = req.body;

    if (!text) {
        return res.status(400).send({ error: 'Text is required' });
    }

    const newArticle = {
        id: articles.length,
        author: req.username,
        body: text,
        date: new Date(),
        comments: [],
    };

    articles.push(newArticle);
    res.send({ articles: [newArticle] });
}

module.exports = (app) => {
    app.get('/articles', getArticles);
    app.put('/articles', updateArticles);
    app.post('/article', addArticle);
}