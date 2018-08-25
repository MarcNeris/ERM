/**
* @author Andy Gup
* This simple demo app displays GPS and Network geodata as well as satellite meta-data.
*
* The mapping engine in this sample uses Esri's ArcGIS API for JavaScript.
* It is a full-features, Enterprise mapping API. More details on the API as well as
* licensing info visit https://developers.arcgis.com/javascript/
*
* A lightweight Leaflet API is also available: https://github.com/Esri/esri-leaflet
*
*/
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler. The scope of 'this' is the event.
    onDeviceReady: function() {

        var map;

        require([
            "dojo/on",
            "esri/map",
            "esri/graphic",
            "esri/geometry/Point",
            "esri/symbols/PictureMarkerSymbol",
            "dojo/domReady!"], function(on, Map, Graphic, Point, PictureMarkerSymbol) {

            var count = 0;
            var satDiv = document.getElementById("satData");
            var locationDiv = document.getElementById("locationData");

            // Displays GPS-derived locations
            var greenGPSSymbol = new PictureMarkerSymbol({
                "angle":0,
                "xoffset":0,
                "yoffset":13,
                "type":"esriPMS",
                "url":"img/green-pin.png",
                "width":35,
                "height":35
            });

            // Displays Network-derived locations
            var blueNetworkSymbol = new PictureMarkerSymbol({
                "angle":0,
                "xoffset":0,
                "yoffset":13,
                "type":"esriPMS",
                "url":"img/blue-pin.png",
                "width":35,
                "height":35
            });

            // Create our map
            map = new Map("map", {
              basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
              center: [-101,39], // longitude, latitude
              zoom: 4
            });

            // Wait until map is loaded before starting up location
            map.on("load", init);

            // Draw a graphic on the map
            function addGraphic(symbol, point){
                map.graphics.add(new Graphic(point, symbol));
            }

            // Required for mobile apps. Suspends drawing while map
            // is zooming in/out. Insures map is in a steady state
            // before we add a new graphic.
            function synchronizeMap(){
                map.on("zoom-start",function(){
                    console.log("Graphic drawing suspended");
                    map.graphics.suspend();
                })

                map.on("zoom-end",function(){
                    console.log("Graphic drawing resumed");
                    map.graphics.resume();
                })
            }

            function addLocationData(type, json){
                locationDiv.innerHTML = type + " Lat: " + Number(json.latitude).toFixed(4) +
                    ", Lon: " +  Number(json.longitude).toFixed(4) +
                    ", Acc: " + Number(json.accuracy).toFixed(4);
            }

            function addSatelliteData(json){

                var date = new Date(parseInt(json["timestamp"]));
                var satellites = "<br /><span style='font-weight:bold;'>Satellite Data:</span> " + date.toUTCString() + "<br /><br />";

                for( var key in json){

                    if(json.hasOwnProperty(key)
                        && key.toLowerCase() != "provider"
                        && key.toLowerCase() != "timestamp"
                        && key.toLowerCase() != "error"){

                        satellites +=
                            "PRN: " + json[key].PRN +
                            ", fix: " + json[key].usedInFix +
                            ", azimuth: " + json[key].azimuth +
                            ", elevation: " + json[key].elevation + "<br />";
                    }
                }

                satDiv.innerHTML = satellites;
            }

            // Initialize the geolocation plugin
            function init(){
                synchronizeMap();

                // Zoom in once
                if(count == 0){
                    map.setLevel(15);
                    count = 1;
                }

                AdvancedGeolocation.start(function(data){

                    try{

                        // Don't draw anything if graphics layer suspended
                        if(!map.graphics.suspended){

                            var jsonObject = JSON.parse(data);

                            switch(jsonObject.provider){
                                case "gps":
                                    if(jsonObject.latitude != "0.0"){

                                        alert(jsonObject.longitude);
                                        addLocationData("GPS", jsonObject);
                                        console.log("GPS location detected - lat:" +
                                            jsonObject.latitude + ", lon: " + jsonObject.longitude +
                                            ", accuracy: " + jsonObject.accuracy);
                                        var point = new Point(jsonObject.longitude, jsonObject.latitude);
                                        map.centerAt(point);
                                        addGraphic( greenGPSSymbol, point);
                                    }
                                    break;

                                case "network":
                                    if(jsonObject.latitude != "0.0"){
                                        addLocationData("Network", jsonObject);
                                        console.log("Network location detected - lat:" +
                                            jsonObject.latitude + ", lon: " + jsonObject.longitude +
                                            ", accuracy: " + jsonObject.accuracy);
                                        var point = new Point(jsonObject.longitude, jsonObject.latitude);
                                        map.centerAt(point);
                                        addGraphic( blueNetworkSymbol, point);
                                    }
                                    break;

                                case "satellite":
                                    console.log("Satellites detected " + (Object.keys(jsonObject).length - 1));
                                    console.log("Satellite meta-data: " + data);
                                    addSatelliteData(jsonObject);
                                    break;

                                case "cell_info":
                                    console.log("cell_info JSON: " + data);
                                    break;

                                case "cell_location":
                                    console.log("cell_location JSON: " + data);
                                    break;

                                case "signal_strength":
                                    console.log("Signal strength JSON: " + data);
                                    break;
                            }
                        }
                    }
                    catch(exc){
                        console.log("Invalid JSON: " + exc);
                    }
                },
                function(error){
                    console.log("Error JSON: " + JSON.stringify(error));
                    var e = JSON.parse(error);
                    console.log("Error no.: " + e.error + ", Message: " + e.msg + ", Provider: " + e.provider);
                },
                /////////////////////////////////////////
                //
                // These are the required plugin options!
                // README has API details
                //
                /////////////////////////////////////////
                {
                    "minTime":0,
                    "minDistance":0,
                    "noWarn":false,
                    "providers":"all",
                    "useCache":true,
                    "satelliteData":true,
                    "buffer":true,
                    "bufferSize":10,
                    "signalStrength":false
                });
            }; //init
        }); // require
    } //onDeviceReady
};

