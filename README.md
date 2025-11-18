###  FILMINIS

###  Usuários já cadastrados

#### Administrador
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


 1. Requisitos
 Backend

Python 3.10+

MySQL Server

pip instalado

 Frontend

Node.js 18+

npm

 2. Configurar o Banco MySQL

ENTRE NO ARQUIVO QUE ESTA JUNTO COM O README


3. Rodar o Backend Python
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

 http://127.0.0.1:8000

 4. Rodar o Frontend React
Instalar dependências
npm install

Rodar o front
npm run dev

Frontend disponível em

 http://localhost:3000

```
###  DOCUMENTAÇÃO
[doc.docx](https://github.com/user-attachments/files/23593552/doc.docx)


###  Figma
https://www.figma.com/design/bHkYJ3uprbAliOb3jn3qrS/Movie?node-id=0-1&t=gmz1izCVE7G96FEC-1


