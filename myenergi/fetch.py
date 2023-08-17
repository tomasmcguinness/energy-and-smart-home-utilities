import requests
import sys
import datetime
import csv
import os

year = int(sys.argv[1])
month = int(sys.argv[2])
token = sys.argv[3]

os.system('cls')

date = datetime.datetime(year, month, 1)

date_in_milliseconds = date.timestamp() * 1000

token_template = "Bearer {token}"

token_header_value = token_template.format(token=token)

headers = {"Authorization": token_header_value}

devices_url = "https://myaccount.myenergi.com/api/Product/UserHubsAndDevices"

response = requests.get(devices_url, headers=headers)

if response.status_code != 200:
    message = "Didn't receive a 200 response: {status_code}"
    print(message.format(status_code = response.status_code))
    exit()

response_json = response.json()

hubs_data = response_json["content"]["hubs"]

hub_data = hubs_data[0]

hub_id = hub_data["hub"]["id"]

devices_data = response_json["content"]["devices"]

for device in devices_data:
    device_type = device["device"]["deviceType"]
    serial_number = device["device"]["serialNumber"]
    print("Found: " + device_type + " with serial number " + serial_number)

data_url = "https://myaccount.myenergi.com/api/Graphs/DevicesOfHubDataHourly"

data = { "hubId":hub_id, "dayTimestampsUtc":[date_in_milliseconds], "duration":744 }

response = requests.post(data_url, json=data, headers=headers)

if response.status_code != 200:
    message = "Didn't receive a 200 response: {status_code}"
    print(message.format(status_code = response.status_code))
    exit

print("Processing usage data...")

response_json = response.json()

for device_data in devices_data:

    device = device_data["device"]

    serial = device["serialNumber"]
    device_type = device["deviceType"]

    serial_key = "U{serial}"

    usage_data = response_json["content"][serial_key.format(serial=serial)]

    ws_to_kWh = 60 * 60 * 1000

    total_diverted_kWh = 0
    total_boosted_kWh = 0

    daily_diverted_kWh = 0
    daily_boosted_kWh = 0

    export_data = []

    export = ["Year", "Month", "Day", "Boosted kWh", "Diverted kWh"]
    export_data.append(export)

    current_dom = 1
    last_dom = 1

    for _reading in usage_data: 

        if _reading["mon"] == month and _reading["yr"] == year:

            last_dom = _reading["dom"]

            if device_type == "zappi":
                phase_1_diverted = 0
                phase_1_boosted = 0

                if "h1d" in _reading:
                    phase_1_diverted = _reading["h1d"] / ws_to_kWh

                if "h1b" in _reading:
                    phase_1_boosted = _reading["h1b"] / ws_to_kWh

                total_diverted_kWh += phase_1_diverted
                total_boosted_kWh += phase_1_boosted

                daily_diverted_kWh += phase_1_diverted
                daily_boosted_kWh += phase_1_boosted

                if current_dom != _reading["dom"]:
                    export = [year, month, current_dom, daily_boosted_kWh, daily_diverted_kWh]
                    export_data.append(export)
                    current_dom = _reading["dom"]
                    daily_boosted_kWh = 0
                    daily_diverted_kWh = 0

            elif device_type == "eddi":
                heater_1_diverted = 0
                heater_1_boosted = 0

                if "h1d" in _reading:
                    heater_1_diverted = _reading["h1d"] / ws_to_kWh

                if "h1b" in _reading:
                    heater_1_boosted = _reading["h1b"] / ws_to_kWh

                total_diverted_kWh += heater_1_diverted
                total_boosted_kWh += heater_1_boosted

                daily_diverted_kWh += heater_1_diverted
                daily_boosted_kWh += heater_1_boosted

                if current_dom != _reading["dom"]:
                    export = [year, month, current_dom, daily_boosted_kWh, daily_diverted_kWh]
                    export_data.append(export)
                    current_dom = _reading["dom"]
                    daily_boosted_kWh = 0
                    daily_diverted_kWh = 0

    export = [last_dom, daily_boosted_kWh, daily_diverted_kWh]
    export_data.append(export)

    print("\n==== " + serial + " - " + device_type + " ====")
    print("Boosted: " + str(round(total_boosted_kWh)) + "kWh")
    print("Diverted: "+ str(round(total_diverted_kWh)) + "kWh")

    file_name = device_type + "_" + serial + "_" + str(year) + "_" + str(month) + ".csv"

    with open(file_name, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(export_data)

    print("Generated " + file_name)

print("\n")
