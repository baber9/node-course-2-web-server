// NOTE**** nodemon doesn't watch handlebars files
// the '-e' flag tells node to watch the extensions that follow
// must use: nodemon server.js -e js,hbs

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// for heroku
const port = process.env.PORT || 3000;
var app = express();
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// EXPRESS MIDDLEWARE using app.use
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err)
      console.log('Unable to append to server.log')
  });

  // CODING CHALLENGE: create new 'maintenance.hbs' view
  // will render when site is in maintenance mode
  // use res.render(mainenance)
  // render in new piece of middleware using app.use
    // one line inside middleware (res.render)
  // stop program and render maintenance


  // next is necessary for the program to continue
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the home page.'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request.'
  });
});

// for heroku we'll use an environment variable that heroku
// will set. This port will change as we use the app.
// along with "start" script in package.json
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
