const http = require("http");
const url = require("url");
const fs = require("fs");
const querystring = require("querystring");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  const parsedQuery = querystring.parse(query);

  if (pathname === "/api") {
    res.writeHead("200", { "Content-type": "application/json" });
    res.end(data);
  } else if (pathname === "/overview" || pathname === "/") {
    res.writeHead("200", { "Content-type": "text/html" });
    const CardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", CardHtml);
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead("200", { "Content-type": "text/html" });
    const product = dataObj[parsedQuery.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(2000, () => {
  console.log("Listening on port 2000");
});
