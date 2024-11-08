/*
 * Copyright (c) 2022 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-5-Clause
 */

#pragma once
#include <app/util/basic-types.h>
#include <lib/core/CHIPError.h>

#include "binding/binding_handler.h"

#include <atomic>

/** @class LightSwitch
 *  @brief Class for controlling a CHIP light bulb over a Thread network
 *
 *  Features:
 *  - discovering a CHIP light bulb which advertises itself by sending Thread multicast packets
 *  - toggling and dimming the connected CHIP light bulb by sending appropriate CHIP messages
 */
class LightSwitch {
public:
	enum class Action : uint8_t {
		Toggle, /* Switch state on lighting-app device */
		On, /* Turn on light on lighting-app device */
		Off /* Turn off light on lighting-app device */
	};

	void Init(chip::EndpointId lightSwitchEndpoint);
	void InitiateActionSwitch(Action action);
	chip::EndpointId GetLightSwitchEndpointId() { return mLightSwitchEndpoint; }
	
	static LightSwitch &GetInstance()
	{
		static LightSwitch sLightSwitch;
		return sLightSwitch;
	}

private:
	chip::EndpointId mLightSwitchEndpoint;
};
