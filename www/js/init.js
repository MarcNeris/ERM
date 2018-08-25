
var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    

    onDeviceReady: function() {
        
        this.receivedEvent('deviceready');

    },

    receivedEvent: function(id) {
        
        window.screen.orientation.lock('portrait');

        localStorage.canWrite='N';

        cordova.plugins.diagnostic.isLocationAvailable(function(available){

            // if(!available){
    
            //     navigator.notification.alert(
            //         'Ative a "Localização/GPS".',
            //         loadLocation,
            //         'overt | HCM',
            //         'Fechar'
            //     )
            // } 

            //loadLocation();

        }, function(error){
            //alert("The following error occurred: "+error);
        });


        // cordova.plugins.diagnostic.requestRuntimePermissions(function(statuses){
        //     for (var permission in statuses){
        //         switch(statuses[permission]){
        //             case cordova.plugins.diagnostic.permissionStatus.GRANTED:
        //                 //alert("Permission granted to use "+permission);
        //                 break;
        //             case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
        //                 //alert("Permission to use "+permission+" has not been requested yet");
        //                 break;
        //             case cordova.plugins.diagnostic.permissionStatus.DENIED:
        //                 //alert("Permission denied to use "+permission+" - ask again?");
        //                 break;
        //             case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
        //                 //alert("Permission permanently denied to use "+permission+" - guess we won't be using it then!");
        //                 break;
        //         }
        //     }
        // }, function(error){
        //     //alert("The following error occurred: "+error);
        // },[
        //     cordova.plugins.diagnostic.permission.CAMERA,
        //     cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION,
        //     cordova.plugins.diagnostic.permission.ACCESS_COARSE_LOCATION
        // ]);


        function loadLocation(){

            AdvancedGeolocation.start(function(success){

                try{
    
                    var jsonObject = JSON.parse(success);

                    var x = JSON.stringify(jsonObject);

                    if(jsonObject.provider=='gps'&&jsonObject.accuracy<20||jsonObject.provider=='network'&&jsonObject.accuracy<50){

                        localStorage.timestamp = jsonObject.timestamp;
                        localStorage.latitude = jsonObject.latitude;   
                        localStorage.longitude = jsonObject.longitude;
                        localStorage.accuracy = jsonObject.accuracy;
                        localStorage.provider = jsonObject.provider;

                        finishGPS();

                        return navigator.vibrate([50]);
                    }
                }

                catch(exc){
                    
                    console.log("Invalid JSON: " + exc);
                }
            },
    
            function(error){
    
            },
        
            {
                "minTime":0,
                "minDistance":0,
                "noWarn":false,
                "providers":"some",
                "useCache":false,
                "satelliteData":false,
                "buffer":false,
                "bufferSize":0,
                "signalStrength":false
            });

        };


        finishGPS = function(){

            AdvancedGeolocation.stop(function(success){

                navigator.vibrate([50]);

                if(!localStorage.isContract){
    
                    return window.location.assign('profile.html');
                
                } else{
    
                    return window.location.assign('capturaPonto.html');
                }

            });
        };


        setTimeout(function(){

            finishGPS();

            window.location.assign('approve.html');
            
        }, 2000);
    }
};

app.initialize();