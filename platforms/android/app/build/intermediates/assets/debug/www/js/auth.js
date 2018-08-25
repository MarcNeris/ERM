firebase.auth().signOut();

localStorage.clear();

//(function(){

    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');

    btnLogin.addEventListener('click', e => {

        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(email, pass);

        auth.signInWithEmailAndPassword(email, pass).catch(function(err) {

            if(err.code=='auth/network-request-failed'){

                navigator.vibrate([100]);
                navigator.notification.alert(
                    'Verifique a conexão com a Internet.',
                    null,
                    'overt | HCM REP',
                    'Fechar'
                );
            }

            if(err.code=='auth/invalid-email'){

                navigator.vibrate([100]);
                navigator.notification.alert(
                    'Por favor informe um email válido.',
                    null,
                    'overt | HCM REP',
                    'Fechar'
                );
            }

            if(err.code=='auth/user-not-found'){
                
                navigator.vibrate([100]);

                function onConfirm(buttonIndex){
      
                    if(buttonIndex==1){
            
                        createUser(email,pass);
                        
                        checkContract();
                    }
                }
            
                navigator.notification.confirm(
                    
                    'Conta não cadastrada, criar um novo Login?',
                    onConfirm,
                    'overt | HCM REP',
                    ['Criar','Fechar']
                );
            };

            if(err.code=='auth/wrong-password'){
          
                navigator.vibrate([100]);

                function onConfirm(buttonIndex){
      
                    if(buttonIndex==1){
            
                        recoverPass(email);
            
                    }
                }

                navigator.notification.confirm(
                    
                    'Seu email ou senha estão errados, recuperar a senha?',
                    onConfirm,
                    'overt | HCM',
                    ['Recuperar','Fechar']
                );
            }
        });
    });





    function recoverPass(email){
        const auth = firebase.auth();
        auth.sendPasswordResetEmail(email);
        navigator.vibrate([100]);

        navigator.notification.alert(
            'Enviamos um email com instruções para recuperar sua senha. Talvez seu servidor o tenha considerado Span, verifique o lixo eletrônico.',
            null,
            'overt | HCM',
            'Fechar'
        );
    }





    function createUser(email,pass){

        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(email, pass).catch(function(err) {

            if(err.code=='auth/weak-password'){
    
                app.vibrate();

                navigator.notification.alert(
                    'A senha precisa ter pelo menos 6 caracteres.',
                    null,
                    'overt | HCM REP',
                    'Fechar'
                );
            }
        })
    }

//}());




firebase.auth().onAuthStateChanged(user => {

    if(user){

        window.location.assign('profile.html');
        
    } 
});