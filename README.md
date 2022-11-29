# Node.js 개념 정리 
- NodeJS 버전 : 16.14.2
- NodeJs -> express 라이브러리 써서 서버를 만듦

## pacakage.json
- pacakage.json : 어떤 라이브러리 설치했는지 기록을 남겨주는 파일이라고 생각하면됨.
- entry point : 시작파일 

## Request
```javascript
/*
  req.body: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체이다.
  req.params : 파라미터의 데이터를 가져온다.
  req.query : 쿼리스트링의 정보를 가져온다.
  req.headers : header 값을 가져온다.
  req.cookies : 쿠키 값을 가져온다.
  req.ip : 프론트 아이피를 가져온다
  req.protocol : 프로토콜 http? https? 인지 가져온다
  req.url : 전체 URI 정보를 가져온다.
*/
```

## Response
```javascript
/*
  res.send() : 클라이언트에 응답을 보낸다.
  res.json() : 클라이언트에 json을 만든다.
  res.redirect() : 페이지를 이동시킨다.
*/
router.get('/board/list',function (req,res,next) {
  res.redirect('/board/list/1'); 
  // 기본 주소로 접속시 자동으로 해당 URI로 페이지를 이동시킨다.
})

res.send("<script>alert('먼저 로그인을 해주시기 바랍니다'); document.location.href='/board/list'</script>");
```
## node.modules
> npm help init <br>
- express 라이브러리 
> npm install express

- 서버 재실행 자동화 : 서버 자동으로 껐다 켜주는 라이브러리 
> npm install -g nodemon

- req를 받아오려면 body-parser 라이브러리가 필요
- body-parser는 node.js 모듈로 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출할 수 있다
> npm install body-parser
```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
```

- mongo DB 연결 
> npm install mongodb
 ```javascript
const MongoClient = require('mongodb').MongoClient;
const MONGO_DB_URL =  properties.get("MONGO_DB_URL");

var db; 
MongoClient.connect(MONGO_DB_URL, function(err, database){
    if(err) return console.log(err);

    db = database.db('todoapp');  // todoapp 이라는 db에 연결
    app.listen(PORT , () => {  
        console.log('listening on ', PORT);
    });
});
```

- EJS : html template engine
> npm install ejs
 ```javascript
app.set('view engine','ejs');      
```

-  form 에 method ="PUT" 넣으려면 method-override or AJAX 사용 
> npm install method-override
```javascript
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
```

- 로그인, 로그인 검증, 세션생성을 도와주는 라이브러리
> npm install passport passport-local express-session
```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 
```

## 📑 <a href="https://github.com/jaero0725/NodeJsStudy/tree/main/TODOAPP">TODO List 프로젝트 </a> 
### API 구조
| HTTP Method | URI | Operation |
| --- | --- | --- |
| GET | /posts | returns a list of todoList |
| GET | /posts/:id | returns the todoList with ID 1 |
| POST | /posts | creates a new todoList |
| PUT | /posts/:id | updates the todoList with ID 3 |
| DELETE | /posts/:id | deletes the todoList with ID 4 |
| DELETE | /posts | deletes all the todoList |

### [Node.js 폴더구조 - 예시]
- 3계층 설계 : api 라우터, 서비스, dao 분리
```bash
src
├── app.js     # App의 시작부분
├── api        # express 라우터 (Controller)
│   ├── middlewares 
│   └── routes
├── config     # 환경 변수 및 설정 파일 분리
├── loaders    # 시작 프로세스를 모듈별로 분할
│   ├── express.js
│   └── mongoose.js
├── models     # 데이터베이스 모델
└── services   # 모든 비즈니스 로직
``` 
