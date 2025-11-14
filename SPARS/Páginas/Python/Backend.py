from supabase import create_client, Client


SUPABASE_URL = "https://azdiqogdttqolcsowink.supabase.co"  
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZGlxb2dkdHRxb2xjc293aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzc2MTEsImV4cCI6MjA3ODY1MzYxMX0.pjgF15YhIug7wsuQ__wgQ_autyv5ypzAO9xFiszYXWs"   

# 1. Inicializa o cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- DADOS DO NOVO USUÁRIO (MÉDICO PARA ESTE EXEMPLO) ---
email = "medico.exemplo@hospital.com"
senha = "senha_muito_segura"
username = "Dr. Silva"
crm = "CRM/SP 123456"
tipo_usuario = "medico" # Ou "paciente"

try:
    # 2. REGISTRO (Sign Up)
    # Isso armazena email e senha em 'auth.users'
    print(f"Tentando registrar {email}...")
    user_response = supabase.auth.sign_up(
        email=email,
        password=senha
    )
    
    # Pega o ID único gerado pelo Supabase
    user_id = user_response.user.id
    print(f"Usuário registrado com sucesso! ID: {user_id}")

    # 3. CRIAÇÃO DO PERFIL ESPECÍFICO
    if tipo_usuario == "medico":
        # Insere dados na tabela 'medico'
        dados_perfil = {
            "id": user_id,  # Vinculando o perfil ao ID de autenticação
            "username": username,
            "crm": crm
        }
        tabela_perfil = "medico"

    elif tipo_usuario == "paciente":
        # Se fosse um paciente, você usaria o CPF:
        cpf = "111.222.333-44" 
        dados_perfil = {
            "id": user_id,
            "username": username,
            "cpf": cpf
        }
        tabela_perfil = "paciente"
    
    else:
        raise ValueError("Tipo de usuário inválido.")
    
    # Insere o perfil no banco de dados
    print(f"Criando perfil em '{tabela_perfil}'...")
    data, count = supabase.table(tabela_perfil).insert(dados_perfil).execute()
    
    print("✅ Perfil criado com sucesso:")
    print(data)

except Exception as e:
    print(f"❌ Ocorreu um erro: {e}")
