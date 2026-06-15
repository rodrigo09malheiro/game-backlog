// =====================
// ESTADO DA APLICAÇÃO
// =====================
let backlog = JSON.parse(localStorage.getItem('backlog')) || [];

// =====================
// GUARDAR NO LOCALSTORAGE
// =====================
function guardarBacklog() {
  localStorage.setItem('backlog', JSON.stringify(backlog));
}

// =====================
// PESQUISA DE JOGOS
// =====================
document.getElementById('search-btn').addEventListener('click', async () => {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  const resultadosContainer = document.getElementById('results-container');
  resultadosContainer.innerHTML = '<p>A pesquisar...</p>';

  const jogos = await searchGames(query);

  if (jogos.length === 0) {
    resultadosContainer.innerHTML = '<p>Nenhum jogo encontrado.</p>';
    return;
  }

  resultadosContainer.innerHTML = jogos.map(jogo => `
    <div class="card-resultado">
      <img src="${jogo.background_image || 'https://via.placeholder.com/150'}" alt="${jogo.name}" />
      <div class="card-info">
        <h3>${jogo.name}</h3>
        <p>⭐ ${jogo.rating ?? 'N/A'} &nbsp;|&nbsp; 🎮 ${jogo.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
        <button onclick="adicionarAoBacklog(${jogo.id}, '${jogo.name.replace(/'/g, "\\'")}', '${jogo.background_image || ''}')">
          + Adicionar ao Backlog
        </button>
      </div>
    </div>
  `).join('');
});

// Pesquisar ao pressionar Enter
document.getElementById('search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('search-btn').click();
});

// =====================
// ADICIONAR AO BACKLOG
// =====================
function adicionarAoBacklog(id, nome, imagem) {
  const existe = backlog.find(j => j.id === id);
  if (existe) {
    alert(`"${nome}" já está no teu backlog!`);
    return;
  }

  backlog.push({
    id,
    nome,
    imagem,
    estado: 'a-jogar',
    nota: 0,
    dataAdicionado: new Date().toISOString()
  });

  guardarBacklog();
  alert(`"${nome}" adicionado ao backlog!`);
}