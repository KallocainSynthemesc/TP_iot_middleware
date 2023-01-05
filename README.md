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