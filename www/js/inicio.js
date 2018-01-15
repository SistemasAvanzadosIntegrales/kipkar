var inicio={};
var agreAuto="";
var recargaPagina = true;
var noBorrarFehaEntrega=false;

inicio.pagiActu=0;
inicio.pagiTota=0;

$(document).ready(function(){
    document.addEventListener("deviceready",function(){
        informacionUsuario = almacenamiento.dameUsuario();
        $("#asesor").val(informacionUsuario.nombre);
        $("#sucursal").val(informacionUsuario.sucursal);
        $("#idUsuario").val(informacionUsuario.id);
        $("#noBahia").html('').append('<option value="">- Seleccione la Bahía -</option>');
        for(var x =1; x<=informacionUsuario.noBahia; x++){
            $("#noBahia").append('<option value="'+x+'">'+x+'</option>');
        }
        
        if(almacenamiento.dameEstatusModoConsulta()==null){
            almacenamiento.salirModoConsulta();
        }else{
            if(almacenamiento.dameEstatusModoConsulta().status!='1' && almacenamiento.dameAutomovil()!=null && almacenamiento.damePropietario()!=null){
                var autom=almacenamiento.dameAutomovil();
                inicio.seleAuto=autom["id"];
                inicio.obtenerAuto();
                var fech=almacenamiento.dameFechaPromesa()["fecha_promesa"];
                if(fech!=null){
                    fech=fech.split(" ");
                    $("#entrega").val(fech[0]);
                    $("#entregaTiempo").val(fech[1]);
                }//if
                var bahi=almacenamiento.dameBahia()["bahia"];
                if(bahi!=null)
                    $("#noBahia").val(bahi);
                //$("#idPropietario").val(propi["id"]);
                //inicio.obtenerPropietario();
                //alert("333");
            }//if
        }//if
        
        //seteamos los valores del usuario en el apartado de informacion.
        //$("#noBahia").val(informacionUsuario.noBahia);
        /*
        $(".date").datetimepicker({
            format: "yyyy-mm-dd hh:ii",
            autoclose: true,
            todayBtn: true,
            minuteStep: 15,
            todayHighlight:true,
            language:'es'
        });
        */
        
        inicio.dameEstados();
        inicio.damePersonasTipo();
        inicio.dameTiposTelefono();
        
        noBorrarFechaEntrega=true;
        inicio.dameAutos();
        inicio.dameOrdenes();
        inicio.estaEditandoAuto=false;
        $("#btnAgregarAutomovil").bind("click",function(){
            $("#entrega").val("");
            $("#entregaTiempo").val("");
            $("#noBahia").val("");
            inicio.estaEditandoAuto=false;
            if(almacenamiento.dameEstatusModoConsulta().status==1){
                modoConsultaActivado();
                return null;
            }
            agreAuto=localStorage.getItem("automovil");
            almacenamiento.tomaAutomovil('','','','','','','','','','','','','');
            agregarAutomovil();
        });
        $("#btnEditarAutomovil").bind("click", function(){
            inicio.estaEditandoAuto=true;
            if(almacenamiento.dameEstatusModoConsulta().status==1){
                modoConsultaActivado();
                return null;
            }
            agreAuto=localStorage.getItem("automovil");
            agregarAutomovil();
        });
        $("#btnAgregarPropietario").bind("click",function(){
            $("#entrega").val("");
            $("#entregaTiempo").val("");
            $("#noBahia").val("");
            if(almacenamiento.dameEstatusModoConsulta().status==1){
                modoConsultaActivado();
                return null;
            }
            agrePro=localStorage.getItem("propietario");
            almacenamiento.tomaPropietario('','','','','','','','','','','','','','','','','','','','','','','','');
            agregarPropietario();
        });
        $("#btnEditarPropietario").bind("click", function(){
            if(almacenamiento.dameEstatusModoConsulta().status==1){
                modoConsultaActivado();
                return null;
            }
            agrePro=localStorage.getItem("propietario");
            agregarPropietario();
        });
        $("#idEstado").bind("change", function(){
            $("#idMunicipio").html('').append('<option value="">- Seleccione un Municipio</option>');
            prop = almacenamiento.damePropietario();
            //mandamos el id del municipio
            inicio.dameMunicipios();
        });
        $("#idMunicipio").bind("change", function(){
            $("#idCiudad").html('').append('<option value="">- Seleccione una Ciudad</option>');
            prop = almacenamiento.damePropietario();
            //mandamos el id del municipio
            inicio.dameCiudades();
        });
        
        
        almacenamiento.tomaAutomovil('','','','','','','','','','','','','');
        //agregarAutomovil();
        
        if(almacenamiento.dameEstatusModoConsulta().status=='1'){
            $("#ModoActivo").html('Consulta');
        //    $('.date').datetimepicker('hide');
        //    $('.date').datetimepicker('remove');
            $(".calendario").removeClass('date');
            //alert(almacenamiento.dameIdOrden()["idEstatus"]);
            if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                $("#noBahia").removeAttr('disabled');
            else
                $("#noBahia").attr('disabled',"disabled");
            var fech=almacenamiento.dameFechaPromesa()["fecha_promesa"];
            if(fech!=null){
                fech=fech.split(" ");
                $("#entrega").val(fech[0]);
                $("#entregaTiempo").val(fech[1]);
            }//if
        }else{
            $("#ModoActivo").html('Captura');
            $(".calendario").addClass('date');
            $("#noBahia").removeAttr('disabled');
            $("#ingreso").val(hoy()).trigger("change");   
        }
        
    },false);
});
inicio.dameEstados=function(estado,municipio,ciudad){
    //alert("dameEstados:"+estado+" "+municipio+" "+ciudad);
    //myApp.showPreloader('Cargando estados... Espere un momento por favor.');
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-estados",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $("#idEstado").html('');
                $("#idEstado2").html('').append('<option value="">- Seleccione un Estado</option>');
                $.each(re, function(i, item) {
                    if(estado!=null && estado!='' && estado == item.idEstado){
                        $("#idEstado").append('<option value="'+item.idEstado+'" selected>'+item.estado+'</option>');
                    }else{
                        $("#idEstado").append('<option value="'+item.idEstado+'">'+item.estado+'</option>');
                    }
                    
                });
                if(municipio!=undefined && municipio!=''){
                    inicio.dameMunicipios(estado,municipio,ciudad);
                }
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            _mensaje("Atención","No hay internet, no se pudo consultar los Estados.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameMunicipios=function(estado,municipio,ciudad){
    //alert("dameMunicipio:"+estado+" "+municipio+" "+ciudad);
    //myApp.showPreloader('Cargando municipios... Espere un momento por favor.');
    var idEstado ='';
    
    if(estado!='' && estado!=null){
        idEstado = estado;
    }else{
        idEstado = $("#idEstado").val();
    }
    
    if(idEstado=='' || idEstado==null){
        $("#idMunicipio").html('').append('<option value="">- Seleccione un Municipio</option>');
        return null;
    }
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-municipios",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            idEstado: idEstado
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    if(municipio!='' && municipio == item.idMunicipio){
                         $("#idMunicipio").append('<option value="'+item.idMunicipio+'" selected>'+item.municipio+'</option>');
                    }else{
                         $("#idMunicipio").append('<option value="'+item.idMunicipio+'">'+item.municipio+'</option>');
                    }
                });
                if(ciudad!='' && ciudad!=null){
                    inicio.dameCiudades(estado,municipio,ciudad);
                }
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            _mensaje("Atención","No hay internet, no se pudo consultar los Municipios.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameCiudades=function(estado,municipio,ciudad){
    //alert("dameCiudades:"+estado+" "+municipio+" "+ciudad);
    //myApp.showPreloader('Cargando ciudades... Espere un momento por favor.');
    var idMunicipio = '';
    
    if(municipio!=null && municipio !=''){
        idMunicipio = municipio
    }else{
        idMunicipio = $("#idMunicipio").val();
    }

    if(idMunicipio==''||idMunicipio==null){
       $("#idCiudad").html('').append('<option value="">- Seleccione una Ciudad</option>');
        return null;
    }
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-ciudades",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            idMunicipio: idMunicipio
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    if(ciudad!='' && ciudad == item.idCiudad){
                         $("#idCiudad").append('<option value="'+item.idCiudad+'" selected="selected">'+item.ciudad+'</option>');
                    }else{
                         $("#idCiudad").append('<option value="'+item.idCiudad+'">'+item.ciudad+'</option>');
                    }
                });  
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            _mensaje("Atención","No hay internet, no se pudo consultar las Ciudades.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.setearEstadoMunicipioCiudad=function(Estado,Municipio,Ciudad){
    inicio.dameEstados(Estado,Municipio,Ciudad);
}
inicio.dameEstados2=function(estado,municipio,ciudad){
    //alert("dameEstados2");
    //myApp.showPreloader('Cargando estados... Espere un momento por favor.');
    $("#idEstado2").html('<option value="">Cargando estados...</option>');
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-estados",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $("#idEstado2").html('');
                $("#idEstado2").html('').append('<option value="">- Seleccione un Estado</option>');
                $.each(re, function(i, item) {
                    if(estado!=null && estado!='' && estado == item.idEstado){
                        $("#idEstado2").append('<option value="'+item.idEstado+'" selected>'+item.estado+'</option>');
                    }else{
                        $("#idEstado2").append('<option value="'+item.idEstado+'">'+item.estado+'</option>');
                    }
                    
                });
                if(municipio!=undefined && municipio!=''){
                    inicio.dameMunicipios2(estado,municipio,ciudad);
                }
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            _mensaje("Atención","No hay internet, no se pudo consultar los Estados.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameMunicipios2=function(estado,municipio,ciudad){
    //alert("dameMunicipios2");
    //myApp.showPreloader('Cargando municipios... Espere un momento por favor.');
    $("#idMunicipio2").html('<option value="">Cargando municipios...</option>');
    var idEstado ='';
    
    if(estado!='' && estado!=null){
        idEstado = estado;
    }else{
        idEstado = $("#idEstado2").val();
    }
    
    if(idEstado=='' || idEstado==null){
        $("#idMunicipio2").html('').append('<option value="">- Seleccione un Municipio</option>');
        return null;
    }
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-municipios",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            idEstado: idEstado
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $("#idMunicipio2").html('');
                $("#idMunicipio2").html('').append('<option value="">- Seleccione un Municipio</option>');
                $.each(re, function(i, item) {
                    if(municipio!='' && municipio == item.idMunicipio){
                         $("#idMunicipio2").append('<option value="'+item.idMunicipio+'" selected>'+item.municipio+'</option>');
                    }else{
                         $("#idMunicipio2").append('<option value="'+item.idMunicipio+'">'+item.municipio+'</option>');
                    }
                });
                if(ciudad!='' && ciudad!=null){
                    inicio.dameCiudades2(estado,municipio,ciudad);
                }//if
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            _mensaje("Atención","No hay internet, no se pudo consultar los Municipios.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameCiudades2=function(estado,municipio,ciudad){
    //alert("dame2");
    //myApp.showPreloader('Cargando ciudades... Espere un momento por favor.');
    $("#idCiudad2").html('<option value="">Cargando ciudades...</option>');
    var idMunicipio = '';
    
    if(municipio!=null && municipio !=''){
        idMunicipio = municipio
    }else{
        idMunicipio = $("#idMunicipio2").val();
    }

    if(idMunicipio==''||idMunicipio==null){
       $("#idCiudad2").html('').append('<option value="">- Seleccione una Ciudad</option>');
        return null;
    }
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-ciudades",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            idMunicipio: idMunicipio
		},
        processData:true,
		success:	function(re){
            //myApp.hidePreloader();
            if(re.length==0 || re[0].error==""){
                $("#idCiudad2").html('');
                $("#idCiudad2").html('').append('<option value="">- Seleccione una Ciudad</option>');
                $.each(re, function(i, item) {
                    if(ciudad!='' && ciudad == item.idCiudad){
                         $("#idCiudad2").append('<option value="'+item.idCiudad+'" selected="selected">'+item.ciudad+'</option>');
                    }else{
                         $("#idCiudad2").append('<option value="'+item.idCiudad+'">'+item.ciudad+'</option>');
                    }
                });  
            }else{
                //alert(re[0].error);
                _mensaje("Atención",re[0].error,"Entendido");
            }//if
		},
		error: function(re){
            //myApp.hidePreloader();
            //alert("No hay internet, no se pudo consultar autos.");
            _mensaje("Atención","No hay internet, no se pudo consultar las Ciudades.","Entendido");
            callbackError();
		}
	});
}
inicio.setearEstadoMunicipioCiudad2=function(Estado,Municipio,Ciudad){
    inicio.dameEstados2(Estado,Municipio,Ciudad);
}
inicio.damePersonasTipo=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-personas-tipo",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    $("#idPersonaTipo").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                });
                
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            
            _mensaje("Atención","No hay internet, no se pudo obtener los tipos de personas.","Entendido");
            //alert();
            callbackError();
		}
	});
}
inicio.damePersonasTipo2=function(idPersonaTipo){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-personas-tipo",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    if(idPersonaTipo!=undefined && idPersonaTipo!='' && idPersonaTipo==item.idTipo){
                        $("#idPersonaTipo2").append('<option value="'+item.idTipo+'" selected="selected">'+item.tipo+'</option>');
                    }else{
                        $("#idPersonaTipo2").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                    }
                    
                });
                
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo obtener los tipos de personas.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameTiposTelefono=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-tipos-telefono",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    $("#idTelefonoTipo1").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                    $("#idTelefonoTipo2").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                });
                
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            
            _mensaje("Atención","No hay internet, no se pudo obtener los tipos de teléfonos.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
inicio.dameTiposTelefono2=function(idTelefonoTipo1,idTelefonoTipo2){
    console.log("dameTiposTelefono2: ");
    console.log(idTelefonoTipo1);
    console.log(idTelefonoTipo2);
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-tipos-telefono",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            if(re.length==0 || re[0].error==""){
                $.each(re, function(i, item) {
                    if(idTelefonoTipo1!=undefined && idTelefonoTipo1!='' && idTelefonoTipo1==item.idTipo){
                        $("#idTelefonoTipo2_1").append('<option value="'+item.idTipo+'" selected="selected">'+item.tipo+'</option>');
                    }else{
                        $("#idTelefonoTipo2_1").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                    }
                    if(idTelefonoTipo2!=undefined && idTelefonoTipo2!='' && idTelefonoTipo2==item.idTipo){
                        $("#idTelefonoTipo2_2").append('<option value="'+item.idTipo+'" selected="selected">'+item.tipo+'</option>');
                    }else{
                        $("#idTelefonoTipo2_2").append('<option value="'+item.idTipo+'">'+item.tipo+'</option>');
                    }
                    
                    
                });
                
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo obtener los tipo de teléfonos.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}
function LimpiarFiltros(){
        $("#txtPlacas").val('');
        $("#txtFolio").val('');
        $("#txtNoSerie").val('');
        $("#txtCliente").val('');
        $("#txtTelefono").val('');
        inicio.dameAutos();
}
inicio.cargAuto=false;

inicio.siguPagi=function(){
    if(inicio.pagiActu < inicio.pagiTota-1){
        inicio.pagiActu++;
        inicio.dameAutos();
    }//if
}//function

inicio.antePagi=function(){
    if(inicio.pagiActu > 0){
        inicio.pagiActu--;
        inicio.dameAutos();
    }//if
}//function

inicio.dameAutos=function(modoConsulta){
    if(modoConsulta!=undefined && modoConsulta=='1'){
        almacenamiento.modoConsulta();
         $("#gridOrde").html('').append('<tr><td>Seleccione un Automovil para cargar las ordenes de servicio...</td></tr>');
    }
    //if(inicio.cargAuto){
        //console.log("retrna null");
    //    return null;
    //}
    $("#gridAuto").html("<tr><td>Cargando...</td></tr>");
    $("#ingreso").val("");
    //$("#entrega").val("");
    inicio.cargAuto=true;
    //alert($("#txtTelefono").val());
    var clav=clave();
    $.ajax({
		url:      dominio+"busca-auto-propietario-con-paginacion",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            placas:    $("#txtPlacas").val(),
			folio:     $("#txtFolio").val(),
			NoSerie:   $("#txtNoSerie").val(),
			nombre:    $("#txtCliente").val(),
			telefono:  $("#txtTelefono").val(),
            email:     $("#txtEmail").val(),
            idSucursal: informacionUsuario.idSucursal,
            pagiActu:  inicio.pagiActu,
            pagiTota:  inicio.pagiTota
		},
        processData:true,
		success:	function(re){
            //Console.log(re);
            var temp=re[0];
            inicio.pagiActu=temp["pagiActu"];
            inicio.pagiTota=temp["pagiTota"];
            //alert(inicio.pagiActu+","+inicio.pagiTota);
            $("#lblPagina").html("Página: "+(parseInt(inicio.pagiActu)+1)+" de "+parseInt(inicio.pagiTota));
            re=re[1];
            inicio.cargAuto=false;
            if(re.length==0 || re[0].error==""){
                var co="";
                for(var i=0; i<=re.length-1; i++){
                    if(re[i]["folio"]==inicio.seleAutoIdOrden)
                        $("#ingreso").val(hoy());
                    co+="<tr class='rengAuto' "+(re[i]["folio"]==inicio.seleAutoIdOrden?"style='background:#FF0000;'":"")+" id='rengAuto"+re[i]["folio"]+"' onClick=\"inicio.seleccionoAuto('"+re[i]["idAutomovil"]+"','"+re[i]["folio"]+"','"+re[i]["ingreso"]+"','"+re[i]["entrega"]+"','"+re[i]["noBahia"]+"','"+re[i]["idOrden"]+"','"+re[i]["idEstatus"]+"');\">";
                    co+=" <td class='col-x s-1' width='10%'>"+quitaNull(re[i]["folio"])+"</td>";
                    co+=" <td class='col-x s-1 text-12' width='8%'>"+quitaNull(re[i]["fecha"])+"</td>";
                    co+=" <td class='col-x s-1' width='8%'>"+quitaNull(re[i]["placas"])+"</td>";
                    co+=" <td class='col-x s-1' width='10%'>"+quitaNull(re[i]["marca"])+"</td>";
                    co+=" <td class='col-x s-1' width='10%'>"+quitaNull(re[i]["modelo"])+"</td>";
                    co+=" <td class='col-x s-1' width='7%'>"+quitaNull(re[i]["ano"])+"</td>";
                    co+=" <td class='col-x s-1' width='13%'>"+quitaNull(re[i]["nserie"])+"</td>";
                    co+=" <td class='col-x s-1' width='8%'>"+quitaNull(re[i]["estatus"])+"</td>";
                    co+=" <td class='col-x s-2' width='13%'>"+quitaNull(re[i]["cliente"])+"</td>";
                    co+=" <td class='col-x s-2' width='13%'>"+quitaNull(re[i]["usuario"])+"</td>";
                    co+="</tr>";
                }//for
                
                if(co=="" && !($("#txtPlacas").val()=="" && $("#txtFolio").val()=="" && $("#txtNoSerie").val()=="" && $("#txtCliente").val()=="" && $("#txtTelefono").val()=="" &&$("#txtEmail").val()=="")){
                    inicio.dameAutosPropietarios();
                }//if
                
                co=co==""?"<tr><td>No hay automóviles con el filtro seleccionado...</td></tr>":co;
                $("#gridAuto").html(co);
                
                
                if(recargaPagina){
                    //recordar seleccion
                    // console.log(almacenamiento.dameFolioActivo());
                    //if(almacenamiento.dameFolioActivo()!=undefined && almacenamiento.dameFolioActivo()!=null && almacenamiento.dameFolioActivo().id=='1'){
                      //  console.log("Recordar seleccion");
                        folio = almacenamiento.dameFolioActivo();
                        if(folio!=undefined && folio!=null && almacenamiento.dameEstatusModoConsulta()!=null && almacenamiento.dameEstatusModoConsulta().status=='1'){
                            inicio.revisarSeleccion=false;
                            $("#rengAuto"+folio.id).trigger("click");
                        }
                        
                   // }
                    recargaPagina=false;
                }
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
            ////$($(".rengAuto")[0]).trigger("click");
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudieron consultar los autos.","Entendido");
            //alert("No hay internet, no se pudo consultar autos.");
            callbackError();
		}
	});
}//function

inicio.dameAutosPropietarios=function(){
    $.ajax({
		url:      dominio+"dame-autos-propietarios",
		type:     'POST',
		data:	{
            clave:     clav,
            codigo:    sha1(clav+palaSecr),
            placas:    $("#txtPlacas").val(),
			NoSerie:   $("#txtNoSerie").val(),
			nombre:    $("#txtCliente").val(),
			telefono:  $("#txtTelefono").val(),
            email:     $("#txtEmail").val(),
            idSucursal: informacionUsuario.idSucursal
		},
        processData:true,
		success:	function(re){
            myApp.modal({
                title: "Seleccionar Auto y/o propietario",
                text:  re,
                buttons: [
                  {
                    text: "Aceptar",
                    onClick: function(){
                        if(idAutoRadi!=""){
                            inicio.seleAuto=idAutoRadi;
                            inicio.obtenerAuto();
                            $("#ingreso").val(hoy());
                        }else if(idPropRadi!=""){
                            inicio.seleAuto="";
                            almacenamiento.tomaAutomovil('','','','','','','','','','','','','');
                            proyectaAutomovil();
                            $("#idPropietario").val(idPropRadi);
                            inicio.obtenerPropietario();
                            $("#ingreso").val(hoy());
                        }//if
                    }//function
                  },
                  {
                    text: "Cancelar",
                    onClick: function(){
                        idAutoRadi="";
                        idPropRadi="";
                    }//function
                  }
                ]
            });
            setTimeout("$('.modal').css('width','1000px'); paraSeleRadioAuto();",100);
        }
    });
}//function

var idAutoRadi="";
var idPropRadi="";
function paraSeleRadioAuto(){
    $(".autoProp").bind("click", function(){
        idPropRadi=this.value.split(",");
        idAutoRadi=idPropRadi[0];
        idPropRadi=idPropRadi[1];
    });
}//function

inicio.cargOrde=false;
inicio.dameOrdenes=function(){
    if(inicio.cargOrde)
        return null;
    $("#gridOrde").html("<tr><td>Cargando...</td></tr>");
    inicio.cargAuto=true;
    //alert($("#txtTelefono").val());
    var clav=clave();
    $.ajax({
		url:      dominio+"ordenes-servicio",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:       clav,
            codigo:      sha1(clav+palaSecr),
            idAutomovil: inicio.seleAuto
		},
        processData:true,
		success:	function(re){
            inicio.cargOrde=false;
            if(re.length==0 || re[0].error==""){
                var co="";
                for(var i=0; i<=re.length-1; i++){
                    var serv=quitaNull(re[i]["servicio"]).split("|,");
                    var oper=quitaNull(re[i]["operacion"]).split("|,");
                    var refa=quitaNull(re[i]["refaccion"]).split("|,");
                    var strServ="";
                    for(var j=0; j<=serv.length-1; j++){
                        if(j==0 || j>0 && serv[j]!=serv[j-1])
                            strServ+=serv[j].substr(0,27)+"<br>";
                        /*else
                            strServ+="<br>";*/
                    }//for
                    var strOper="";
                    for(var j=0; j<=oper.length-1; j++){
                        if(j==0 || j>0 && oper[j]!=oper[j-1])
                            strOper+=oper[j].substr(0,27)+"<br>";//<div style='width:200px; white-space:nowrap; overflow:hidden;'>
                        else
                            strOper+="<br>";
                    }//for
                    var strRefa="";
                    for(var j=0; j<=refa.length-1; j++){
                        strRefa+=refa[j].substr(0,27)+"<br>";
                    }//for
                    co+="<tr class='rengOrde' "+(re[i]["id"]==inicio.seleOrde?"style='background:#FF0000;'":"")+" id='rengOrde"+re[i]["id"]+"' rel='"+re[i]["id"]+"'>";
                    co+=" <td class='col-xs-2' onClick=\"inicio.seleccionoOrde('"+re[i]["id"]+"');\">"+quitaNull(re[i]["fecha"])+"</td>";
                    co+=" <td class='col-xs-1' onClick=\"inicio.seleccionoOrde('"+re[i]["id"]+"');\">"+quitaNull(re[i]["kilometraje"])+"</td>";
                    co+=" <td class='col-xs-1' onClick=\"inicio.seleccionoOrde('"+re[i]["id"]+"');\">"+quitaNull(re[i]["precio"])+"</td>";
                    co+=" <td class='col-xs-3' onClick=\"inicio.seleccionoOrde('"+re[i]["id"]+"');\">"+strServ+"</td>";
                    //condicional para al cargar el grid la primera fila venga expandida
                    //if(i==parseInt(re.length-1)){
                    if(i==0){
                          co+=" <td class='col-xs-3' onClick=\"inicio.toggleDetalle('"+re[i]["id"]+"','1');\"><span class='mas_detalle'>"+strOper+"</span><span class='ver_detalle hidden rojo'>Ver detalle</span></td>";
                          co+=" <td class='col-xs-3' onClick=\"inicio.toggleDetalle('"+re[i]["id"]+"','1');\"><span class='mas_detalle'>"+strRefa+"</span><span class='ver_detalle hidden rojo'>Ver detalle</span></td>";
                    }else{
                          co+=" <td class='col-xs-3' onClick=\"inicio.toggleDetalle('"+re[i]["id"]+"','0');\"><span class='mas_detalle hidden'>"+strOper+"</span><span class='ver_detalle rojo'>Ver detalle</span></td>";
                          co+=" <td class='col-xs-2' onClick=\"inicio.toggleDetalle('"+re[i]["id"]+"','0');\"><span class='mas_detalle hidden'>"+strRefa+"</span><span class='ver_detalle rojo'>Ver detalle</span></td>";
                    }
                  
                    
                    co+="</tr>";
                }//for
                co=co==""?"<tr><td>No hay ordenes de servicio con el filtro seleccionado...</td></tr>":co;
                $("#gridOrde").html(co);
                
                inicio.toggleDetalle(inicio.seleAutoIdOrdenReal,'0');
            }else{
                _mensaje("Atención",re[0].error,"Entendido");
                //alert(re[0].error);
            }//if
		},
		error: function(re){
            
            _mensaje("Atención","No hay internet, no se pudo consultar las ordenes.","Entendido");
            //alert("No hay internet, no se pudo consultar las ordenes.");
            callbackError();
		}
	});
}//function
inicio.toggleDetalle=function(idOrden,status){
    //alert(idOrden+","+status);
    $(".mas_detalle").addClass("hidden");
    $(".ver_detalle").removeClass("hidden");
     $("#gridOrde tr").each(function(){
         var orden = $(this).attr("rel").valueOf();
            $(this).find("td:eq(4)").attr("onclick","inicio.toggleDetalle('"+orden+"','0')");
            $(this).find("td:eq(5)").attr("onclick","inicio.toggleDetalle('"+orden+"','0')");
     });
            if(status==0){//expandimos la fila
                 $("#rengOrde"+idOrden+" .mas_detalle").removeClass("hidden");
                 $("#rengOrde"+idOrden+" .ver_detalle").addClass("hidden");
                 $("#rengOrde"+idOrden+" td:eq(4)").attr("onclick","inicio.toggleDetalle('"+idOrden+"','1')");
                 $("#rengOrde"+idOrden+" td:eq(5)").attr("onclick","inicio.toggleDetalle('"+idOrden+"','1')");
            }else{//contraemos la fila
                 $("#rengOrde"+idOrden+" .ver_detalle").removeClass("hidden");
                 $("#rengOrde"+idOrden+" .mas_detalle").addClass("hidden");
                 $("#rengOrde"+idOrden+" td:eq(4)").attr("onclick","inicio.toggleDetalle('"+idOrden+"','0')");
                 $("#rengOrde"+idOrden+" td:eq(5)").attr("onclick","inicio.toggleDetalle('"+idOrden+"','0')");
            }
   
    
}
inicio.obtenerAuto=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-automovil",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:       clav,
            codigo:      sha1(clav+palaSecr),
            idAutomovil: inicio.seleAuto
		},
        processData:true,
		success:	function(re){
            if(re.error==""){
                //al seleccionar el auto, seteamos el id del propietario
                // en el campo ocult para poder obtener la informacion del servicio
                $("#idPropietario").val(re["idPropietario"]);
                // guardamos la informacion en el local storage
                almacenamiento.tomaAutomovil(re["id"], re["idPropietario"], re["placas"], re["noSerie"], re["idAnoRiqs"], re["ano"], re["idMarcaRiqs"], re["marca"], re["kilometraje"], re["idModeloRiqs"], re["modelo"], re["idMotorRiqs"], re["motor"]);
                proyectaAutomovil();
                inicio.obtenerPropietario();
                
            }else{
                _mensaje("Atención",re.error,"Entendido");
                //alert(re.error);
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo obtener información del vehículo.","Entendido");
            //alert("No hay internet, no se pudo obtener información del vehículo.");
            callbackError();
		}
	});
}//function

