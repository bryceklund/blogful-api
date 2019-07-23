require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const ArticlesService = require('./articles-service');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_KEY;
    const authToken = req.get('Authorization');

    if (!apiToken || authToken.split(' ')[1] !== apiToken) {
        console.error(`Unauthorized request to path ${req.path}.`)
        res.status(401).json({ error: 'Unauthorized request' })
    };
    next();
});

app.get('/articles', (req, res, next) => {
    const knexInstance = req.app.get('db');
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
});

app.get('/articles/:article_id', (req, res, next) => {
    const knexInstance = req.app.get('db');
    ArticlesService.getById(knexInstance, req.params.article_id)
        .then(article => {
            if (!article) {
                res.status(404).json({
                    error: {
                        message: 'Article doesn\'t exist!'
                    }
                })
            }
            res.json(article)
        })
        .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
})

module.exports = app;