const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// diz pro express que quer usar um template dinâmico, que nesse caso é usado através do template engine pug
app.set('view engine', 'pug');
app.set('views', 'views') // pegará os templates que serão dinamicamente "trocados" pelo template do pug (pasta views)

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// setando as rotas - a ordem importa
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found' })
});

app.listen(3000);
