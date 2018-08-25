var app = {

    initialize: function() {

        localStorage.isOnline='Y';

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    
    },

    onDeviceReady: function() {

        localStorage.networkState = navigator.connection.type;

        if(localStorage.networkState=='none'){

            $('#btnIsTouched').html(localStorage.networkState);

            localStorage.isOnline='N';

        }
        
        window.screen.orientation.lock('portrait');

        document.addEventListener("offline", onOffline, false);
        
        function onOffline() {
            
            $('#btnIsTouched').html('offline');
            
            localStorage.isOnline='N';
        }
        
        document.addEventListener("online", onOnline, false);
        
        function onOnline() {
            
            localStorage.isOnline='Y';
            
            localStorage.networkState = navigator.connection.type;

            $('#btnIsTouched').html(localStorage.networkState);
        };

        if(localStorage.latitude&&localStorage.isOnline=='Y'){

            var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};

            var mapOptions = {
                center: GOOGLE,
                disableDefaultUI:true,  
                zoom: 19,
                scrollwheel: false,
                styles: [
                    {
                        "stylers": [
                            {
                                "hue": "#ff1a00"
                            },
                            {
                                "invert_lightness": false
                            },
                            {
                                "saturation": -50
                            },
                            {
                                "lightness": 33
                            },
                            {
                                "gamma": 0.5
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#0088ff"
                            }
                        ]
                    }
                ],
            };

            $("#map").empty();
            
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            map.setCenter(GOOGLE);

        }

    },

        
    
    finishGPS:function(){
  
        localStorage.Geolocation='N';
        
        localStorage.canWrite='N';
        
        AdvancedGeolocation.stop(function(success){});
    },



    documentScanner:function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 100,

            destinationType: Camera.DestinationType.FILE_URI });
        
        function onSuccess(imageURI) {

            var image = document.getElementById('myImage');

            image.src = imageURI;
        }
        
        function onFail(message) {

        }
    },



    qrScannerDestroy:function(){

        var btnScanner = document.getElementById("qrScannerStatus");

        btnScanner.innerHTML = 'QrCode | Ponto';

        btnScanner.setAttribute('onclick','app.qrScanner()');

        btnScanner.classList.add('btn-info');

        btnScanner.classList.remove('btn-danger');

        QRScanner.destroy();
    },



    qrScanner:function(){

        localStorage.isQrPonto='N';

        localStorage.origem = 'qrPonto';

        if(localStorage.isOnline=='Y'){

            var now = moment().format('YYYYMMDDHHmm');

            localStorage.now = now;

            var encrypted = CryptoJS.AES.encrypt(now, 'angra@@2');
        
            FB.ref('timestamp/'+localStorage.CNPJ).set(String(encrypted));

            QRScanner.scan(displayContents);

            function displayContents(err, contents){

                if(err){

                    $("qrScannerStatus").html('Escanear Novamente');

                } else {
                    
                    var decrypted = CryptoJS.AES.decrypt(contents, 'angra@@2');

                    if(decrypted.toString(CryptoJS.enc.Utf8)==localStorage.now){

                        localStorage.isQrPonto='Y';

                        localStorage.canWrite='Y';

                        AdvancedGeolocation.start(function(success){
    
                            var jsonObject = JSON.parse(success);
            
                            if(jsonObject.provider=='gps'&&jsonObject.accuracy<5||jsonObject.provider=='network'&&jsonObject.accuracy<25){
            
                                localStorage.timestamp = jsonObject.timestamp;
                                localStorage.latitude = jsonObject.latitude;   
                                localStorage.longitude = jsonObject.longitude;
                                localStorage.accuracy = jsonObject.accuracy;
                                localStorage.provider = jsonObject.provider;

                                var isWrited = app.writeCapturaPonto(jsonObject);

                                if(isWrited){

                                    var diaHora = moment(jsonObject.timestamp).format("DD/MM/YYYY HH:mm");
    
                                    return navigator.notification.alert(
                                        diaHora+' QrPonto Registrado com sucesso!',
                                        touchend,
                                        'overt | HCM',
                                        'Fechar'
                                    );
                              
                                }
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
                            "satelliteData":true,
                            "buffer":false,
                            "bufferSize":0,
                            "signalStrength":false
                        });

                        app.qrScannerDestroy();

                    }  else {

                        return qrScanner();

                        // navigator.notification.alert(
                        //     'Qr Code inválido.',
                        //     null,
                        //     'overt | HCM',
                        //     'Fechar'
                        // );

                        // app.qrScannerDestroy();
                    }
                }
            }
            
            QRScanner.show();

            QRScanner.getStatus(function(status){

                if(status.scanning==true){

                    var btnScanner = document.getElementById("qrScannerStatus");
                    btnScanner.innerHTML = 'Cancelar';
                    btnScanner.setAttribute('onclick','app.qrScannerDestroy()');
                    btnScanner.classList.remove('btn-info');
                    btnScanner.classList.add('btn-danger');

                } else {

                    app.qrScannerDestroy();

                }


                setTimeout(function() {

                    if(localStorage.isQrPonto=='N'){

                        onConfirm= function(){
                            //app.qrScanner();
                        }
    
                        navigator.notification.alert(
                            'Tempo excedido, tente novamete.',
                            onConfirm,
                            'overt | HCM',
                            'Fechar'
                        );
    
                    }

                    app.qrScannerDestroy();
        
                }, 15000);
                
            });

        } else {

            navigator.vibrate([100]);
            
            navigator.notification.alert(
                'Não é possível usar o Qr Ponto sem estar conectado à Internet.',
                null,
                'overt | HCM',
                'Fechar'
            );
        }
    },


    qrScannerCancelScan : function(){

        QRScanner.cancelScan(function(status){
        
        });
    },
 
    notify: function(type, message){
        
        $.notify({
            icon: "ti-alert",
            message: message
        },{
            type: type,
            timer: 10,
            placement: {
                from: 'top',
                align: 'left'
            }
        });
    },



    vibrate: function(){

        navigator.vibrate([100]);
    },
    //
    //
    //registraPonto
    //
    //
    registraPonto : function(position){

        
       var nTry = parseInt(localStorage.nTry);

        try{

            if(localStorage.isTouched=='W'){
            
                localStorage.origem='device';
    
                if(!position.cached){
    
                    if(position.accuracy){

                        if(nTry<10){
                            var rTry = nTry;
                        }
    
                        localStorage.canWrite='Y';
                        
                        if(position.provider=='network'&&position.accuracy<(rTry+25)){
        
                            return app.writeCapturaPonto(position);
                        }
                        
                        if(position.provider=='gps'&&position.accuracy<rTry+3){
        
                            return app.writeCapturaPonto(position);
                
                        }
                    }
                }
            }

        }catch(e){

        }

        localStorage.nTry=(parseInt(localStorage.nTry)+1);
        
    },



    //writeCapturaPonto
    writeCapturaPonto : function(position) {

        var provider = position.provider;
        var accuracy = position.accuracy;
        var timestamp = position.timestamp;
        var latitude = position.latitude;
        var longitude = position.longitude;

        var dataST = moment(timestamp).format("DD/MM/YYYY");
        var dataHoraST = moment(timestamp).format("DD/MM/YYYY HH:mm:ss");
        var dataHoraDevice = moment().format("DD/MM/YYYY HH:mm:ss");
        var dateST = moment(timestamp).format("YYYY-MM-DD");
        var dateTimeST = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
        var horaST = moment(timestamp).format("HH:mm:ss");
        var HHmm = moment(timestamp).format("HH-mm");
        var YYYYMMDD = moment(timestamp).format("YYYY-MM-DD");

        var diaHora = moment(timestamp).format("DD/MM/YYYY HH:mm");

        if(localStorage.lastWrited){
            
            if(moment(localStorage.lastWrited).isSame(dateTimeST, 'minute')){

                localStorage.canWrite='N';
    
                return AdvancedGeolocation.stop(function(data){

                    navigator.vibrate([50]);

                    navigator.notification.alert(
                        diaHora+' Ponto já registrado nesta data e hora.',
                        touchend,
                        'overt | HCM',
                        'Fechar'
                    );
                });  
            } 
        }

        
        var currentUser = firebase.auth().currentUser;
        
        var usersContractsRef = FS.collection('/users/'+currentUser.uid+'/contracts').doc(localStorage.CNPJ);

        usersContractsRef.get().then(function(doc) {
            
            userContract = doc.data();
            
            var deviceInfo = {serial: device.serial, version: device.version, model: device.model, uuid: device.uuid};

            var sitDevice = 'Pendente';

            if(!userContract.uuid){
                usersContractsRef.update(deviceInfo);
            }

            if(userContract.uuid==device.uuid){
                var sitDevice = 'Autorizado';
            }
            
            var CPF = userContract.NumCpf;
            var PIS = userContract.NumPis;
            var CNPJ = userContract.NumCgc;
            var NumCra = userContract.NumCra;
            var NumCad = userContract.NumCad;
            var networkInfo = navigator.connection.type;

            var origem = localStorage.origem;
            var provider = localStorage.provider;

            if(localStorage.ES){
    
                switch(localStorage.ES){
    
                    case 'Entrada':
                    localStorage.ES ='Pausa';
                        break;
                    case 'Pausa':
                    localStorage.ES='Retorno';
                        break;
                    case 'Retorno':
                    localStorage.ES='Saída';
                        break;
                    case 'Saída':
                    localStorage.ES='Entrada';
                        break;
                }

            }else{

                localStorage.ES='Entrada';
            }
            
            var pontoCapturado = {
                horaST: horaST,
                timestampFS: firebase.firestore.FieldValue.serverTimestamp(),
                timestampST:timestamp,
                dataST: dataST,
                dataHoraST: dataHoraST,
                dataHoraAcerto: dataHoraST,
                dataHoraDevice: dataHoraDevice,
                dateST: dateST,
                dateTimeST: dateTimeST,
                ES: localStorage.ES,
                origem:origem,
                provider:provider,
                justificativa:0,
                justificativaAcerto: null,
                justificativaAprovada: 0,
                justificativaAprovador: 0,
                justificativaDocumento: 0,
                justificativaImagem: 0,
                justificativaTimestamp:0,
                latitude: latitude,
                longitude: longitude,
                network: networkInfo,
                device: deviceInfo,
                sitDevice:sitDevice,
                CPF: CPF,
                CNPJ: CNPJ,
                PIS: PIS,
                NumCra: NumCra,
                NumCad: NumCad,
                SitReg: 0,
                nTry:localStorage.nTry,
                accuracy:accuracy
            };
    
            var FSref = 'users/REP/'+localStorage.uid+'/'+userContract.NumCgc+'/'+YYYYMMDD;
            
            if(localStorage.canWrite=='Y'){

                FS.collection(FSref).doc(HHmm).set(pontoCapturado);
            

                localStorage.lastWrited = dateTimeST;

                return AdvancedGeolocation.stop(function(data){

                    localStorage.canWrite='N';
        
                    localStorage.isWrited='Y';
        
                    navigator.vibrate([100]);
                    
                    if(localStorage.isOnline=='Y'){
                        
                        isSync='Registrado com Sucesso! '+diaHora;

                    } else{

                        isSync = 'Registrado com Sucesso! '+diaHora+'. Aguardando conexão com a internet para sincronizar.'
                    
                    }


                    bar.animate(1.0,  {
            
                        duration: 200
                        
                    },function(){

                        navigator.notification.alert(
                            isSync,
                            touchend,
                            'overt | HCM',
                            'Fechar'
                        );
                    }); 
                });
            }
        });

        return true;
    }
};



