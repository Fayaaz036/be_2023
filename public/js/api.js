const axios = require("axios");

const getVideoGamesNews = {
    method: 'GET',
    url: 'https://videogames-news2.p.rapidapi.com/videogames_news/recent',
    headers: {
        'X-RapidAPI-Key': '92c911c05fmshf12c9b883dc8b01p195452jsna31390874f81',
        'X-RapidAPI-Host': 'videogames-news2.p.rapidapi.com'
    }
};

axios.request(getVideoGamesNews).then(function (response) {
    // console.log(response.data);
}).catch(function (error) {
    console.error(error);
});
module.exports = {
    getVideoGamesNews,
};