function proyectaAutomovil(){
    var auto=almacenamiento.dameAutomovil();
    //alert(JSON.stringify(auto));
    $(".idAutomovil").val(auto["id"]);
    $(".idPropietario").val(auto["idPropietario"]);
    $(".placas").val(auto["placas"]);
    $(".noSerie").val(auto["noSerie"]);
    $(".ano").val(auto["ano"]);
    $(".idAnoRiqs").html("<option value='"+auto["idAnoRiqs"]+"'>"+auto["ano"]+"</option>");
    $(".marca").val(auto["marca"]);
    $(".idMarcaRiqs").html("<option value='"+auto["idMarcaRiqs"]+"'>"+auto["marca"]+"</option>");
    $(".kilometraje").val(auto["kilometraje"]);
    $(".modelo").val(auto["modelo"]);
    $(".idModeloRiqs").html("<option value='"+auto["idModeloRiqs"]+"'>"+auto["modelo"]+"</option>");
    $(".motor").val(auto["motor"]);
    $(".idMotorRiqs").html("<option value='"+auto["idMotorRiqs"]+"'>"+auto["motor"]+"</option>");
}//function


var formAuto='<div class="col-xs-12 sinPaddingLateral">'+
            '<div class="col-xs-12 errorAutomovil alert alert-danger hidden">'+
            '</div>'+
            '<div class="col-xs-3">'+
            '    <input type="hidden" class="idAutomovil" id="idAutomovil" value="">'+
            '    <input type="text" class="w100 form-control placas" maxlength="14" id="placas" placeholder="Placas">'+
            '</div>'+
            '<div class="col-xs-4">'+
            '    <input type="text" class="w100 form-control noSerie" maxlength="20" placeholder="No. serie" id="noSerie">'+
            '</div>'+
        '</div>'+
        '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
        '    <div class="col-xs-4 ">'+
        '        <select type="text" class="form-control idAnoRiqs"  placeholder="Año" id="ano" onChange="inicio.obtenerMarcas();"><option value="">- Año -</option><option value="2016">2016</option></select>'+
        '    </div>'+
        '    <div class="col-xs-4 ">'+
        '        <select class="form-control idMarcaRiqs" placeholder="Marca" id="marca" onChange="inicio.obtenerModelos();"><option value="">- Marca -</option><option value="21">Honda</option></select>'+
        '    </div>'+
        '    <div class="col-xs-4 ">'+
        '       <input type="text" class="form-control kilometraje" placeholder="Kilometraje" id="kilometraje" onkeypress="return permiteNumerosSinDecimal(event, this)">'+
        '    </div>'+
        '</div>'+
        '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
        '    <div class="col-xs-6 ">'+
        '        <select class="form-control idModeloRiqs"  placeholder="Modelo" id="modelo" onChange="inicio.obtenerMotores();"><option value="">- Modelo -</option><option value="23">Vagoneta</option></select>'+
        '    </div>'+
        '    <div class="col-xs-6 ">'+
        '        <select class="form-control idMotorRiqs" placeholder="Motor" id="motor"><option value="">- Motor -</option><option value="2">Mtrf-2334</option></select>'+
        '    </div>'+
        '</div>';
