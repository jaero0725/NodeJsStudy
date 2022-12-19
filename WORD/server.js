const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    limit:"50mb",
    extended: false
}));
app.set('view engine','ejs');       
require('dotenv').config()

const request = require('request')

// 한글 자모자 분리 library
const Hangul = require('hangul-js');

app.listen(process.env.PORT , () => {  
    console.log('listening on ', process.env.PORT);
});

//페이지 이동 
app.get('/', (req, res) => {
    res.render('index.ejs');
});


//검색
app.post('/search', (req, res) => {
    let text  = req.body.text;
    console.log("# req.body : " , text);
    console.log("process.env.PORT", process.env.KOREAN_KEY);

    //api 를 통해 보내기 -  검색어(UTF-8 인코딩)
    const korean_url = "https://stdict.korean.go.kr/api/search.do?";
    const korean_addr = 'certkey_no=3529&key=' + process.env.KOREAN_KEY + '&type_search=search&req_type=json&q=' ;
    const korean_q =  encodeURI(req.body.text);
    const api_req = korean_url+korean_addr+korean_q;

    var word_definition = "";
    request(api_req, function(error, response, body){
        console.log("start");
        if(error){  console.log(error)  }

        var obj = JSON.parse(body)
        var data = obj.channel.item;
        word_definition = obj.channel.item[0].sense.definition;
        console.log(word_definition);

        res.status(200).send({message : word_definition});
      });
});

app.post('/excel', (req, res) => {
    let excel  = JSON.parse(req.body.excel); 

    //api 를 통해 보내기 -  검색어(UTF-8 인코딩)
    const korean_url = "https://stdict.korean.go.kr/api/search.do?";
    const korean_addr = 'certkey_no=3529&key=' + process.env.KOREAN_KEY + '&type_search=search&req_type=json&q=' ;
    const korean_q =  encodeURI(req.body.text);
    const api_req = korean_url+korean_addr+korean_q;

    var word_definition = "";
    var wordJson = new Array() ;
    //for(idx in excel){
        let data = new Object() ;
        data.word = excel[0].word; 
/*
        async () => {
            request(api_req, function(error, response, res){
                if(error){  console.log(error)  }
                console.log(res);
                var obj = res;
                var data = obj.channel.item;
                word_definition = obj.channel.item[0].sense.definition;
                data.definition = word_definition;            
            });
        }
        */
        wordJson.push(data) ;
    //}
    console.log("wordJson: ", wordJson);
});