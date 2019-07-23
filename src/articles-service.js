const ArticlesService = {
    getAllArticles(knex) {
        return knex.select('*').from('blogful_articles');
    },
    insertArticle(knex, article) {
        return knex
                .insert(article)
                .into('blogful_articles')
                .returning('*')
                .then(rows => {
                    return rows[0]
                })
    },
    getById(knex, id) {
        return knex.select('*').from('blogful_articles').where('id', id).first();
    },
    deleteArticle(knex, id) {
        return knex('blogful_articles').where({ id }).delete();
    },
    updateArticle(knex, id, content) {
        return knex('blogful_articles').where({ id }).update(content);
    }
};

module.exports = ArticlesService;