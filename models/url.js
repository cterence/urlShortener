const { Pool } = require("pg");
const shortId = require("shortid")

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
});

const createShortUrl = async (url) =>
    await pool.query("INSERT INTO urls(fullUrl, shortUrl) VALUES ($1, $2)", [
        url,
        shortId.generate(),
    ]);

const getUrl = async (shortUrl) => await pool.query("SELECT * FROM urls WHERE shorturl = $1", [
    shortUrl,
]);

const getUrls = async () => await pool.query("SELECT * FROM urls");

const updateClicks = async (clicks, shortUrl) => await pool.query(
    "UPDATE urls SET clicks = $1 WHERE shorturl = $2",
    [clicks, shortUrl]
);

const deleteUrl = async (shortUrl) => await pool.query("DELETE FROM urls WHERE shorturl = $1", [
    shortUrl,
]);


module.exports = {
    createShortUrl,
    getUrl,
    getUrls,
    updateClicks,
    deleteUrl
}