# Utilities

## myenergi usage data

Using the fetch.py script, you can download the daily usage data of your Myenergi devices. It's broken down into diverted and boosted.

All you need to get started in your access token from Myenergi.

To download July's usage, you would run this command:

``` 
python fetch.py 2023 7 <token>
```

This will produce a CSV file for each device you have connected to your account.

I've recorded a demo of the script - https://youtu.be/putHfwCZrLE

# Sensors

## Flow and Return Sensor 

Using the boiler_flow_and_return_sensor.yaml to flash ESPHome.
