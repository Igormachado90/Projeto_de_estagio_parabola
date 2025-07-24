const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', () => {
    let hideTimeout;
    let updateTimeout;
    let ultimoEstadoId = null;

    // Busca dados e mostra mensagem
    async function buscarDados(estado, estadoId) {
        const mensagemTitulo = document.getElementById('mensagem-titulo');
        const mensagemLista = document.getElementById('mensagem-lista');
        mensagemTitulo.textContent = estado;
        mensagemLista.innerHTML = '';

        try {
            // Busca todos os artigos do estado na tabela state_articles
            const { data, error } = await _supabase
                .from('state_articles')
                .select('stateContent, state')
                .eq('state', estadoId);

            if (error) {
                mensagemLista.innerHTML = '<li>Erro ao buscar dados.</li>';
                return;
            }

            if (data && data.length > 0) {
                // Conta as ocorrências de cada stateContent
                const contagem = {};
                data.forEach(item => {
                    const conteudo = item.stateContent || 'Sem conteúdo';
                    contagem[conteudo] = (contagem[conteudo] || 0) + 1;
                });

                // Mostra o conteúdo e a quantidade
                Object.entries(contagem).forEach(([conteudo, quantidade]) => {
                    const li = document.createElement('li');
                    li.textContent = `${conteudo}: ${quantidade}`;
                    mensagemLista.appendChild(li);
                });
            } else {
                mensagemLista.innerHTML = '<li>Nenhuma publicação encontrada.</li>';
            }
        } catch (err) {
            console.error('Erro ao buscar dados:', err);
            mensagemLista.innerHTML = '<li>Erro ao buscar dados.</li>';
        }
    }

    function isMobile() {
        return window.innerWidth <= 700 || /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    }

    document.querySelectorAll('svg a path').forEach((estado) => {
        estado.addEventListener('mousemove', (event) => {
            clearTimeout(hideTimeout);
            clearTimeout(updateTimeout);
            const texto = estado.getAttribute('title');
            const estadoId = estado.getAttribute('id');
            mostrarMensagem(event, texto, estadoId);
        });

        estado.addEventListener('mouseout', () => {
            hideTimeout = setTimeout(() => {
                document.getElementById('mensagem-flutuante').style.display = 'none';
            }, 4000);
        });
    });

    function mostrarMensagem(event, estado, estadoId) {
        const mensagemFlutuante = document.getElementById('mensagem-flutuante');
        mensagemFlutuante.style.display = 'block';
        mensagemFlutuante.style.position = 'absolute';

        if (isMobile()) {
            // Centraliza na tela em dispositivos móveis
            mensagemFlutuante.style.left = '50%';
            mensagemFlutuante.style.top = '50%';
            mensagemFlutuante.style.transform = 'translate(-50%, -50%)';
        } else {
            // Posição ao lado do mouse, ajustando para não sair da tela
            mensagemFlutuante.style.transform = '';
            let left = event.pageX + 20;
            let top = event.pageY + 10;
            if (left + 250 > window.innerWidth) left = window.innerWidth - 260;
            if (top + 120 > window.innerHeight) top = window.innerHeight - 130;
            mensagemFlutuante.style.left = left + 'px';
            mensagemFlutuante.style.top = top + 'px';
        }

        // Só busca novamente se mudou de estado, com atraso de 250ms
        if (ultimoEstadoId !== estadoId) {
            updateTimeout = setTimeout(() => {
                buscarDados(estado, estadoId);
                ultimoEstadoId = estadoId;
            }, 250);
        }
    }

    // Ao esconder a mensagem, libera para mostrar novamente
    document.addEventListener('mousemove', (e) => {
        const mensagemFlutuante = document.getElementById('mensagem-flutuante');
        if (mensagemFlutuante.style.display === 'none') {
            ultimoEstadoId = null;
        }
    });
});