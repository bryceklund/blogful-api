module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.TEST_DB_URL || 'postgresql://dunder-mifflin@localhost/blogful',
    API_KEY: process.env.API_KEY
}