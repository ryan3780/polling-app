## 설문조사 투표 앱  

callicoder의 코드를 ES6를 기반으로 컴포넌트형과 ReactHook으로 변경하고, 숨고(Soomgo) 디자인을 참고하여 변경했다.

### 느낀점  

1. 설계, 폴더 정리, 중복 코드 최소화를 항상 염두해야 한다
2. 가독성이 좋은 명명법과 디자인에 도움을 주는 라이브러리를 알고 있으면 효율성이 올라간다  
3. 가야할 길이 멀다. 그래도 가야한다. 꾸준히 해보자.

### 기초 코드 : https://github.com/callicoder/spring-security-react-ant-design-polls-app

## 사진  

<img width = "80%" height="60%" alt="page" src="https://user-images.githubusercontent.com/45477679/82125051-2d7e3080-97de-11ea-8763-77c32465478d.gif">
<img width = "80%" height="60%" alt="page" src="https://user-images.githubusercontent.com/45477679/82125183-42a78f00-97df-11ea-8d49-f4c369c4ac43.gif">
<img width = "50%" height="60%" alt="page" src="https://user-images.githubusercontent.com/45477679/82125405-b9915780-97e0-11ea-8806-455385d5c9ac.png">


## Steps to Setup the Spring Boot Back end app (polling-app-server)
Clone the application

git clone https://github.com/callicoder/spring-security-react-ant-design-polls-app.git
cd polling-app-server
Create MySQL database

create database polling_app
Change MySQL username and password as per your MySQL installation

open src/main/resources/application.properties file.

change spring.datasource.username and spring.datasource.password properties as per your mysql installation

Run the app

You can run the spring boot app by typing the following command -

mvn spring-boot:run
The server will start on port 8080.

You can also package the application in the form of a jar file and then run it like so -

mvn package
java -jar target/polls-0.0.1-SNAPSHOT.jar
Default Roles

The spring boot app uses role based authorization powered by spring security. To add the default roles in the database, I have added the following sql queries in src/main/resources/data.sql file. Spring boot will automatically execute this script on startup -

INSERT IGNORE INTO roles(name) VALUES('ROLE_USER');
INSERT IGNORE INTO roles(name) VALUES('ROLE_ADMIN');
Any new user who signs up to the app is assigned the ROLE_USER by default.

## Steps to Setup the React Front end app (polling-app-client)

First go to the `polling-app-client` folder -

```bash
cd polling-app-client
```

Then type the following command to install the dependencies and start the application -

```bash
npm install && npm start
```

The front-end server will start on port `3000`.
