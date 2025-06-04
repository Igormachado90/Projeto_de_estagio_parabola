const supabase = window.supabase;
let currentPage = 1;
const itemsPerPage = 4; // Número de artigos por página
let totalArticles = 0;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { count } = await supabase
            .from('artigos')
            .select('*', { count: 'exact', head: true });
        
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
        
        const from = (page - 1 ) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data: artigos, error } = await supabase
            .from('artigos')
            .select('*')
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
            activityItem.classList.add('col-lg-6', 'mb-4');

            activityItem.innerHTML = `
            <div class="article-section" data-id="${artigoss.id}">
                <h3 class="article-title">${artigoss.titulo}</h3>
                <p class="institution">${artigoss.instituto || ''}</p>
                <p>${artigoss.resumo}</p>
                <a href="${artigoss.link}" class="article-link" target="_blank">Leia o artigo completo</a>
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

            // Números das páginas
            for (let i = 1; i <= totalPages; i++) {
                const pageItem = document.createElement('li');
                pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
                pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                pageItem.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await MostraArtigos(i);
                });
                pagination.appendChild(pageItem);
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