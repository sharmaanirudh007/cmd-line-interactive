const fetch = require("axios");

module.exports = async function fetchPrice(token){
    token = token.trim();
    let urls = process.env.API_URL.concat(`?fsym=${token}&tsyms=USD&api_key=${process.env.API_SECRET}`)
    const response = await fetch.get(urls);
    return response.data;
}


