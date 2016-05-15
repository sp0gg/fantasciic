var querystring = require("querystring"),
  fs = require("fs"),
  formidable = require("formidable");
const imageToAscii = require("image-to-ascii");
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
    function sleep(milliSeconds) {
      var startTime = new Date().getTime();
      while (new Date().getTime() < startTime + milliSeconds);
    }

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
function show(response) {
  console.log("Request handler 'show' was called.");
  response.writeHead(200, {"Content-Type": "image/png"});
}
exports.start = start;
exports.upload = upload;
exports.show = show;