# 🏥 SPAR — **Sistema Próprio de Agendamento Rápido**

Bem-vindo(a) ao **SPAR**! 🚀  
Nosso objetivo é **revolucionar** o processo de **agendamento e atendimento médico**, tornando tudo **mais rápido, prático e eficiente** — tanto para pacientes quanto para médicos.

---

## 💡 O que é o SPAR?

O **SPAR (Sistema Próprio de Agendamento Rápido)** é uma plataforma web desenvolvida para **simplificar o processo de marcação de consultas** e a **comunicação entre pacientes e profissionais de saúde**.  
Cansado da burocracia e da demora para agendar um atendimento? 😩  
Com o SPAR, tudo isso fica no passado! ✨  

---

## 👥 Tipos de Usuário


### 🧑‍⚕️ Médicos
- Acessam **todos os agendamentos** com facilidade;
- Podem **notificar pacientes diretamente** sobre:
  - 📄 Documentos necessários;
  - 🔁 Remarcações;
  - 🗣️ Observações e avisos importantes;
- Tudo isso de forma **ágil, organizada e intuitiva**.

### 🧍 Pacientes
- Realizam **agendamentos rápidos e simples**;
- Visualizam **consultas já marcadas**;
- Recebem **notificações diretas dos médicos**;
- Tudo em um ambiente **amigável e seguro**! 🩺

---

## ⚙️ Tecnologias Utilizadas

- 🖥️ **Front-end:** HTML / CSS / JAVA SCRIPT
- 🧠 **Back-end:** PYTHON  
- 🗄️ **Banco de Dados:** SUPABASE  

---

## 🚀 Objetivo

Tornar o processo de **agendamento médico algo rápido, fácil e confiável**, reduzindo filas, ligações e confusões de horário.  
O SPAR é o elo que conecta **quem cuida da saúde** com **quem precisa de cuidados** ❤️  

---

# SPARS - Sistema Próprio de Agendamento Rápido

Sistema de agendamento médico desenvolvido com FastAPI, Supabase e frontend moderno.

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Conta no [Supabase](https://supabase.com)

### 1. Clone e prepare o ambiente
```bash
# Baixe e descompacte o repositório
# Abra a pasta SPARS no VSCode
# Abra um terminal no VSCode
```

### 2. Instale as dependências
Execute no terminal (uma por vez):
```bash
pip install fastapi
pip install python-dotenv
pip install supabase
pip install pydantic
pip install jinja2
pip install uvicorn
```

**Caso encontre erros, use:**
```bash
python -m pip install [nome_da_dependencia]
```


### 3. Execute o servidor
Abra um **novo terminal** e execute:
```bash
uvicorn main:app --reload
```
ou
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Acesse a aplicação
Abra um **novo terminal** e execute:
```bash
python -m webbrowser "http://127.0.0.1:8000"
```

Ou acesse manualmente: http://localhost:8000

## 📋 Funcionalidades
- ✅ Cadastro de usuários (Pacientes e Médicos)
- ✅ Sistema de login
- ✅ Interface responsiva
- ✅ Integração com Supabase
- ✅ API REST completa

## 🛑 Parar o servidor
No terminal onde o servidor está rodando:
```bash
Ctrl + C
```
Ou force o fechamento:
```bash
taskkill /f /im python.exe
```

## 🏗️ Estrutura do Projeto
```
SPARS/
├── main.py              # Servidor FastAPI
├── templates/           # Arquivos HTML
├── static/             # CSS, JS e imagens
└── .env               # Variáveis de ambiente
```

---


## 📸 Demonstração

| Tela de Login | Painel do Paciente | Painel do Médico |
|---------------|-------------------|------------------|
| <img width="1920" height="1080" alt="download" src="https://github.com/user-attachments/assets/47134288-a23b-4085-a2ad-f4a9bd6f9012" /> | EM DESENVOLVIMENTO | EM DESENVOLVIMENTO |

---

## 🧩 Contribuindo

Quer ajudar o SPAR a crescer?  
Sinta-se à vontade para:
1. Fazer um **fork** deste repositório 🍴  
2. Criar sua **branch de feature** (`git checkout -b feature/nome-da-feature`)  
3. Fazer o **commit** (`git commit -m 'Adiciona nova feature'`)  
4. Enviar um **pull request**! 💙  

---

## 💬 Contato

📧 **E-mail:** MEDcodeSPAR@gmail.com

---

## 🩵 Feito com dedicação pela equipe **SPAR MEDcode**
- <a href="https://github.com/Atr24o">Arthur Henrique</a>(Project Owner)
- <a href="https://github.com/verstl0l">Victor Rodrigues</a> (Scrum Master)
- <a href="https://github.com/LoucuraGames">Gabriel Lucas</a>
- <a href="https://github.com/Caduccus">Jeferson Lira</a>
- <a href="https://github.com/But069">Gabriel Elias</a>
- <a href="https://github.com/Ryancm1234">Ryan Carlos</a>
- <a href="https://github.com/Guilherme49121">Guilherme Oliveira</a>
> “Agendar uma consulta nunca foi tão rápido!” 💫