function agregarAutomovil(){
    var cont="<table><tr><td>"+formAuto+"</td></tr></table>";
    myApp.modal({
        title: "Agregar automovil",
        text:  cont,
        buttons: [
          {
            text: "Guardar",
            onClick: function(){
                guardarAutomovil();
            }//function
          },
          {
            text: "Cancelar",
            onClick: function(){
                if(agreAuto!=""){
                    localStorage.setItem("automovil",agreAuto);
                    proyectaAutomovil();
                }//if
            }//function
          }
        ]
    })
    setTimeout("proyectaAutomovil(); bloqueaCamposAlEditar(); inicio.obtenerAnos(); inicio.obtenerMarcas(); inicio.obtenerModelos(); inicio.obtenerMotores();",100);
}//function

function bloqueaCamposAlEditar(){
    if(inicio.estaEditandoAuto){
        $("#noSerie")[0].disabled=true;
        $("#ano")[0].disabled    =true;
        $("#marca")[0].disabled  =true;
        $("#modelo")[0].disabled =true;
        $("#motor")[0].disabled  =true;
    }//if
}//function

function guardarAutomovil(){
    var idProp=0;
    var prop=almacenamiento.damePropietario();
    if(prop!=null)
        idProp=prop["id"];
    almacenamiento.tomaAutomovil(
        $("#idAutomovil").val(),
        '',//idProp,
        $("#placas").val(),
        $("#noSerie").val(),
        $("#ano").val(),
        $("#ano option:selected").attr('rel'),
        $("#marca").val(),
        $("#marca option:selected").attr('rel'),
        $("#kilometraje").val(),
        $("#modelo").val(),
        $("#modelo option:selected").attr('rel'),
        $("#motor").val(),
        $("#motor option:selected").attr('rel')
    );
    var auto=almacenamiento.dameAutomovil();
    var clav=clave();
    $.ajax({
		url:      dominio+"guardar-automovil",
		type:     'POST',
        //dataType: "json",
		data:	{
            clave:    clav,
            codigo:   sha1(clav+palaSecr),
            automovil:JSON.stringify(auto)
		},
        processData:true,
		success:	function(re){
            $("#ingreso").val(hoy());
            if(isNaN(re)){
                //_mensaje("Atención",re,"Entendido");
                //alert(re);
                //alert(inicio.estaEditandoAuto);
                agregarAutomovil();
                $(".errorAutomovil").text(re);
                $(".errorAutomovil").removeClass("hidden");
            }else{
                almacenamiento.tomaIdAutomovil(re);
                proyectaAutomovil();
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo guardar el  vehículo.","Entendido");
            //alert("No hay internet, no se pudo obtener información del vehículo.");
            callbackError();
		}
	});
}//function


inicio.obtenerPropietario=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-propietario",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:         clav,
            codigo:        sha1(clav+palaSecr),
            idPropietario: $("#idPropietario").val()
		},
        processData:true,
		success:	function(re){
            if(re["error"]==""){
                almacenamiento.tomaPropietario(re["id"], 
                                               re["idPersonaTipo"], 
                                               re["personaTipo"], 
                                               (re["rfc"]==""     ||re["rfc"]==null?'XAXX010101000':re["rfc"]), 
                                               re["nombre"], 
                                               (re["domicilio"]==""||re["domicilio"]=="null"?"Av. Patria 2335":re["domicilio"]), 
                                               (re["codigoPostal"]==""||re["codigoPostal"]=="null"?"45070":re["codigoPostal"]),
                                               re["idEstado"], 
                                               re["estado"], 
                                               re["idMunicipio"], 
                                               re["municipio"], 
                                               re["idCiudad"], 
                                               re["ciudad"],
                                               re["idTelefonoTipo1"],
                                               re["telefonoTipo1"],
                                               re["lada1"],
                                               re["telefono1"],
                                               re["extension1"],
                                               re["idTelefonoTipo2"],
                                               re["telefonoTipo2"],
                                               re["lada2"],
                                               re["telefono2"],
                                               re["extension2"],
                                               re["email"]);
                $("#id").val(re["id"]);
                $("#idPersonaTipo").val(re["idPersonaTipo"]).change();
				//$("#personaTipo").val(re["personaTipo"]);
				$("#rfc").val(re["rfc"]==""||re["rfc"]==null?'XAXX010101000':re["rfc"]);
				$("#nombre").val(re["nombre"]);
				$("#domicilio").val(re["domicilio"]==""||re["domicilio"]=="null"?"Av. Patria 2335":re["domicilio"]);
				$("#codigoPostal").val(re["codigoPostal"]==""||re["codigoPostal"]=="null"?"45070":re["codigoPostal"]);
                inicio.setearEstadoMunicipioCiudad(re["idEstado"],re["idMunicipio"],re["idCiudad"]);
				//$("#ciudad").val(re["ciudad"]);
				$("#idTelefonoTipo1").val(re["idTelefonoTipo1"]).change();
                //$("#telefonoTipo1").val(re["telefonoTipo1"]);
				$("#lada1").val(re["lada1"]);
				$("#telefono1").val(re["telefono1"]);
				$("#extension1").val(re["extension1"]);
				$("#idTelefonoTipo2").val(re["idTelefonoTipo2"]).change();
				//$("#telefonoTipo2").val(re["telefonoTipo2"]);
				$("#lada2").val(re["lada2"]);
				$("#telefono2").val(re["telefono2"]);
				$("#extension2").val(re["extension2"]);
                $("#email").val(re["email"]);
            }else{
                _mensaje("Atención",re["error"],"Entendido");
                //alert(re["error"]);
            }//if
		},
		error: function(re){
            
            _mensaje("Atención","No hay internet, no se pudo obtener información del propietario.","Entendido");
            //alert("No hay internet, no se pudo obtener información del vehículo.");
            callbackError();
		}
	});
}//function
function proyectaPropietario(bandera){
    proyectaPropietario
    var prop=almacenamiento.damePropietario();
    
    $(".modal").css("width","1000px");
    
    $(".idPropietario").val(prop["id"]);
    inicio.damePersonasTipo2(prop["idPersonaTipo"]);
    inicio.dameTiposTelefono2(prop["idTelefonoTipo1"],prop["idTelefonoTipo2"]);
    //$("#idPersonaTipo2").val(prop["idPersonaTipo"]).change();
    //$(".personaTipo").val(prop["personaTipo"]);
    $(".rfc").val(prop["rfc"]==""||prop["rfc"]==null?"XAXX010101000":prop["rfc"]);
	$(".nombre").val(prop["nombre"]);
	$(".domicilio").val(prop["domicilio"]==""||prop["domicilio"]=="null"?"Av. Patria 2335":prop["domicilio"]);
	$(".codigoPostal").val(prop["codigoPostal"]==""||prop["codigoPostal"]=="null"?"45070":prop["codigoPostal"]);
    if(bandera=='1'){
        inicio.setearEstadoMunicipioCiudad2(prop["idEstado"],prop["idMunicipio"],prop["idCiudad"]);
    }else{
        inicio.dameEstados2();
    }
	//$(".idEstado").val(prop["idEstado"]).change();
	//$(".estado").val(prop["estado"]);
	//$(".idMunicipio").val(prop["idMunicipio"]).change();
	//$(".municipio").val(prop["municipio"]);
	//$(".idCiudad").val(prop["idCiudad"]).change();
	//$(".ciudad").val(prop["ciudad"]);
	//$("#idTelefonoTipo2_1").val(prop["idTelefonoTipo1"]).change();
    //$(".telefonoTipo1").val(prop["telefonoTipo1"]);
	$(".lada1").val(prop["lada1"]);
	$(".telefono1").val(prop["telefono1"]);
	$(".extension1").val(prop["extension1"]);
	//$("#idTelefonoTipo2_2").val(prop["idTelefonoTipo2"]).change();
	//$(".telefonoTipo2").val(prop["telefonoTipo2"]);
	$(".lada2").val(prop["lada2"]);
	$(".telefono2").val(prop["telefono2"]);
	$(".extension2").val(prop["extension2"]);
    $(".email").val(prop["email"]);

       /* $("#idEstado2").bind("change", function(){
            $("#idMunicipio2").html('').append('<option value="">- Seleccione un Municipio</option>');
            prop = almacenamiento.damePropietario();
            //mandamos el id del municipio
            inicio.dameMunicipios2();
        });
        $("#idMunicipio2").bind("change", function(){
            $("#idCiudad2").html('').append('<option value="">- Seleccione una Ciudad</option>');
            prop = almacenamiento.damePropietario();
            //mandamos el id del municipio
            inicio.dameCiudades2();
      });*/
        
}//function
var formProp=''+
    '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
                '<div class="col-xs-12 errorPropietario alert alert-danger hidden">'+
                '</div>'+
                    '<div class="col-xs-3 ">'+
                        '<input type="hidden" class="idPropietario" value="" id="idPropietario">'+
                        '<select id="idPersonaTipo2" class="form-control idPersonaTipo">'+
                            '<option value="">- Seleccione un tipo -</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="col-xs-3 ">'+
                        '<input type="text" class="form-control rfc" maxlength="13" placeholder="Rfc" id="rfc">'+
                    '</div>'+
    
                    '<div class="col-xs-2 ">'+
                        '<select id="idTelefonoTipo2_1" class="form-control" >'+
                            '<option value="">- Seleccione un Tipo de teléfono -</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="col-xs-1 ">'+
                        '<input type="text" class="form-control lada1" maxlength="3" onkeypress="return permiteNumerosSinDecimal(event, this)"   placeholder="Lada" id="lada1">'+
                    '</div>'+
                    '<div class="col-xs-2 ">'+
                        '<input type="text" class="form-control telefono1" maxlength="30" onkeypress="return permiteNumerosSinDecimal(event, this)" placeholder="Teléfono" id="telefono1">'+
                    '</div>'+
                    '<div class="col-xs-1 ">'+
                        '<input type="text" class="form-control extension1" maxlength="3" onkeypress="return permiteNumerosSinDecimal(event, this)" placeholder="Extensión" id="extension1">'+
                    '</div>'+
    
                '</div>'+
                '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
                    '<div class="col-xs-6 ">'+
                        '<input type="text" class="form-control nombre" maxlength="100"  placeholder="Nombre" id="nombre">'+
                    '</div>'+
    
                    '<div class="col-xs-2 ">'+
                        '<select id="idTelefonoTipo2_2" class="form-control" >'+
                            '<option value="">- Seleccione un Tipo de teléfono -</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="col-xs-1 ">'+
                        '<input type="text" class="form-control lada2" maxlength="3" onkeypress="return permiteNumerosSinDecimal(event, this)" placeholder="Lada" id="lada2">'+
                    '</div>'+
                    '<div class="col-xs-2 ">'+
                        '<input type="text" class="form-control telefono2" maxlength="30" onkeypress="return permiteNumerosSinDecimal(event, this)" placeholder="Teléfono" id="telefono2">'+
                    '</div>'+
                    '<div class="col-xs-1 ">'+
                        '<input type="text" class="form-control extension2" maxlength="3" onkeypress="return permiteNumerosSinDecimal(event, this)" placeholder="Extensión" id="extension2">'+
                    '</div>'+
    

                '</div>'+
                '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
                    '<div class="col-xs-4 ">'+
                        '<input type="text" class="form-control domicilio" maxlength="100"  placeholder="Calle y número" id="domicilio">'+
                    '</div>'+
                    '<div class="col-xs-2 ">'+
                        '<input type="text" onkeypress="return permiteNumerosSinDecimal(event, this)" maxlength="5" class="form-control codigoPostal"  placeholder="Código postal" id="codigoPostal">'+
                    '</div>'+
    
                    '<div class="col-xs-6 ">'+
                        '<input type="text" class="form-control email"  maxlength="100" placeholder="Correo electrónico" id="email">'+
                    '</div>'+
    
                '</div>'+
                '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
                    '<div class="col-xs-6 ">'+
                        '<select id="idEstado2" class="form-control" onchange="inicio.dameMunicipios2();">'+
                            '<option value="">- Seleccione un Estado -</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="col-xs-6 ">'+
                        '<select id="idMunicipio2" class="form-control" onchange="inicio.dameCiudades2();">'+
                            '<option value="">- Seleccione un Municipio -</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+
                '<div class="col-xs-12 paddingTop5px sinPaddingLateral">'+
                    '<div class="col-xs-12 ">'+
                        '<select id="idCiudad2" class="form-control" >'+
                            '<option value="">- Seleccione una Ciudad -</option>'+
                        '</select>'+
                    '</div>'+
                '</div>';

