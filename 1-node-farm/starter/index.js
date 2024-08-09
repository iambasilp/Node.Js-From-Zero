const http = require('http')
const url = require('url')
const fs  = require('fs')
const querystring = require('querystring');

 


const replaceTemplate = (template,product)=>{
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName || 'N/A');
    output = output.replace(/{%IMAGE%}/g, product.image );
    output = output.replace(/{%PRICE%}/g, product.price || 'N/A');
    output = output.replace(/{%FROM%}/g, product.from || 'Unknown');
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients || 'N/A');
    output = output.replace(/{%QUANTITY%}/g, product.quantity || 'N/A');
    output = output.replace(/{%DESCRIPTION%}/g, product.description || 'No description');
    output = output.replace(/{%ID%}/g, product.id || 'N/A');
  
    if (!product.organic) {
      output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    } else {
      output = output.replace(/{%NOT_ORGANIC%}/g, '');
    }
  
    return output;
    
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const dataObj = JSON.parse(data)
console.log(dataObj)


const server = http.createServer((req,res)=>{

     const {query,pathname} = url.parse(req.url)
     const queryparam = querystring.parse(query)

    // overview page
    if(pathname === '/' || pathname === '/overview'){
       res.writeHead('200',{'Content-type':'text/html'})
       const cardsHtml = dataObj.map((el)=> replaceTemplate(tempCard,el)).join('')
       const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
       console.log(cardsHtml)
       res.end(output)
    }
    
    // product page
    else if(pathname === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html' });
      const product = dataObj.find((el)=>el.id=== queryparam.id)
      console.log(product)
      const output = replaceTemplate(tempProduct,product)
      res.end(output)  
    }
    
    // api page
    else if(pathname === '/api'){
        res.writeHead('200',{'Content-type':'application/json'})
        res.end(data)
    }
})

server.listen('9000','127.0.0.1',()=>{
    console.log("Listening on 9000")
})

