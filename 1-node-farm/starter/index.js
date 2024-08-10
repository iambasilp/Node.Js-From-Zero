const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const querystring = require('querystring');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugify('Fresh Avocados', { lower: true }));

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);

  const parsedQuery = querystring.parse(query);

  // api
  if (pathname === '/api') {

    res.writeHead('200', { 'Content-type': 'application/json' });
    res.end(data);

    // overview
  } else if (pathname === '/overview' || pathname === '/') {
    res.writeHead('200', { 'Content-type': 'text/html' });
    const CardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', CardHtml);
    res.end(output);

    // product
  } else if (pathname === '/product') {
    res.writeHead('200', { 'Content-type': 'text/html' });
    const product = dataObj[parsedQuery.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
});
