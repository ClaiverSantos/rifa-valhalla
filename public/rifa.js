const whatsappNumber = '5514998838837'; // Seu número do WhatsApp
let numerosSelecionados = [];

// URL do seu backend - inclua a rota completa /rifa-data
const BACKEND_URL = 'https://projeto-rifa-i5zxmilh8-claiver-santos-projects.vercel.app/rifa-data';

async function carregarDadosDaRifa() {
  try {
    const response = await fetch('https://projeto-rifa-i5zxmilh8-claiver-santos-projects.vercel.app/rifa-data', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados recebidos:', data);
    
    const grid = document.getElementById('gridRifa');
    if (!grid) throw new Error('Elemento gridRifa não encontrado');
    
    // Limpa o grid antes de renderizar
    grid.innerHTML = '';
    
    let total = 0;
    let vendidos = 0;
    let disponiveis = 0;

    // Verifica se os dados têm o formato esperado
    if (!Array.isArray(data)) {
      throw new Error('Formato de dados inválido');
    }

    // Renderiza cada número
    data.forEach(row => {
      if (!Array.isArray(row) || row.length < 3) return;
      
      total++;
      const numero = row[0]?.toString().trim() || '';
      const nome = row[1]?.toString().trim() || '';
      const status = row[2]?.toString().toLowerCase().trim() || '';

      const div = document.createElement('div');
      div.classList.add('numero');
      
      // Verifica se está disponível (inclui variações de escrita)
      if (status.includes('dispon') || status === '') {
        disponiveis++;
        div.textContent = numero;
        div.classList.add('disponivel');
        div.addEventListener('click', () => toggleSelecao(numero, div));
      } else {
        vendidos++;
        div.textContent = 'X';
        div.classList.add('vendido');
      }

      grid.appendChild(div);
    });

    // Atualiza contadores
    atualizarContadores(total, vendidos, disponiveis);
    
  } catch (err) {
    console.error('Erro ao carregar os dados:', err);
    mostrarErro('Erro ao carregar os números da rifa. Recarregue a página.');
  }
}

// Função auxiliar para atualizar contadores
function atualizarContadores(total, vendidos, disponiveis) {
  const contador = document.getElementById('contador');
  if (contador) {
    contador.innerText = `Total: ${total} | Vendidos: ${vendidos} | Disponíveis: ${disponiveis}`;
  }

  const progressoInterno = document.getElementById('progressoInterno');
  if (progressoInterno) {
    const percentualVendido = total > 0 ? (vendidos / total) * 100 : 0;
    progressoInterno.style.width = `${percentualVendido}%`;
  }
}

// Função para mostrar erros
function mostrarErro(mensagem) {
  const errorElement = document.createElement('div');
  errorElement.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    background: #ff4444;
    color: white;
    border-radius: 5px;
    z-index: 1000;
    max-width: 80%;
    text-align: center;
  `;
  errorElement.textContent = mensagem;
  document.body.appendChild(errorElement);
  
  setTimeout(() => errorElement.remove(), 5000);
}
// Função para mostrar erros de forma amigável
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    background: #ff4444;
    color: white;
    border-radius: 5px;
    z-index: 1000;
    max-width: 80%;
    text-align: center;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
function toggleSelecao(numero, elemento) {
  const index = numerosSelecionados.indexOf(numero);
  if (index > -1) {
    numerosSelecionados.splice(index, 1);
    elemento.classList.remove('selecionado');
  } else {
    numerosSelecionados.push(numero);
    elemento.classList.add('selecionado');
  }
  atualizarBotao();
}

function atualizarBotao() {
  const btn = document.getElementById('btnReservar');
  if (!btn) return;
  
  if (numerosSelecionados.length > 0) {
    btn.style.display = 'inline-block';
    btn.textContent = `Reservar ${numerosSelecionados.length} número(s)`;
  } else {
    btn.style.display = 'none';
  }
}

document.getElementById('btnReservar')?.addEventListener('click', () => {
  if (numerosSelecionados.length === 0) return;

  const mensagem = `Olá, quero reservar o(s) número(s): ${numerosSelecionados.join(', ')}.`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
});

// Carrega os dados quando a página estiver pronta
document.addEventListener('DOMContentLoaded', carregarDadosDaRifa);