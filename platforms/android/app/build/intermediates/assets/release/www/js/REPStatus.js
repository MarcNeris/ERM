firebase.auth().onAuthStateChanged(user => {

    if (user) {

        var now = new Date

        var dia = moment(now).format("YYYY-MM-DD");
        
        var pis = '01240025602';
        var cnpj = '10804639000183';

        const dbRefObject = firebase.database().ref(user.uid+'/'+cnpj+'/'+pis+'/').child(dia);

        dbRefObject.on('value', function(data) {
            
            data = data.val();

            console.log(data);
    
            var REPStatus = '<tr><td>${diaHora}</td><td>CAPTURADO</td></tr>';
    
            $("#ponto").empty();
    
            $.each( data, function(k, v){
                
                console.log(v);
    
                $.tmpl( REPStatus, v ).appendTo( "#ponto" );
    
            });
    
        }); 

    } else {

    }
});