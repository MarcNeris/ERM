// ///////show de funcao
// function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
//     var promise = new Promise(function (resolve, reject) {
//         try {
//             var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
//             var pc = new myPeerConnection({ iceServers: [] }),
//                 noop = function () { },
//                 localIPs = {},
//                 ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
//                 key;
//             function ipIterate(ip) {
//                 if (!localIPs[ip]) onNewIP(ip);
//                 localIPs[ip] = true;
//             }
//             pc.createDataChannel(""); //create a bogus data channel
//             pc.createOffer(function (sdp) {
//                 sdp.sdp.split('\n').forEach(function (line) {
//                     if (line.indexOf('candidate') < 0) return;
//                     line.match(ipRegex).forEach(ipIterate);
//                 });
//                 pc.setLocalDescription(sdp, noop, noop);
//             }, noop); // create offer and set local description

//             pc.onicecandidate = function (ice) { //listen for candidate events
//                 if (ice && ice.candidate && ice.candidate.candidate && ice.candidate.candidate.match(ipRegex)) {
//                     ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
//                 }
//                 resolve("FindIPsDone");
//                 return;
//             };
//         }
//         catch (ex) {
//             reject(Error(ex));
//         }
//     });// New Promise(...{ ... });
//     return promise;
// };

// //This is the callback that gets run for each IP address found
// function foundNewIP(ip) {
//     if (typeof window.ipAddress === 'undefined')
//     {
//         window.ipAddress = ip;
//     }
//     else
//     {
//         window.ipAddress += " - " + ip;
//     }
// }

// //This is How to use the Waitable findIP function, and react to the
// //results arriving
// var ipWaitObject = findIP(foundNewIP);        // Puts found IP(s) in window.ipAddress
// ipWaitObject.then(
//     function (result) {
//         alert ("IP(s) Found.  Result: '" + result + "'. You can use them now: " + window.ipAddress)
//     },
//     function (err) {
//         alert ("IP(s) NOT Found.  FAILED!  " + err)
//     }
// );
// ///////show de funcao



/////////////////////////////////////////
//
// fnAcertoMarcacao | Gerencia as marcações e identifica os erros.
//
/////////////////////////////////////////

