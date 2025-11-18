import http.server
import socketserver
import json
import jwt
import mysql.connector
import hashlib
import time
from urllib.parse import urlparse

# ---------------------- CONFIGURAÇÃO ----------------------
# host/porta do servidor + configs de JWT e MySQL

HOST = "127.0.0.1"
PORT = 8000

JWT_SECRET = "SEGREDO_MUITO_SEGURO_E_COMPLEXO"
JWT_ALGORITHM = "HS256"

DB_CONFIG = {
    "user": "root",
    "password": "fer123",
    "host": "127.0.0.1",
    "database": "filmesdb"
}

# função que cria conexão com banco
def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG, autocommit=True)
    except mysql.connector.Error as err:
        print(f"Erro ao conectar ao MySQL: {err}")
        return None

#  hash senha, criar JWT, validar JWT

def hash_password(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def generate_jwt(user_id, username, is_admin):
    payload = {
        "id": user_id,
        "username": username,
        "role": "admin" if is_admin else "user",
        "exp": time.time() + 60 * 60 * 24     # expira em 24h
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def validate_jwt(headers):
    auth = headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth.split(" ")[1]

    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        return None


# ---------------------- HANDLER ----------------------
# (GET/POST/PUT/DELETE)

class PurePythonServer(http.server.BaseHTTPRequestHandler):


    def format_filme(self, cursor, row):
        if not row:
            return None
        col_names = [desc[0] for desc in cursor.description]
        return {col_names[i]: row[i] for i in range(len(col_names))}


    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "http://localhost:3000")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()


    def send_json_response(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))


    def get_json_data(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            if length > 0:
                return json.loads(self.rfile.read(length).decode("utf-8"))
            return {}
        except:
            return {}

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    # ---------------------- POST ----------------------

    def do_POST(self):
        parsed = urlparse(self.path)
        raw_path = parsed.path
        path = raw_path.rstrip("/")        
        data = self.get_json_data()

        conn = get_db_connection()
        if not conn:
            return self.send_json_response(500, {"error": "Erro no banco"})
        cursor = conn.cursor()

        try:
            # --- REGISTER ---
            # cria usuário normal
            if path == "/register":
                username = data.get("username")
                email = data.get("email")
                password = data.get("password")

                if not username or not email or not password:
                    return self.send_json_response(400, {"error": "Todos os campos são obrigatórios"})

                hashed = hash_password(password)

                try:
                    cursor.execute(
                        "INSERT INTO usuarios (username, email, senha, is_admin) VALUES (%s,%s,%s,0)",
                        (username, email, hashed)
                    )
                    return self.send_json_response(201, {"message": "Usuário criado"})
                except mysql.connector.IntegrityError:
                    return self.send_json_response(409, {"error": "Usuário ou email já existe"})

            # --- LOGIN ---
            #  retorna JWT
            elif path == "/login":
                username = data.get("username")
                password = data.get("password")

                if not username or not password:
                    return self.send_json_response(400, {"error": "Usuário e senha obrigatórios"})

                hashed = hash_password(password)

                cursor.execute(
                    "SELECT id, username, is_admin, senha FROM usuarios WHERE username=%s",
                    (username,)
                )
                user = cursor.fetchone()

                if user and user[3] == hashed:
                    token = generate_jwt(user[0], user[1], bool(user[2]))
                    return self.send_json_response(200, {
                        "token": token,
                        "role": "admin" if user[2] else "user",
                        "username": username
                    })

                return self.send_json_response(401, {"error": "Credenciais inválidas"})

            # --- ADICIONAR FILME ---
            elif path == "/filmes":
                payload = validate_jwt(self.headers)
                if not payload:
                    return self.send_json_response(401, {"error": "Não autorizado"})

                required = ["titulo", "ano", "genero", "diretor", "sinopse", "poster"]
                if not all(data.get(k) for k in required):
                    return self.send_json_response(400, {"error": "Campos obrigatórios faltando"})

                # se admin -> já aprova, se user -> vai como pendente
                aprovado = 1 if payload["role"] == "admin" else 0

                cursor.execute(
                    """INSERT INTO filmes (titulo, ano, genero, diretor, sinopse, poster, duracao, aprovado, usuario_id)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (
                        data["titulo"], data["ano"], data["genero"], data["diretor"],
                        data["sinopse"], data["poster"], data.get("duracao"),
                        aprovado, payload["id"]
                    )
                )
                return self.send_json_response(201, {"message": "Filme adicionado"})

            # --- APROVAR FILME ---
            elif path.endswith("/aprovar"):
                payload = validate_jwt(self.headers)
                if not payload or payload["role"] != "admin":
                    return self.send_json_response(403, {"error": "Acesso negado"})

                partes = path.split("/")
                try:
                    filme_id = int(partes[-2])
                except:
                    return self.send_json_response(400, {"error": "ID inválido"})

                cursor.execute("UPDATE filmes SET aprovado = 1 WHERE id=%s", (filme_id,))
                cursor.execute("SELECT * FROM filmes WHERE id=%s", (filme_id,))
                row = cursor.fetchone()
                filme = self.format_filme(cursor, row)

                return self.send_json_response(200, filme)

            # --- DESAPROVAR FILME ---
            elif path.endswith("/desaprovar"):
                payload = validate_jwt(self.headers)
                if not payload or payload["role"] != "admin":
                    return self.send_json_response(403, {"error": "Acesso negado"})

                partes = path.split("/")
                try:
                    filme_id = int(partes[-2])
                except:
                    return self.send_json_response(400, {"error": "ID inválido"})

                cursor.execute("UPDATE filmes SET aprovado = 0 WHERE id=%s", (filme_id,))
                cursor.execute("SELECT * FROM filmes WHERE id=%s", (filme_id,))
                row = cursor.fetchone()
                filme = self.format_filme(cursor, row)

                return self.send_json_response(200, filme)

            return self.send_json_response(404, {"error": "Rota POST não existe"})

        finally:
            cursor.close()
            conn.close()

    # ---------------------- GET ----------------------
    # lista filmes

    def do_GET(self):
        parsed = urlparse(self.path)
        raw_path = parsed.path
        path = raw_path.rstrip("/")

        payload = validate_jwt(self.headers)
        is_admin = payload and payload["role"] == "admin"

        conn = get_db_connection()
        if not conn:
            return self.send_json_response(500, {"error": "Erro no banco"})
        cursor = conn.cursor(dictionary=True)

        try:
            # --- LISTAR FILMES ---
            if path == "/filmes":
                sql = "SELECT * FROM filmes"
                if not is_admin:
                    sql += " WHERE aprovado = 1"  
                cursor.execute(sql)
                filmes = cursor.fetchall()

                return self.send_json_response(200, {"filmes": filmes})

            # --- DETALHE FILME ---
            elif path.startswith("/filmes/"):
                try:
                    filme_id = int(path.split("/")[-1])
                except:
                    return self.send_json_response(400, {"error": "ID inválido"})

                cursor.execute("SELECT * FROM filmes WHERE id=%s", (filme_id,))
                filme = cursor.fetchone()

                if not filme:
                    return self.send_json_response(404, {"error": "Não encontrado"})


                if filme["aprovado"] == 0 and not is_admin:
                    return self.send_json_response(403, {"error": "Não permitido"})

                return self.send_json_response(200, filme)

            return self.send_json_response(404, {"error": "Rota GET não existe"})

        finally:
            cursor.close()
            conn.close()

# ---------------------- PUT (EDITAR FILME) ----------------------

    def do_PUT(self):
        parsed = urlparse(self.path)
        raw_path = parsed.path
        path = raw_path.rstrip("/")
        data = self.get_json_data()

        # precisa estar logado
        payload = validate_jwt(self.headers)
        if not payload:
            return self.send_json_response(401, {"error": "Não autorizado"})

        if not path.startswith("/filmes/"):
            return self.send_json_response(404, {"error": "Rota PUT não existe"})

        # pega ID do filme
        try:
            filme_id = int(path.split("/")[-1])
        except:
            return self.send_json_response(400, {"error": "ID inválido"})

        conn = get_db_connection()
        if not conn:
            return self.send_json_response(500, {"error": "Erro no banco"})
        cursor = conn.cursor(dictionary=True)

        try:
            # pega filme e valida dono/admin
            cursor.execute("SELECT * FROM filmes WHERE id=%s", (filme_id,))
            filme = cursor.fetchone()

            if not filme:
                return self.send_json_response(404, {"error": "Filme não encontrado"})

            is_admin = payload["role"] == "admin"
            is_owner = filme.get("usuario_id") == payload["id"]

            # user normal só edita o que ele criou
            if not is_admin and not is_owner:
                return self.send_json_response(403, {"error": "Você não pode editar esse filme"})

            # atualiza só campos enviados
            campos = ["titulo", "ano", "genero", "diretor", "duracao", "sinopse", "poster"]
            updates = []
            values = []

            for c in campos:
                if c in data:
                    updates.append(f"{c}=%s")
                    values.append(data[c])

            if not updates:
                return self.send_json_response(400, {"error": "Nada para atualizar"})

            values.append(filme_id)

            cursor.execute(
                f"UPDATE filmes SET {', '.join(updates)} WHERE id=%s",
                values
            )

            # retorna atualizado
            cursor.execute("SELECT * FROM filmes WHERE id=%s", (filme_id,))
            filme_atualizado = cursor.fetchone()

            return self.send_json_response(200, filme_atualizado)

        finally:
            cursor.close()
            conn.close()


    # ---------------------- DELETE ----------------------
    # só admin

    def do_DELETE(self):
        parsed = urlparse(self.path)
        raw_path = parsed.path
        path = raw_path.rstrip("/")

        payload = validate_jwt(self.headers)
        if not payload or payload["role"] != "admin":
            return self.send_json_response(403, {"error": "Acesso negado"})

        if path.startswith("/filmes/"):
            try:
                filme_id = int(path.split("/")[-1])
            except:
                return self.send_json_response(400, {"error": "ID inválido"})

            conn = get_db_connection()
            if not conn:
                return self.send_json_response(500, {"error": "Erro no banco"})
            cursor = conn.cursor()

            try:
                cursor.execute("DELETE FROM filmes WHERE id=%s", (filme_id,))
                return self.send_json_response(200, {"message": "Filme deletado"})
            finally:
                cursor.close()
                conn.close()

        return self.send_json_response(404, {"error": "Rota DELETE não existe"})


# ---------------------- RUN SERVER ----------------------
# inicia o servidor Python

def run_server():
    print(f"Servidor rodando em http://{HOST}:{PORT}")
    with socketserver.TCPServer((HOST, PORT), PurePythonServer) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor finalizado.")


if __name__ == "__main__":
    run_server()
