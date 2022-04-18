# Taskum
This application is built with Node JS to provide customizable API's to manage users and tasks. These API's provide easy and secure communication between client and the server.

### Setup .env
* Change the name of .env.example to dev.env or any other name you would like.
```
config
    |
    |> .env.example         ❌
    |
    |> dev.env              ✅
```
* You must provide all the information required in .env to get the full benifits.
```
APP_NAME=Taskum
SECRET_PASSWORD_KEY=RANDOM SECRET KEY FOR JSON WEB TOKEN(ANY TEXT)
PORT=3000

GMAIL_EMAIL=YOUR EMAIL
GMAIL_PASSWORD=YOUR EMAIL PASSWORD HERE

MONGO_DB_PATH=mongodb://127.0.0.1:27017/Taskum
```

### Install Dependencies
```
$ npm install
```