fnAcertoMarcacao = function(DatMrc){

    var YYYYMMDD;

    if(DatMrc){

        YYYYMMDD = DatMrc;

        localStorage.YYYYMMDD = YYYYMMDD;

        $('#btnAcertoDePonto').addClass('btn-fill');

    } else {

        if(localStorage.YYYYMMDD){
            
            YYYYMMDD = localStorage.YYYYMMDD;

        } else {

            YYYYMMDD = moment().format("YYYY-MM-DD");
        }

        
        localStorage.YYYYMMDD = YYYYMMDD;
    };
    
    $('#btnAcertoDePonto').val(moment(YYYYMMDD).format("ddd DD/MM"));
    

    (function(){
        
        localStorage.lastES = 'Saída';

        FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD).child('LastES').once('value', function(lastES){
            
            var lastES = lastES.val();

            if(lastES){
    
               localStorage.lastES = lastES;
    
            } else{
    
               localStorage.lastES='Saída';
            }
        });

    })();

    var REPref = FS.collection('users/REP/'+localStorage.uid+'/'+localStorage.CNPJ+'/'+YYYYMMDD);

    REPref.onSnapshot( snapshot => {
        
        var REPStatus = '<div class="row"> <btn class="btn ${btnESclass} btn-lg btnOvert"><i class="${btnESicon}"></i><span class="orientacao" justificativaAprovada="${justificativaAprovada}" dateTimeST="${dateTimeST}"> ${horaAcerto}</span></btn>'+
        '<btn class="btn ${btnAcertoClass} btn-lg btn-simple btn-icon btnIcon" onclick="${fnAcerto}Ponto(\'${dateTimeST}\',\'${CNPJ}\',\'${uid}\')"><i class="${btnAcertoIcon}"></i></btn></div>';
        
        $("#ponto").empty();

        var QtdApv = 0;
        var QtdMrc = 0;
        var QtdErr = 0;       

        snapshot.forEach(REPdoc => {//FOREACH PONTO
                                    
            var ponto = REPdoc.data();

            var YYYYMMaf = moment(ponto.dateTimeST).format("YYYYMM");
            var YYYYMMDDaf = moment(ponto.dateTimeST).format("YYYYMMDD");
            var DDMMYYYY = moment(ponto.dateTimeST).format("DDMMYYYY");
            var HHmmAcerto = moment(ponto.dataHoraAcerto,'DD/MM/YYYY HH:mm:ss').format("DDMMYYYYHHmm");
            var HHmmPonto = moment(ponto.dateTimeST).format("DDMMYYYYHHmm");
            var HHmm = moment(ponto.dateTimeST).format("HHmm");
            /////////////////////////////////////////
            //
            // FORMATA O AFD PARA IMPORTAÇÃO NO RH
            //
            /////////////////////////////////////////
            var strNSR = '' + HHmm;
            var padNSR = '000000000';
            var NSR = padNSR.substring(0, padNSR.length - strNSR.length) + strNSR;
            
            var strPIS =''+ponto.PIS;
            var padPIS = '000000000000';
            var PIS = padPIS.substring(0, padPIS.length - strPIS.length) + strPIS;
            
            var ES = ponto.ES.substring(0,1);
            
            if(ponto.justificativaAprovada==1){
                
                var DDMMYYYYHHmm = HHmmAcerto;
                
            } else{
                
                var DDMMYYYYHHmm = HHmmPonto;
                
            }
            
            var AFD = NSR+ES+DDMMYYYYHHmm+PIS;

            if(localStorage.CPF){

               FB.ref('afd/'+localStorage.CNPJ+'/'+YYYYMMaf+'/'+YYYYMMDDaf+'/'+localStorage.CPF+'/'+HHmm).set({AFD});
            };
            /////////////////////////////////////////
            //
            // FIM DA FORMATACAO O AFD PARA IMPORTAÇÃO NO RH
            //
            /////////////////////////////////////////
            
            

            /////////////////////////////////////////
            //
            // FORMATA OS BOTOES E GERENCIA MARCAÇÕES ERRADAS
            //
            /////////////////////////////////////////

            ponto.uid = localStorage.uid;
            
            if(ponto.justificativa==1){

                ponto.btnAcertoClass='btn-warning';
                ponto.btnAcertoIcon='ti-user';

            }else{

                ponto.btnAcertoClass='btn-default';
                ponto.btnAcertoIcon='ti-settings';
                ponto.btnAcertoClass='btn-info';
            } 
            
            if(ponto.justificativaAprovada==1){
                ponto.btnAcertoClass='btn-success';
                ponto.btnAcertoIcon='ti-check';
            } else {
                ponto.fnOrientacao='fnOrientacao';
                ponto.fnAcerto='fnAcerto';
            }

            if(ponto.ES=='Entrada'&&(DDMMYYYY==moment().format('DDMMYYYY'))){

                localStorage.UltEnt = moment(ponto.dateTimeST).format("YYYY-MM-DD HH:mm");

                FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/usu/UltEnt').set(localStorage.UltEnt);
            
            };

            if(ponto.origem=='Marcação Manual'){

                ponto.btnESclass='btn-warning';

                ponto.btnAcertoIcon='ti-hand-point-up';

            };

            var logES;

            
            //console.log(localStorage.lastES);

            switch(ponto.ES){
  
                case 'Entrada':

                    ponto.btnESclass='btn-info';
                    ponto.btnESicon='ti-control-play';

                    if(localStorage.lastES=='Saída'){

                        logES = '';
                        
                    } else{

                        ponto.btnESclass='btn-danger';
                        ponto.btnAcertoClass='btn-danger';
                        ponto.fnAcerto='fnAcertoManual';

                        logES = 'Entrada sem registro da Saída.';

                        QtdErr++;

                    };

                    localStorage.lastES = ponto.ES;                    
                    
                    break;
                case 'Pausa':
                    ponto.btnESclass='btn-info';
                    ponto.btnESicon='ti-control-pause';

                    if(localStorage.lastES=='Entrada'||localStorage.lastES=='Retorno'){
                        
                        logES = '';

                    } else{

                        ponto.btnESclass='btn-danger';
                        ponto.btnAcertoClass='btn-danger';
                        ponto.fnAcerto='fnAcertoManual';

                        logES = 'Pausa sem registro da Entrada.';

                        QtdErr++;

                    };

                    localStorage.lastES=ponto.ES;

                    break;

                case 'Retorno':
                    ponto.btnESclass='btn-info';
                    ponto.btnESicon='ti-control-forward';

                    if(localStorage.lastES=='Pausa'){
                        
                        logES = '';

                    } else{

                        ponto.btnESclass='btn-danger';
                        ponto.btnAcertoClass='btn-danger';
                        ponto.fnAcerto='fnAcertoManual';

                        logES = 'Retorno sem registro da Pausa.';

                        QtdErr++;

                    };

                    localStorage.lastES=ponto.ES;

                    break;

                case 'Saída':
                    ponto.btnESclass='btn-info';
                    ponto.btnESicon='ti-control-stop';

                    if(localStorage.lastES=='Retorno'||localStorage.lastES=='Entrada'){
                        
                        logES = '';

                    } else{

                        ponto.btnESclass='btn-danger';
                        ponto.btnAcertoClass='btn-danger';
                        ponto.fnAcerto='fnAcertoManual';

                        logES = 'Saída sem registro do Retorno/Entrada.';

                        QtdErr++;

                    };

                    localStorage.lastES = ponto.ES;

                    break;
                case 'Desconsiderar':
                    ponto.btnESclass = 'btn-default disabled';
                    ponto.btnESicon = 'ti-close';
                    logES = 'Marcação Desconsiderada.';
                    ponto.btnAcertoIcon = '';
                    ponto.fnAcerto = '';
                    ponto.btnAcertoClass = '';

                    break;
                default:
                    ponto.btnESclass = 'btn-default';

            }

            console.log(localStorage.lastES, logES, ponto.dataHoraAcerto);
            /////////////////////////////////////////
            //
            // FIM DA FORMATACAO DOS BOTOES E GERENCIA MARCAÇÕES ERRADAS
            //
            /////////////////////////////////////////

            var HHmm = moment(ponto.dateTimeST).format("HH-mm");
         
            
            ponto.horaAcerto = moment(ponto.dataHoraAcerto,'DD/MM/YYYY HH:mm:ss').format('HH:mm');
            
            
            if(logES){
                
                FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD+'/'+HHmm+'/LogES').set(logES);
                
            } else{
                
                FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD+'/'+HHmm+'/LogES').remove();
            }

            /////////////////////////////////////////
            //
            // GRAVA MARCACOES PARA TRATAMENTO DA EMRPESA.
            if(localStorage.CPF){

                FB.ref('rep/'+localStorage.CNPJ+'/'+YYYYMMDD+'/'+localStorage.CPF+'/'+HHmm).set(ponto);
            }
            /////////////////////////////////////////
            
            //FB.ref('rep/'+localStorage.CNPJ+'/'+localStorage.CPF+'/'+YYYYMM+'/'+YYYYMMDD+'/'+HHmm).set(ponto);
            //FB.ref('afd/'+localStorage.CNPJ+'/'+YYYYMMaf+'/'+YYYYMMDDaf+'/'+localStorage.CPF+'/'+HHmm).set({AFD});
            
            $.tmpl(REPStatus, ponto).appendTo("#ponto");

            if(ponto.ES=='Desconsiderar'){
             
            }else{

                QtdMrc++;

                localStorage.ES = ponto.ES;
            };

            
            if(ponto.justificativa==1&&ponto.justificativaAprovada==0){
                
                QtdApv++;
            };

        });//FIM DO FOREACH PONTO


        

        /////////////////////////////////////////
        //
        // fnMudaOrientacao MUDA A ORIENTACAO DA MARCACAO, ENTRADA, PAUSA, RETORNO, SAIDA, OU DESCONSIDERAR
        //
        /////////////////////////////////////////

        $('.orientacao').on('click', function(){
            
            navigator.vibrate([50]);

            var justificativaAprovada = $(this).attr('justificativaAprovada');
            
            var timestampST = $(this).attr('dateTimeST');

            var YYYYMMDD = moment(timestampST).format("YYYY-MM-DD");

            localStorage.YYYYMMDD = YYYYMMDD;
            
            var HHmm = moment(timestampST).format("HH-mm");
            var refREP= '/users/REP/'+localStorage.uid+'/'+localStorage.CNPJ+'/'+YYYYMMDD;
            var REPref = FS.collection(refREP).doc(HHmm);

            var HHmmMarcacao = moment(timestampST).format("HH:mm");

            if(justificativaAprovada==1){

                return navigator.notification.alert(
                    HHmmMarcacao+' Marcação já foi aprovada.',
                    null,
                    'overt | HCM',
                    'Fechar'
                );

            } else {

                REPref.get().then(function(doc) {

                    var REP = doc.data();

                    var ES;
                    
                    switch(REP.ES){
                        case  'Entrada':
                            ES = {ES:'Pausa'}
                            break;
                        case  'Pausa':
                            ES = {ES:'Retorno'}
                            break;
                        case  'Retorno':
                            ES = {ES:'Saída'}
                            break;
                        case  'Saída':
                            ES = {ES:'Desconsiderar'}
                            break;
                        case  'Desconsiderar':
                            ES = {ES:'Entrada'}
                            break;
                        default:
                            ES = {ES:'Entrada'}
                    }

                    console.log(ES);

                    ES.justificativaAcerto = 'Orientação';
                    ES.justificativaMotivo = 'Orientação da Marcação';
                    ES.justificativaAprovada = 0;
                    ES.justificativa = 1;
                    ES.justificativaDataHora = moment().format('DD/MM/YYYY HH:mm:ss');

                    (function(){
        
                        localStorage.lastES = 'Saída';
                
                        FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD).child('LastES').once('value', function(lastES){
                            
                            var lastES = lastES.val();
                
                            if(lastES){
                    
                                localStorage.lastES = lastES;
                    
                            } else{
                    
                                localStorage.lastES='Saída';
                            }
                        });
                
                    })();
                    
                    return REPref.update(ES);
                })
            }

            return true;
        
        });
        
        
        lastYYYYMMDD = moment(YYYYMMDD).add(1, 'day').format('YYYY-MM-DD');
             
        FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD+'/QtdMrc').set(QtdMrc);
        FB.ref('employees/'+localStorage.CNPJ+'/'+localStorage.CPF+'/approve/'+YYYYMMDD+'/QtdApv').set(QtdApv);
        FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+YYYYMMDD+'/QtdErr').set(QtdErr);
        FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+lastYYYYMMDD+'/LastES').set(localStorage.lastES);
        
        checkDay(YYYYMMDD);
    });

    return true;
};



