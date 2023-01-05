# TP_iot_middleware

## Run influxDB

Navigate to where you downloaded indluxDB and execute the following command in a powershell or CMD
``` bash
influxd.exe
```
after that influxDB should be available on http://localhost:8086

Here influxDB greets you with the first configuration of a Organization and default bucket. Configurations made here are later neccessary for running the middleware application and connecting influxDB with grafana

furthermore we need to create a new API token. The token is also needed for grafana and the middleware application


## Run middleware
execute the middleware with the following command
``` bash
npm install
node mom.js --token="token_exemple" --org="org_example" --bucket="bucket_example" --url="url_example"
```
here is an example with filled parameters:
``` bash
node mom.js --token="lN010kvvjDoUt_utxF004SIWiL-UjAMNFnxIOOeLKmGRPliYbq9HvmWUiAATPx1VqQ79H1mWb28jGYYQkMloEQ==" --org="IotOrg" --bucket="IoTBucket" --url="http://localhost:8086"
```
When sucessfully executed you should see the following lines on your console:

``` bash
url: http://localhost:8086
token: lN010kvvjDoUt_utxF004SIWiL-UjAMNFnxIOOeLKmGRPliYbq9HvmWUiAATPx1VqQ79H1mWb28jGYYQkMloEQ==
org: IotOrg
bucket: IoTBucket
Humidity server is listening on http://localhost:8888
Temperature server is listening on http://localhost:9999
 temperature code=40i,temperature=19i,threshold=0i 1672921736606132600
WRITE FINISHED
```

This shows the parameters that you put into the application and that the middleware api is listening to the two endpoints. For security reasons I would not log those parameters for a real world application but since this is just a quick exercice to play around with grafana and influxDB security is neglected.

## Modify sensors

The Humidity ENDPOINT variable needs to be set to http://localhost:8888
the Temperature ENDPOINT variable needs to be set to http://localhost:9999

## Run sensors

This project is adapted to deal with sensor imput from the projet tp-iot. This project is provided by our professor and I have not found a github for it so I can't link it here :(

In order to start sensors, run the following commands :
``` bash
npm i
npm run sensors
```

## Run grafana

If not already installed, install grafana and verify that in services the grafana servive is running.
After that grafana should be available on http://localhost:3000

## configure grafana

We need to link the influxDB datasource in grafana. To do so we go to:
Data Sources -> Add data source -> select InfluxDB

There we specify the URL, token, Organization, default bucket and test the connection.


## Expected behaviour

Thanks to the middleware application data is now sent from the sensors to the influxDB. From here grafana can fetch information and display the result as following when configured corectly.
![Alt Text](https://i.ibb.co/d5kjwTt/firefox-x-F3os-Se-TYX.gif)

### The flux query used to fetch the two diagrams are the following:
Temperature:

```
from(bucket: "IoTBucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "temperature" and r._field == "temperature")
    |> yield(name: "_results")
```
Humidity:
```
from(bucket: "IoTBucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "humidity" and r._field == "humidity")
    |> yield(name: "_results")
```

Thresholds can be added when editing the Dashboard view under the threshold tab. For teperature I chose 25° and for the humidity view I chose 80%. Those values are hardcoded. Since the sensors are sending thresholds as well it would be possible to dynamically determine the threshold via the values sent from the sensor. However I could not figure out how to make a flux query that could make a dynamic threshold based on the values sent from the sensor.

