const express = require('express');

const axios = require('axios');

const qs = require('qs');

const api_key = '';

const app = express();

const port = 3000;

app.get('/summoner_name', async (req, res) => {
    const params = qs.parse(req.query);

    const ids = await obtainSummonerIds(params.name, params.tag);

    const count = 10;

    let last_idx = 0;

    const promise_arr = [];

    while(curr_page){
        const curr_page = await obtainMatchHistory(ids.puuid, last_idx, count);

        for(const match_id of curr_page){
            promise_arr.push(match_id);
        }

        last_idx += count;
    }

    const resolved_matches = await Promise.all(promise_arr);

    res.send(resolved_matches);
});
  
app.listen(port, () => {
    console.log(`Express rodando na porta ${port}`)
})

async function obtainSummonerIds(account_name, tag_line = 'BR1'){
    const api_url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${account_name}/${tag_line}?api_key=${api_key}`;

    const response = await axios.get(api_url);
    
    return response.data;
}

async function obtainMatchHistory(puuid, index, count){
    const api_url = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${index}&count=${count}&api_key=${api_key}`;

    const response = await axios.get(api_url);
    
    return response.data;
}

async function obtainMatchDetails(match_id){
    const api_url = `https://americas.api.riotgames.com/lol/match/v5/matches/${match_id}?api_key=${api_key}`;

    const response = await axios.get(api_url);
    
    return response.data;
}