/////////////////////////////////////////
//
// VERIFICA AS INCONSISTEMCAS POR DIA
//
/////////////////////////////////////////

checkDay = function(YYYYMMDD){

    FB.ref('users/'+localStorage.uid+'/toCheck/').child(localStorage.CNPJ).on('value', function(toCheck){
        
        var toCheck = toCheck.val();

        var qtdNotification = 0;

        $.each(toCheck, function( index, value ) {

            if(value.QtdErr>=1){

                qtdNotification++;

            } else if (value.QtdErr==0&&value.QtdApv==0){

               FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ).child(index).remove();

            }

        });

        $('#ulAcertoDePonto').removeClass('hide');
        if(qtdNotification>0){
            $('#qtdNotification').html(qtdNotification+'d');
            $('#qtdNotification').removeClass('hide');
        } else{
            $('#qtdNotification').addClass('hide');
        }

        return checkDay;
    });

    return true;
}//checkDay



$('.displayCompany').html(localStorage.COMPANY);


/////////////////////////////////////////
//
// RETORNA O DIA COM AS DEVIDAS CONSISTENCIAS
//
/////////////////////////////////////////

$('#btnAcertoDePonto').on('change', function(){

    var YYYYMMDD = moment($(this).val(),'DD/MM/YYYY').format('YYYY-MM-DD');

    return fnAcertoMarcacao(YYYYMMDD);
    
});


