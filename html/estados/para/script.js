document.addEventListener('DOMContentLoaded', async function () {
    const supabaseUrl = 'https://ribvjcjogwukedhhkgbx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYnZqY2pvZ3d1a2VkaGhrZ2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5Njk4MDMsImV4cCI6MjA1NjU0NTgwM30.152UN5yiJrWyHIeBnZjSmIhGargSRDTqs1BYF0qohwQ';
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

    const colorMap = {
        'T': '#03a8f1',
        'M': '#724141',
        'D': '#fa903a',
    };

    async function fetchAndDisplayArticles(title = '', type = '') {
        let query = _supabase.from('state_articles').select('*').eq('state', 'PA');
        if (title) {
            query = query.ilike('title', `%${title}%`);
        }
        if (type) {
            query = query.eq('stateContent', type);
        }

        const { data, error } = await query;
        if (error) {
            console.error(error);
            return;
        }

        const tabelaArt = document.getElementById('tabela-art');
        tabelaArt.innerHTML = '';

        if (data.length === 0) {
            document.getElementById('no-articles-message').style.display = 'block';
        } else {
            document.getElementById('no-articles-message').style.display = 'none';
            data.forEach(artigo => {
                const firstLetter = artigo.stateContent.charAt(0.2).toUpperCase();
                const color = colorMap[firstLetter] || '#03a8f1';

                const artigoDiv = document.createElement('div');
                artigoDiv.className = 'artigos';
                artigoDiv.innerHTML = `
                    <h1 style="background-color: ${color};" tabindex="0">${artigo.stateContent}</h1>
                    <img src="${artigo.stateImage}" alt="Imagem do artigo" tabindex="0">
                    <p tabindex="0">Titulo</p>
                    <h2 tabindex="0">${artigo.title}</h2>
                    <p tabindex="0">autores</p>
                    <h3 tabindex="0">${artigo.stateAuthors}</h3>
                    <p tabindex="0">Instituto</p>
                    <h3 tabindex="0">${artigo.stateInstitution}</h3>
                    <a href="${artigo.stateButtonUrl}" class="view-article" data-id="${artigo.id}">ler artigo</a>
                    <div class="logos">
                        <img src="../../imagens/logogov.png" alt="Logo 1">
                        <img src="../../imagens/ministr.png" alt="Logo 2">
                        <img src="../../imagens/brasil f logo2.png" alt="Logo 3">
                    </div>
                    <div class="views" tabindex="0">Visualizações: <span>${artigo.acessos}</span></div>
                `;
                tabelaArt.appendChild(artigoDiv);
            });

            document.querySelectorAll('.view-article').forEach(link => {
                link.addEventListener('click', async function (event) {
                    event.preventDefault();
                    const artigoId = this.getAttribute('data-id');
                    const viewCountElement = this.parentElement.querySelector('.views span');
                    const currentCount = parseInt(viewCountElement.textContent);
                    viewCountElement.textContent = currentCount + 1;

                    const { data, error } = await _supabase
                        .from('state_articles')
                        .update({ acessos: currentCount + 1 })
                        .eq('id', artigoId);

                    if (error) {
                        console.error(error);
                    } else {
                        window.location.href = this.href;
                    }
                });
            });
        }
    }

    document.getElementById('search-button').addEventListener('click', function () {
        const title = document.getElementById('search-input').value;
        const type = document.getElementById('filter-select').value;
        fetchAndDisplayArticles(title, type);
    });

    fetchAndDisplayArticles();
});