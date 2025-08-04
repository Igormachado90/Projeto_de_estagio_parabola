document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabase;
    let hideTimeout;
    let updateTimeout;
    let ultimoEstadoId = null;
    let currentPage = 1;
    const itemsPerPage = 6;

    // Busca dados e mostra mensagem
    async function buscarDados(estado, estadoId) {
        const mensagemTitulo = document.getElementById('mensagem-titulo');
        const mensagemLista = document.getElementById('mensagem-lista');
        mensagemTitulo.textContent = estado;
        mensagemLista.innerHTML = '';

        try {
            // Busca todos os artigos do estado na tabela state_articles
            const { data, error } = await supabase
                .from('artigos')
                .select('tipo_pesquisa, estado_uf')
                .eq('estado_uf', estadoId);

            if (error) {
                mensagemLista.innerHTML = '<li>Erro ao buscar dados.</li>';
                return;
            }

            if (data && data.length > 0) {
                // Agrupa os dados por tipo de pesquisa
                const contagem = {};
                data.forEach(item => {
                    let conteudo = item.tipo_pesquisa || 'Sem conteúdo';

                    // Substituir "Dissertação" por "Mestrado"
                    if (conteudo.toLowerCase() === 'dissertacao') {
                        conteudo = 'Mestrado';
                    }
                    // Substituir "Artigo Científico Original" por "Artigo Científico - Original"


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

    function mostrarMensagem(event, estado, estadoId) {
        const mensagemFlutuante = document.getElementById('mensagem-flutuante');
        if (!mensagemFlutuante) return;

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

    async function setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        // Contar total de artigos
        const { count, error } = await supabase
            .from('artigos')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Erro ao contar artigos:', error);
            return;
        }

        const totalPages = Math.ceil(count / itemsPerPage);
        pagination.innerHTML = '';

        const prevItem = document.createElement('li');
        prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `
        <a class="page-link" href="#" aria-label="Anterior">
            <span aria-hidden="true">&laquo;</span>
        </a>
        `;
        prevItem.addEventListener('click', async (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                await MostraEstado(currentPage - 1);
            }
        });
        pagination.appendChild(prevItem);

        // Configuração da paginação limitada
        const maxVisiblePages = 3; // Número máximo de páginas visíveis
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            // Mostrar todas as páginas se não exceder o máximo
            startPage = 1;
            endPage = totalPages;
        } else {
            // Calcular páginas visíveis com a atual no centro
            const halfVisible = Math.floor(maxVisiblePages / 2);

            if (currentPage <= halfVisible + 1) {
                // Páginas iniciais
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - halfVisible) {
                // Páginas finais
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                // Páginas intermediárias
                startPage = currentPage - halfVisible;
                endPage = currentPage + halfVisible;
            }
        }

        // Botão para primeira página (se necessário)
        if (startPage > 1) {
            const firstPageItem = document.createElement('li');
            firstPageItem.className = 'page-item';
            firstPageItem.innerHTML = `<a class="page-link" href="#">1</a>`;
            firstPageItem.addEventListener('click', async (e) => {
                e.preventDefault();
                await MostraEstado(1);
            });
            pagination.appendChild(firstPageItem);

            // Adicionar ellipsis se houver mais páginas antes
            if (startPage > 2) {
                const ellipsisItem = document.createElement('li');
                ellipsisItem.className = 'page-item disabled';
                ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
                pagination.appendChild(ellipsisItem);
            }
        }

        // Páginas visíveis
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageItem.addEventListener('click', async (e) => {
                e.preventDefault();
                await MostraEstado(i);
            });
            pagination.appendChild(pageItem);
        }

        // Botão para última página (se necessário)
        if (endPage < totalPages) {
            // Adicionar ellipsis se houver mais páginas depois
            if (endPage < totalPages - 1) {
                const ellipsisItem = document.createElement('li');
                ellipsisItem.className = 'page-item disabled';
                ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
                pagination.appendChild(ellipsisItem);
            }

            const lastPageItem = document.createElement('li');
            lastPageItem.className = 'page-item';
            lastPageItem.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
            lastPageItem.addEventListener('click', async (e) => {
                e.preventDefault();
                await MostraEstado(totalPages);
            });
            pagination.appendChild(lastPageItem);
        }

        // Botão Próximo
        const nextItem = document.createElement('li');
        nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextItem.innerHTML = `
        <a class="page-link" href="#" aria-label="Próximo">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
        nextItem.addEventListener('click', async (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                await MostraEstado(currentPage + 1);
            }
        });
        pagination.appendChild(nextItem);
    }

    async function MostraEstado(page, estadoId = null) {
        const activityList = document.getElementById('article-eventos');
        console.log('mostra', activityList);

        if (!activityList) {
            console.error('Elemento com ID "article-eventos" não encontrado.');
            return;
        }

        // Mostrar estado de carregamento
        activityList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i>Carregando eventos...</div>';

        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        try {
            let query = supabase
                .from('artigos')
                .select('*')
                .order('created_at', { ascending: false })
                .range(from, to);

            if (estadoId) {
                query = query.eq('estado_uf', estadoId);
            }

            const { data: eventos, error } = await query;

            if (error) throw error || 'Erro ao carregar eventos';


            // renderizar atividade
            activityList.innerHTML = '';

            if (!eventos || eventos.length === 0) {
                activityList.innerHTML = '<div class="no-events">Nenhum artigo encontrado.</div>';
                return;
            }

            eventos.forEach(evento => {

                const activityItem = document.createElement('article');
                activityItem.classList.add('event-card');

                // Substituir "Dissertação" por "Mestrado"
                if (evento.tipo_pesquisa && evento.tipo_pesquisa.toLowerCase() === 'dissertacao') {
                    evento.tipo_pesquisa = 'Mestrado';
                }

                activityItem.innerHTML = `
                    <div class="" data-id="${evento.id}">
                        <h2>${evento.tipo_pesquisa}</h2>
                        <img src="${evento.imagem || 'https://i0.wp.com/multarte.com.br/wp-content/uploads/2018/12/fundo-cinza-claro4.png?resize=696%2C427&ssl=1'}" alt="" class="event-image">
                        <h2>${evento.titulo}</h2>
                        <p>${evento.autores}</p>
                        <p>${evento.instituto}</p>
                        <a href="${evento.url_doi}" target="_blank" class="event-link">Visite a página do evento</a>
                    </div>
                `;

                activityList.appendChild(activityItem);
            });

            currentPage = page;
            await setupPagination(estadoId);

        } catch (error) {
            console.error('Erro ao exibir eventos:', error);
            activityList.innerHTML = '<div class="error">Erro ao carregar eventos. Tente novamente mais tarde.</div>';
        }
    }

    // Inicialização
    function init() {
        // Configurar eventos dos estados

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
                    const mensagemFlutuante = document.getElementById('mensagem-flutuante');
                    if (mensagemFlutuante) {
                        mensagemFlutuante.style.display = 'none';
                    }
                }, 4000);
            });
        });

        // Configurar cliques nos estados
        document.querySelectorAll('svg a').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const estadoPath = this.querySelector('path');
                const estadoId = estadoPath.id;
                const estadoNome = estadoPath.getAttribute('title');
                buscarDados(estadoNome, estadoId);
                console.log(`Estado clicado: ${estadoNome}, ID: ${estadoId}`);
                window.location.href = `../../ArtigoEstados/estado.html?estadoId=${estadoId}&estadoNome=${encodeURIComponent(estadoNome)}`;
            });


        });

        // Carregar dados iniciais
        MostraEstado(1, estadoId);
    }

    init();

});
