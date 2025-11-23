from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import traceback

#intale as dependências necessárias no terminal:

# pip install fastapi
# pip install dotenv
# pip install supabase
# pip install pydantic
# pip install jinja2
# pip install uvicorn 
# pip install python-multipart

#caso nao funcione o ex:"pip install supabase", tente:
# python -m pip install {nome da dependencia}

# -----------------------------
# Configurações iniciais
# -----------------------------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL ou SUPABASE_KEY não encontrado no .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Sistema User – Supabase + FastAPI + JS")

# Habilita CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração dos diretórios
# Certifique-se de que as pastas 'static' e 'templates' existem
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# -----------------------------
# MODELO COMPLETO
# -----------------------------
class User(BaseModel):
    id: int | None = None
    Tipo_Usuario: str
    Nome: str
    Email: str
    Senha: str
    CRM: str | None = None  # Opcional (apenas para médicos)
    CPF: str

# -----------------------------
# ROTAS FRONTEND
# -----------------------------
@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("Main_page.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request, tipo: str = None):
    return templates.TemplateResponse("Login.html", {
        "request": request, 
        "tipo_usuario": tipo
    })

@app.get("/Cadastro", response_class=HTMLResponse)
def cadastro_page(request: Request):
    return templates.TemplateResponse("Cadastro.html", {"request": request})

# -----------------------------
# ROTAS BACKEND
# -----------------------------
@app.get("/user")
def listar_user():
    try:
        response = supabase.table("User").select("*").execute()
        return response.data
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.post("/user")
async def criar_user(
    Tipo_Usuario: str = Form(...),
    Nome: str = Form(...),
    Email: str = Form(...),
    Senha: str = Form(...),
    CRM: str = Form(None),
    CPF: str = Form(...)
):
    try:
        # Validações básicas
        if not Nome or not Email or not Senha or not CPF:
            raise HTTPException(status_code=400, detail="Campos obrigatórios não preenchidos")

        if Tipo_Usuario == "Médico" and not CRM:
            raise HTTPException(status_code=400, detail="CRM obrigatório para médicos")

        # Verificar se email já existe
        existing_user = supabase.table("User").select("*").eq("Email", Email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        user_data = {
            "Tipo_Usuario": Tipo_Usuario,
            "Nome": Nome,
            "Email": Email,
            "Senha": Senha,
            "CPF": CPF
        }

        # Adiciona CRM apenas se fornecido (para médicos)
        if CRM:
            user_data["CRM"] = CRM

        response = supabase.table("User").insert(user_data).execute()
        return {"status": "ok", "data": response.data}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.get("/user/{user_id}")
def obter_user(user_id: int):
    try:
        response = supabase.table("User").select("*").eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User não encontrado")
        return response.data[0]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.put("/user/{user_id}")
def atualizar_user(user_id: int, user: User):
    try:
        user_data = {
            "Tipo_Usuario": user.Tipo_Usuario,
            "Nome": user.Nome,
            "Email": user.Email,
            "Senha": user.Senha,
            "CRM": user.CRM,
            "CPF": user.CPF
        }
        response = supabase.table("User").update(user_data).eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User não encontrado para atualização")
        return response.data
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.delete("/user/{user_id}")
def deletar_user(user_id: int):
    try:
        response = supabase.table("User").delete().eq("id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="User não encontrado para exclusão")
        return {"message": "User deletado com sucesso"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

@app.post("/login")
async def login_user(request: Request):
    try:
        print("📨 Headers da requisição:", dict(request.headers))
        print("📦 Tipo de conteúdo:", request.headers.get("content-type"))
        
        # Ler dados baseado no content-type
        content_type = request.headers.get("content-type", "")
        
        if "application/x-www-form-urlencoded" in content_type:
            form_data = await request.form()
            print("📊 FormData recebido:", dict(form_data))
            usuario = form_data.get("usuario")
            senha = form_data.get("senha")
        elif "application/json" in content_type:
            json_data = await request.json()
            print("📊 JSON recebido:", json_data)
            usuario = json_data.get("usuario")
            senha = json_data.get("senha")
        else:
            # Tentar ler como form data de qualquer maneira
            try:
                form_data = await request.form()
                usuario = form_data.get("usuario")
                senha = form_data.get("senha")
                print("📊 FormData (fallback):", dict(form_data))
            except:
                raise HTTPException(status_code=400, detail="Formato de dados não suportado")
        
        print(f"🔐 Dados extraídos: usuario='{usuario}', senha='{senha}'")
        
        if not usuario or not senha:
            raise HTTPException(status_code=400, detail="Usuário e senha são obrigatórios")

        # Resto do código continua igual...
        response = supabase.table("User").select("*").eq("Email", usuario).execute()
        
        if not response.data:
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

        user = response.data[0]
        
        if user["Senha"] != senha:
            raise HTTPException(status_code=401, detail="Usuário ou senha incorretos")

        return {
            "status": "ok", 
            "message": "Login realizado com sucesso", 
            "user": {
                "id": user["id"],
                "nome": user["Nome"],
                "email": user["Email"],
                "tipo_usuario": user["Tipo_Usuario"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Erro no login: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

# Rota de saúde da API
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API está funcionando"}


@app.get("/debug-users")
def debug_users():
    try:
        users = supabase.table("User").select("*").execute()
        print("👥 Usuários no banco:", users.data)
        return {
            "total_users": len(users.data), 
            "users": users.data
        }
    except Exception as e:
        return {"error": str(e)}

# para ligar o servidor, abra um novo terminal e digite:
# ________________________________
# uvicorn main:app --reload 
# ou 
# python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
# -------------------------------

# para acessar o navegador abra um novo terminal e digite:
# ____________________________________________________
# python -m webbrowser "http://127.0.0.1:8000"
# ----------------------------------------------------

#para fechar o server, abre um novo terminal e use:
#  taskkill /f /im python.exe   