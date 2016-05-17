var querystring = require("querystring"),
  fs = require("fs"),
  formidable = require("formidable");
const imageToAscii = require("image-to-ascii");

var Scraper = require ('images-scraper')
  , bing = new Scraper.Bing();

function start(response) {
  console.log("Request handler 'start' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  fs.createReadStream("./fantasciic.html").pipe(response);
}

function imageSearch(response, request) {
  var query = request.url.split('?')[1];
  var criteria = querystring.parse(query).criteria;
  console.log("Request handler 'imageSearch' was called with criteria " + criteria);

  bing.list({
    keyword: criteria,
    num: 10,
    detail: true
  }).then(function(res){
    response.writeHead(200, {"Content-Type": "application/json"});
    console.log('results', res);
    response.write(JSON.stringify(res));
    response.end();
  });
}

function asciify(response, request) {
  var query = request.url.split('?')[1];
  var image = querystring.parse(query).image;
  console.log("Request handler 'asciify' was called with criteria " + image);

  imageToAscii(image, {
    colored: false,
    size: {
      screen_size: {
        height: 600,
        width: 800
      }
    }
  }, (err, converted) => {
    response.writeHead(200, {"Content-Type": "text"});
    response.write(err || converted);
    response.end();
    console.log(err || converted);
  });
}

exports.start = start;
exports.imageSearch = imageSearch;
exports.asciify = asciify;