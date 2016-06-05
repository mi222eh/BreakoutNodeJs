var express = require('express');
var app = express();
var bodyParser  = require('body-parser');
var fs = require('fs');
var dir = "./Maps";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});

app.get('/GetList', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
    var files = fs.readdirSync("./Maps/");
    var filesSend = [];
    for(var i = 0; i < files.length; i++){
        var text = files[i].substr(0, files[i].lastIndexOf('.'));
        filesSend.push(text);
    }
    res.send(filesSend);
});

app.get('/GetMap', function(req, res){

    var levelNumber = req.query.level;
    var file = fs.readFileSync("Maps/" + levelNumber + ".json");
    var fileContents = JSON.parse(file);
    res.send(fileContents);
});

app.post('/PostMap', function(req, res){

    var bricks = req.body.bricks;
    var numberOfBricks = 0;
    var numberOfInvulnerableBricks = 0;
    for (var i = 0; i < bricks.length; i++){
        if(bricks[i].type == 0){
            numberOfInvulnerableBricks++;
        }
        else{
            numberOfBricks++;
        }
    }
    if(numberOfBricks == 0){
        if(numberOfInvulnerableBricks > 0){
            res.send("Server: Only invulnerable");
        }
        else{
            res.send("Server: Empty");
        }
    }
    else{
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        console.log(req.body);
        var Id = 1;
        while(fs.existsSync("Maps/" + Id + ".json")){
            Id++;
        }
        fs.writeFileSync("Maps/" + Id + ".json", JSON.stringify(req.body), "UTF-8");
        res.send("Server: Uploaded as " + Id);
    }
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP, function () {
  console.log('Example app listening on port 3000!');
});
