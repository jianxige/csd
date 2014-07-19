// 路由给真正的请求处理程序模板:对请求作出响应,能够像onRequest函数那样可以和浏览器进行“对话”.
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  //console.log("Request handler 'upload' was called.");

  //console.log(fs.lstatSync(__dirname + "/upload"));

  var form = new formidable.IncomingForm();

  var stat = fs.lstatSync(__dirname + "/upload");
  var img = fs.lstatSync(__dirname + "/upload/test.png");
  //console.log(img.isDirectory());
  /*if(!img.isDirectory()) {
      console.log(img.isDirectory());
      response.writeHead(302, {
     'Location': '/'
    //add other headers here...
  });
  response.end();
  return;
  }*/
  if(!stat.isDirectory()) {
  //console.log(stat.isDirectory());
    
    fs.mkdirSync(__dirname + "/upload")
  }
  

  form.encoding = 'utf-8';

  form.uploadDir = __dirname + "/upload";

  //console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    //console.log("parsing done");
    if(!files.upload)
    {
        response.writeHead(302, {
       'Location': '/'
      //add other headers here...
      });
      response.end();
      return;
    }
    fs.renameSync(files.upload.path, __dirname + "/upload/test.png");
    // fs.rename(files.upload.path, __dirname + "/upload/test.png", function(err) {
    //   if (err) {
    //     fs.unlink(__dirname + "/upload/test.png");
    //     fs.rename(files.upload.path, __dirname + "/upload/test.png");
    //   }
    // });
	response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  //console.log("Request handler 'show' was called.");
  fs.readFile(__dirname + "/upload/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;