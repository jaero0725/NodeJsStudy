// Server open 문법
const express = require('express');
const app = express();
const portNumber = 8080;

// listen(서버띄울 포트번호, 콜백- 띄운호 실행할 코드)
app.listen(portNumber, function(){
    console.log('listening on ', portNumber);
});

// ~ 경로로 들어오면 ~로 보내줌 controller 기능 
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/pet', function(req, res){
    res.send('펫 용품쇼핑 사이트');     // 1. /pet 으로 접속 -> pet 관련 안내문 띄워주자 
});

app.get('/beauty', function(req, res){
    res.send('뷰티 용품 쇼핑 사이트ss');
});





