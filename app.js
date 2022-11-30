const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const axios = require('axios');

const authRouter = require('./routes/auth.routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/Project2')
  .then(x => console.log(`connected to db ${x.connections[0].name}`))
  .catch(err => console.log(err));

const hbs = require('hbs');

app.set('views', __dirname + '/views')
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  next();
})

app.use(
  session({
    secret: 'keyboardcat',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
      secure: false,
      httpOnly: true,
      maxAge: 60000 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/Project2'
    })
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.use('/', authRouter);

app.get('/', (req, res, next) => {
  res.render('index.hbs')
});

app.get('/feed', (req, res, next) => {
  const articles = [{
    title: 'Test Article',
    createdAt: Date.now(),
    description:'Test description'

  }]
  res.render('feed.hbs')
});



app.listen(3000, () => console.log('app is running on port 3000'))