const axios = require("axios");

const options = {
    method: 'GET',
    url: 'https://videogames-news2.p.rapidapi.com/videogames_news/search_news',
    headers: {
        'X-RapidAPI-Key': '4290b1fda9msh8241662d167c40ep1da90ajsn6e448db68dfe',
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