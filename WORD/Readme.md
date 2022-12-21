## [이슈 1] PayloadTooLargeError: request entity too large. 
- request의 내용을 파싱하여 라우터가 이용할 수 있도록 위와 같이 두 가지 파서(body-parser 패키지에 있음)를 등록하게 된다.
- PayloadTooLargeError가 발생하는 원인은 파서가 읽을 수 있는 데이터 허용치보다 request가 보낸 데이터의 크기가 커서 정상적으로 파싱을 할 수 없을 때 발생하는 에러이다.
- 기본값으로는 .json()과 .urlencoded()가 100kb 까지만 파싱할 수 있도록 설정되어 있다.

#### 해결방법 
1) parser limit 조절
``` javascript
app.use(express.json({
    limit : "50mb"
}));
app.use(express.urlencoded({
    limit:"50mb",
    extended: false
}));
```

2) 통신 데이터 포맷 변경
- 1번 방법으로 파싱의 허용치를 크게(MB 단위) 늘렸음에도 동일한 오류가 발생한다면 
- request의 body가 엄청나게 큰 상황이므로(문자열로만 MB 단위를 만들어냈다는 얘기므로 정상적인 상황은 아님) 
- 통신 데이터 포맷을 변경해서 물리적으로 용량을 줄이는 방향을 선택해야한다.