/////////////////////////////////////////
//
// INSERE O MOTIVO DA SOLICITACAO DE APROVACAO DOS ACERTOS NAS MARCACOES.
//
/////////////////////////////////////////
$('.motivo').on('click', function(){

    $('#txtJustificativa').removeClass('hide');
    $('#dataJustificativa').removeClass('hide');
    $('#motivo').html($(this).html());
 
    const REPref = FS.collection(localStorage.StorageRefREP).doc(localStorage.StorageRefDOC);

    REPref.update({
        justificativaMotivo:$(this).html(),
        justificativaAprovada: 0,
        justificativa: 1,
        justificativaDataHora: moment().format('DD/MM/YYYY HH:mm:ss'),
        SitReg:'Editado'
    });
});


$('#txtJustificativa').on('blur', function(){

    const REPref = FS.collection(localStorage.StorageRefREP).doc(localStorage.StorageRefDOC);

    var txtJustificativa = {
        justificativaAcerto: $('#txtJustificativa').val(),
        justificativaAprovada: 0,
        justificativa: 1,
        justificativaDataHora: moment().format('DD/MM/YYYY HH:mm:ss'),
        SitReg:'Editado'
    };
    
    REPref.update(txtJustificativa);
});



/////////////////////////////////////////
//
// TRATA AS MARCACOES MANUAIS
//
/////////////////////////////////////////
$('#dataNovaMarcacao').on('change', function(){

    var dataHoraST = moment(localStorage.YYYYMMDD).format('DD/MM/YYYY HH:mm:ss');

    var dia = moment(localStorage.YYYYMMDD).format('DD/MM/YYYY');

    var dataHoraAcerto = dia + moment($('#dataNovaMarcacao').val(),'DD/MM/YYYY HH:mm').format(' HH:mm:ss');

    var YYYYMMDD = moment(dataHoraAcerto,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD');
    var HHmm = moment(dataHoraAcerto,'DD/MM/YYYY HH:mm').format('HH-mm');

    var FSref = 'users/REP/'+localStorage.uid+'/'+localStorage.CNPJ+'/'+YYYYMMDD;           
    const RMPref = FS.collection(FSref).doc(HHmm);

    RMPref.get().then(function(REP) {

        if(REP.data()){

            navigator.vibrate([50]);

            navigator.notification.alert(
                dataHoraAcerto+' Ponto já registrado nesta data e hora.',
                touchend,
                'overt | HCM',
                'Fechar'
            );

        }else{

            if(localStorage.isOnline=='Y'){

                $.get("https://ipinfo.io", function(networkLog) {
    
                    localStorage.networkLog = JSON.stringify(networkLog);
    
                }, "jsonp");

                var networkInfo = navigator.connection.type;
                
                var deviceInfo = {serial: device.serial, version: device.version, model: device.model, uuid: device.uuid};
                
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

                if(localStorage.networkLog){
                    var networkLog = JSON.parse(localStorage.networkLog);
                } else{
                    var networkLog = 'falha ao identificar Ip de origem';
                }

                var latitude = parseFloat(localStorage.latitude) || 0;
                var longitude = parseFloat(localStorage.longitude) || 0;
                
                var pontoManual = {
                    horaST: moment().format('HH:mm:ss'),
                    timestampFS: firebase.firestore.FieldValue.serverTimestamp(),
                    timestampST: moment(dataHoraAcerto,'DD/MM/YYYY HH:mm').unix(),
                    dataST: moment().format('DD/MM/YYYY'),
                    dataHoraST: moment().format('DD/MM/YYYY HH:mm:ss'),
                    dataHoraAcerto: dataHoraAcerto,
                    dataHoraDevice: moment().format('DD/MM/YYYY HH:mm:ss'),
                    dateST: moment().format('YYYY-MM-DD'),
                    dateTimeST: moment(dataHoraAcerto,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                    ES: localStorage.ES,
                    origem:'Marcação Manual',
                    provider: null,
                    justificativa: 1,
                    justificativaAcerto: null,
                    justificativaAprovada: 0,
                    justificativaAprovador: 0,
                    justificativaDocumento: 0,
                    justificativaImagem: 0,
                    justificativaAprovadorDataHora:null,
                    justificativaDataHora:moment().format('DD/MM/YYYY HH:mm:ss'),
                    latitude: latitude,
                    longitude: longitude,
                    network: networkInfo,
                    networkLog : networkLog,
                    device: deviceInfo,
                    sitDevice: null,
                    CPF: localStorage.CPF,
                    CNPJ: localStorage.CNPJ,
                    PIS: localStorage.PIS,
                    NumCra: localStorage.NumCra,
                    NumCad: localStorage.NumCad,
                    SitReg: 0,
                    nTry: null,
                    accuracy:null
                };

            
                (function(){
                    
                    localStorage.lastES = 'Saída';
                    
                    FB.ref('users/'+localStorage.uid+'/toCheck/'+localStorage.CNPJ+'/'+localStorage.YYYYMMDD).child('LastES').once('value', function(lastES){
                        
                        var lastES = lastES.val();
                        
                        if(lastES){
                            
                            localStorage.lastES = lastES;
                            
                        } else{
                            
                            localStorage.lastES='Saída';
                        }
                    });
                    
                    return RMPref.set(pontoManual);
                    
                })();
            
                navigator.vibrate([50]);
                
                navigator.notification.alert(
                    dataHoraAcerto+' Ponto registrado com sucesso.',
                    null,
                    'overt | HCM',
                    'Fechar'
                );
            
            } else{

                navigator.vibrate([50]);

                navigator.notification.alert(
                    dataHoraAcerto+' a Marcação Manual só pode ser feita quando o equipamento estiver online.',
                    touchend,
                    'overt | HCM',
                    'Fechar'
                );
            }   
        }
    });

    return true;
});




$('#capturaFoto').on('click', function(){

    navigator.camera.getPicture(onSuccess, null, {

        quality: 50,

        destinationType: Camera.DestinationType.DATA_URL

    });

    
    function onSuccess(imageData) {
    
        var uploader = document.getElementById('uploader');

        var uid = getUid();

        var dia = moment().format("YYYY-MM-DD");

        var storageRef = firebase.storage().ref(localStorage.StorageRefREP+'/'+localStorage.StorageRefDOC+'.jpg');

        file = "data:image/jpeg;base64," + imageData;

        var task = storageRef.putString(file, 'data_url');

        task.on('state_changed',

            function progress(snapshot){
                var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                uploader.style.width = percentage+'%';
            },

            function error(err){
                navigator.notification.alert(
                    'Erro ao enviar a Foto, tente novamente.',
                    null,
                    'overt | HCM',
                    'Fechar'
                )
            },

            function complete(){

                const REPref = FS.collection(localStorage.StorageRefREP).doc(localStorage.StorageRefDOC);

                var justificativa = {
                    justificativaImagem:1,
                    justificativa: 1,
                    justificativaAprovada: 0,
                    justificativaDataHora: moment().format('DD/MM/YYYY HH:mm:ss'),
                    justificativaDataHoraImagem: moment().format('DD/MM/YYYY HH:mm:ss')
                }

                REPref.update(justificativa);

                setTimeout(function(){
                    navigator.notification.alert(
                        'Foto enviada com sucesso!',
                        null,
                        'overt | HCM',
                        'Fechar'
                    )
                }, 500);
            }
        );
    }
});


$('#btnPontoManual').on('click', function(){

    if(localStorage.isOnline!='Y'){
        
        navigator.vibrate([50]);

        navigator.notification.alert(
            'A Marcação Manual só pode ser feita quando o equipamento estiver online.',
            null,
            'overt | HCM',
            'Fechar'
        );

    } else{

        return fnAcertoManualPonto();
    }
});


function fnAcertoManualPonto(timestampST, cnpj, uid){

    $('#dataNovaMarcacao').bootstrapMaterialDatePicker
    ({
        date: false,
        shortTime: false,
        time: true,
        format: 'DD/MM/YYYY HH:mm',
        maxDate : moment(localStorage.YYYYMMDD).format('DD/MM/YYYY')+moment().format('HH:mm:ss'),
        lang: 'pt-BR',
        weekStart: 1,
        cancelText : 'Cancelar',
        okText:'Salvar',
        cancelButton:false,
        switchOnClick : true
    });

    $('#txtJustificativa').addClass('hide');
    $('#dataJustificativa').removeClass('hide');
    $('.docs').addClass('hide');

    $('#motivo').html('Motivo');

    $('#acertoMarcacaoModal').modal();

    var horaMarcacao = moment(localStorage.YYYYMMDD).format("DD/MM/YYYY");

    localStorage.fnAcertoPonto=horaMarcacao;
    
    $('#horaMarcacao').html(horaMarcacao);

    $('#dataNovaMarcacao').val(moment(localStorage.YYYYMMDD).format("DD/MM/YYYY HH:mm"));
}


















function fnAcertoPonto(timestampST, cnpj, uid){

    $('#dataNovaMarcacao').bootstrapMaterialDatePicker
    ({
        date: false,
        shortTime: false,
        time: true,
        format: 'DD/MM/YYYY HH:mm',
        //minDate : moment(timestampST).format('DD/MM/YYYY')+' 00:00',
        maxDate : moment().format('DD/MM/YYYY HH:mm'),
        //disabledDays:[6],
        //currentDate: new Date(),
        lang: 'pt-BR',
        weekStart: 1,
        //triggerEvent:open,
        cancelText : 'Cancelar',
        //nowText : 'Agora',
        //clearText : 'Limpar',
        okText:'Salvar',
        //nowButton : true,
        //clearButton: true,
        cancelButton:false,
        switchOnClick : true
    });


    $('#txtJustificativa').addClass('hide');
    $('#dataJustificativa').addClass('hide');

    $('#motivo').html('Motivo');

    $('#dataJustificativa').addClass('hide');


    $('.docs').removeClass('hide');



    $('#acertoMarcacaoModal').modal();

    var horaMarcacao = moment(timestampST).format("DD/MM/YYYY HH:mm");

    localStorage.fnAcertoPonto=horaMarcacao;
    
    $('#horaMarcacao').html(horaMarcacao);

    const YYYYMMDD = moment(timestampST).format("YYYY-MM-DD");
    const HHmm = moment(timestampST).format("HH-mm");
    const refREP = '/users/REP/'+uid+'/'+cnpj+'/'+YYYYMMDD+'/';
    
    localStorage.StorageRefREP = refREP;

    localStorage.StorageRefDOC = HHmm;
    
    const refRef = FS.collection(refREP).doc(HHmm);

    refRef.get().then(function(doc) {

        var REP = doc.data();

        if(REP.justificativa==1){
            $('#motivo').html(REP.justificativaMotivo);
            $('#txtJustificativa').removeClass('hide');
            //$('#dataJustificativa').removeClass('hide');
        }

        $('#txtJustificativa').val(REP.justificativaAcerto);

        //$('#dataNovaMarcacao').val(moment(REP.dataHoraAcerto,'DD/MM/YYYY HH:mm:ss').format("DD/MM/YYYY HH:mm"));

        if(REP.justificativaImagem==0){

        } else if (justificativaImagem==1){

            $('#iconCapturaFoto').removeClass('ti-camera');

            $('#iconCapturaFoto').addClass('ti-download');

        }
    })
};




function mostraFoto(timestampST, cnpj, uid){
    alert(uid);
}




var bar = new ProgressBar.Circle(divButton, {
    color: '#7AC29A',
    trailColor: '#7A9E9F',
    trailWidth: 2,
    //duration: 3000,
    easing: 'bounce',
    strokeWidth: 9,
    //from: {color: '#EB5E28', a:0},
    from: {color: '#68B3C8', a:0},
    to: {color: '#7AC29A', a:1},
    step: function(state, circle) {
      circle.path.setAttribute('stroke', state.color);
    }
});


function fnES(BTN){

    let pageWidth = window.innerWidth || document.body.clientWidth;
    let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    const limit = Math.tan(45 * 1.5 / 180 * Math.PI);
    const gestureZone = document.getElementById(BTN);

    gestureZone.addEventListener('touchstart', function(event) {
        navigator.vibrate([50]);
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);

    gestureZone.addEventListener('touchmove', function(event) {

        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;
        handleGesture(event);

    }, false);


    gestureZone.addEventListener('touchend', function(event) {
        
        $('#btnOrientation').html('');
        
        return touchend();

    }, false);

    function handleGesture(e) {
        let x = touchendX - touchstartX;
        let y = touchendY - touchstartY;
        let xy = Math.abs(x / y);
        let yx = Math.abs(y / x);
        if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
            if (yx <= limit) {
                if (x < 0) {

                    localStorage.ES='Retorno';
                    
                    if(BTN=='btnPause'){

                        $('#btnOrientation').html('Saída');
                    }
                    if(localStorage.ES=='Retorno'){

                        $('#btnOrientation').html('Saída');
                    }
                    console.log("left");
                } else {

                    if(BTN=='btnPlay'){

                        localStorage.ES='Saída';

                        $('#btnOrientation').html('Entrada');
                    }
                    
                    console.log("right");
                }
            }
            if (xy <= limit) {
                if (y < 0) {
                    console.log("top");
                } else {
                    console.log("bottom");
                }
            }
        } else {
            console.log("tap");
        }

        
    };

    return touchStart();

}

$('#btnPlay').on('click', loadMap);
function loadMap(){
    
    loadGmap();
    
    setTimeout(function(){
        
        app.finishGPS();

        $('#btnOrientation').html('');
    
    }, 4000);

    $('#btnOrientation').html('GPS on');
}



$('#btnPlay').on('touchstart', Play);

function Play(){
        
   return fnES('btnPlay');
}


$('#btnPause').on('click', finishGPS);
function finishGPS(){
    
    app.finishGPS();

    $('#btnOrientation').html('GPS off');

    setTimeout(function(){

        $('#btnOrientation').html('');
    
    }, 4000);
}


$('#btnPause').on('touchstart', Pause);
function Pause(){

    return fnES('btnPause');
}




$('#imgButton').on('touchstart', touchStart);
/////////////////////////////////////////
//
// toutchStart INICIA O MAPS E REGISTRA O PONTO 
//
/////////////////////////////////////////
function touchStart(){

    if(localStorage.ES){
        
        switch(localStorage.ES){
    
            case 'Entrada':
                $('#btnOrientation').html('Pausa');
                break;
            case 'Pausa':
                $('#btnOrientation').html('Retorno');
                break;
            case 'Retorno':
                $('#btnOrientation').html('Saída');
                break;
            case 'Saída':
                $('#btnOrientation').html('Entrada');
                break;
            default:
            
            $('#btnOrientation').html('');
        }
    }

    localStorage.isTouched = 'P';

    if(localStorage.isTouched=='P'){

        navigator.vibrate([50]);

    }
  
    
    $('#btnInfo').html('SAT');
    $('#btnInfo').removeClass('hide btn-warning btn-info');
    $('#btnInfo').addClass('btn-danger');
    $('#btnDistance').removeClass('hide btn-success');
    $('#btnDistance').addClass('btn-danger');
    $('#btnIsTouched').html(localStorage.isTouched);
    $('#btnIsTouched').removeClass('btn-danger');
    $('#btnIsTouched').addClass('btn-info');
    
    bar.animate(0.9, {
        
        duration: 1000,
        
    },function(){
        
        localStorage.nTry=0;

        localStorage.isWrited = 'N';
        
        checkDevice();

        initGPS();//Chama somente o provider GPS;

        //loadGmap();
        
    });
};


$('#imgButton').on('touchend', touchend);
$('#imgButton').on('click', touchend);
//$('#imgButton').on('touchmove', touchend);



function touchend(){

    localStorage.isTouched='P';
    localStorage.canWrite='N';

    app.finishGPS();
    
    $('#btnIsTouched').html(localStorage.isTouched);
    $('#btnIsTouched').addClass('btn-danger');
    $('#btnInfo').addClass('btn-warning btn-fill');
    $('#btnInfo').html('GPS');

    bar.animate(0.0,  {
        
        duration: 1000,
        easing: 'easeInOut',
        
    },function(){
            
        setTimeout(function(){
            
            $('#btnInfo').addClass('hide');
            $('#btnDistance').addClass('hide');
            
        }, 10000);
    })
};


checkDevice = function(){

    cordova.plugins.diagnostic.isLocationAvailable(function(available){

        if(!available){

            localStorage.isTouched ='P';

            navigator.vibrate([100]);

            navigator.notification.alert(
                'Ative a "Localização/GPS" de seu equipamento.',
                touchend,
                'overt | HCM',
                'Fechar'
            )

        } else{

            localStorage.isTouched ='W';

            getDeveloperMode();

        }

    }, function(error){

        navigator.vibrate([100]);

        navigator.notification.alert(
            'Ocorreu um erro ao ativar a "Localização/GPS" de seu equipamento.',
            touchend,
            'overt | HCM',
            'Fechar'
        )
    });

    function getDeveloperMode(){

        window.devicesettings.getDeveloperMode(function(isDeveloperMode){

            if(isDeveloperMode==1){//zero apenas para teste

                localStorage.isTouched ='P';
    
                navigator.vibrate([100]);
    
                navigator.notification.alert(
    
                    'Desative "Opções do Desenvolvedor" de seu equipamento e tente Novamente.',
                    touchend,
                    'overt | HCM',
                    'Fechar'
                )
    
            } else {

                localStorage.isTouched ='W';

                getAutoTimeZoneMode();
                    
            }
            
        },null);

    }

    function getAutoTimeZoneMode(){

        window.devicesettings.getAutoTimeZoneMode(function(isAutoTimeZoneMode){
            
            if(isAutoTimeZoneMode==0){

                localStorage.isTouched ='P';
                
                navigator.vibrate([100]);
                
                navigator.notification.alert(
                    
                    'Ative "Fuso horário automático" de seu equipamento e tente Novamente.',
                    touchend,
                    'overt | HCM',
                    'Fechar'
                )
                
            } else{
                
                localStorage.isTouched ='W';

                getAutoTimeMode();
            }
            
        }, null);
    }
    
    function getAutoTimeMode(){

        window.devicesettings.getAutoTimeMode(function(isAutoTimeMode){
            
            if(isAutoTimeMode==0){

                localStorage.isTouched ='P';
    
                navigator.vibrate([100]);
    
                navigator.notification.alert(
                    'Ative "Data e hora automáticas" de seu equipamento e tente Novamente.',
                    touchend,
                    'overt | HCM',
                    'Fechar'
                )
    
            } else{

                //return app.loadMap();

                localStorage.isTouched ='W';
                //app.registraPonto();

                // while(!isWrited){

                //     app.registraPonto();
                // }
            }
            
        },null);  
    }
};

$(document).ready(function(){

    fnAcertoMarcacao(moment().format('YYYY-MM-DD'));
});



document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


//    setTimeout(function(){
   
//         app.finishGPS();

//     }, 10000);
}

window.onbeforeunload = function (e) {

    app.finishGPS();

};