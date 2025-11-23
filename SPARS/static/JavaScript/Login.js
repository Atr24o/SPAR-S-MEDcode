// ===== LOGIN.JS COMPLETO =====
console.log('🚀 Script de login carregado NO FINAL');

// 1. TOGGLE DA SENHA
const toggleBtn = document.getElementById('togglesenha');
const senhaInput = document.getElementById('senha');

if (toggleBtn && senhaInput) {
    console.log('✅ Toggle configurado!');
    
    toggleBtn.addEventListener('click', function() {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            this.innerHTML = '<img src="/static/imagens/olho_fechado.png" alt="ocultar senha">';
        } else {
            senhaInput.type = 'password';
            this.innerHTML = '<img src="/static/imagens/olho_aberto.png" alt="mostrar senha">';
        }
    });
}

// 2. FORMULÁRIO DE LOGIN - VERSÃO CORRIGIDA
const formLogin = document.getElementById('loginForm');
if (formLogin) {
    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        
        console.log('🔍 Dados para envio:', { usuario, senha });
        
        if (!usuario || !senha) {
            alert('Por favor, preencha usuário e senha!');
            return;
        }
        
        const botao = document.getElementById('botaoEntrar');
        const botaoOriginal = botao.textContent;
        botao.textContent = 'Entrando...';
        botao.disabled = true;
        
        try {
            console.log('📤 Enviando dados para login...');
            
            // MÉTODO 1: URLSearchParams (mais compatível)
            const params = new URLSearchParams();
            params.append('usuario', usuario);
            params.append('senha', senha);
            
            console.log('📦 Parâmetros:', params.toString());
            
            const resposta = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params
            });
            
            console.log('📥 Status:', resposta.status);
            
            const respostaTexto = await resposta.text();
            console.log('📄 Resposta completa:', respostaTexto);
            
            try {
                const dados = JSON.parse(respostaTexto);
                
                if (resposta.ok) {
                    console.log('✅ Login bem-sucedido:', dados);
                    if (dados.status === 'ok') {
                    alert(`Bem-vindo, ${dados.user.nome}!`);
                    // Redirecionar baseado no tipo de usuário
                    const tipoUsuarioRaw = dados.user.tipo_usuario;
                    console.log('Tipo usuário do backend:', tipoUsuarioRaw);

                    // Normaliza tipo usuario para evitar diferenças de acentos/case
                    const tipoUsuario = tipoUsuarioRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

                    console.log('Tipo usuário normalizado:', tipoUsuario);

                    if (tipoUsuario === 'medico') {
                        console.log('Redirecionando para /Medico');
                        window.location.href = '/Medico';
                    } else if (tipoUsuario === 'secretaria') {
                        console.log('Redirecionando para /Secretaria');
                        window.location.href = '/Secretaria';
                    } else if (tipoUsuario === 'paciente') {
                        console.log('Redirecionando para /Paciente');
                        window.location.href = '/Paciente';
                    } else {
                        console.warn('Tipo usuário desconhecido, redirecionando para /');
                        window.location.href = '/';
                    }
                } else {
                    alert('Login falhou: ' + (dados.detail || 'Credenciais inválidas'));
                }
                } else {
                    console.error('❌ Erro do servidor:', dados);
                    alert('Erro: ' + (dados.detail || dados.error || 'Erro desconhecido'));
                }
            } catch (parseError) {
                console.error('❌ Erro ao parsear resposta:', parseError);
                alert('Erro na resposta do servidor');
            }
            
        } catch (erro) {
            console.error('💥 Erro de conexão:', erro);
            alert('Erro de conexão. Verifique se o servidor está rodando.');
        } finally {
            botao.textContent = botaoOriginal;
            botao.disabled = false;
        }
    });
}