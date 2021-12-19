const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/*const index = express.Router();
index.get('/', function (req, res, next) {
    res.render('');
});
app.use('/', index);*/

app.listen(3000);
