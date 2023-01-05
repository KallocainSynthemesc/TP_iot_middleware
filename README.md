# TP_iot_middleware

## Run middleware
execute the middleware with the following command
``` bash
npm i
node mom.js --token="token_exemple" --org="org_example" --bucket="bucket_example" --url="url_example"
```
here is an example with filled parameters:
node mom.js --token="lN010kvvjDoUt_utxF004SIWiL-UjAMNFnxIOOeLKmGRPliYbq9HvmWUiAATPx1VqQ79H1mWb28jGYYQkMloEQ==" --org="IotOrg" --bucket="IoTBucket" --url="http://localhost:8086"

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

This just shows the parameters that you put into the application. For security reasons I would not log those parameters for a real world application but since this is just a quick exercice to play around with grafana and influxDB security is neglected.

## Run sensors

This project is adapted to deal with sensor imput from the projet tp-iot. This project is provided by our professor and I have not found a github for it so I can't link it here :(

In order to start sensors, run the following commands :
``` bash
npm i
npm run sensors
```

## Expected behaviour

Thanks to the middleware application data is now sent from the sensors to the influxDB. From here grafana can fetch information and display the result as following when configured corectly.
![Alt Text](https://i.ibb.co/d5kjwTt/firefox-x-F3os-Se-TYX.gif)

### The flux query used to fetch the two diagrams are the following:
Temperature:

from(bucket: "IoTBucket")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "temperature" and r._field == "temperature")
    |> yield(name: "_results")
	
Humidity:
from(bucket: "fdsafdsa")
    |> range(start: -1h)
    |> filter(fn: (r) => r._measurement == "humidity" and r._field == "humidity")
    |> yield(name: "_results")
	

