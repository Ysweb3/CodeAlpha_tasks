const express = require('express');
const router = express.Router();
const {nanoid} = require('nanoid');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

function isValidUrl(string){
  try{
    new URL(string);
    return true;
  }
  catch(err){
    return false;
  }
}


router.post('/', async(req, res) => {
    const code = nanoid(6);

  const ulrExists = await prisma.url.findUnique({
    where:{ longUrl: req.body.longUrl }
  })
    if(ulrExists != null){
      res.send(ulrExists)
      return;
    }
    if(isValidUrl(req.body.longUrl)){
      const result = await prisma.url.create({
        data: {
        longUrl: req.body.longUrl,
        shortCode: code,
        }
    })
    res.send(result);
    } 
    else if(await ulrExists(req.body.longUrl) !== null){
      res.status(400).send('URL already exists');
      console.log("RAAAAAAAAAA")
      return;
    }
    else{
      res.status(400).send('URL not valid');
    }
});


module.exports = router;
