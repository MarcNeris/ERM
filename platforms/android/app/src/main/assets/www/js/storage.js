var uploader = document.getElementById('uploader');
var fileButton = document.getElementById('fileButton');

fileButton.addEventListener('change', function(e){
    //Get File
    var file=e.target.files[0];
    //Create Storage Reference
    var storageRef = firebase.storage().ref('hcm/rep/atestado/'+file.name);
    //Upload File

    var task = storageRef.put(file);
    //Update Progress Bar
    task.on('state_changed',
        function progress(snapshot){
            var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            uploader.value = percentage;
        },
        function error(err){
            app.notify('danger', err+'<br>):!');
        },
        function complete(){
            app.notify('success', file.name+'<br>Gravado com Sucesso!');
        }
    );
});