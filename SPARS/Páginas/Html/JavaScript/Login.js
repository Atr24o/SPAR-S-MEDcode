// URL de diferentes usuarios para o mesmo link


    // Pega a mensagem da URL (o "tipo")
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUsuario = urlParams.get('tipo'); // Isso pega o valor depois de "?tipo="

    // Agora, decide o que mostrar baseado no tipo
    if (tipoUsuario === 'paciente') {
        // Se for paciente, muda o título e a mensagem
        document.getElementById('tituloLogin').textContent = 'Login do Paciente';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, paciente! Faça seu login para agendar consultas e ver seu histórico.';
    } else if (tipoUsuario === 'medico') {
        // Se for médico, muda o título e a mensagem
        document.getElementById('tituloLogin').textContent = 'Login do Médico';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, médico! Faça seu login para ver agendamentos e notificar pacientes.';
    } else {
        // Se não houver tipo (alguém acessou direto), mostra uma mensagem padrão
        document.getElementById('tituloLogin').textContent = 'Login';
        document.getElementById('mensagemLogin').textContent = 'Escolha seu tipo de usuário na página principal primeiro.';
    }
