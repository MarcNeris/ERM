# cordova-plugin-device-settings

This plugin defines a global `devicesettings` object, which provides access to the device's native settings.
Although the object is in the global scope, it is not available until after the `deviceready` event.

```js
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window['devicesettings'].getDeveloperMode(result => console.log(result), err => console.log(err));
}
```

Report issues with this plugin on the [Project issue tracker](https://bitbucket.org/peekvision/cordova-plugin-device-settings/issues)

## Installation

    cordova plugin add cordova-plugin-device-settings
    or
    cordova plugin add https://bitbucket.org/peekvision/cordova-plugin-device-settings.git
    or
    node_modules/.bin/cordova plugin add https://bitbucket.org/peekvision/cordova-plugin-device-settings.git

## Functions

- devicesettings.getDeveloperMode

## Supported Platforms

- Android

## Quick Examples

```js
window['devicesettings'].getDeveloperMode(result => console.log(result), err => console.log(err));
```

Result:
```js
false
```

## Android Quirks


# Licence
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.


