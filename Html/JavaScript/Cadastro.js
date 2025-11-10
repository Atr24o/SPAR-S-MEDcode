document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUsuario = urlParams.get('tipo');

    if (tipoUsuario === 'paciente') {
        document.getElementById('tituloLogin').textContent = 'Cadastro do Paciente';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, paciente! Insira seus dados para criar sua conta.';
    } else if (tipoUsuario === 'medico') {
        document.getElementById('tituloLogin').textContent = 'Cadastro do Médico';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, médico! Insira seus dados para criar sua conta.';
    } else {
        document.getElementById('tituloLogin').textContent = 'Cadastro';
        document.getElementById('mensagemLogin').textContent = 'Por favor, insira seus dados para criar sua conta.';
    }

    // Ajustar o link "Já tenho uma conta" para incluir o tipo
    const linkVoltar = document.querySelector('a[href="Login.html"]');
    if (linkVoltar && tipoUsuario) {
        linkVoltar.href = `Login.html?tipo=${tipoUsuario}`;
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
