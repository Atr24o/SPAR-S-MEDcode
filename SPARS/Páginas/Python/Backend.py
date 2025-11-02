from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///SPAR.db'  # nome do banco
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# MODELOS

class Paciente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(200), nullable=False)

    # Método para criar senha criptografada
    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    # Método para checar senha
    def checar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

class Medico(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    senha_hash = db.Column(db.String(200), nullable=False)

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def checar_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)
