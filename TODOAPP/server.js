// Server open 문법
const express = require('express');
const app = express();
const PORT  = 8080;

//bodyParser 사용 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

//
const propertiesReader = require('properties-reader');
const properties = propertiesReader('application.properties');

//mongo db 연결
const MongoClient = require('mongodb').MongoClient;
const MONGO_DB_URL =  properties.get("MONGO_DB_URL");
app.set('view engine','ejs');       //vue, react 사용 가능 

var db; // 이게 Database임
MongoClient.connect(MONGO_DB_URL, function(err, database){
    if(err) return console.log(err);

    db = database.db('todoapp');  // todoapp 이라는 db에 연결

    app.listen(PORT , () => {  
        console.log('listening on ', PORT ," | " , properties.get("MONGO_DB_URL"));
    });
   
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html');
});

/** /add : 게시글 추가하기 */ 
app.post('/add', (req, res) => {
    let todo = req.body; 
    db.collection("counter").findOne({name :'게시물갯수'}, (err, data) => {    // auto increment => mongo db는 없음 :직접구현
        // counter : sequence 역할 
        todo._id = data.totalPost;

        db.collection('post').insertOne(todo, (err, data) => {
            if (err) throw err;
            console.log("저장 완료");
        });  

        db.collection("counter").updateOne({name :'게시물갯수'}, {$inc : {totalPost : 1}}, (err, data)  => {
            if (err) console.log("error : sequence[counter] update error");
            else console.log("1 document updated");
        });
        
    });
    return res.redirect("/write");
});

/** /list : 전체 목록 보기*/ 
app.get('/list', (req, res) => {
    //db 에 저장된 post 라는 collection안의 모든 데이터를 꺼내주세요. 
   db.collection("post").find().toArray((err, data)=>{
       res.render('list.ejs', { todoList : data }); //views에 넣어두어야됨
   });  // 이렇게 하면 모두 가져옴.. 
});

/** /delete/#{id}  : 특정 TODOList 삭제 */ 
app.delete('/posts/:id', (req, res) => {
    req.body._id = parseInt(req.body._id);
    db.collection("post").deleteOne(req.body, (err, data)=>{
        if (err) throw err;
        console.log("1 document deleted");
        res.send('삭제완료');
    });
})