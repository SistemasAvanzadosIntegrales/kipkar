var ingreso={};

$(document).ready(function(){
});

ingreso.ingresar=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"ingresar",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
			email:     $("#email").val(),
			contrasena:$("#contrasena").val()
		},
        processData:true,
		success:	function(re){
            if(re.error==""){
                almacenamiento.loguear(re.id, re.nombre, re.idSucursal, re.email,re.administrador,re.noBahia, re.sucursal);
                window.location="inicio.html";
            }else{
                _mensaje("Atención",re.error,"Entendido");
                //alert(re.error);
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo ingresar.","Entendido");
            //alert("No hay internet, no se pudo ingresar.");
            callbackError();
		}
	});
}//function