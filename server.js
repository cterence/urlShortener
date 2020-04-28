require("dotenv").config();

const express = require("express");
const shortId = require("shortid");
const app = express();

const { Pool } = require("pg");
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const shortUrls = await pool.query("SELECT * FROM urls");
    res.render("index", { shortUrls: shortUrls.rows });
});

app.post("/shortenUrl", async (req, res) => {
    if (req.body.fullUrl === null) return res.sendStatus(404);
    await pool.query("INSERT INTO urls(fullUrl, shortUrl) VALUES ($1, $2)", [
        req.body.fullUrl,
        shortId.generate(),
    ]);
    res.redirect("/");
});

app.get("/delete/:shortUrl", async (req, res) => {
    if (req.params.shortUrl === null) return res.sendStatus(404);
    await pool.query("DELETE FROM urls WHERE shorturl = $1", [
        req.params.shortUrl,
    ]);
    res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
    const result = await pool.query("SELECT * FROM urls WHERE shorturl = $1", [
        req.params.shortUrl,
    ]);

    if (!result.rows.length) return res.sendStatus(404);

    const shortUrl = result.rows[0];
    const query = await pool.query(
        "UPDATE urls SET clicks = $1 WHERE shorturl = $2",
        [parseInt(shortUrl.clicks) + 1, shortUrl.shorturl]
    );

    res.redirect(shortUrl.fullurl);
});

app.listen(3000);
