// Server open 문법
const express = require('express');
const app = express();
const PORT  = 8080;

//bodyParser 사용 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

// properties 가져오기 
const propertiesReader = require('properties-reader');
const properties = propertiesReader('application.properties');

//mongo db 연결
const MongoClient = require('mongodb').MongoClient;
const MONGO_DB_URL =  properties.get("MONGO_DB_URL");
app.set('view engine','ejs');       //vue, react 사용 가능 

// 미들웨어 
app.use('/public', express.static('public'));

// 메서드 오버라이드 - PUT 사용 
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

var db; // 이게 Database임
MongoClient.connect(MONGO_DB_URL, function(err, database){
    if(err) return console.log(err);

    db = database.db('todoapp');  // todoapp 이라는 db에 연결

    app.listen(PORT , () => {  
        console.log('listening on ', PORT);
    });
   
});

//페이지 이동 
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/write', (req, res) => {
    res.render('write.ejs');
});

app.get('/posts/edit/:id', (req, res) => {
    db.collection("post").findOne({ _id : parseInt(req.params.id) }, (err, data) => {
        if (err) throw err;
        res.render('edit.ejs', { todo : data });
    });  
});

/** [GET] /posts : 전체 게시글 보기 */ 
app.get('/posts', (req, res) => {
   //db 에 저장된 post 라는 collection안의 모든 데이터를 꺼내주세요. 
   db.collection("post").find().toArray((err, data)=>{
       res.render('list.ejs', { todoList : data }); //views에 넣어두어야됨
   });  // 이렇게 하면 모두 가져옴.. 
});

//** [GET] /posts/:id  : 상세 게시글 조회 */
app.get('/posts/:id', (req, res) => {
    console.log(" [GET] /posts/:id  : 상세 게시글 조회");
    db.collection("post").findOne({ _id : parseInt(req.params.id) }, (err, data) => {
        if (err) throw err;
        res.render('detail.ejs', { todo : data });
    });  
});

/** [POST] /posts : 게시글 추가하기 */ 
app.post('/posts', (req, res) => {
    let todo = req.body; 
    db.collection("counter").findOne({name :'게시물갯수'}, (err, data) => {    // auto increment => mongo db는 없음 :직접구현
        // counter : sequence 역할 
        todo._id = data.totalPost;

        db.collection('post').insertOne(todo, (err, data) => {
            if (err) throw err;
        });  

        db.collection("counter").updateOne({name :'게시물갯수'}, {$inc : {totalPost : 1}}, (err, data)  => {
            if (err) console.log("error : sequence[counter] update error");
            else console.log("1 document updated");
        });
    });
    res.status(200).render('write.ejs', {message : '저장을 완료했습니다.'});
});

/** [DELETE] /posts/#{id}  : 특정 게시글 삭제 */ 
app.delete('/posts/:id', (req, res) => {
    db.collection("post").deleteOne({ _id : parseInt(req.params.id) } , (err, data)=>{
        if (err) throw err;
        console.log("1 document deleted");
        res.status(200).send({message : req.params.id+ '번 게시글삭제를 완료했습니다.'});
    });
})

/** [put] /posts/#{id}  : 특정 게시글 수정 */ 
app.put('/posts/:id', (req, res) => {
    console.log(" [put] /posts/#{id}  : 특정 게시글 수정 ");
    db.collection("post").updateOne({_id : parseInt(req.params.id)}, {$set : { title: req.body.title, date :req.body.date }}, (err, data)  => {
        if (err) console.log("error : 특정 게시글 수정중 에러 발생");
        else console.log("1 document updated");
        res.status(200).send({message : '수정을 완료했습니다.'}).redirect("/posts");
    });
})

