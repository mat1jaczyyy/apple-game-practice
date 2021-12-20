const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const index = express.Router();

function renderAppleGame(res, prac) {
    res.render('apple_game', {
        practice: prac
    })
};

index.get('/', function (req, res, next) {
    renderAppleGame(res, false);
});
index.get('/practice', function (req, res, next) {
    renderAppleGame(res, true);
});
app.use('/', index);

app.listen(process.env.PORT || 3000);
