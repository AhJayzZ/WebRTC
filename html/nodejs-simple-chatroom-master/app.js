var fs = require('fs');
var https = require('https');
var express = require('express')
var app = express();

var options = {
    key: fs.readFileSync('../../key/server.key'),
    cert: fs.readFileSync('../../key/server.crt'),
}

var server = https.createServer(options, app);
var io = require('socket.io')(server);
var nicknames = [];

server.listen(5000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.use('/public', express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    socket.on('new user', function(data) {
        console.log(data);
        if (nicknames.indexOf(data) != -1) {

        } else {
            socket.emit('chat', 'SERVER', '歡迎光臨 ' + data);

            socket.nickname = data;
            nicknames.push(socket.nickname);
            io.sockets.emit('usernames', nicknames);
            updateNicknames();
        }
    });

    function updateNicknames() {
        io.sockets.emit('usernames', nicknames);
    }

    //
    socket.on('send message', function(data) {
        io.sockets.emit('new message', { msg: data, nick: socket.nickname });
    });

    socket.on('disconnect', function(data) {
        if (!socket.nickname) return;
        io.sockets.emit('chat', 'SERVER', socket.nickname + ' 離開了聊天室～');
        nicknames.splice(nicknames.indexOf(socket.nickname), 1);
        updateNicknames();
    });
});