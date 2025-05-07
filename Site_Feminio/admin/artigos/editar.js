import supabase from '../../assets/JS/supabase-client';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const artigoId = urlParams.get('id');
    
    if (!artigoId) {
        window.location.href = 'listar.html';
        return;
    }
    
    await loadArtigo(artigoId);
    
    // Formulário de submissão
    document.getElementById('form-artigo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateArtigo(artigoId);
    });
    
    // Botão de excluir
    document.getElementById('btn-excluir').addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir este artigo permanentemente?')) {
            const { error } = await supabase
                .from('artigos')
                .delete()
                .eq('id', artigoId);
            
            if (error) {
                alert('Erro ao excluir artigo');
                console.error(error);
                return;
            }
            
            alert('Artigo excluído com sucesso');
            window.location.href = 'listar.html';
        }
    });
});

async function loadArtigo(id) {
    const { data: artigo, error } = await supabase
        .from('artigos')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !artigo) {
        alert('Artigo não encontrado');
        window.location.href = 'listar.html';
        return;
    }
    
    // Preencher formulário
    document.getElementById('id').value = artigo.id;
    document.getElementById('titulo').value = artigo.titulo;
    document.getElementById('resumo').value = artigo.resumo;
    document.getElementById('conteudo').value = artigo.conteudo;
    document.getElementById('autor').value = artigo.autor;
    document.getElementById('data_publicacao').value = artigo.data_publicacao.split('T')[0];
    document.getElementById('imagem').value = artigo.imagem || '';
    document.getElementById('status').value = artigo.status;
}

async function updateArtigo(id) {
    const form = document.getElementById('form-artigo');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Atualizando...';
    
    const artigo = {
        titulo: document.getElementById('titulo').value,
        resumo: document.getElementById('resumo').value,
        conteudo: document.getElementById('conteudo').value,
        autor: document.getElementById('autor').value,
        data_publicacao: document.getElementById('data_publicacao').value,
        imagem: document.getElementById('imagem').value || null,
        status: document.getElementById('status').value,
        updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
        .from('artigos')
        .update(artigo)
        .eq('id', id);
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Atualizar Artigo';
    
    if (error) {
        alert('Erro ao atualizar artigo: ' + error.message);
        console.error(error);
        return;
    }
    
    alert('Artigo atualizado com sucesso!');
    await loadArtigo(id);
}