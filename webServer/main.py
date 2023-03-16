import pymysql
from flask import jsonify

from flask import request
from app import app
from mysql_config import mysql
from socket_config import socketio

#from flask_socketio import SocketIO
#socketio = SocketIO(app)

# tb_users id, name, password, email
con = mysql.connect()
cursor = con.cursor(pymysql.cursors.DictCursor)

@app.route("/add-user", methods=["POST"])
def add_user():
    try:
        body = request.form
        if body["name"] and body["password"] and body["email"] and request.method == 'POST':
            # cursor = mysql.get_db().cursor()

            query = "INSERT INTO tb_users(name, email, password) values(%s, %s, md5(%s))"
            binData = (body["name"], body["email"], body["password"])
            cursor.execute(query, binData)
            con.commit()
            response = jsonify('Usario adicionado com exito')
            response.status_code = 201
            return response
        else:
            response = jsonify({"Error": "CJ-Eduardo"})
            response.status_code = 400
            return response

    except Exception as e:
        print(e)

@app.route("/login", methods=["POST"])
def login():
    try:
        body = request.form
        if (body["email"]) and body["password"] and request.method == 'POST':
            query = "Select id, name, email from tb_users where (email like %s) and password=md5(%s)"
            bind = (body["email"], body["password"])
            cursor.execute(query, bind)
            data = cursor.fetchone()

            if not data:
                response = jsonify("usuário ou senha incorretos")
                response.status_code = 404
                return response
            response = jsonify(data)
            response.status_code = 200
            return response
        else:
            response = jsonify({"Error": "CJ-Eduardo"})
            response.status_code = 400
            return response

    except Exception as e:
        print(e)


@app.route("/add-comment", methods=["POST"])
def add_comment():
    try:
        body = request.form
        if (body["id_sender"]) and body["id_receptor"] and body["message"] and request.method == 'POST':
            query = "insert into tb_message_chat(id_sender, id_receptor, message) values(%s,%s,%s)"
            bind = (body["id_sender"], body["id_receptor"], body["message"])
            cursor.execute(query, bind)
            con.commit()
            response = jsonify('comentario adicionado com exito!')
            response.status_code = 201
            return response
        else:
            response = jsonify({"Error": "CJ-Eduardo"})
            response.status_code = 400
            return response
    except Exception as e:
        print(e)

@app.route("/teste", methods=["POST"])
def teste():
    try:
        body = request.json
        if (body["name"] or body["email"]) and body["password"] and request.method == 'POST':
            response = jsonify(body)
            response.status_code = 200
            return response

    except Exception as e:
        print(" Error:: ", e)

@app.route("/")
def home():
    return "home of api"

@app.route("/get-users")
def get_users():
    query = "Select id, name, email from tb_users"
    cursor.execute(query)
    data = cursor.fetchall()

    response = jsonify(data)
    response.status_code = 200
    return response

@app.route("/message-chat/sender/<int:id_sender>/recept/<int:id_receptor>")
def get_messages(id_sender, id_receptor):
    query = "Select * from tb_message_chat where (id_sender=%s and id_receptor=%s) or (id_sender=%s and id_receptor=%s)"
    cursor.execute(query, (id_sender, id_receptor, id_receptor, id_sender))
    data = cursor.fetchall()
    print(data)

    response = jsonify(data)
    response.status_code = 200
    return response


if __name__ == "__main__":
    app.run( port=8000 )
    #socketio.run(app)