app.initialize();





else {

    var provider = 'gps';
}
























    
    

    if(jsonObject.provider=='gps'){
            
        if(jsonObject.timestamp){
            var timestamp = jsonObject.timestamp;
            localStorage.timestamp = timestamp;
            $('#btnInfo').html(moment(timestamp).format("HH:mm:ss"));
            $('#btnInfo').removeClass('hide');
        }


        if(accuracy){
        
            $('#btnDistance').removeClass('hide');
            
            if(accuracy<=3){
                
                localStorage.canWrite='Y';
                localStorage.latitude = latitude;   
                localStorage.longitude = longitude;
                localStorage.accuracy = accuracy;
                localStorage.provider = provider;

                var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};
                $('#btnDistance').removeClass('btn-danger');
                $('#btnDistance').addClass('btn-success');
                $('#btnDistance').addClass('btn-fill');
                $('#btnDistance').html(numeral(parseFloat(accuracy)+5).format('0,00')+'m');
                
                if(localStorage.isOnline=='Y'){

                    map.setCenter(GOOGLE);
                    
                    marker.setPosition(GOOGLE);

                }
                    //setTimeout(function(){
                    //}, 200000);

                    
                } else{
                    
                    localStorage.canWrite='N';
                    
                    $('#btnDistance').removeClass('btn-success');
                    $('#btnDistance').addClass('btn-danger');
                    $('#btnDistance').removeClass('btn-fill');
                    
                }
            }

    } else if (jsonObject.provider=='cell_info'){

        FB.ref('timestamp/timestampFB').set({".sv": "timestamp" });
        FB.ref("timestamp/timestampFB").on('value', function(timestamp) {
            var timestamp = timestamp.val();
            localStorage.timestamp = timestamp;
            $('#btnInfo').html(moment(timestamp).format("HH:mm:ss"));
            $('#btnInfo').addClass('btn-info');
            $('#btnInfo').removeClass('hide');
        });

        $('#btnDistance').removeClass('hide');
        
        localStorage.canWrite='Y';
        localStorage.latitude = latitude;   
        localStorage.longitude = longitude;
        localStorage.accuracy = accuracy;
        localStorage.provider = provider;
        localStorage.timestamp = timestamp;

        var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};
        $('#btnDistance').removeClass('btn-danger');
        $('#btnDistance').addClass('btn-success');
        $('#btnDistance').addClass('btn-fill');
        $('#btnDistance').html(numeral(parseFloat(accuracy)+5).format('0,00')+'m');
        
        if(localStorage.isOnline=='Y'){

            map.setCenter(GOOGLE);
            
            marker.setPosition(GOOGLE);

        }
    }     
    
    localStorage.provider = provider;















    $('#imgButton').on('touchstart', touchStart);
