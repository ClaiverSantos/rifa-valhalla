const sheetId = '1ydMC63EcxJZSfh7B59O-ts2p-_V_TTFqGIFuqrkKXlk';
const sheetName = 'Página1';

const targetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const whatsappNumber = '5514998838837'; // Troque pelo seu número real
let numerosSelecionados = [];

fetch(proxyUrl + targetUrl)
    .then(response => response.text())
    .then(data => {
        const json = JSON.parse(data.substr(47).slice(0, -2));
        const grid = document.getElementById('gridRifa');
        grid.innerHTML = '';

        let total = 0;
        let vendidos = 0;
        let disponiveis = 0;

        json.table.rows.forEach(row => {
            const numero = row.c[0]?.v || '';
            const status = (row.c[2]?.v || '').toLowerCase();

            total++;

            const div = document.createElement('div');
            div.classList.add('numero');

            if (status === 'disponível') {
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

        // Atualizar contador de status
        document.getElementById('contador').innerText = `Total: ${total} | Vendidos: ${vendidos} | Disponíveis: ${disponiveis}`;

        // Atualizar barra de progresso
        const percentualVendido = (vendidos / total) * 100;
        document.getElementById('progressoInterno').style.width = `${percentualVendido}%`;

        atualizarBotao();
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));

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
    if (numerosSelecionados.length > 0) {
        btn.style.display = 'inline-block';
        btn.textContent = `Reservar ${numerosSelecionados.length} número(s)`;
    } else {
        btn.style.display = 'none';
    }
}

document.getElementById('btnReservar').addEventListener('click', () => {
    if (numerosSelecionados.length === 0) return;

    const mensagem = `Olá, quero reservar o(s) número(s): ${numerosSelecionados.join(', ')}.`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
});
