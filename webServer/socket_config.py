from flask_socketio import SocketIO
from app import app

app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def test_connect(auth):
    socketio.emit('my response', {'data': 'Connected'})
    print('Client connected')


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')\

@socketio.on('my event')
def test_disconnect(data):
    print(data)

@socketio.on('sendMessage')
def sendMessage(data):
    print('Client send a message')
    id_sender = data['id_sender']
    id_recept = data['id_recept']
    socketio.emit("receive-message", data, broadcast=True)


@socketio.on('')


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['user_id']
    socketio.join_room(room)
    socketio.send(username + ' has entered the room.', to=room)


