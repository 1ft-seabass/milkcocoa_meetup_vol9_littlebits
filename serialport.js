// Serial Port ///////////////////////////////

var serialport = require('serialport');
var portName = 'COM3'; // Win環境
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});

// シリアルポートからの入力
sp.on('data', function(input) {
    var buffer = new Buffer(input, 'utf8');
    try {
        console.log('serialport buffer: ' + buffer);
        if( buffer == 1 ){
            // /input/1
            console.log('/input/1');
        } else if( buffer == 2 ){
            // /input/2
            console.log('/input/2');
        } else if( buffer == 3 ){
            // /input/3
            console.log('/input/3');
        }
    } catch(e) {
        return;
    }
});

// Server /////////////////////////////////

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

// 出力1を反応させる
app.get('/output/1', function(req, res){
    res.send("/output/1");
    console.log("/output/1");
    sp.write('1',function(err,results){
        console.log('sp.write');
        console.log(err);
        console.log(results);
    })
});

// 出力2を反応させる
app.get('/output/2', function(req, res){
    res.send("/output/2");
    console.log("/output/2");
    sp.write('2',function(err,results){
        console.log('sp.write');
        console.log(err);
        console.log(results);
    })
});

// 出力3を反応させる
app.get('/output/3', function(req, res){
    res.send("/output/3");
    console.log("/output/3");
    sp.write('3',function(err,results){
        console.log('sp.write');
        console.log(err);
        console.log(results);
    })
});

// root
app.get('/', function(req, res){
    res.send("Hello World!!");
    console.log("/");
});