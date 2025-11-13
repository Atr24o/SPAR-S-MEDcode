
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

    // Correção: Ajustar o link de cadastro para incluir o tipo
    const linkCadastro = document.querySelector('a[href="Cadastro.html"]');
    if (linkCadastro && tipoUsuario) {
        linkCadastro.href = `Cadastro.html?tipo=${tipoUsuario}`;
    }
});
