const whatsappNumber = '5514998838837'; // Seu número do WhatsApp
let numerosSelecionados = [];

// URL do seu backend (substitua pela sua URL real)
const BACKEND_URL = 'https://projeto-rifa-i5zxmilh8-claiver-santos-projects.vercel.app'; // 👈 Substitua pelo seu URL

async function carregarDadosDaRifa() {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
    
    const data = await response.json();
    console.log('Dados recebidos:', data); // Para debug
    
    const grid = document.getElementById('gridRifa');
    if (!grid) throw new Error('Elemento gridRifa não encontrado');
    grid.innerHTML = '';
    
    let total = 0;
    let vendidos = 0;
    let disponiveis = 0;

    if (!data || data.length === 0) {
      throw new Error('Nenhum dado encontrado na planilha');
    }

    data.forEach(row => {
      if (row.length < 3) return;
      
      const numero = row[0]?.trim() || '';
      const nome = row[1]?.trim() || '';
      const status = (row[2]?.trim().toLowerCase()) || '';
      
      total++;

      const div = document.createElement('div');
      div.classList.add('numero');

      if (status.includes('disponível') || status.includes('disponivel')) {
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

    // Atualizar contador
    const contador = document.getElementById('contador');
    if (contador) {
      contador.innerText = `Total: ${total} | Vendidos: ${vendidos} | Disponíveis: ${disponiveis}`;
    }

    // Atualizar barra de progresso
    const percentualVendido = total > 0 ? (vendidos / total) * 100 : 0;
    const progressoInterno = document.getElementById('progressoInterno');
    if (progressoInterno) {
      progressoInterno.style.width = `${percentualVendido}%`;
    }

    atualizarBotao();
  } catch (err) {
    console.error('Erro ao carregar os dados:', err);
    const errorElement = document.createElement('div');
    errorElement.style.color = 'red';
    errorElement.textContent = 'Erro ao carregar os dados da rifa. Por favor, tente novamente mais tarde.';
    document.body.prepend(errorElement);
  }
}

// Funções auxiliares (mantidas iguais)
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