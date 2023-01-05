'use strict';
Object.defineProperty(exports, "__esModule", { value: true });

var influxdb_client_1 = require("@influxdata/influxdb-client");
const http = require("http");
const argv = require('minimist')(process.argv.slice(2));

const url = argv.url;
const token = argv.token;
const org = argv.org;
const bucket = argv.bucket;

console.log(`url: ${url}`);
console.log(`token: ${token}`);
console.log(`org: ${org}`);
console.log(`bucket: ${bucket}`);

var influxDB = new influxdb_client_1.InfluxDB({ url: url, token: token });

var writeApi = influxDB.getWriteApi(org, bucket);

function createPoint(value, mode, threshold, code) {
  var point1 = new influxdb_client_1.Point(mode)
    .intField(mode, value)
    .intField("threshold", threshold)
    .intField("code", code);
  return point1;
}

function sendPoint(point) {
  console.log(" ".concat(point));
  writeApi.writePoint(point);
  writeApi.flush().then(function () {
    console.log("WRITE FINISHED");
  });
}

const requestListener = function (req, res, type){
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", () => {
    processInput(type, res, data);
  });
}

const temperatureRequestListener = function (req, res) {
  const type = "temperature";
  requestListener(req, res, type);
};

const humidityRequestListener = function (req, res) {
  const type = "humidity";
  requestListener(req, res, type);
};

const temperatureServer = http.createServer(temperatureRequestListener);
const humidityServer = http.createServer(humidityRequestListener);

temperatureServer.listen(9999, "localhost", () => {
  console.log(
    "Temperature server is listening on http://localhost:9999"
  );
});

humidityServer.listen(8888, "localhost", () => {
  console.log(
    "Humidity server is listening on http://localhost:8888"
  );
});

function processInput(mode, res, data) {
  let threshold = 0;
  const frame = JSON.parse(data);
  let code = parseValue(frame.data, 0, 2);
  let value = parseValue(frame.data, 2, 6) / 10;
  if (frame.data.length > 6) {
    if(mode === "humidity"){
      threshold = parseValue(frame.data, 6, 10)
    }
    else{
      threshold = parseValue(frame.data, 6, 10) / 10;
    }
  }
  const point = createPoint(value, mode, threshold, code);
  sendPoint(point);
  res.writeHead(200);
  res.end("OK");
}

function fromByte(string) {
  return parseInt(string, 16);
}

function parseValue(string, indexStart, indexEnd) {
  const result = string.substring(indexStart, indexEnd);
  return fromByte(result);
}

function close(){
  writeApi.close().then(function () {
    console.log("CLOSE API");
  });
}

process.on("exit", function () {
  close()
});

process.on('SIGINT', function() {
  close()
});