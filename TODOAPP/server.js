// Server open 문법
const express = require('express');
const app = express();
const PORT  = 8080;

//bodyParser 사용 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

//mongo db 연결
const MongoClient = require('mongodb').MongoClient;
const MONGO_DB_URL =  'mongodb+srv://admin:qwer1234@cluster0.hqfk8sx.mongodb.net/todoapp?retryWrites=true&w=majority';
app.set('view engine','ejs');       //vue, react 사용 가능 

var db; // 이게 Database임

MongoClient.connect(MONGO_DB_URL, function(err, database){
    if(err) return console.log(err);

    db = database.db('todoapp');  // todoapp 이라는 db에 연결

    app.listen(PORT , () => {  
        console.log('listening on ', PORT );
    });

});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

app.get('/list', (req, res) => {
    res.render('list.ejs');
});

app.post('/add', (req, res) => {
    let todo = req.body; 
    db.collection('post').insertOne(todo, (err, res) => {
        console.log("저장 완료");
    });  

    return res.redirect("/write");
});