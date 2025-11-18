from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import SraticFileserver
from fastapi.templating import Jinja2Templates
from supabase import create_client, Client
from pydantic import BaseModel
import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


SUPABASE_URL = "https://azdiqogdttqolcsowink.supabase.co"  
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZGlxb2dkdHRxb2xjc293aW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzc2MTEsImV4cCI6MjA3ODY1MzYxMX0.pjgF15YhIug7wsuQ__wgQ_autyv5ypzAO9xFiszYXWs"   

# 1. Inicializa o cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="SPARS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/Html/JavaScript", StaticFiles(directory="js"), name="js")
templates = Jinja2Templates(directory="templates")

# -----------------------------
# ROTAS FRONTEND
# -----------------------------
@app.get("/Main_page.html", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("Main_page.html", {"request": request})

@app.get("/Cadastro" and "/Login.html", response_class=HTMLResponse)
def cadastro(request: Request):
    return templates.TemplateResponse("Cadastro.html" and "Login.html", {"request": request})


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
