const supabase = window.supabase;

document.addEventListener("DOMContentLoaded", async () => {
    await CarregaEstatisticas();
    await CarregaAtividadesRecentes();
});

const CarregaEstatisticas = async () => {

    // ler todas as linhas da tabela artigos
    const { count: artigosCount } = await supabase
        .from('artigos')
        .select('*', { count: 'exact', head: true });
    document.getElementById('total-artigos').textContent = artigosCount || 0;
    
    //ler todas as linhas da tabela eventos
    const { count: eventosCount } = await supabase
        .from('eventos')
        .select('*', { count: 'exact', head: true });
    document.getElementById('total-eventos').textContent = eventosCount || 0;
}

const CarregaAtividadesRecentes = async () => {
    const activityList = document.getElementById('recent-activity');

    // Buscar atividades recentes de todas as tabelas
    const { data: artigos } = await supabase
        .from('artigos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    // Combinar e ordenar todas as atividades
    const allActivities = [
        ...artigos.map(artigo => ({ ...artigo, type: 'artigo' })),
        ...eventos.map(evento => ({ ...evento, type: 'evento' }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Renderizar atividades
    activityList.innerHTML = '';
    allActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.classListName = 'activity-item';

        activityItem.innerHTML = `
            <div classe= "activity-icon">
                <i classe=" bi bi-${activity.type === 'Artigo' ? 'newspaper' :
                activity.type === 'Evento' ? 'calendar-event' : 'info-circle'}"></i>
            </div>
            <div class="activity-details">
                <strong>${activity.type}: ${activity.titulo}</strong>
                <div class="activity-time">${new Date(activity.created_at).toLocaleString()}</div>
            </div>
        `;
        activityList.appendChild(activityItem);
    })
}