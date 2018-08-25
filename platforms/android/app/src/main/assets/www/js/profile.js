//VALIDA USUÁRIO

String.prototype.trunc = String.prototype.trunc ||
    function(n){
    return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};


firebase.auth().onAuthStateChanged(function(user) {

    if(user){

        if(localStorage.NomFun){

            $('.displayName').html(localStorage.NomFun.trunc(25));
        }

        localStorage.uid = user.uid;

        $('.displayName').html(user.displayName);

        if(!user.displayName){

            var userNameEmail = user.email.split('@');

            user.updateProfile({ displayName:userNameEmail[0]});
        };


        $('.displayName').on('click', function(){

            $('#displayNameEdit').removeClass('hide');
            $('.displayName').addClass('hide');
        });
        
        
        $('#displayNameEdit').on('change', function(){
        
            $('#displayNameEdit').addClass('hide');
            $('.displayName').removeClass('hide');
            
            firebase.auth().onAuthStateChanged(user => {
                user.updateProfile({ displayName:$('#displayNameEdit').val()});
            });
        
            $('.displayName').html($('#displayNameEdit').val());
        });

    }else{

        //return localStorage.clear();
    };

    if(localStorage.CNPJ){

        user.updateProfile({ displayName:localStorage.CNPJ});
    };


    firebase.storage().ref('profile/'+user.uid).getDownloadURL().then(function(imageUrl){

        $('#profileImage').attr("src", imageUrl);

    });


    $('.displayEmail').html(user.email);


    if(user.emailVerified){

        $('.displayEmail').removeClass('text-danger');
        $('.displayEmail').addClass('text-success');

    } else{

        $('.displayEmail').on('click',function(){

            user.sendEmailVerification();

            navigator.vibrate([100]);

            navigator.notification.alert(
                'As instruções de ativação foram enviadas para seu email.',
                null,
                'overt | HCM',
                'Fechar'
            );
        });
    };
});


function photoProfile(){

    firebase.auth().onAuthStateChanged(user => {

        navigator.camera.getPicture(onSuccess, onFail, {
            
            quality: 100,
            
            destinationType: Camera.DestinationType.DATA_URL
        });
    

        function onSuccess(imageData) {
            
            var imageProfile = document.getElementById('profileImage');

            imageProfile.src = "data:image/jpeg;base64," + imageData;

            var refImage = 'profile/' + user.uid;
            
            user.updateProfile({ 
                photoURL:refImage
            });

            var storageRef = firebase.storage().ref(refImage);

            file = "data:image/jpeg;base64," + imageData;

            var task = storageRef.putString(file, 'data_url');

        }


        function onFail(message) {

            navigator.notification.alert(
                'Erro ao enviar a foto, tente novamente.',
                null,
                'overt | HCM',
                'Fechar'
            );
        }
    });
};