### ***🎬 FILMINIS – README Oficial***

### ***👤 Usuários já cadastrados***

#### ***Administrador***
- **Usuário:** `admin`
- **Senha:** `123456`

#### ***Usuário comum***
- **Usuário:** `fer`
- **Senha:** `fer`

#### ***Inserir no MySQL***
```sql
INSERT INTO usuarios (username, email, senha, is_admin)
VALUES ('admin', 'admin@filminis.com', SHA2('123456',256), 1);

INSERT INTO usuarios (username, email, senha, is_admin)
VALUES ('fer', 'fer@filminis.com', SHA2('fer',256), 0);


🛠️ 1. Requisitos
🔧 Backend

Python 3.10+

MySQL Server

pip instalado

💻 Frontend

Node.js 18+

npm

🗄️ 2. Configurar o Banco MySQL
Criar o banco
CREATE DATABASE filmesdb;
USE filmesdb;

Criar as tabelas
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0
);

CREATE TABLE filmes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    genero VARCHAR(120) NOT NULL,
    diretor VARCHAR(120) NOT NULL,
    sinopse TEXT NOT NULL,
    poster TEXT NOT NULL,
    duracao VARCHAR(50),
    aprovado TINYINT(1) DEFAULT 0,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

🚀 3. Rodar o Backend Python
Arquivo principal

main.py

Instalar dependências
pip install mysql-connector-python pyjwt

Ajustar configurações do banco
DB_CONFIG = {
    "user": "root",
    "password": "fer123",   # altere se sua senha for outra
    "host": "127.0.0.1",
    "database": "filmesdb"
}

Iniciar o servidor
python main.py

Backend disponível em

👉 http://127.0.0.1:8000

🌐 4. Rodar o Frontend React
Instalar dependências
npm install

Rodar o front
npm run dev

Frontend disponível em

👉 http://localhost:3000