function limpiarFormPropietario(){
    $("#idPropietario").val('');
    $("#idPersonaTipo").val('').change();
    $("#rfc").val('XAXX010101000');
	$("#nombre").val('');
	$("#domicilio").val('Av. Patria 2335');
	$("#codigoPostal").val('45070');
    $("#idEstado").val('').change();
    $("#idMunicipio").val('').change();
    $("#idCiudad").val('').change();
    $("#idTelefonoTipo1").val('').change();
	$("#lada1").val('');
	$("#telefono1").val('');
	$("#extension1").val('');
    $("#idTelefonoTipo2").val('').change();
	$("#lada2").val('');
	$("#telefono2").val('');
	$("#extension2").val('');
    $("#email").val('');
}
function agregarPropietario(){
    
     var cont="<table width='100%'><tr><td>"+formProp+"</td></tr></table>";
    myApp.modal({
        title: "Agregar Propietario",
        text:  cont,
        buttons: [
          {
            text: "Guardar",
            onClick: function(){
                guardarPropietario();
            }//function
          },
          {
            text: "Cancelar",
            onClick: function(){
                if(agrePro!=""){
                    localStorage.setItem("propietario",agrePro);
                    proyectaAutomovil();
                }//if
            }//function
          }
        ]
    })
     if(agrePro!=""){
           setTimeout("proyectaPropietario('1');",100);
     }else{
         setTimeout("proyectaPropietario('0');",100);
     }
    
}//function


