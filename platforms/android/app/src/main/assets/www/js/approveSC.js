String.prototype.trunc = String.prototype.trunc ||
    function(n){
    return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
};



firebase.auth().onAuthStateChanged(function(user) {

    if(user){
        
        localStorage.uid = user.uid;
        localStorage.email = user.email;
        
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



function mostraSolicitoesEmAberto(YYYYMMDD) {

    $('#btnSolicitacaoDeCompra').val(moment(YYYYMMDD).format('DD/MM/YYYY'));

    $("#liApprove").empty();

    const emailRef = localStorage.email.split('.').join("-");

    const refApprove = FB.ref('solpenapr/'+emailRef).child(YYYYMMDD);

    refApprove.on('value', function(solpenapr){

        var solpenapr =  solpenapr.val();

        if(solpenapr)

        $.each(solpenapr, function( k, data ) {

            var REPStatus =
                '<div class="row">'+
                    '<div class="dropdown">'+
                        '<a href="#" id="${CodEmp}${CodFil}${NumSol}${SeqSol}" class="btn btn-lg ${btnClass} btnOvert btn-fill btn-block dropdown-toggle" data-toggle="dropdown">'+
                            '${ShrIte}'+
                        '</a>'+
                        '<div class="dropdown-menu">'+
                            '<div class="content">'+
                                '<div class="row">'+
                                    '<div class="col-lg-12">'+
                                        '<div class="col-md-12"><br><h5><span>${DesIte}</span></h5></div>'+
                                        '<div class="col-md-12"><h6> Solicitação: <span class="text-danger">${NumSol} - ${SeqSol}</span></h6> <h6> Quantidade: <span class="text-danger">${QtdSol}</span></h6> <h6> Valor Unitário: <span class="text-danger">${PreUni}</span></h6><h6>Valor Total Estimado: <span class="text-danger">${VlrApr}</span></h6><hr></div>'+
                                        '<div class="col-md-12"><h6>${NomEmp}</h6><h6>${NomFil}</h6><hr></div>'+
                                        
                                        '<div class="col-md-12"><h6>Centro de Custo:<span class="text-danger"> ${AbrCcu}</span></h6></div>'+
                                        '<div class="col-md-12"><h6>Solicitante:<span class="text-danger"> ${NomSol}</span></h6><hr></div>'+
                                        
                                        '<div id="aprovador${CodEmp}${CodFil}${NumSol}${SeqSol}" class="col-md-12 hide"><h6>Aprovador:<span class="text-danger aprovador${CodEmp}${CodFil}${NumSol}${SeqSol}"> </span></h6><hr></div>'+
                                        
                                        '<div class="text-center">'+
                                            '<div id="btnFechar${CodEmp}${CodFil}${NumSol}${SeqSol}" class="col-md-6">'+
                                                '<button class="btn btn-fill btnLeft">Fechar</button>'+
                                            '</div>'+

                                            '<div id="btnAprovar${CodEmp}${CodFil}${NumSol}${SeqSol}" class="col-md-6">'+
                                                '<button onclick="aprovarSolicitacaoCompra(\'${ChvInt}\',\'${SeqInt}\',\'${CodPrp}\',\'${CodEmp}\',\'${CodFil}\',\'${NumSol}\',\'${SeqSol}\',\'${DatGer}\')" class="btn btn-fill btn-success btnRigth">Aprovar</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';

            $("#liApprove").empty();

            var QtdApr=0;
            
            $.each(data, function(k, value ) {

                $('#TipApv').html(value.TipApv);
                
                $('#TipApv').removeClass('hide');

                value.ShrIte = value.DesIte.trunc(23);
                
                value.QtdSol = parseFloat((value.QtdSol.split('.').join('')).split(',').join('.'));
                value.PreUni = parseFloat((value.PreUni.split('.').join('')).split(',').join('.'));
                value.VlrApr = parseFloat((value.VlrApr.split('.').join('')).split(',').join('.'));
                
                value.QtdSol = numeral(value.QtdSol).format('0.00');
                value.PreUni = numeral(value.PreUni).format('$0,0.00');
                value.VlrApr = numeral(value.VlrApr).format('$0,0.00');
                
                value.btnClass = 'btn-info';
                
                $.tmpl(REPStatus, value).appendTo("#liApprove");

                FB.ref('solapr/CodPrp-'+value.CodPrp+'-'+value.CodEmp+'/CodFil-'+value.CodFil+'/NumSol-'+value.NumSol+'/SeqSol-'+value.SeqSol).on('value', function(solapr){
                
                    var solapr =  solapr.val();

                    if(solapr){

                        var DatAprRef = moment(solapr.DatApr, 'DD/MM/YYYY').format('YYYY-MM-DD');

                        //emailRef

                        //FB.ref('solapr/SitErp/'+DatAprRef+'/'+value.CodEmp+'-'+value.CodFil+'-'+value.NumSol+'-'+value.SeqSol).set(solapr);
    
                        FB.ref('solapr/SitApr/'+YYYYMMDD+'/DatApr').set(YYYYMMDD);

                        $('#aprovador'+solapr.CodEmp+solapr.CodFil+solapr.NumSol+solapr.SeqSol).removeClass('hide');

                        $('.aprovador'+solapr.CodEmp+solapr.CodFil+solapr.NumSol+solapr.SeqSol).html(' '+solapr.UsuEml);

                        $('#'+solapr.CodEmp+solapr.CodFil+solapr.NumSol+solapr.SeqSol).addClass('btn-warning');
                        
                        $('#btnAprovar'+solapr.CodEmp+solapr.CodFil+solapr.NumSol+solapr.SeqSol).empty();
                        
                    } else{
                        
                        QtdApr++;
                                
                        FB.ref('solapr/SitApr/'+YYYYMMDD+'/QtdApr').set(QtdApr);
                    
                    };
                }); 
            });
        });
    });
};

mostraSolicitoesEmAberto(moment().format('YYYY-MM-DD'));

$('#btnSolicitacaoDeCompra').on('change', function(){

    var YYYYMMDD = moment($('#btnSolicitacaoDeCompra').val(),'DD/MM/YYYY').format('YYYY-MM-DD');

    mostraSolicitoesEmAberto(YYYYMMDD);
    
});


function alertNavigator(){
    //
};


function aprovarSolicitacaoCompra(ChvInt, SeqInt, CodPrp, CodEmp, CodFil, NumSol, SeqSol, DatGer){

    //window.devicesettings.getAutoTimeMode(function(isAutoTimeMode){
        
        //if(isAutoTimeMode==0){
        if(0!=0){

            navigator.vibrate([100]);

            navigator.notification.alert(
                
                'Ative "Data e hora automáticas" de seu equipamento e tente Novamente.',
                alertNavigator,
                'overt | HCM',
                'Fechar'
            );
            
        } else{

            //navigator.vibrate([50]);
                        
            const refSolApr = FB.ref('solapr/CodPrp-'+CodPrp+'-'+CodEmp+'/CodFil-'+CodFil+'/NumSol-'+NumSol+'/SeqSol-'+SeqSol);
            
            var DatApr = moment().format('DD/MM/YYYY');

            if(moment().format('HH.mm')=='00.00'){
                
                var HorApr='1';

            } else{

                var HorApr = ((parseFloat(moment().format('HH.mm'))) * 60).toString();
            }

            var solapr = {

                ChvInt : ChvInt,
                SeqInt : SeqInt,
                CodPrp : CodPrp,
                CodEmp : CodEmp,
                CodFil : CodFil,
                NumSol : NumSol,
                SeqSol : SeqSol,
                UsuEml : localStorage.email,
                DatApr : DatApr,
                DatGer : DatGer,
                DatHor : moment().format('DD/MM/YYYY HH:mm:ss'),
                HorApr : HorApr

            }

            var DatAprRef = moment().format('YYYY-MM-DD');

            refSolApr.set(solapr).then(SiErp => {

                FB.ref('solapr/SitErp/'+DatAprRef+'/'+CodPrp+'-'+CodEmp+'-'+CodFil+'-'+NumSol+'-'+SeqSol+'-'+ChvInt).set(solapr);

            });
        }

    //}, null);
};




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