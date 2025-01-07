/*
   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/

#include <esp_err.h>
#include <esp_log.h>
#include <stdlib.h>
#include <string.h>

#include <common_macros.h>
#include <esp_matter.h>
#include <app-common/zap-generated/attributes/Accessors.h>

#include <app_priv.h>
#include <iot_button.h>

#include "esp_sleep.h"

using namespace chip::app::Clusters;
using namespace esp_matter;
using namespace esp_matter::cluster;

static const char *TAG = "app_driver";

esp_err_t app_driver_attribute_update(app_driver_handle_t driver_handle, uint16_t endpoint_id, uint32_t cluster_id,
                                      uint32_t attribute_id, esp_matter_attr_val_t *val)
{
    esp_err_t err = ESP_OK;
    return err;
}

static void app_driver_button_initial_pressed(void *arg, void *data)
{
    ESP_LOGI(TAG, "Initial button pressed");
    gpio_button * button = (gpio_button*)data;
    int switch_endpoint_id = (button != NULL) ? get_endpoint(button) : 1;
    // Press moves Position from 0 (idle) to 1 (press)
    uint8_t newPosition = 1;
    chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, newPosition]() {
        chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
        // InitialPress event takes newPosition as event data
        switch_cluster::event::send_initial_press(switch_endpoint_id, newPosition);
    });
}

static void app_driver_button_release(void *arg, void *data)
{
    gpio_button *button = (gpio_button *)data;
    int switch_endpoint_id = (button != NULL) ? get_endpoint(button) : 1;

    if (iot_button_get_ticks_time((button_handle_t)arg) < 5000) {
        ESP_LOGI(TAG, "Short button release");
        // Release moves Position from 1 (press) to 0 (idle)
        uint8_t previousPosition = 1;
        uint8_t newPosition = 0;
        chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, previousPosition, newPosition]() {
             chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
             // ShortRelease event takes previousPosition as event data
             switch_cluster::event::send_short_release(switch_endpoint_id, previousPosition);
        });
    } else {
        ESP_LOGI(TAG, "Long button release");
        // Release moves Position from 1 (press) to 0 (idle)
        uint8_t previousPosition = 1;
        uint8_t newPosition = 0;
        chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, previousPosition, newPosition]() {
            chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
            // LongRelease event takes previousPositionPosition as event data
            switch_cluster::event::send_long_release(switch_endpoint_id, previousPosition);
        });
    }
}

static void app_driver_button_long_pressed(void *arg, void *data)
{
    ESP_LOGI(TAG, "Long button pressed");
    gpio_button *button = (gpio_button *)data;
    int switch_endpoint_id = (button != NULL) ? get_endpoint(button) : 1;
    // Press moves Position from 0 (idle) to 1 (press)
    uint8_t newPosition = 1;
    chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, newPosition]() {
        chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
        // LongPress event takes newPosition as event data
        switch_cluster::event::send_long_press(switch_endpoint_id, newPosition);
    });
}

static int current_number_of_presses_counted = 1;

static void app_driver_button_multipress_ongoing(void *arg, void *data)
{
    ESP_LOGI(TAG, "Multipress Ongoing");
    gpio_button * button = (gpio_button *)data;
    int switch_endpoint_id = (button != NULL) ? get_endpoint(button) : 1;
    // Press moves Position from 0 (idle) to 1 (press)
    uint8_t newPosition = 1;
    current_number_of_presses_counted++;
    chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, newPosition]() {
        chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
        // MultiPress Ongoing event takes newPosition and current_number_of_presses_counted as event data
        switch_cluster::event::send_multi_press_ongoing(switch_endpoint_id, newPosition, current_number_of_presses_counted);
    });
}

static void app_driver_button_multipress_complete(void *arg, void *data)
{
    ESP_LOGI(TAG, "Multipress Complete");
    gpio_button * button = (gpio_button *)data;
    int switch_endpoint_id = (button != NULL) ? get_endpoint(button) : 1;
    // Press moves Position from 0 (idle) to 1 (press)
    uint8_t previousPosition = 1;
    uint8_t newPosition = 0;
    static int total_number_of_presses_counted = current_number_of_presses_counted;
    chip::DeviceLayer::SystemLayer().ScheduleLambda([switch_endpoint_id, previousPosition, newPosition]() {
        chip::app::Clusters::Switch::Attributes::CurrentPosition::Set(switch_endpoint_id, newPosition);
        // MultiPress Complete event takes previousPosition and total_number_of_presses_counted as event data
        switch_cluster::event::send_multi_press_complete(switch_endpoint_id, previousPosition, total_number_of_presses_counted);
        // Reset current_number_of_presses_counted to initial value
        current_number_of_presses_counted = 1;
    });
}

#define GPIO_WAKEUP_LEVEL       1

app_driver_handle_t app_driver_button_init(gpio_button * button)
{
    button_config_t config;
    memset(&config, 0, sizeof(button_config_t));

    config.type = BUTTON_TYPE_GPIO;
    config.gpio_button_config.gpio_num = GPIO_NUM_0;
    config.gpio_button_config.active_level = 1;
    config.gpio_button_config.enable_power_save = true;

    button_handle_t handle = iot_button_create(&config);
    
    iot_button_register_cb(handle, BUTTON_PRESS_DOWN, app_driver_button_initial_pressed, button);
    // iot_button_register_cb(handle, BUTTON_PRESS_UP, app_driver_button_release, button);
    // iot_button_register_cb(handle, BUTTON_LONG_PRESS_START, app_driver_button_long_pressed, button);
    // iot_button_register_cb(handle, BUTTON_PRESS_REPEAT, app_driver_button_multipress_ongoing, button);
    // iot_button_register_cb(handle, BUTTON_PRESS_REPEAT_DONE, app_driver_button_multipress_complete, button);

    return (app_driver_handle_t)handle;
}
