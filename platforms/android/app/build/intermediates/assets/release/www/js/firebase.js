firebase.initializeApp({
    apiKey: "AIzaSyDQBwFnkee2UvDN_ir4KNSuXgvq8jzjSGw",
    authDomain: "hcmrep-overt.firebaseapp.com",
    databaseURL: "https://hcmrep-overt.firebaseio.com",
    projectId: "hcmrep-overt",
    storageBucket: "hcmrep-overt.appspot.com",
    messagingSenderId: "168435926428",
});

const FS = firebase.firestore();

const FB = firebase.database();

const settings = {timestampsInSnapshots: true};

FS.settings(settings);

FS.enablePersistence();


firebase.auth().onAuthStateChanged(function(user) {

    if(user){

        localStorage.uid = user.uid;
        
        if(!localStorage.isContract){
           
            return configureProfile();
        }
        
    } else{
        
        return locationAuth();
    }

    if(!user.emailVerified){

        navigator.notification.alert(
            'Ative seu email. Toque em seu email utilizado para o login, que lhe enviaremos as instruções',
            configureProfile,
            'overt | HCM',
            'Fechar'
        );
    }
});




function configureProfile(){

    navigator.vibrate([50]);
    
    // navigator.notification.alert(
    //     'Ative seu cadastro, ou registre um contrato, informando o CNPJ, data de admissão, CPF e PIS.',
    //     null,//activeCompany(localStorage.CNPJ),
    //     'overt | HCM REP',
    //     'Fechar'
    // );

    return locationProfile();
}



function locationProfile(){

    var url  = window.location.href;

    var html = url.split("/")[url.split("/").length -1];

    if (html !='profile.html'){

        return window.location.assign('profile.html');
    }
    
}


function locationAuth(){

    var url  = window.location.href;

    var html = url.split("/")[url.split("/").length -1];

    if (html !='auth.html'){

        return window.location.assign('auth.html');
    }
    
}



function logout(){

    navigator.vibrate([50]);

    function onConfirm(buttonIndex){
      
        if (buttonIndex==1){
            
            localStorage.clear();
            firebase.auth().signOut();
            AdvancedGeolocation.kill(function(success){});
            return navigator.app.exitApp();
        }
        
    }

    navigator.notification.confirm(
        
        'Encerrar o App?',
        onConfirm,
        'overt | HCM',
        ['Sim','Voltar']
    );
};




$(function() {
    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).parent().addClass('active');
});