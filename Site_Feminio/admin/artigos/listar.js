const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', async () => {
    await CarregaArtigos();
});

async function CarregaArtigos() {
    const tableBody = document.getElementById('artigos-table');
    tableBody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
    
    const { data: artigos, error } = await supabase
        .from('artigos')
        .select('*')
        .order('data_publicacao', { ascending: false });
    
    if (error) {
        tableBody.innerHTML = '<tr><td colspan="5">Erro ao carregar artigos</td></tr>';
        console.error(error);
        return;
    }
    
    if (artigos.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Nenhum artigo encontrado</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    artigos.forEach(artigo => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${artigo.titulo}</td>
            <td>${artigo.autor}</td>
            <td>${new Date(artigo.data_publicacao).toLocaleDateString()}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(artigo.status)}">
                    ${artigo.status.charAt(0).toUpperCase() + artigo.status.slice(1)}
                </span>
            </td>
            <td>
                <a href="editar.html?id=${artigo.id}" class="btn btn-sm btn-primary">
                    <i class="bi bi-pencil"></i>
                </a>
                <button class="btn btn-sm btn-danger" data-id="${artigo.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        // Adicionar evento de clique para o botão de excluir
        row.querySelector('.btn-danger').addEventListener('click', () => {
            deleteArtigo(artigo.id);
        });
        
        tableBody.appendChild(row);
    });
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'publicado': return 'bg-success';
        case 'rascunho': return 'bg-warning text-dark';
        case 'arquivado': return 'bg-secondary';
        default: return 'bg-light text-dark';
    }
}

async function deleteArtigo(id) {
    if (!confirm('Tem certeza que deseja excluir este artigo?')) return;
    
    const { error } = await supabase
        .from('artigos')
        .delete()
        .eq('id', id);
    
    if (error) {
        alert('Erro ao excluir artigo');
        console.error(error);
        return;
    }
    
    alert('Artigo excluído com sucesso');
    await CarregaArtigos();
}