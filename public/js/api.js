const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://videogames-news2.p.rapidapi.com/videogames_news/recent',
    headers: {
        'X-RapidAPI-Key': '92c911c05fmshf12c9b883dc8b01p195452jsna31390874f81',
        'X-RapidAPI-Host': 'videogames-news2.p.rapidapi.com'
    }
};

async function getVideoGamesNews() {
    let data = await axios.request(options).then(function (response) {
        return response.data
    }).catch(function (error) {
        console.error(error);
    });

    return data;
}

module.exports = {
    getVideoGamesNews,
};