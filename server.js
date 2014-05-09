var http = require('http');
var url = require('url');
var request = require('hyperquest');
var director = require('director');


var port = process.env.PORT || 3000;
var router =    new director.http.Router();


var server = http.createServer(function(req, res){
  router.dispatch(req, res, function(err){
    if (err) {
      res.writeHead(404);
      res.end();
    }
  });
});

router.get('/', function(){
  this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end('the root url');
});

router.get('/data', function(programa){
var url_parts = url.parse(this.req.url,true);
  if (url_parts.query.format=='csv'){
    var req = request('http://172.31.0.101:8983/solr/bienestar/select?q=programa%3A'+url_parts.query.programa+'&rows=10000000&wt=csv&indent=true');
    req.pipe(this.res);
  } if(url_parts.query.format=='xls'){
    this.res.writeHead(200, { 'Content-Type': 'text/html' });
    this.res.end('En matenimiento.');
  } if(url_parts.query.format=='pdf'){
    var req = request('http://172.31.0.101:8983/solr/bienestar/select?q=programa%3A'+url_parts.query.programa+'&rows=10000000&wt=csv&indent=true');
    //req.pipe(this.res);
    console.log(req.body)
  }
});


router.get('/test',function(){
  var req = request('http://172.31.0.101:8983/solr/bienestar/select?q=programa%3A1&rows=10000000&wt=csv&indent=true');
   
  var csv ="";
  req.pipe(process.stdout);
 
csv = csv.replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;');
 
var lines = csv.split(/[\n\r]+/g),
    header = lines.shift().split(","),
    line,
    rows = "",
    thead = '<tr>'+
    '<th>'+header[0]+'</th>'+
    '<th>'+header[1]+'</th>'+
      '</tr>\n';
 
for (var i=0, len=lines.length; i<len; i++) {
    line = lines[i].split(",");
    rows += '<tr>'+
    '<td>'+line[0]+'</td>'+
    '<td>'+line[1]+'</td>'+
      '</tr>\n';
}
 
 this.res.writeHead(200, { 'Content-Type': 'text/html' });
  this.res.end('<table><thead>\n' + thead + '</thead><tbody>\n' + rows + '</tbody></table>'); 

});

server.listen(port);
console.log('app running on http://127.0.0.1:' + port);