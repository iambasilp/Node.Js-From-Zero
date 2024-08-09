const http = require('http')
const url = require('url')
const fs  = require('fs')
const server = http.createServer((req,res)=>{
    const pathName = req.url
    if(pathName === '/products'){
        fs.readFile('./dev-data/productData.json','utf-8',(error,data)=>{
             res.writeHead('200',{'Content-type':'application/json'})
             res.end(data)
        })
    }else{
        res.end("This is from Serveroo")
    }
})

server.listen('7000','127.0.0.1',()=>{
    console.log("Listening on 7000")
})

