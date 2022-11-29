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

// 로그인, 로그인 검증, 세션생성을 도와주는 라이브러리
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 


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

app.get('/login', (req, res) => {
    if(req.query.e == "true"){
        res.send("<script>alert('아이디와 비밀번호를 확인하세요');document.location.href='/login'</script>");
    } 
    else{
        res.render('login.ejs')
    } 
});

// req.user는 deserializeUser가 보내준 그냥 로그인한 유저의 DB 데이터
function isLogin (req, res, next){
    console.log("1");
    if (req.user) { 
        next();
        console.log("3")
    } else { 
        console.log("4")
        res.send("<script>alert('먼저 로그인을 해주시기 바랍니다'); document.location.href='/login'</script>");
    } 
}

app.get('/mypage', isLogin, (req, res) => {
    console.log("2", req.user)
    res.render('mypage.ejs', { user : req.user });
}) 

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
        res.status(200).send({message : '수정을 완료했습니다.'});
    });
})

// LOGIN
passport.use(new LocalStrategy({    // LocalStrategy( { 설정 }, function(){ 아이디비번 검사하는 코드 } )
   usernameField: 'id',
   passwordField: 'pw',
   session: true,
   passReqToCallback: false,
 }, function (input_id, input_pw, done) {
   console.log(input_id, input_pw);
   db.collection('user').findOne({ id: input_id }, (err, data) => {
        if (err) return done(err)
        if (!data) return done(null, false, { message: '존재하지않는 아이디요' })
        if (input_pw == data.pw) {
            return done(null, data)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
  })
}));
 
// 세션 만들고 세션아이디 발급해서 쿠키로 보내주기 
passport.serializeUser(function (user, done) {
    console.log("execute : serializeUser ")
    done(null, user.id)
});

// 방문자가 세션아이디 쿠키가 존재하면 deserializeUser 라는 함수 덕분에 항상 요청.user라는 데이터가 존재
// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function (user, done) {
    console.log("execute : deserializeUser ", user)
    db.collection('user').findOne({ id: user }, (err, data) => {
        console.log("execute : DB deserializeUser findOne");
        console.log("deserializeUser res : ", data)
        done(null, data);
    })
}); 

/** [POST] Login 요청 */
app.post('/login', passport.authenticate('local', {failureRedirect : '/login?e=true'}), (req, res) => {
    res.redirect('/')
});