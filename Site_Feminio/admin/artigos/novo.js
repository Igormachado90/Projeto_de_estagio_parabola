import supabase from '../../assets/JS/supabase-client';

document.addEventListener('DOMContentLoaded', () => {
    // Definir data atual como padrão
    document.getElementById('data_publicacao').valueAsDate = new Date();
    
    // Formulário de submissão
    document.getElementById('form-artigo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveArtigo();
    });
});

async function saveArtigo() {
    const form = document.getElementById('form-artigo');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Salvando...';
    
    const artigo = {
        titulo: document.getElementById('titulo').value,
        resumo: document.getElementById('resumo').value,
        conteudo: document.getElementById('conteudo').value,
        autor: document.getElementById('autor').value,
        data_publicacao: document.getElementById('data_publicacao').value,
        imagem: document.getElementById('imagem').value || null,
        status: document.getElementById('status').value
    };
    
    const { data, error } = await supabase
        .from('artigos')
        .insert([artigo])
        .select();
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar Artigo';
    
    if (error) {
        alert('Erro ao salvar artigo: ' + error.message);
        console.error(error);
        return;
    }
    
    alert('Artigo salvo com sucesso!');
    window.location.href = `editar.html?id=${data[0].id}`;
}