const express = require('express');
const app = express();
app.listen(3000, () => {
    console.log("Готов к работе...");
});
app.set('view engine', 'ejs');


app.get('/:number/news/for/:category', async (req, res) => {
    const number = req.params.number;
    const category = req.params.category;

    const rssUrl = `https://www.vedomosti.ru/rss/rubric/${category}.xml`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(response.status);
        }

        const data = await response.json();

        const items = [];
        let i = 0;
        while (i < number && i < data.items.length) {
            items.push(data.items[i]);
            i++;
        }

        res.render('news', {
            number: number,
            category: category,
            items: items
        });

    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Ошибка при получении новостей' });
    }
});