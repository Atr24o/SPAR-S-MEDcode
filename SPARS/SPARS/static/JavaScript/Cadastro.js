document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar campos baseado no tipo de usuário
    const tipoUsuarioSelect = document.getElementById('Tipo_Usuario');
    const crmContainer = document.getElementById('crmContainer');

    if (tipoUsuarioSelect) {
        tipoUsuarioSelect.addEventListener('change', function() {
            const tipoUsuario = this.value;
            if (tipoUsuario === 'Médico') {
                crmContainer.style.display = 'block';
            } else {
                crmContainer.style.display = 'none';
            }
        });
    }

    // Toggle para visibilidade da senha
    const toggleButton = document.getElementById('toggleSenha');
    const senhaInput = document.getElementById('Senha');

    if (toggleButton && senhaInput) {
        toggleButton.addEventListener('click', function() {
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                toggleButton.innerHTML = '<img src="/static/imagens/olho_fechado.png" alt="olho_fechado">'; // Ícone de olho fechado
            } else {
                senhaInput.type = 'password';
                toggleButton.innerHTML = '<img src="/static/imagens/olho_aberto.png" alt="olho_aberto">'; // Ícone de olho aberto
            }
        });
    }

    // Toggle para visibilidade da confirmação de senha
    const toggleButtonC = document.getElementById('toggleConfirmarSenha');
    const senhaCInput = document.getElementById('Confirmar_Senha');

    if (toggleButtonC && senhaCInput) {
        toggleButtonC.addEventListener('click', function() {
            if (senhaCInput.type === 'password') {
                senhaCInput.type = 'text';
                toggleButtonC.innerHTML = '<img src="/static/imagens/olho_fechado.png" alt="olho_fechado">'; // Ícone de olho fechado
            } else {
                senhaCInput.type = 'password';
                toggleButtonC.innerHTML = '<img src="/static/imagens/olho_aberto.png" alt="olho_aberto">'; // Ícone de olho aberto
            }
        });
    }

    // Função para formatar CPF: XXX.XXX.XXX-XX
    function formatCPF(value) {
        return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Função para formatar CRM: XXXX-XXXX (8 dígitos)
    function formatCRM(value) {
        return value.replace(/\D/g, '').replace(/(\d{4})(\d{4})/, '$1-$2');
    }

    // Aplicar formatação automática ao campo CPF
    const cpfInput = document.getElementById('CPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            this.value = formatCPF(this.value);
        });
    }

    // Aplicar formatação automática ao campo CRM
    const crmInput = document.getElementById('CRM');
    if (crmInput) {
        crmInput.addEventListener('input', function() {
            this.value = formatCRM(this.value);
        });
    }

    // Validação e submissão do formulário
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const tipoUsuario = document.getElementById('Tipo_Usuario').value;
        const nome = document.getElementById('Nome').value;
        const email = document.getElementById('Email').value;
        const senha = document.getElementById('Senha').value;
        const senhaC = document.getElementById('Confirmar_Senha').value;
        const crm = document.getElementById('CRM').value;
        const cpf = document.getElementById('CPF').value;

        // Validações básicas
        if (!tipoUsuario || !nome || !email || !senha || !senhaC || !cpf) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== senhaC) {
            alert('As senhas não coincidem.');
            return;
        }

        // Validação do CPF sem formatação (remover pontos e traços)
        const cpfNumerico = cpf.replace(/\D/g, '');
        if (!/^\d{11}$/.test(cpfNumerico)) {
            alert('O CPF deve conter exatamente 11 dígitos numéricos.');
            return;
        }

        // Validação específica para médicos (CRM obrigatório)
        let crmNumerico = ''; // DECLARAR A VARIÁVEL FORA DO BLOCO IF
        if (tipoUsuario === 'Médico') {
            if (!crm) {
                alert('Por favor, preencha o campo CRM.');
                return;
            }
            
            // Validação do CRM sem formatação (remover traços)
            crmNumerico = crm.replace(/\D/g, ''); // ATRIBUIR VALOR À VARIÁVEL
            if (!/^\d{8}$/.test(crmNumerico)) {
                alert('O CRM deve conter exatamente 8 dígitos numéricos.');
                return;
            }
        }

        // Preparar dados para envio
        const formData = new FormData();
        formData.append('Tipo_Usuario', tipoUsuario);
        formData.append('Nome', nome);
        formData.append('Email', email);
        formData.append('Senha', senha);
        formData.append('CPF', cpfNumerico); // Enviar CPF sem formatação
        
        // CORREÇÃO: Usar a variável crmNumerico que agora está definida
        if (tipoUsuario === 'Médico' && crmNumerico) {
            formData.append('CRM', crmNumerico); // Enviar CRM sem formatação
        }

        try {
            // Enviar dados para o backend
            const response = await fetch('/user', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Cadastro realizado com sucesso!');
                // Redirecionar para o login
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert('Erro no cadastro: ' + (error.error || 'Erro desconhecido'));
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor: ' + error.message);
        }
    });
});