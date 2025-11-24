    // ===== LOGIN.JS - VERSÃO FINAL FUNCIONAL =====
    console.log('🚀 Script de login carregado - VERSÃO FINAL');

    // TOGGLE DA SENHA
    const toggleBtn = document.getElementById('togglesenha');
    const senhaInput = document.getElementById('senha');

    if (toggleBtn && senhaInput) {
        toggleBtn.addEventListener('click', function() {
            console.log('👁️ Botão de visualizar senha clicado');
            if (senhaInput.type === 'password') {
                senhaInput.type = 'text';
                this.innerHTML = '<img src="/static/imagens/olho_fechado.png" alt="ocultar senha">';
                console.log('🔓 Senha visível');
            } else {
                senhaInput.type = 'password';
                this.innerHTML = '<img src="/static/imagens/olho_aberto.png" alt="mostrar senha">';
                console.log('🔒 Senha oculta');
            }
        });
        console.log('✅ Toggle de senha configurado');
    }

    // FORMULÁRIO DE LOGIN
    const formLogin = document.getElementById('loginForm');
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📝 Formulário submetido');
            
            const usuario = document.getElementById('usuario').value.trim();
            const senha = document.getElementById('senha').value;
            
            console.log('🔐 Dados:', { usuario, senha: senha ? '***' : 'vazia' });
            
            if (!usuario || !senha) {
                alert('Por favor, preencha usuário e senha!');
                return;
            }
            
            const botao = document.getElementById('botaoEntrar');
            const botaoOriginal = botao.textContent;
            botao.textContent = 'Entrando...';
            botao.disabled = true;
            
            try {
                console.log('📤 Enviando requisição para /login...');
                
                const formData = new FormData();
                formData.append('usuario', usuario);
                formData.append('senha', senha);
                
                const response = await fetch('/login', {
                    method: 'POST',
                    body: formData
                });
                
                console.log('📥 Status:', response.status);
                
                const result = await response.json();
                console.log('📨 Resposta completa:', result);
                
                if (response.ok && result.status === 'ok') {
                    console.log('🎉 LOGIN BEM-SUCEDIDO!');
                    console.log('👤 Dados do usuário:', result.user);
                    
                    // 🔥🔥🔥 REDIRECIONAMENTO CORRETO 🔥🔥🔥
                    const userType = result.user.tipo_usuario.toLowerCase();
                    console.log('🔤 Tipo de usuário:', userType);
                    
                    let redirectUrl = '/';
                    
                    if (userType.includes('medico')) {
                        redirectUrl = '/Medico';
                        console.log('🎯 Redirecionando para Médico');
                    } 
                    else if (userType.includes('secretaria') || userType.includes('secretária')) {
                        redirectUrl = '/Secretária';
                        console.log('🎯 Redirecionando para Secretária');
                    } 
                    else if (userType.includes('paciente')) {
                        redirectUrl = '/Paciente';
                        console.log('🎯 Redirecionando para Paciente');
                    }
                    
                    console.log('🚀 EXECUTANDO REDIRECIONAMENTO PARA:', redirectUrl);
                    
                    // 🔥 REDIRECIONAMENTO FINAL
                    setTimeout(() => {
                        console.log('📍 Navegando para:', redirectUrl);
                        window.location.href = redirectUrl;
                    }, 100);
                    
                } else {
                    console.error('❌ Login falhou:', result);
                    alert('❌ ' + (result.detail || result.error || 'Login falhou'));
                }
                
            } catch (error) {
                console.error('💥 Erro:', error);
                alert('❌ Erro de conexão');
            } finally {
                botao.textContent = botaoOriginal;
                botao.disabled = false;
                console.log('🔚 Processo de login finalizado');
            }
        });
        console.log('✅ Formulário de login configurado');
    } else {
        console.error('❌ Formulário de login não encontrado!');
    }
