const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', fetchPhotos);

if (!window.supabase || typeof window.supabase.from !== 'function') {
        console.error('Supabase client not properly initialized');
        const container = document.getElementById('photos-container');
        if (container) {
            container.innerHTML = '<p class="text-danger">Erro de configuração. Recarregue a página.</p>';
        }
    }

// Elementos DOM
const container = document.getElementById('photos-container') || document.getElementById('gallery-grid');

if (!container) {
    console.log('Container não encontrados!');
}

// Se for a galeria, mostra loading (para galeria.html)
const isGallery = container.id === 'gallery-grid';
const limit = isGallery ? null : 4; // 4 fotos para index, todas para galeria

if (isGallery) {
    const loadingElement = document.getElementById('loading');
    fetchPhotos(container, loadingElement, limit);
} else {
    fetchPhotos(container, null, limit); // Sem loading para index
}

async function fetchPhotos(container, loadingElement, limit = null) {
    try {
        if (loadingElement) loadingElement.style.display = 'block'; // Exibe o elemento de carregamento
        isGallery.innerHTML = ''; // Limpa a galeria antes de carregar novas fotos

        let query = window.supabase
            .from('galeria_fotos')
            .select('*')
            .order('criado_em', { ascending: false });

        if (limit) query = query.limit(limit); // Aplica o limite se necessário

        const { data, error } = await query;
        if (error) throw error;

        container.innerHTML = '';
        
        if (data?.length > 0) {
            data.forEach(photo => {
                if (container.id === 'photos-container') {
                    // Layout para index.html (4 fotos)
                    const col = document.createElement('div');
                    col.className = 'col-md-3 col-sm-6 mb-4';
                    col.innerHTML = `
                        <a href="#" data-toggle="modal" data-target="#photoModal${photo.id}">
                            <img src="${photo.url_imagem}" alt="${photo.descricao || 'Foto da galeria'}"
                                class="img-responsive img-thumbnail" style="height: 200px; width: 100%; object-fit: cover; margin-bottom: 15px;">
                        </a>
                    `;
                    container.appendChild(col);
                } else {
                    // Layout para galeria.html (todas as fotos)
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                    <img src="${photo.url_imagem}" alt="${photo.descricao || 'Foto da galeria'}">
                    <p>${photo.descricao}</p>
                
                    <div class="gallery-caption">
                        <h3>${photo.title || 'Sem título'}</h3>
                    </div>
                    `;
                    container.appendChild(item);
                }
            });
        } else {
            container.innerHTML = '<p>Nenhuma foto encontrada.</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        container.innerHTML = '<p>Erro ao carregar fotos. Tente novamente mais tarde.</p>';
    } finally {
        if (loadingElement) loadingElement.style.display = 'none'; // Esconde o elemento de carregamento
    }
}