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
    
    var selectCompany = '<div class="row"><div class="col-md-12"><button id="id${NumCgc}" onclick="activeCompany(\'${NumCgc}\')"  class="btn ${btn} btn-block" style="margin: 2px;"> ${NumCgc}-${NomEmp}</button></div></div>';
      
    $("#selectCompany").empty();
    
    FS.collection('users/'+localStorage.uid+'/contracts').get().then(function(contracts) {

        contracts.forEach(function(contract) {

            contract = contract.data();

            if(contract){

                const employerContractRef = FS.collection('users/'+localStorage.uid+'/contracts').doc(contract.NumCgc);

                employerContractRef.update({DatLog:moment().format('YYYY-MM-DD HH:mm:ss')});

                contract.btn='btn-primary';

                if(localStorage.CNPJ){

                    if(localStorage.CNPJ==contract.NumCgc){

                        contract.btn='btn-success btn-fill';

                    }else{

                        contract.btn='disabled';
                    }

                }else{

                    localStorage.CNPJ=contract.NumCgc;
                }

                if(!localStorage.isContract){

                    localStorage.COMPANY = contract.NomEmp;
                    localStorage.DatAdm = contract.DatAdm;
                    localStorage.CPF = contract.NumCpf;
                    localStorage.PIS = contract.NumPis;
                    localStorage.NumCra = contract.NumCra;
                    localStorage.NumCad = contract.NumCad;
                    localStorage.isContract = 1;
                    localStorage.NomFun = contract.NomFun;

                    $('.displayName').html(localStorage.NomFun.trunc(25));
                    $('#COMPANY').html(localStorage.COMPANY);
                    $('#CNPJ').html(localStorage.CNPJ);
                    $('#DatAdm').html(moment(localStorage.DatAdm).format('DD/MM/YYYY'));
                    $('#CPF').html(localStorage.CPF);
                    $('#PIS').html(localStorage.PIS);

                    $('.sitContract').removeClass('text-danger');
                    $('.sitContract').addClass('text-success');
                };
                
                $.tmpl(selectCompany, contract).appendTo("#selectCompany");

                if(!localStorage.isContract){
           
                    return configureProfile();
                }
            }
        });
    });



    activeCompany = function(NumCgc){

        if(localStorage.isOnline=='N'){

            navigator.notification.alert(
                'Talvez não seja possível ativar o contrato sem estar conectado à Internet.',
                null,
                'overt | HCM',
                'Fechar'
            );
        };

        navigator.vibrate([50]);
        
        const employerContractRef = FS.collection('users/'+localStorage.uid+'/contracts').doc(NumCgc);

        localStorage.removeItem('isContract');
              
        employerContractRef.get().then(function(contract) {
                        
            var contract = contract.data();

            if(contract){

                localStorage.COMPANY=contract.NomEmp;
                localStorage.CNPJ=contract.NumCgc;
                localStorage.DatAdm=contract.DatAdm;
                localStorage.CPF=contract.NumCpf;
                localStorage.PIS=contract.NumPis;
                localStorage.NumCra=contract.NumCra;
                localStorage.NumCad=contract.NumCad;
                localStorage.isContract = 1;
                localStorage.NomFun=contract.NomFun;

                FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/DatLog').set(moment().format('DD/MM/YYYY HH:mm:ss'));
                FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/NumCpf').set(localStorage.CPF);
                FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/UsuUid').set(localStorage.uid);

                const refEmployees = FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu');
                
                refEmployees.once('value', function(employees){

                    var employees =  employees.val();
                    
                    if(employees){

                        if(employees.DevUid){

                            if(employees.DevUid!=device.uuid){
                                    
                                FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/DevNew').set(device.uuid);

                                return navigator.notification.alert(
                                    device.model+' - '+ device.uuid +' Este equipamento não está autorizado para seu contrato. Registramos um chamado solicitando autorização.',
                                    null,
                                    'overt | HCM',
                                    'Fechar'
                                );
                                
                            }

                        } else{

                            FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/DevUid').set(device.uuid);

                        }

                    } 

                    location.reload();
                });

                createContract();

            } else{

                navigator.vibrate([50]);

                return navigator.notification.alert(
                    'Erro ao ativar este contrato, verifique os dados e tente novamente.',
                    null,
                    'overt | HCM',
                    'Fechar'
                );
            }
        })  
    };

   
    $('#COMPANY').html(localStorage.COMPANY);
    $('#CNPJ').html(localStorage.CNPJ);
    $('#DatAdm').html(moment(localStorage.DatAdm).format('DD/MM/YYYY'));
    $('#CPF').html(localStorage.CPF);
    $('#PIS').html(localStorage.PIS);

    

    if(!localStorage.CNPJ){
        $('#CNPJ').html('Informe o CNPJ');
    }
    if(localStorage.DatAdm=='Invalid date'){
        $('#DatAdm').html('Data de Admissão');
    } else if(!localStorage.DatAdm){
        $('#DatAdm').html('Data de Admissão');
    }
    if(!localStorage.CPF){
        $('#CPF').html('Informe o CPF');
    }
    if(!localStorage.PIS){
        $('#PIS').html('Informe o PIS');
    }

    createContract();

});//VALIDA USUÁRIO


