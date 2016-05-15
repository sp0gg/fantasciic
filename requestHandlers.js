var querystring = require("querystring"),
  fs = require("fs"),
  formidable = require("formidable");
const imageToAscii = require("image-to-ascii");

var Scraper = require ('images-scraper')
  , bing = new Scraper.Bing();

function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
}

function start(response) {
  console.log("Request handler 'start' was called.");
  response.writeHead(200, {"Content-Type": "text/html"});
  fs.createReadStream("./fantasciic.html").pipe(response);
}
function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function (error, fields, files) {
    console.log("parsing done");
    /* Possible error on Windows systems:
     tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function (error) {
      if (error) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });



    sleep(1000);

    imageToAscii("/tmp/test.png", {
      colored: false
    }, (err, converted) => {
      response.writeHead(200, {"Content-Type": "text"});
      response.write(err || converted);
      response.end();
      console.log(err || converted);
    });
  });
}

function imageSearch(response, request){
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

function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.imageSearch = imageSearch;