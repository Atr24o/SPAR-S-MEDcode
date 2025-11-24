// VARIÁVEIS GLOBAIS
let consultaSelecionada = null;
let prioridadeSelecionada = 'media';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de confirmação carregada');
    carregarConsultasAgendadas();
    carregarConsultasPendentes();
});

// CARREGAR CONSULTAS AGENDADAS
function carregarConsultasAgendadas() {
    const container = document.querySelector('#consultasAgendadas .grid-container');
    const emptyState = document.getElementById('emptyAgendadas');
    let consultas = JSON.parse(localStorage.getItem('consultasConfirmadas')) || [];
    
    // Filtrar apenas consultas não canceladas
    consultas = consultas.filter(consulta => consulta.status !== 'cancelada');
    
    console.log('Consultas agendadas:', consultas);
    
    // Limpar container (exceto empty state)
    const items = container.querySelectorAll('.consulta-agendada');
    items.forEach(item => item.remove());
    
    if (consultas.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Adicionar consultas agendadas
    consultas.forEach(consulta => {
        const item = criarItemConsultaAgendada(consulta);
        container.appendChild(item);
    });
}

// CRIAR ITEM DE CONSULTA AGENDADA
function criarItemConsultaAgendada(consulta) {
    const item = document.createElement('div');
    item.className = 'consulta-agendada';
    item.innerHTML = `
        <div class="item-header">
            <h3>Consulta ${consulta.numero || consulta.id?.slice(-4) || 'N/A'}</h3>
            <span class="status-confirmada">${consulta.status === 'reagendada' ? 'Reagendada' : 'Confirmada'}</span>
        </div>
        <div class="consulta-content">
            <p><strong>Paciente:</strong> ${consulta.nome}</p>
            <p><strong>CPF:</strong> ${consulta.cpf}</p>
            <p><strong>Idade:</strong> ${consulta.idade} anos</p>
            <p><strong>Médico:</strong> ${consulta.medico || 'A definir'}</p>
            <p><strong>Horário:</strong> ${consulta.horario || 'A definir'}</p>
            <p><strong>Data:</strong> ${consulta.dataConsulta || 'A definir'}</p>
            <p><strong>Prioridade:</strong> <span class="prioridade-${consulta.prioridade || 'media'}">${(consulta.prioridade || 'Média').toUpperCase()}</span></p>
            <p><strong>Status:</strong> <span class="status-confirmada">${consulta.status === 'reagendada' ? 'Reagendada' : 'Confirmada'}</span></p>
        </div>
        <div class="button-container" style="position: relative; margin-top: 15px; border: none; padding-top: 0;">
            <button class="btn btn-cancel-consulta" onclick="cancelarConsultaSecretaria('${consulta.id}')">
                <span class="btn-icon">✕</span>
                Cancelar Consulta
            </button>
            <button class="btn btn-reschedule" onclick="reagendarConsultaSecretaria('${consulta.id}')">
                <span class="btn-icon">↻</span>
                Reagendar Consulta
            </button>
        </div>
    `;
    return item;
}

// CARREGAR CONSULTAS PENDENTES
function carregarConsultasPendentes() {
    const container = document.querySelector('#consultasConfirmar .grid-container');
    const emptyState = document.getElementById('emptyConfirmar');
    let consultas = JSON.parse(localStorage.getItem('consultasPendentes')) || [];
    
    console.log('Carregando consultas pendentes:', consultas);
    
    // Limpar container (exceto empty state)
    const items = container.querySelectorAll('.consulta-pendente');
    items.forEach(item => item.remove());
    
    if (consultas.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Adicionar consultas pendentes
    consultas.forEach(consulta => {
        const item = criarItemConsultaPendente(consulta);
        container.appendChild(item);
    });
}

// CRIAR ITEM DE CONSULTA PENDENTE
function criarItemConsultaPendente(consulta) {
    const item = document.createElement('div');
    item.className = 'consulta-pendente';
    item.innerHTML = `
        <div class="item-header">
            <h3>Consulta ${consulta.id ? consulta.id.slice(-4) : 'N/A'}</h3>
            <span class="status-pendente">Pendente</span>
        </div>
        <div class="consulta-content">
            <p><strong>Paciente:</strong> ${consulta.nome}</p>
            <p><strong>CPF:</strong> ${consulta.cpf}</p>
            <p><strong>Idade:</strong> ${consulta.idade} anos</p>
            <p><strong>Motivo:</strong> ${consulta.motivo}</p>
            <p><strong>Alergias:</strong> ${consulta.alergias || 'Nenhuma'}</p>
            <p><strong>Data Solicitação:</strong> ${new Date(consulta.dataCriacao).toLocaleDateString('pt-BR')}</p>
        </div>
        <button class="btn-acao" onclick="abrirModalConfirmacao('${consulta.id}')">
            🔍 Ver Detalhes e Confirmar
        </button>
    `;
    return item;
}

// MODAL DE CONFIRMAÇÃO
function abrirModalConfirmacao(consultaId) {
    const consultas = JSON.parse(localStorage.getItem('consultasPendentes')) || [];
    consultaSelecionada = consultas.find(c => c.id === consultaId);
    
    if (!consultaSelecionada) {
        alert('Consulta não encontrada!');
        return;
    }
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-info">
            <div class="modal-info-item">
                <span class="modal-info-label">Paciente:</span>
                <span class="modal-info-value">${consultaSelecionada.nome}</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-label">CPF:</span>
                <span class="modal-info-value">${consultaSelecionada.cpf}</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-label">Idade:</span>
                <span class="modal-info-value">${consultaSelecionada.idade} anos</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-label">Motivo:</span>
                <span class="modal-info-value">${consultaSelecionada.motivo}</span>
            </div>
            <div class="modal-info-item">
                <span class="modal-info-label">Alergias:</span>
                <span class="modal-info-value">${consultaSelecionada.alergias || 'Nenhuma informada'}</span>
            </div>
        </div>
        
        <div class="priority-form">
            <label><strong>Definir Nível de Prioridade:</strong></label>
            <div class="priority-buttons">
                <button type="button" class="priority-btn baixa" data-prioridade="baixa" onclick="selecionarPrioridade('baixa')">
                    📊 Baixa
                </button>
                <button type="button" class="priority-btn selected" data-prioridade="media" onclick="selecionarPrioridade('media')">
                    ⚖️ Média
                </button>
                <button type="button" class="priority-btn alta" data-prioridade="alta" onclick="selecionarPrioridade('alta')">
                    🔴 Alta
                </button>
            </div>
        </div>
    `;
    
    // Resetar prioridade para média
    prioridadeSelecionada = 'media';
    document.getElementById('confirmModal').style.display = 'flex';
}

// FECHAR MODAL
function fecharModal() {
    document.getElementById('confirmModal').style.display = 'none';
    consultaSelecionada = null;
}

// SELECIONAR PRIORIDADE
function selecionarPrioridade(prioridade) {
    prioridadeSelecionada = prioridade;
    
    // Remover classe selected de todos os botões
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Adicionar classe selected ao botão clicado
    document.querySelector(`.priority-btn[data-prioridade="${prioridade}"]`).classList.add('selected');
}

// CONFIRMAR CONSULTA
function confirmarConsulta() {
    if (!consultaSelecionada) {
        alert('Nenhuma consulta selecionada!');
        return;
    }
    
    // Remover das pendentes
    let consultasPendentes = JSON.parse(localStorage.getItem('consultasPendentes')) || [];
    consultasPendentes = consultasPendentes.filter(c => c.id !== consultaSelecionada.id);
    localStorage.setItem('consultasPendentes', JSON.stringify(consultasPendentes));
    
    // Adicionar às confirmadas
    let consultasConfirmadas = JSON.parse(localStorage.getItem('consultasConfirmadas')) || [];
    const consultaConfirmada = {
        ...consultaSelecionada,
        status: 'confirmada',
        prioridade: prioridadeSelecionada,
        dataConfirmacao: new Date().toISOString(),
        dataConsulta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // +7 dias
        horario: gerarHorario(),
        medico: definirMedico(consultaSelecionada.motivo),
        numero: 'CONS_' + Date.now().toString().slice(-6)
    };
    
    consultasConfirmadas.push(consultaConfirmada);
    localStorage.setItem('consultasConfirmadas', JSON.stringify(consultasConfirmadas));
    
    // Fechar modal
    fecharModal();
    
    // Recarregar as listas
    carregarConsultasPendentes();
    carregarConsultasAgendadas();
    
    alert('Consulta confirmada com sucesso!');
}

// REJEITAR CONSULTA
function rejeitarConsulta() {
    if (!consultaSelecionada) {
        alert('Nenhuma consulta selecionada!');
        return;
    }
    
    if (confirm('Tem certeza que deseja rejeitar esta consulta?')) {
        // Remover das pendentes
        let consultasPendentes = JSON.parse(localStorage.getItem('consultasPendentes')) || [];
        consultasPendentes = consultasPendentes.filter(c => c.id !== consultaSelecionada.id);
        localStorage.setItem('consultasPendentes', JSON.stringify(consultasPendentes));
        
        // Fechar modal
        fecharModal();
        
        // Recarregar lista de pendentes
        carregarConsultasPendentes();
        
        alert('Consulta rejeitada com sucesso!');
    }
}

// FUNÇÕES AUXILIARES
function definirMedico(motivo) {
    const medicos = {
        'Estou doente': 'Dr. Carlos Silva - Clínico Geral',
        'Exame de sangue': 'Dra. Ana Santos - Hematologista',
        'Check up de rotina': 'Dr. Roberto Lima - Clínico Geral'
    };
    return medicos[motivo] || 'Dr. Silva - Clínico Geral';
}

function gerarHorario() {
    const horarios = ['08:00', '09:30', '11:00', '14:00', '15:30', '16:45'];
    return horarios[Math.floor(Math.random() * horarios.length)];
}

// FECHAR MODAL AO CLICAR FORA
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('confirmModal').style.display === 'flex') {
            fecharModal();
        }
    });
});

// FUNÇÕES DE CANCELAMENTO E REAGENDAMENTO (placeholder)
function cancelarConsultaSecretaria(consultaId) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        let consultasConfirmadas = JSON.parse(localStorage.getItem('consultasConfirmadas')) || [];
        consultasConfirmadas = consultasConfirmadas.filter(c => c.id !== consultaId);
        localStorage.setItem('consultasConfirmadas', JSON.stringify(consultasConfirmadas));
        
        carregarConsultasAgendadas();
        alert('Consulta cancelada com sucesso!');
    }
}

function reagendarConsultaSecretaria(consultaId) {
    alert('Funcionalidade de reagendamento em desenvolvimento!');
}