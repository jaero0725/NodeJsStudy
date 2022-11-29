# Node.js 개념 정리 
- NodeJS 버전 : 16.14.2
- NodeJs -> express 라이브러리 써서 서버를 만듦

## pacakage.json
- pacakage.json : 어떤 라이브러리 설치했는지 기록을 남겨주는 파일이라고 생각하면됨.
- entry point : 시작파일 

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
│   ├── miidlewares 
│   └── routes
├── config     # 환경 변수 및 설정 파일 분리
├── loaders    # 시작 프로세스를 모듈별로 분할
│   ├── express.js
│   └── mongoose.js
├── models     # 데이터베이스 모델
└── services   # 모든 비즈니스 로직
``` 
