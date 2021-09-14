const express = require('express');
const app = express();
const path = require('path')

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop')

app.use(express.urlencoded({ extended: false }));

// servindo arquivos de forma estática e assim é possível acessar esses arquivos
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// é possível setar o status da requisição. Neste caso é 404, para not found
app.use((req, res) => {
   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000);

