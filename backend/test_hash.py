import hashlib

senha = "123456"
print(hashlib.sha256(senha.encode("utf-8")).hexdigest())
