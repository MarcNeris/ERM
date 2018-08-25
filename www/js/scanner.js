var uploader = document.getElementById('uploader');

function scannerDoc(){

    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    });
    
    function onSuccess(imageData) {
        // var image = document.getElementById('myImage');
        // image.src = "data:image/jpeg;base64," + imageData;

        var dia = moment(new Date()).format("YYYY-MM-DD");

        var storageRef = firebase.storage().ref('hcm/rep/marcacao/'+dia);//+file.name);

        file = "data:image/jpeg;base64," + imageData;

        var task = storageRef.putString(file, 'data_url');

        task.on('state_changed',
            function progress(snapshot){
                var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                uploader.style.width = percentage+'%';
            },
            function error(err){
                app.notify('danger', err+'<br>):!');
            },
            function complete(){
                app.notify('success', '<br>Gravado com Sucesso!');
            }
        );
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

};

var dia = moment(new Date()).format("YYYY-MM-DD");

    var imageUrl = firebase.storage().ref('hcm/rep/marcacao/'+dia);

    console.log(imageUrl);


    imageUrl.getDownloadURL().then(function(url)                             {
        
        var image = document.getElementById('myImage');
        image.src = url;
    }).catch(function(error) {
        
        console.error(error);
    });