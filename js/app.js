// =====================
// ESTADO DA APLICAÇÃO
// =====================
let backlog = JSON.parse(localStorage.getItem('backlog')) || [];
let filtroAtual = 'todos';

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
  renderBacklog();
  alert(`"${nome}" adicionado ao backlog!`);
}

// =====================
// REMOVER DO BACKLOG
// =====================
function removerDoBacklog(id) {
  if (!confirm('Tens a certeza que queres remover este jogo?')) return;
  backlog = backlog.filter(j => j.id !== id);
  guardarBacklog();
  renderBacklog();
}

// =====================
// MUDAR ESTADO
// =====================
function mudarEstado(id, novoEstado) {
  const jogo = backlog.find(j => j.id === id);
  if (jogo) {
    jogo.estado = novoEstado;
    guardarBacklog();
    renderBacklog();
  }
}

// =====================
// DAR NOTA
// =====================
function darNota(id, nota) {
  const jogo = backlog.find(j => j.id === id);
  if (jogo) {
    jogo.nota = nota;
    guardarBacklog();
    renderBacklog();
  }
}

// =====================
// FILTROS
// =====================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroAtual = btn.dataset.filter;
    renderBacklog();
  });
});

// =====================
// RENDER DO BACKLOG
// =====================
function renderBacklog() {
  const container = document.getElementById('backlog-container');

  const jogosFiltrados = filtroAtual === 'todos'
    ? backlog
    : backlog.filter(j => j.estado === filtroAtual);

  if (jogosFiltrados.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nenhum jogo aqui ainda.</p>';
    return;
  }

  container.innerHTML = jogosFiltrados.map(jogo => `
    <div class="card-backlog">
      <img src="${jogo.imagem || 'https://via.placeholder.com/150'}" alt="${jogo.nome}" />
      <div class="card-info">
        <h3>${jogo.nome}</h3>

        <select onchange="mudarEstado(${jogo.id}, this.value)">
          <option value="a-jogar" ${jogo.estado === 'a-jogar' ? 'selected' : ''}>🎮 A Jogar</option>
          <option value="concluido" ${jogo.estado === 'concluido' ? 'selected' : ''}>✅ Concluído</option>
          <option value="abandonado" ${jogo.estado === 'abandonado' ? 'selected' : ''}>❌ Abandonado</option>
        </select>

        <div class="estrelas">
          ${[1,2,3,4,5].map(n => `
            <span onclick="darNota(${jogo.id}, ${n})" class="${n <= jogo.nota ? 'ativa' : ''}">★</span>
          `).join('')}
        </div>

        <button class="btn-remover" onclick="removerDoBacklog(${jogo.id})">🗑️ Remover</button>
      </div>
    </div>
  `).join('');
}

// =====================
// INICIAR APP
// =====================
renderBacklog();