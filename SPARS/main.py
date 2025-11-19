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

# pip install fastapi
# pip install dotenv
# pip install supabase
# pip install pydantic
# pip install jinja2
# pip install uvicorn #se precisar


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
def login_lower(request: Request):
    return templates.TemplateResponse("Login.html", {"request": request})

@app.get("/Cadastro", response_class=HTMLResponse)
def cadastro(request: Request):
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
    response = supabase.table("User").select("*").eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User não encontrado")
    return response.data[0]

@app.put("/user/{user_id}")
def atualizar_user(user_id: int, user: User):
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

@app.delete("/user/{user_id}")
def deletar_user(user_id: int):
    response = supabase.table("User").delete().eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User não encontrado para exclusão")
    return {"message": "User deletado com sucesso"}


# para ligar o servidor, abra um novo terminal e digite:
# ________________________________
# uvicorn main:app --reload
# -------------------------------

# para acessar o navegador abra um novo terminal e digite:
# ____________________________________________________
# python -m webbrowser "http://127.0.0.1:8000"
# ----------------------------------------------------

