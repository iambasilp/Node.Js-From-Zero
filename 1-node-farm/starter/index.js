const { error } = require('console');
const fs = require('fs')
const http = require('http')
const url = require('url')

const ReadData = fs.readFile('./txt/basil.txt','utf-8',(error,data)=>{
    console.log("Hello")
})

const server = http.createServer((req,res)=>{
    const pathName = req.url
    switch(pathName){
        case "/contact":
        res.end("This is Contact page");


        case "/about":
         res.end("This is About page");
    

        case "/service":
         res.end("This is service page");
   

         default:
         fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(error,data)=>{
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(data)
            console.log(data);
         })
      

    }
    

})

server.listen('7000','127.0.0.1',()=>{
console.log("Server is running"

)})