function guardarPropietario(){
    almacenamiento.limpiaPropietario();
    auto=almacenamiento.dameAutomovil();
    var idAuto=0;
    if(auto!=null)
        idAuto=auto["id"];
    //alert(idAuto);
    almacenamiento.tomaPropietario(
        $(".idPropietario").val(),
        $("#idPersonaTipo2").val(),
        $("#idPersonaTipo2 option:selected").text(),
        $(".rfc").val(),
        $(".nombre").val(),
        $(".domicilio").val(),
        $(".codigoPostal").val(),
        $("#idEstado2").val(),
        $("#idEstado2 option:selected").text(),
        $("#idMunicipio2").val(),
        $("#idMunicipio2 option:selected").text(),
        $("#idCiudad2").val(),
        $("#idCiudad2 option:selected").text(),
        $("#idTelefonoTipo2_1").val(),
        $("#idTelefonoTipo2_1 option:selected").text(),
        $(".lada1").val(),
        $(".telefono1").val(),
        $(".extension1").val(),
        $("#idTelefonoTipo2_2").val(),
        $("#idTelefonoTipo2_2 option:selected").text(),
        $(".lada2").val(),
        $(".telefono2").val(),
        $(".extension2").val(),
        $(".email").val()  
    );
    var prop=almacenamiento.damePropietario();
    var clav=clave();
    $.ajax({
		url:      dominio+"guardar-propietario2",
		type:     'POST',
        //dataType: "json",
		data:	{
            clave:    clav,
            codigo:   sha1(clav+palaSecr),
            propietario:JSON.stringify(prop),
            idAuto:   idAuto
		},
        processData:true,
		success:	function(re){
            $("#ingreso").val(hoy());
            //var hoyFech=hoy();
            //hoyFech=hoyFech.split(' ');
            //$("#entrega").val(hoyFech[0]);
            //$("#entregaTiempo").val(hoyFech[1]);
            inicio.actualizarFechaPromesa(this);
            if(isNaN(re)){
                agregarPropietario();
                $(".errorPropietario").text(re);
                $(".errorPropietario").removeClass("hidden");
                
            }else{
                //alert(re);
                limpiarFormPropietario();
                $("#idPropietario").val(re);
                almacenamiento.tomaIdPropietario(re);
                inicio.obtenerPropietario();
                //proyectaPropietario();
            }//if
		},
		error: function(re){
            _mensaje("Atención","No hay internet, no se pudo guardar la información del propietario.","Entendido");
            //alert("No hay internet, no se pudo obtener información del vehículo.");
            callbackError();
		}
	});
}//function

