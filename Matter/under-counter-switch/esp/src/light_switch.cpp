/*
 * Copyright (c) 2022 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-5-Clause
 */

#include "light_switch.h"
#include "binding/binding_handler.h"

#include <app/server/Server.h>
#include <app/util/binding-table.h>
#include <controller/InvokeInteraction.h>
#include <platform/CHIPDeviceLayer.h>
#include <zephyr/logging/log.h>

using namespace chip;
using namespace chip::app;

LOG_MODULE_DECLARE(app, CONFIG_CHIP_APP_LOG_LEVEL);

void LightSwitch::Init(chip::EndpointId lightSwitchEndpoint)
{
	Nrf::Matter::BindingHandler::Init();
	mLightSwitchEndpoint = lightSwitchEndpoint;
}

void LightSwitch::InitiateActionSwitch(Action action)
{
	//Nrf::Matter::BindingHandler::BindingData *data = Platform::New<Nrf::Matter::BindingHandler::BindingData>();
	// if (data) {
	// 	data->EndpointId = mLightSwitchEndpoint;
	// 	data->ClusterId = Clusters::OnOff::Id;
	// 	data->InvokeCommandFunc = SwitchChangedHandler;
	// 	switch (action) {
	// 	case Action::Toggle:
	// 		data->CommandId = Clusters::OnOff::Commands::Toggle::Id;
	// 		break;
	// 	case Action::On:
	// 		data->CommandId = Clusters::OnOff::Commands::On::Id;
	// 		break;
	// 	case Action::Off:
	// 		data->CommandId = Clusters::OnOff::Commands::Off::Id;
	// 		break;
	// 	default:
	// 		Platform::Delete(data);
	// 		return;
	// 	}
	// 	Nrf::Matter::BindingHandler::RunBoundClusterAction(data);
	// }
}