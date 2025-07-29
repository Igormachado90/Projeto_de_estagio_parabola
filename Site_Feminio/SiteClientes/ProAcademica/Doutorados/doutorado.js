const supabase = window.supabase;
let currentPage = 1;
const itemsPerPage = 6; // Número de artigos por página
let totalArticles = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { count } = await supabase
            .from('artigos')
            .select('*', { count: 'exact', head: true })
            .eq('tipo_pesquisa', 'doutorado');

        totalArticles = count;

        await MostraArtigos(currentPage);
        await setupPagination();
    } catch (error) {
        console.error('Erro ao carregar artigos:', error);
    }
});

const MostraArtigos = async (page) => {
    const activityList = document.getElementById('article-artigos');
    if (!activityList) {
        console.error('Elemento com ID "article-artigos" não encontrado.');
        return;
    }
    //carregar a atividade de artigos
    try {
        // Mostrar estado de carregamento
        activityList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i>Carregando artigos...</div>';

        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data: artigos, error } = await supabase
            .from('artigos')
            .select('*')
            .eq('tipo_pesquisa', 'doutorado')
            .order('created_at', { ascending: false })
            .range(from, to);



        if (error) throw error || 'Erro ao carregar artigos';

        if (!artigos || artigos.length === 0) {
            activityList.innerHTML = '<div class="no-articles">Nenhum artigo encontrado.</div>';
            return;
        }

        // renderizar atividade
        activityList.innerHTML = '';
        artigos.forEach(artigoss => {
            const activityItem = document.createElement('div');
            activityItem.classList.add('col-lg-4', 'col-mb-6', 'col-sm-12', 'mb-4');

            // Verifica se o link está presente
            const linkHTML = artigoss.link_artigo
                ? `<a href="${artigoss.link_artigo}" class="article-link" target="_blank" rel="noopener noreferrer">Leia o artigo completo</a>`
                : `<span class="article-link disabled">Link não disponível</span>`;

            activityItem.innerHTML = `
            <div class="article-section" data-id="${artigoss.id}">
                <h3 class="article-title">${artigoss.titulo}</h3>
                <p class="institution">${artigoss.instituto || ''}</p>
                <p>${artigoss.descricao}</p>
                ${linkHTML}
            </div>       
        `;
            activityList.appendChild(activityItem);
        });

        currentPage = page;
        await setupPagination();

    } catch (error) {
        activityList.innerHTML = '<div class="error">Erro ao carregar artigos. Tente novamente mais tarde.</div>';
    }
}

const setupPagination = async () => {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    // Calcular o número total de páginas
    const totalPages = Math.ceil(totalArticles / itemsPerPage);

    // Limpar paginação existente
    pagination.innerHTML = '';

    // Botão Anterior
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
            await MostraArtigos(currentPage - 1);
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
            await MostraArtigos(1);
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
            await MostraArtigos(i);
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
            await MostraArtigos(totalPages);
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
            await MostraArtigos(currentPage + 1);
        }
    });
    pagination.appendChild(nextItem);
};