app.initialize();



getUid = function(){

    var currentUser = firebase.auth().currentUser;
    
    return currentUser.uid;
}



loadGmap = function(){
    
    try{

        if(localStorage.latitude&&localStorage.isOnline=='Y'){

            var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};

            var mapOptions = {
                center: GOOGLE,
                disableDefaultUI:true,  
                zoom: 19,
                scrollwheel: false,
                styles: [
                    {
                        "stylers": [
                            {
                                "hue": "#ff1a00"
                            },
                            {
                                "invert_lightness": false
                            },
                            {
                                "saturation": -50
                            },
                            {
                                "lightness": 33
                            },
                            {
                                "gamma": 0.5
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#0088ff"
                            }
                        ]
                    }
                ],
            };
        
            $("#map").empty();

    
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            
            var marker = new google.maps.Marker({
                position: GOOGLE,
                icon: "img/job.svg",
                map: map,
                title: "Registrar Ponto Aqui!"
            });
        
            map.setCenter(GOOGLE);
        
        }

    }
    
    catch(exc){
        
        console.log("Invalid JSON: " + exc);
    }

    if(map&&marker){

        init(map, marker);
        
    } else{

        init();
    }
}



init = function(map, marker){
       
    AdvancedGeolocation.start(function(data){

     //alert(JSON.stringify(data));

        try{

            var jsonObject = JSON.parse(data);

            $('#btnInfo').html(moment(jsonObject.timestamp).format("HH:mm:ss"));
            $('#btnInfo').removeClass('hide');


            switch(jsonObject.provider){

                case "gps":

                    if(jsonObject.latitude != "0.0"){

                        localStorage.latitude = jsonObject.latitude;   
                        localStorage.longitude = jsonObject.longitude;
                        localStorage.accuracy = jsonObject.accuracy;
                        localStorage.provider = jsonObject.provider;

                        
                        $('#btnInfo').html(moment(jsonObject.timestamp).format("HH:mm:ss"));
                        $('#btnInfo').removeClass('hide btn-info btn-danger');
                        $('#btnInfo').addClass('btn-success');
                        
                        $('#btnDistance').html(numeral(jsonObject.accuracy+5).format('0,00')+'m');
                        $('#btnDistance').removeClass('hide btn-info btn-danger');
                        $('#btnDistance').addClass('btn-success');
                        
                        app.registraPonto(jsonObject);
                        
                        if(map&&marker){
                            
                            var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};
                            map.setCenter(GOOGLE);
                            marker.setPosition(GOOGLE);
                        }
                    }

                break;

                case "network":

                    if(jsonObject.latitude != "0.0"){

                        localStorage.latitude = jsonObject.latitude;   
                        localStorage.longitude = jsonObject.longitude;
                        localStorage.accuracy = jsonObject.accuracy;
                        localStorage.provider = jsonObject.provider;

                        $('#btnInfo').html(moment(jsonObject.timestamp).format("HH:mm:ss"));
                        $('#btnInfo').removeClass('hide btn-success btn-danger');
                        $('#btnInfo').addClass('btn-info');

                        $('#btnDistance').html(numeral(jsonObject.accuracy+5).format('0,00')+'m');
                        $('#btnDistance').removeClass('hide btn-success btn-danger');
                        $('#btnDistance').addClass('btn-info');
 
                        app.registraPonto(jsonObject);
                        
                        if(map&&marker){
                            
                            var GOOGLE = {"lat": parseFloat(localStorage.latitude), "lng": parseFloat(localStorage.longitude)};
                            map.setCenter(GOOGLE);
                            marker.setPosition(GOOGLE);
                        }
                    }

                break;
            }  
        }
        
        catch(exc){

            $('#btnInfo').html('Erro');
            $('#btnInfo').removeClass('hide btn-success btn-info');
            $('#btnInfo').addClass('btn-danger');
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