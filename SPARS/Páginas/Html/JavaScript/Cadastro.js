document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tipoUsuario = urlParams.get('tipo');

    if (tipoUsuario === 'paciente') {
        document.getElementById('tituloLogin').textContent = 'Cadastro do Paciente';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, paciente! Insira seus dados para criar sua conta.';
        document.getElementById('cpfContainer').style.display = 'block';
    } else if (tipoUsuario === 'medico') {
        document.getElementById('tituloLogin').textContent = 'Cadastro do Médico';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, médico! Insira seus dados para criar sua conta.';
        document.getElementById('crmContainer').style.display = 'block';
    } else if (tipoUsuario === 'funcionario') {
        document.getElementById('tituloLogin').textContent = 'Cadastro do Funcionário';
        document.getElementById('mensagemLogin').textContent = 'Bem-vindo, funcionário! Insira seus dados para criar sua conta.';
        document.getElementById('funcionarioContainer').style.display = 'block';
    } else {
        document.getElementById('tituloLogin').textContent = 'Cadastro';
        document.getElementById('mensagemLogin').textContent = 'Por favor, insira seus dados para criar sua conta.';
    }

    // Correção: Ajustar o link "Já tenho uma conta" para incluir o tipo
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

    // Toggle para visibilidade da confirmação de senha
    const toggleButtonC = document.getElementById('toggleSenha_C');
    const senhaCInput = document.getElementById('senha_C');

    toggleButtonC.addEventListener('click', function() {
        if (senhaCInput.type === 'password') {
            senhaCInput.type = 'text';
            toggleButtonC.innerHTML = '<img src="imagens/olho_fechado.png" alt="olho_fechado">'; // Ícone de olho fechado
        } else {
            senhaCInput.type = 'password';
            toggleButtonC.innerHTML = '<img src="imagens/olho_aberto.png" alt="olho_aberto">'; // Ícone de olho aberto
        }
    });

    // Função para formatar CPF: XXX.XXX.XXX-XX
    function formatCPF(value) {
        return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Função para formatar CRM: XXXX-XXXX (8 dígitos)
    function formatCRM(value) {
        return value.replace(/\D/g, '').replace(/(\d{4})(\d{4})/, '$1-$2');
    }

    // Aplicar formatação automática ao campo CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            this.value = formatCPF(this.value);
        });
    }

    // Aplicar formatação automática ao campo CRM
    const crmInput = document.getElementById('crm');
    if (crmInput) {
        crmInput.addEventListener('input', function() {
            this.value = formatCRM(this.value);
        });
    }

    // Aplicar formatação automática ao campo CRM do funcionário
    const crmFuncionarioInput = document.getElementById('crmFuncionario');
    if (crmFuncionarioInput) {
        crmFuncionarioInput.addEventListener('input', function() {
            this.value = formatCRM(this.value);
        });
    }

    // Aplicar formatação automática ao campo CPF do funcionário
    const cpfFuncionarioInput = document.getElementById('cpfFuncionario');
    if (cpfFuncionarioInput) {
        cpfFuncionarioInput.addEventListener('input', function() {
            this.value = formatCPF(this.value);
        });
    }

    // Lógica para mostrar campos específicos do funcionário
    const tipoFuncionarioSelect = document.getElementById('tipoFuncionario');
    if (tipoFuncionarioSelect) {
        tipoFuncionarioSelect.addEventListener('change', function() {
            const tipoFuncionario = this.value;
            document.getElementById('crmFuncionarioContainer').style.display = 'none';
            document.getElementById('cpfFuncionarioContainer').style.display = 'none';

            if (tipoFuncionario === 'medico' || tipoFuncionario === 'enfermeiro') {
                document.getElementById('crmFuncionarioContainer').style.display = 'block';
            } else if (tipoFuncionario === 'secretaria') {
                document.getElementById('cpfFuncionarioContainer').style.display = 'block';
            }
        });
    }

    // Validação e submissão do formulário
    const form = document.getElementById('cadastroForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('Email').value;
        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const senhaC = document.getElementById('senha_C').value;
        const crm = document.getElementById('crm').value;
        const cpf = document.getElementById('cpf').value;
        const tipoFuncionario = document.getElementById('tipoFuncionario').value;
        const crmFuncionario = document.getElementById('crmFuncionario').value;
        const cpfFuncionario = document.getElementById('cpfFuncionario').value;

        // Validações básicas
        if (!email || !usuario || !senha || !senhaC) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== senhaC) {
            alert('As senhas não coincidem.');
            return;
        }

        if (tipoUsuario === 'medico') {
            if (!crm) {
                alert('Por favor, preencha o campo CRM.');
                return;
            }
            // Validação do CRM sem formatação (remover pontos e traços)
            const crmNumerico = crm.replace(/\D/g, '');
            if (!/^\d{8}$/.test(crmNumerico)) {
                alert('O CRM deve conter exatamente 8 dígitos numéricos.');
                return;
            }
        }

        if (tipoUsuario === 'paciente') {
            if (!cpf) {
                alert('Por favor, preencha o campo CPF.');
                return;
            }
            // Validação do CPF sem formatação (remover pontos e traços)
            const cpfNumerico = cpf.replace(/\D/g, '');
            if (!/^\d{11}$/.test(cpfNumerico)) {
                alert('O CPF deve conter exatamente 11 dígitos numéricos.');
                return;
            }
        }

        if (tipoUsuario === 'funcionario') {
            if (!tipoFuncionario) {
                alert('Por favor, selecione o tipo de funcionário.');
                return;
            }

            if (tipoFuncionario === 'medico' || tipoFuncionario === 'enfermeiro') {
                if (!crmFuncionario) {
                    alert('Por favor, preencha o campo CRM.');
                    return;
                }
                // Validação do CRM sem formatação (remover pontos e traços)
                const crmFuncionarioNumerico = crmFuncionario.replace(/\D/g, '');
                if (!/^\d{8}$/.test(crmFuncionarioNumerico)) {
                    alert('O CRM deve conter exatamente 8 dígitos numéricos.');
                    return;
                }
            } else if (tipoFuncionario === 'secretaria') {
                if (!cpfFuncionario) {
                    alert('Por favor, preencha o campo CPF.');
                    return;
                }
                // Validação do CPF sem formatação (remover pontos e traços)
                const cpfFuncionarioNumerico = cpfFuncionario.replace(/\D/g, '');
                if (!/^\d{11}$/.test(cpfFuncionarioNumerico)) {
                    alert('O CPF deve conter exatamente 11 dígitos numéricos.');
                    return;
                }
            }
        }

        // Simulação de cadastro bem-sucedido
        alert('Cadastro realizado com sucesso!');

        // Redirecionar para o referrer
        const referrer = document.referrer || 'Main_page.html'; // Fallback para Main_page.html se não houver referrer
        window.location.href = referrer;
    });
});
