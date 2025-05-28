const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-logout').addEventListener('click', logout);
});

async function logout() {
    const btnLogout = document.getElementById('btn-logout');
    btnLogout.disabled = true;
    btnLogout.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saindo...';
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        alert('Erro ao sair: ' + error.message);
        btnLogout.disabled = false;
        btnLogout.textContent = 'Sair';
        return;
    }
    
    // Redirecionar para página de login ou home
    window.location.href = '../login_admin/login.html'; // Ajuste conforme sua estrutura
}