inicio.seleAuto=0;
inicio.seleAutoIdOrden=0;
inicio.seleAutoFingreso='';
inicio.seleAutoFentrega='';
inicio.seleAutoNoBahia=0;
inicio.seleAutoIdOrdenReal=0;
inicio.seleAutoIdEstatus='';
inicio.revisarSeleccion=true;
inicio.seleccionoAuto=function(idAuto,idOrde,fingreso,fentrega,noBahia,idOrdeReal,idEstatus){
    if(almacenamiento.dameEstatusModoConsulta().status=='1' && inicio.revisarSeleccion){
        _mensaje("Atención","Antes de seleccionar otro vehículo tienes que salir del modo de consulta.","Entendido");
        return false;
    }//if
    
    inicio.seleAutoIdOrdenReal=idOrdeReal;
    inicio.seleAutoIdEstatus=idEstatus;
    inicio.seleAuto=idAuto;
    almacenamiento.limpiaFolioActivo(idOrde);
    //inicio.seleOrde=idOrde;
    //$("#ingreso").val("");
    if(almacenamiento.dameEstatusModoConsulta().status!='1' && !noBorrarFechaEntrega){
        $("#entrega").val("");
        $("#entregaTiempo").val("");
        $("#noBahia").val("");
    }//if
    noBorrarFechaEntrega=false;
    
    for(var i=0; i<=$(".rengAuto").length-1; i++){
        $(".rengAuto").css("background","");
    }//for
    $("#rengAuto"+idOrde).css("background","#FF0000");
    $("#ingreso").val(hoy());
    
    inicio.seleAutoIdOrden=idOrde;
    inicio.seleAutoFingreso=fingreso;
    inicio.seleAutoFentrega=fentrega;
    inicio.seleAutoNoBahia=noBahia;
    
    $("#lnkImprimir").css("display","");
    
    if(almacenamiento.dameEstatusModoConsulta().status!=undefined && almacenamiento.dameEstatusModoConsulta().status=='1'){
        $("#folio").val(idOrde);
        $("#ingreso").val(fingreso);
        //$("#entrega").val(fentrega);
        $("#noBahia").val(noBahia).change();
    }
    
    almacenamiento.guardaFolioActivo(idOrde);
    inicio.dameOrdenes();
    inicio.obtenerAuto();
    
    inicio.revisarSeleccion=true;
}//function

