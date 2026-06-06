const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
require('dotenv/config')
const express = require('express');

const app = express();



app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index');
});
app.get('/analytics', (req, res) => {
    res.render('analytics');
});
app.use(express.static('public'))

const shortUrlRouter = require('./routes/shorten');
app.use('/shorten', shortUrlRouter);

app.get('/analytics/:code',async(req,res)=>{
    const totalClicks = await prisma.url.findUnique({
    where: { shortCode: req.params.code },
    });
    res.json(totalClicks);
})
app.get('/:code', async(req, res) => {
    console.log(req.params.code);
    const url = await prisma.url.findUnique({   
        where: {
        shortCode: req.params.code
    }
})
  if(!url){
    res.status(404).send('URL not found');
    console.log('URL not found '+req.params.code);
    
  }
  else{
    const update = await prisma.url.update({
        where: { shortCode: req.params.code },
        data: { clicks: { increment: 1 } }
    })
      res.redirect(url.longUrl);

  }

});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});