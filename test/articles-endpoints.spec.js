const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeArticlesArray } = require('./articles.fixtures');

describe.only(`Articles Endpoints`, () => {
    let db;
    const testArticles = makeArticlesArray();
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    });
    after('disonnect from db', () => db.destroy());

    before('clean the table', () => db('blogful_articles').truncate())

    describe(`GET /articles`, () => {
        context(`given there are articles in the database`, () => {        
            beforeEach(`insert articles`, () => {
                return db
                        .into('blogful_articles')
                        .insert(testArticles)
            })
            afterEach(`clear tables`, () => db('blogful_articles').truncate())

            it(`returns 200 and all of the articles`, () => {
                return supertest(app)
                        .get('/articles')
                        .set({ Authorization: "Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445" })
                        .expect(200, testArticles)
            })
        })
        context(`given no articles`, () => {
            it(`responds with 200 and an empty list`, () => {
                supertest(app)
                    .get('/articles')
                    .set({ Authorization: "Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445" })
                    .expect(200, '[]')
                    .end()
            })
        })
    })

    describe(`GET /articles/:articleId`, () => {
        context(`given there are articles in the database`, () => {
            beforeEach(`insert articles`, () => {
                return db
                        .into('blogful_articles')
                        .insert(testArticles)
            })
            afterEach(`clear tables`, () => db('blogful_articles').truncate())

            it(`GET /article/:articleId returns 200 and the specified article`, () => {
                const articleId = 2;
                const expectedArticle = testArticles[articleId - 1];
                return supertest(app)
                        .get(`/articles/${articleId}`)
                        .set({ Authorization: "Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445" })
                        .expect(200, expectedArticle)
            })
        });
        context(`given no articles`, () => {
            const testArticles = makeArticlesArray();
            beforeEach(`insert articles`, () => {
                return db
                        .into('blogful_articles')
                        .insert(testArticles)
            })
            afterEach(`clear tables`, () => db('blogful_articles').truncate())
            it(`responds with 404`, () => {
                const id = 123456;
                return supertest(app)
                        .get(`/articles/${id}`)
                        .set({ Authorization: "Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445" })
                        .expect(404, { error: { message: 'Article doesn\'t exist!' } })
            })
        })
    })

    describe('POST /articles', () => {
        it(`creates an article, responding with 201 and the created content`, () => {
            return supertest(app)
                        .post({
                            title: 'zip',
                            style: 'Listicle',
                            content: 'zop zam zome zoom zune'
                        })
                        .set({ "Authorization": "Bearer 706fe381-bd4f-4e59-af15-cfc31b3ed445" })
                        .expect(201)
        })
    })
})