function imprimirFactura(){
    if(inicio.seleAutoIdOrden!=0)
        console.log('http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?folio='+inicio.seleAutoIdOrden);
        window.open('http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?folio='+inicio.seleAutoIdOrden, '_blank','location=0','closebuttoncaption=Cerrar');
}//function

inicio.seleOrde=0;
inicio.seleccionoOrde=function(idOrde){
    //almacenamiento.limpiaFolioActivo(idOrde);
    inicio.seleOrde=idOrde;
    //$("#lnkImprimir").attr("href","http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?idOrden=69");
    //window.location="http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?idOrden=69";
    //window.plugins.fileOpener.open("http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?idOrden=69");
    //cordova.InAppBrowser.open("http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?idOrden=69", '_blank', 'location=yes');
    
    for(var i=0; i<=$(".rengOrde").length-1; i++){
        $(".rengOrde").css("background","");
    }//for
    $("#rengOrde"+idOrde).css("background","#FF0000");
    //$("#ingreso").val(fingreso);
    //$("#entrega").val(fentrega);
    //almacenamiento.guardaFolioActivo(idOrde);
    //asigno la fecha al campo de fcha de ingreso
   // $("#ingreso").val(fecha);
}//function
inicio.actualizarBahia = function(obj){
    //if(almacenamiento.dameEstatusModoConsulta().status==0){
        almacenamiento.actualizarBahia($(obj).val());
    //}//if
}
inicio.actualizarFechaEntrega = function(obj){
    if(almacenamiento.dameEstatusModoConsulta().status==0){
        almacenamiento.actualizarFechaEntrega($(obj).val());
    }
    
}
inicio.actualizarFechaPromesa = function(obj){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]=="ABI" || almacenamiento.dameEstatusModoConsulta().status==0){
        almacenamiento.actualizarFechaPromesa($("#entrega").val()+" "+$("#entregaTiempo").val());
    }//if
}//if
inicio.btnLimpiar=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1){
        almacenamiento.salirModoConsulta();
        window.location = 'inicio.html';
    }else{
        _confirmarAntesDeEliminar();
    }   
}

