import pymysql
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flaskext.mysql import MySQL

app = Flask(__name__)
CORS(app)

mysql = MySQL()

app.config['MYSQL_DATABASE_HOST'] = 'localhost'
#app.config['MYSQL_DATABASE_PORT'] = '3306'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'rootroot'
app.config['MYSQL_DATABASE_DB'] = 'db_video_chat'
#app.config['MYSQL_DATABASE_CHARSET'] = 'utf-8'

mysql.init_app(app)

from socket_config import socketio

#from flask_socketio import SocketIO
#socketio = SocketIO(app)

# tb_users id, name, password, email

@app.route("/add-user", methods=["POST"])
def add_user():
    try:
        body = request.form
        if body["name"] and body["password"] and body["email"] and request.method == 'POST':
            # cursor = mysql.get_db().cursor()
            con = mysql.connect()
            cursor = con.cursor(pymysql.cursors.DictCursor)
            query = "INSERT INTO tb_users(name, password, email) values(%s, md5( %s), %s)"
            binData = (body["name"], body["password"], body["email"])
            cursor.execute(query, binData)
            con.commit()
            response = jsonify('Usario adicionado com exito')
            return response
            response.status_code = 200
        else:
            response = jsonify({"Error": "CJ-Eduardo"})
            response.status_code = 400
            return response

    except Exception as e:
        print(e)
    finally:
        cursor.close()
        con.close()

@app.route("/login", methods=["POST"])
def login():
    try:
        body = request.form
        if (body["name"] or body["email"]) and body["password"] and request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor(pymysql.cursors.DictCursor)
            query = "Select * from tb_users where (name like %s or email like %s) and password=md5(%s)"
            binData = (body["name"],  body["email"], body["password"])
            cursor.execute(query, binData)
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
    finally:
        cursor.close()
        con.close()

@app.route("/teste", methods=["POST"])
def teste():
    try:
        body = request.json
        if (body["name"] or body["email"]) and body["password"] and request.method == 'POST':
            con = mysql.connect()
            cursor = con.cursor(pymysql.cursors.DictCursor)

            response = jsonify(body)
            response.status_code = 200
            return response

    except Exception as e:
        print(" Error:: ", e)
    finally:
        pass
        cursor.close()
        con.close()

@app.route("/teste2", methods=["POST"])
def teste2():
    try:
        body = request.form

        response = jsonify({"body": body, "CJ": "CJ"})
        response.status_code = 200
        return response

    except Exception as e:
        print(" Error:: ", e)
    finally:
        pass

@app.route("/")
def home():
    return "home of api"

if __name__ == "__main__":
    app.run()
    #socketio.run(app)