$('#novaEmpresa').on('click',function(){

    $('.sitContract').addClass('text-danger');
    $('.sitContract').removeClass('text-success');
        
    $('#CNPJEdit').removeClass('hide');
    $('#CNPJ').addClass('hide');
    $('#DatAdmEdit').removeClass('hide');
    $('#DatAdm').addClass('hide');
    $('#CPFEdit').removeClass('hide');
    $('#CPF').addClass('hide');
    $('#PISEdit').removeClass('hide');
    $('#PIS').addClass('hide');
    
    return localStorage.clear();
})


$('#CNPJ').on('click', function(){

    $('#CNPJEdit').removeClass('hide');
    $('#CNPJ').addClass('hide');
})


$('#CNPJEdit').on('blur', function(){
    $('#CNPJ').html($('#CNPJEdit').val());

    var CNPJ = $('#CNPJEdit').val();

    if(valida_cpf_cnpj(CNPJ)){

        localStorage.CNPJ= CNPJ;
        $('#CNPJ').removeClass('hide');
        $('#CNPJEdit').addClass('hide');

    } else{
        navigator.notification.alert(
            'CNPJ Inválido.',
            null,
            'overt | HCM',
            'Fechar'
        );
    }
})


$('#CPF').on('click', function(){

    $('#CPFEdit').removeClass('hide');
    $('#CPF').addClass('hide');
})


$('#CPFEdit').on('blur', function(){

    $('#CPF').html($('#CPFEdit').val());


    var CPF = $('#CPFEdit').val();

    if(valida_cpf_cnpj(CPF)){

        localStorage.CPF= CPF;
        $('#CPF').removeClass('hide');
        $('#CPFEdit').addClass('hide');

    } else{
        navigator.notification.alert(
            'CPF Inválido.',
            null,
            'overt | HCM',
            'Fechar'
        );
    }
});


$('#PIS').on('click', function(){
    
    $('#PISEdit').removeClass('hide');
    $('#PIS').addClass('hide');
})


$('#PISEdit').on('blur', function(){

    $('#PIS').html($('#PISEdit').val());

    var PIS = $('#PISEdit').val();
    
    if(valida_pis(PIS)){

        localStorage.PIS=PIS;
        $('#PIS').removeClass('hide');
        $('#PISEdit').addClass('hide');

    } else{

        navigator.notification.alert(
            'PIS Inválido.',
            null,
            'overt | HCM',
            'Fechar'
        );
    }
});


$('#DatAdm').on('click', function(){
    $('#DatAdmEdit').removeClass('hide');
    $('#DatAdm').addClass('hide');
});


$('#DatAdmEdit').on('change', function(){

    localStorage.DatAdm = moment($('#DatAdmEdit').val(),'DD/MM/YYYY').format('YYYY-MM-DD');
    
    $('#DatAdm').html($('#DatAdmEdit').val());

});


$('#DatAdmEdit').on('blur', function(){
    $('#DatAdm').removeClass('hide');
    $('#DatAdmEdit').addClass('hide');
});




createContract = function(isMessage){

    if(isMessage){

        if(!localStorage.CNPJ){

            navigator.notification.alert(
                'Informe o CNPJ.',
                null,
                'overt | HCM',
                'Fechar'
            );
        };
        
        if(!localStorage.DatAdm){
            navigator.notification.alert(
                'Informe a Data de Admissão.',
                null,
                'overt | HCM',
                'Fechar'
            );
                
        }
    
        if(!localStorage.CPF){
    
            navigator.notification.alert(
                'Informe o CPF.',
                null,
                'overt | HCM',
                'Fechar'
            );
        };
    
        if(!localStorage.PIS){
    
            navigator.notification.alert(
                'Informe o PIS.',
                null,
                'overt | HCM',
                'Fechar'
            );
        };
    }

    
    FB.ref('employers/'+localStorage.CNPJ+'/'+localStorage.CPF).once('value', function(employerConctract) {
        
        var employerConctract = employerConctract.val();
        
        if(employerConctract){
            
            console.log(employerConctract.DatAdm);

            console.log(localStorage.DatAdm);

            if(employerConctract.DatAdm==localStorage.DatAdm){

                if(employerConctract.NumPis==localStorage.PIS){

                    $('.sitContract').removeClass('text-danger');
                    $('.sitContract').addClass('text-success');
                    $('#COMPANY').html(employerConctract.NomEmp);
                    $('#CNPJ').html(employerConctract.NumCgc);
                    $('#DatAdm').html(moment(employerConctract.DatAdm).format('DD/MM/YYYY'));
                    $('#CPF').html(employerConctract.NumCpf);
                    $('#PIS').html(employerConctract.NumPis);

                    localStorage.COMPANY=employerConctract.NomEmp;
                    localStorage.CNPJ=employerConctract.NumCgc;
                    localStorage.DatAdm=employerConctract.DatAdm;
                    localStorage.CPF=employerConctract.NumCpf;
                    localStorage.PIS=employerConctract.NumPis;
                    
                    var usersContractsRef = FS.collection('/users/'+localStorage.uid+'/contracts').doc(localStorage.CNPJ);
                    
                    usersContractsRef.set(employerConctract, {merge: true});

                    contractMessage('1');

                } else{

                    contractMessage();
                }  
            } else{

                contractMessage();
                
            }

        } else{

            contractMessage();
        }
    });

    contractMessage = function(isOk){

        if(isMessage){

            navigator.vibrate([50]);

            if(isOk){

                //localStorage.isContract=1;

                //activeCompany(localStorage.CNPJ);

                navigator.notification.alert(
                    'Contrato cadastrado! Ative seu contrato clicando no botão acima',
                    null,
                    'overt | HCM',
                    'Fechar'
                );


            }else{
                
                $('.sitContract').addClass('text-danger');
                $('.sitContract').removeClass('text-success');
  
                navigator.notification.alert(
                    'Contrato inválido ou inativo. Verifique os dados cadastrados e tente novamente.',
                    null,
                    'overt | HCM',
                    'Fechar'
                );
            }

            location.reload();
        }
    }
}

