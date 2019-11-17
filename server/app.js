// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');

// create local urls
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/LagerLogger';

// connect to database
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// connect to redis
let redisURL = {
  hostname: 'redis-18254.c17.us-east-1-4.ec2.cloud.redislabs.com',
  port: 18254, // port number from RedisLabs
};

let redisPASS = 'p16zADmEqvo9hPBfCaFNDBhJRWKslai9';

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// route app
const router = require('./router.js');

const app = express();

// grab assets from folder
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// set favicon to beer icon
app.use(favicon(`${__dirname}/../hosted/img/beerIcon.png`));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// use redis store
app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS,
  }),
  secret: 'Log your favorite beers',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

// use handlebars
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// csrf must come after cookieparser
// app.use(session) should come before router
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});

router(app);

// check for errors
app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Listening on port ${port}`);
});
