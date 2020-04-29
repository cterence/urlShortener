require("dotenv").config();

const express = require("express");

const { createShortUrl, getUrl, getUrls, updateClicks, deleteUrl } = require("./models/url");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
    const shortUrls = await getUrls();
    res.render("index", { shortUrls: shortUrls.rows });
});

app.post("/shortenUrl", async (req, res) => {
    if (req.body.fullUrl === null) return res.sendStatus(404);
    await createShortUrl(req.body.fullUrl)
    res.redirect("/");
});

app.get("/delete/:shortUrl", async (req, res) => {
    if (req.params.shortUrl === null) return res.sendStatus(404);
    await deleteUrl(req.params.shortUrl);
    res.redirect("/");
});


app.get("/:shortUrl", async (req, res) => {
    const result = await getUrl(
        req.params.shortUrl);

    if (!result.rows.length) return res.sendStatus(404);

    const shortUrl = result.rows[0];
    await updateClicks(parseInt(shortUrl.clicks) + 1, shortUrl.shorturl);

    res.redirect(shortUrl.fullurl);
});


app.listen(3000);
