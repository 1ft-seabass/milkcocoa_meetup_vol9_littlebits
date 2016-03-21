MILKCOCOA_APP_ID = "MILKCOCOA_APP_ID";
MILKCOCOA_DATASTORE_ID = "milkcocoa_vol9_littlebits";

// MilkCocoa /////////////////////////////////
var MilkCocoa = require("./node_modules/milkcocoa/index.js");
var milkcocoa = new MilkCocoa(MILKCOCOA_APP_ID + ".mlkcca.com");
//////////////////////////////////////////////
// dataStore作成
// デフォルトのデータストアIDは milkcocoa_vol9_littlebits にしています。
var sampleDataStore = milkcocoa.dataStore(MILKCOCOA_DATASTORE_ID);
// データがpushされたときのイベント通知
sampleDataStore.on("push", function(datum) {
    // 内部のログ
    console.log('[push complete] sampleDataStore');
    console.log(datum);
});
//////////////////////////////////////////////
// dataStore作成 iftttDataStore
var iftttDataStore = milkcocoa.dataStore("iftttDataStore");
// データがpushされたときのイベント通知
iftttDataStore.on("push", function(datum) {
    // 内部のログ
    console.log('[push complete] iftttDataStore');
    console.log(datum);
    // 出力ポート2が反応する
    sp.write(2,function(err,results){
        console.log('-- socket.io output sp.write complete');
        console.log(err);
        console.log(results);
    })
});
//////////////////////////////////////////////

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.send('Hello Milkcocoa!');
});

// /port Arduinoポートを動かす
app.get('/port', function(request, response) {
    response.send('[get]/port');
    // 出力ポート2が反応する
    sp.write(2,function(err,results){
        console.log('-- socket.io output sp.write complete');
        console.log(err);
        console.log(results);
    })
});

// /push
app.get('/push', function(request, response) {
    response.send('[push sampleDataStore]');
    // 内部のログ
    console.log('[push sampleDataStore : ' + MILKCOCOA_DATASTORE_ID + ']');
    console.log(request.query);
    var sendValue = "送信テスト";  // text値のデフォルトは「送信テスト」
    if(request.query.text){
        sendValue = request.query.text;  // text値が存在する場合、採用する。
    }
    sampleDataStore.push({ text : sendValue , host : request.headers.host });
});

app.listen(app.get('port'), function() {

    // サーバーの起動
    console.log("Node app is running at localhost:" + app.get('port'));

    // Serial Port設定 ///////////////////////////////

    var serialport = require('serialport');
    var portName = 'COM4';  // Arduinoが認識されているポートと一致させましょう
    var sp = new serialport.SerialPort(portName, {
        baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false,
        parser: serialport.parsers.readline("\n")
    });

    // シリアルポート入力からのデータ送信
    sp.on('data', function(input) {
        var buffer = new Buffer(input, 'utf8');
        try {
            console.log('buffer: ' + buffer);
            if( buffer == 1 ){
                // 1番目のポートのlittleBits入力の情報を送る
                console.log('-> LittlebitsInputAction 1');
                sampleDataStore.push({ port : 1 , host : request.headers.host });
            } else if( buffer == 2 ){
                // 2番目のポートのlittleBits入力の情報を送る
                console.log('-> LittlebitsInputAction 2');
                sampleDataStore.push({ port : 2 , host : request.headers.host });
            } else if( buffer == 3 ){
                // 3番目のポートのlittleBits入力の情報を送る
                console.log('-> LittlebitsInputAction 3');
                sampleDataStore.push({ port : 3 , host : request.headers.host });
            }
        } catch(e) {
            return;
        }
    });

});