$(document).ready(function(){
    setTimeout(function(){ 
        //activeCompany(localStorage.CNPJ);
    }, 5000);
});


//********************************************************************//
//
//VALIDA E FORMATA O PIS
//
//********************************************************************//
function valida_pis(pis) {
    var multiplicadorBase = "3298765432";
    var total = 0;
    var resto = 0;
    var multiplicando = 0;
    var multiplicador = 0;
    var digito = 99;
    
    var numeroPIS = pis.replace(/[^\d]+/g, '');

    if (numeroPIS.length !== 11 || 
        numeroPIS === "00000000000" || 
        numeroPIS === "11111111111" || 
        numeroPIS === "22222222222" || 
        numeroPIS === "33333333333" || 
        numeroPIS === "44444444444" || 
        numeroPIS === "55555555555" || 
        numeroPIS === "66666666666" || 
        numeroPIS === "77777777777" || 
        numeroPIS === "88888888888" || 
        numeroPIS === "99999999999") {
        return false;
    } else {
        for (var i = 0; i < 10; i++) {
            multiplicando = parseInt( numeroPIS.substring( i, i + 1 ) );
            multiplicador = parseInt( multiplicadorBase.substring( i, i + 1 ) );
            total += multiplicando * multiplicador;
        }

        resto = 11 - total % 11;
        resto = resto === 10 || resto === 11 ? 0 : resto;

        digito = parseInt("" + numeroPIS.charAt(10));
        return resto === digito;
    }
}
//********************************************************************//
//
//VALIDA E FORMATA O CNPJ
//
//********************************************************************//
function verifica_cpf_cnpj ( valor ) {

    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if ( valor.length === 11 ) {
        return 'CPF';
    } 
    else if ( valor.length === 14 ) {
        return 'CNPJ';
    }
    else {
        return false;
    }    
}

function calc_digitos_posicoes( digitos, posicoes = 10, soma_digitos = 0 ) {

    digitos = digitos.toString();
    for ( var i = 0; i < digitos.length; i++  ) {
        soma_digitos = soma_digitos + ( digitos[i] * posicoes );
        posicoes--;
        if ( posicoes < 2 ) {
            posicoes = 9;
        }
    }

    soma_digitos = soma_digitos % 11;

    if ( soma_digitos < 2 ) {
        soma_digitos = 0;
    } else {
        soma_digitos = 11 - soma_digitos;
    }
    var cpf = digitos + soma_digitos;
    return cpf;
}

function valida_cpf( valor ) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    var digitos = valor.substr(0, 9);
    var novo_cpf = calc_digitos_posicoes( digitos );
    var novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );
    if ( novo_cpf === valor ) {
        return true;
    } else {
        return false;
    } 
}

function valida_cnpj ( valor ) {
  valor = valor.toString();
  valor = valor.replace(/[^0-9]/g, '');
  var cnpj_original = valor;
  var primeiros_numeros_cnpj = valor.substr( 0, 12 );
  var primeiro_calculo = calc_digitos_posicoes( primeiros_numeros_cnpj, 5 );
  var segundo_calculo = calc_digitos_posicoes( primeiro_calculo, 6 );
  var cnpj = segundo_calculo;
  if ( cnpj === cnpj_original ) {
      return true;
  }
  return false;
}

function valida_cpf_cnpj ( valor ) {

    var valida = verifica_cpf_cnpj( valor );
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    if ( valida === 'CPF' ) {
        return valida_cpf( valor );
    } 
    else if ( valida === 'CNPJ' ) {
        return valida_cnpj( valor );
    } 
    else {
        return false;
    } 
}


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