const API_KEY = '25a159d8a2ed4f7faffbe7a8bf3b4572';
const BASE_URL = 'https://api.rawg.io/api';

async function searchGames(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=10`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao pesquisar jogos:', error);
    return [];
  }
}

async function getGameDetails(gameId) {
  try {
    const response = await fetch(
      `${BASE_URL}/games/${gameId}?key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter detalhes do jogo:', error);
    return null;
  }
}