function touchStart(){

    localStorage.isTouched ='W';
    app.finishGPS();
    navigator.vibrate([100]);
    app.initialize();
    app.loadMap();


    localStorage.origem = 'device';
    
    $('#btnInfo').removeClass('hide');
    $('#btnInfo').removeClass('btn-warning');
    $('#btnInfo').removeClass('btn-info');
    $('#btnInfo').addClass('btn-success');
    $('#btnInfo').html('SAT');
    $('#btnIsTouched').removeClass('btn-danger');
    $('#btnIsTouched').addClass('btn-info');
    $('#btnIsTouched').html(localStorage.isTouched);
                
    if (localStorage.isTouched=='P') {
        
        touchend();
        
    } else if(localStorage.isTouched =='W') {
        
        $('#btnInfo').addClass('btn-info');
        
        bar.animate(1.0, {
            
            duration: 4000,
            //easing: 'easeInOut',
            
        },function(){
            
            if(localStorage.Geolocation=='N'){
    
                navigator.vibrate([100]);

                app.loadMap();

                checkDevice();
    
            } else{
    
                if(localStorage.canWrite=='Y'){
                    
                    checkDevice();
        
               } 
            }//else {

            //         function onConfirm(buttonIndex) {

            //             if(buttonIndex==1){
    
            //                 app.finishGPS();

            //                 fnAcertoMarcacao();
    
            //             } else if(buttonIndex==2){
    
            //                 touchend();
            //             }
            //         }
    
            //         navigator.vibrate([100]);
                    
            //         navigator.notification.confirm(
            //             'A precisão da Localização GPS do seu equipamento ainda não está concluída.',
            //             onConfirm,
            //             'overt | HCM',
            //             ['Encerrar GPS','Aguardar']
            //         );
            //     }
            // }
        });
    }
}










//create contract

var user = firebase.auth().currentUser;
    
    var uid = user.uid;
    
    var usersContractsRef = FS.collection('/users/'+uid+'/contracts').doc('CNPJ');

    usersContractsRef.get().then(function(doc) {

        if (doc.exists) {

            userContract = doc.data();

                var CNPJ = $('#CNPJ').html();

                if(CNPJ!='CNPJ'){

                    if(valida_cpf_cnpj(CNPJ)){
                       
                        var contract = {CNPJ:CNPJ};
    
                        usersContractsRef.update(contract);
    
                    } else {
                       
                        navigator.notification.alert(
                            'CNPJ Inválido.',
                            null,
                            'overt | HCM REP',
                            'Fechar'
                        );  
                    }
                }


                var CPF = $('#CPF').html();

                if(CPF!='CPF'){

                    if(valida_cpf_cnpj(CPF)){
                        
                        var contract = {CPF:CPF};
                        usersContractsRef.update(contract);
                    } else {
                        
                        navigator.notification.alert(
                            'CPF Inválido.',
                            null,
                            'overt | HCM REP',
                            'Fechar'
                        );
                    }
                }
                

                var PIS = $('#PIS').html();

                if(PIS!='PIS'){

                    if(valida_pis(PIS)){
                        var contract = {PIS:PIS};
                        usersContractsRef.update(contract);
                    } else {
                        
                        navigator.notification.alert(
                            'PIS Inválido.',
                            null,
                            'overt | HCM REP',
                            'Fechar'
                        );
                        
                    }
                }

                var DatAdm = moment($('#DatAdmEdit').val(),'DD/MM/YYYY').format('YYYY-MM-DD');
                var contract = {DatAdm:DatAdm};
                usersContractsRef.update(contract);
                $('#DatAdm').html(moment(DatAdm).format("DD/MM/YYYY"));

        } else {

            contract = {
                COMPANY:'COMPANY',
                  CNPJ:'CNPJ',
                    CPF:'CPF',
                    PIS:'PIS',
             DatAdm: moment(new Date()).format("YYYY-MM-DD")
            }

            usersContractsRef.set(contract);
        }
    });