inicio.obtenerAnos=function(){
    var auto=JSON.parse(agreAuto);
    $("#ano").html("<option value='"+$("#ano").val()+"' rel='"+auto["ano"]+"'>Cargando...Año</option>");
    $.ajax({
		url:  dominioServicios+"obtener-anos",
		type: 'POST',
		data: {
		},
		success: function(re){
            if(re=='Error'){
                alert("Ocurrió un error al momento de consumir los servicios de http://app.ciosa.com/");
                $("#ano").html("<option value=''>- Error en servicios -</option>");
            }else{
                var idAnoo=$("#ano").val();
                $("#ano").html(re);
                $("#ano").val(idAnoo);
            }//if
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

inicio.obtenerMarcas=function(){
    var auto=JSON.parse(agreAuto);
    $("#marca").html("<option value='"+$("#marca").val()+"' rel='"+auto["marca"]+"'>Cargando...Marca</option>");
    $.ajax({
		url:  dominioServicios+"obtener-marcas/idAno/"+$("#ano").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            var idMarc=$("#marca").val();
            $("#marca").html(re);
            $("#marca").val(idMarc);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

inicio.obtenerModelos=function(){
    var auto=JSON.parse(agreAuto);
    $("#modelo").html("<option value='"+$("#modelo").val()+"' rel='"+auto["modelo"]+"'>Cargando...Modelo</option>");
    $.ajax({
		url:  dominioServicios+"obtener-modelos/idAno/"+$("#ano").val()+"/idMarca/"+$("#marca").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            var idMode=$("#modelo").val();
            $("#modelo").html(re);
            $("#modelo").val(idMode);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

inicio.obtenerMotores=function(){
    var auto=JSON.parse(agreAuto);
    $("#motor").html("<option value='"+$("#motor").val()+"' rel='"+auto["motor"]+"'>Cargando...Motor</option>");
    $.ajax({
		url:  dominioServicios+"obtener-motores/idAno/"+$("#ano").val()+"/idMarca/"+$("#marca").val()+"/idModelo/"+$("#modelo").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            var idMode=$("#motor").val();
            $("#motor").html(re);
            var cbo=$("#motor")[0];
            //$("#motor").val(idMode);
            for(var i=0; i<=cbo.options.length-1; i++){
                //alert(cbo.options[i].value+" "+idMode);
                if(cbo.options[i].value.toUpperCase() == idMode.toLocaleUpperCase()){
                    cbo.options[i].selected=true;
                    break;
                }//if
            }//for
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function