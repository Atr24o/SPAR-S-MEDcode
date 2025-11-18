from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Configurações iniciais
# -----------------------------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL ou SUPABASE_KEY não encontrado no .env — verifique o arquivo .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Sistema Usuários – Supabase + FastAPI + JS")

# Habilita CORS (para o JS do navegador poder acessar as rotas)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Configuração dos diretórios de arquivos estáticos e templates
# -----------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# -----------------------------
# ROTAS FRONTEND
# -----------------------------
@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("Main_page.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def login_lower(request: Request):
    return templates.TemplateResponse("Login.html", {"request": request})

@app.get("/Cadastro", response_class=HTMLResponse)
def cadastro(request: Request):
    return templates.TemplateResponse("Cadastro.html", {"request": request})


# -----------------------------
# MAPEAMENTO DO BANCO DE DADOS
# -----------------------------


# Modelo Pydantic para validação
class Usuario(BaseModel):
    id: int | None = None
    nome: str
    email: str


# -----------------------------
# ROTAS BACKEND
# -----------------------------
@app.get("/usuarios")
def listar_usuarios():
    response = supabase.table("Usuario").select("*").execute()
    return response.data

@app.get("/usuarios/{usuario_id}")
def obter_usuario(usuario_id: int):
    response = supabase.table("Usuario").select("*").eq("id", usuario_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return response.data[0]

@app.post("/usuarios")
async def criar_usuario(nome: str = Form(...), email: str = Form(...)):
    response = supabase.table("Usuario").insert({"nome": nome, "email": email}).execute()
    return {"status": "ok", "data": response.data}

@app.put("/usuarios/{usuario_id}")
def atualizar_usuario(usuario_id: int, usuario: Usuario):
    response = supabase.table("Usuario").update({"nome": usuario.nome, "email": usuario.email}).eq("id", usuario_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado para atualização")
    return response.data

@app.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int):
    response = supabase.table("Usuario").delete().eq("id", usuario_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado para exclusão")
    return {"message": "Usuário deletado com sucesso"}
