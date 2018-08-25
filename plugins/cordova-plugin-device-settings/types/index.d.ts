// Type definitions for Apache Cordova Device Policy plugin
// Project: https://github.com/PeekVision/cordova-plugin-device-settings
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// 
// Copyright (c) Peek Vision Ltd
// Licensed under the MIT license 

/**
 * This object is not available until after the deviceready event.
 */
interface DeviceSettings {

    /**
     * Gets the developer mode status, boolean
     */
    getDeveloperMode;

}



declare let devicesettings: DeviceSettings;