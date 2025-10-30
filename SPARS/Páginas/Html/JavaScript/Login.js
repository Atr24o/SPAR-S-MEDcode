
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUsuario = urlParams.get('tipo');

    if (tipoUsuario === 'paciente') {
        document.getElementById('tituloLogin').textContent = 'Login do Paciente';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, paciente! Faça seu login para agendar consultas e ver seu histórico.';
    }

    else if (tipoUsuario === 'medico') {
        document.getElementById('tituloLogin').textContent = 'Login do Médico';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, médico! Faça seu login para ver agendamentos e notificar pacientes.';
    }

    else {
        document.getElementById('tituloLogin').textContent = 'Login';
        document.getElementById('mensagemLogin').textContent = 'Escolha seu tipo de usuário na página principal primeiro.';
    }

    // Toggle para visibilidade da senha
    const toggleButton = document.getElementById('toggleSenha');
    const senhaInput = document.getElementById('senha');

    toggleButton.addEventListener('click', function() {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleButton.innerHTML = '<img src="imagens/olho_fechado.png" alt="olho_fechado">'; // Ícone de olho fechado
        } else {
            senhaInput.type = 'password';
            toggleButton.innerHTML = '<img src="imagens/olho_aberto.png" alt="olho_aberto">'; // Ícone de olho aberto
        }
    });
});
