operacion = {};
$(document).ready(function(){
    document.addEventListener("deviceready",function(){
        $("#btnImprimir").css("display",(almacenamiento.dameEstatusModoConsulta().status==1?"":"none"));
        
        var auto=almacenamiento.dameAutomovil();
        var prop=almacenamiento.damePropietario();
        if(auto!=null && prop!=null && auto["idPropietario"]==''){
            $.ajax({
                url:  dominio+"asigna-propietario",
                type: 'POST',
                data:	{
                    idAutomovil:   auto["id"],
                    idPropietario: prop["id"]
                },
                success:	function(re){
                },
                error: function(re){
                    alert("Error al comunicarse con servidor.");
                }
            });
        }//if
        
    var idAuto=0;
    if(auto!=null)
        idAuto=auto["id"];
        
        //obtenemos los datos del automovil y propietario seleccionado
        //seteamos los campos del encabezado
        var propietario = almacenamiento.damePropietario();
        var automovil = almacenamiento.dameAutomovil();
        var folio = almacenamiento.dameFolioActivo();
        //folio,modelo,cliente
        
        $("#headerModelo").val(automovil.marca+", "+automovil.modelo+", "+automovil.motor);
        $("#headerCliente").val(propietario.nombre);
        almacenamiento.vaciarAreaSeleccionada();
        almacenamiento.vaciarServicioSeleccionado();
        //almacenamiento.vaciarOperaciones();
        //almacenamiento.vaciarRefacciones();
        //obtenemos el select de servicios
        //obtenemos lAS AREAS DE OPORTUNIDAD y los pintamos en el grid
        operacion.cargarAreasOportunidad();
        
        operacion.obtenerServicios();
         
        //obtenemos lAS categorias y los pintamos en el select
        operacion.cargarCategorias();
        
        //alert(almacenamiento.consultaCargoOperacion());
        if(almacenamiento.dameEstatusModoConsulta().status=='1' && almacenamiento.consultaCargoOperacion()=='0'){
            //alert("esta en modo consulta");
            $("#headerFolio").val(folio.id);
            if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){
                $("#servicios").removeAttr("disabled");
                //almacenamiento.cargoOperacion('1');
            }else
                $("#servicios").attr("disabled","disabled");
            $("#ModoActivo").html('Consulta');
            //obtenemos los servicios relacionados a la orden de servicio seleccionada
            operacion.cargarServiciosDeOrden(almacenamiento.dameFolioActivo().id);
        }else{
            if(almacenamiento.dameIdOrden()!=null && almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){
                $("#headerFolio").val(folio.id);
                $("#ModoActivo").html('Consulta');
            }else{
                $("#headerFolio").val('');
                $("#ModoActivo").html('Captura');
            }//if
            //$("#headerFolio").val('');
            //$("#ModoActivo").html('Captura');
            $("#servicios").removeAttr("disabled");
            //vaciamos las recomendaciones cada vez que se cargue la pagina
            //almacenamiento.vaciarRecomendaciones();
            //obtenemos los servicio almacenados en localstorage y los pintamos en el grid
            operacion.cargarServiciosAlmacenados(almacenamiento.dameServicios());
            operacion.actualizaPrecioDeServicios();
        }
        
        var modo=almacenamiento.dameEstatusModoConsulta();
        var modoStatus=modo.status=='1' && almacenamiento.dameIdOrden()["idEstatus"]!="ABI";
        $("#categoria")[0].disabled    =modoStatus;
        $("#taller")[0].disabled       =modoStatus;
        $("#recomendacion")[0].disabled=modoStatus;
        
    },false);
});

operacion.obtenerServicios=function(){
    var clav=clave();
    $.ajax({
		url:      dominio+"dame-servicios",
		type:     'POST',
        dataType: "json",
		data:	{
            clave:       clav,
            codigo:      sha1(clav+palaSecr)
		},
        processData:true,
		success:	function(re){
            console.log("Servidor responde: ");
            console.log(re);
            if(re[0].error==""){
                //limpiamos el select
                $("#servicios").html('');
                 $("#servicios").append('<option value="" >- Seleccione un servicio -</option>');
                //recorremos los servicios y los insertamos al select
                $.each(re, function(index, item) {
                    console.log('<option value="'+item.id+'" rel="'+item.totalRefacciones+','+(item.unidades*item.manoDeObra)+'">'+item.servicio+'</option>');
                   $("#servicios").append('<option value="'+item.id+'" rel="'+item.totalRefacciones+','+(item.unidades*item.manoDeObra)+'" >'+item.servicio+'</option>');
                });
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

 operacion.cargarServiciosDeOrden=function(folio){
     console.log("Se consulta a las ordenes de servicio con el folio: "+folio);
      var clav=clave();
        $.ajax({
            url:      dominio+"dame-servicios-de-orden",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                folio:       folio
            },
            processData:true,
            success:	function(re){
                console.log("Servidor responde: ");
                console.log(re);
                if(re.length!=0 && re[0].error==""){// a veces el servicio no retorna operaciones
                    //recorremos las operaciones para almacenarlas
                    $.each(re, function(index, item) {
                       //obtenemos los datos de la operacion en curso
                        var idServicio = item.id;
                        var nombreServicio = item.servicio;
                        var precioServicio = item.totalRefacciones;
                        
                        var co='';
                        co+="<tr rel=\""+idServicio+"\" >";
                        co+=" <td class='col-xs-7 valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">"+nombreServicio+"</td>";
                        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">$"+((parseFloat(precioServicio)+parseFloat(item.unidades*item.manoDeObra)).toFixed(2))+"</td>";
                        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaServicio('"+idServicio+"');\" ><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                        co+="</tr>";
                        $("#gridServicios").append(co);
                        almacenamiento.guardaServicio(idServicio,nombreServicio,precioServicio,item.unidades*item.manoDeObra,item.idReal);
                        //operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio,'',1);
                        //obtenemos las operaciones de la orden ligada
                        var clav=clave();
                        $.ajax({
                            url:      dominio+"dame-operaciones-orden2",
                            type:     'POST',
                            dataType: "json",
                            data:	{
                                clave:       clav,
                                codigo:      sha1(clav+palaSecr),
                                idServicio: idServicio,
                                folio: folio
                            },
                            processData:true,
                            success:	function(res){
                                console.log("Servidor responde(operaciones): ");
                                console.log(JSON.stringify(res));
                                if(res.length!=0 && res[0].error==""){// a veces el servicio no retorna operaciones
                                    //recorremos las operaciones para almacenarlas
                                    $.each(res, function(i, oitem) {
                                       //obtenemos los datos de la operacion en curso
                                        var idOperacion = oitem.id;
                                        var nombreOperacion = (oitem.opcional==1 ?"(Opcional) "+oitem.operacion:oitem.operacion);
                                        var opcional = oitem.opcional;

                                        var co='';
                                                co+="<tr rel=\""+idOperacion+"\" >";
                                                co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacionOrden('"+almacenamiento.dameFolioActivo().id+"','"+idOperacion+"','"+idServicio+"','1','0');\">"+nombreOperacion+"</td>";
                                                if(oitem.opcional=='1'){
                                                    co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                                }else{
                                                    co+=" <td class='col-xs-2 text-center valign'></td>";
                                                }
                                                co+="</tr>";
                                        $("#gridOperaciones").append(co);
                                        almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio, oitem.idReal);
                                        for(var j=0; j<=oitem["refacciones"].length-1; j++){
                                            almacenamiento.guardarRefaccion(
                                                idOperacion
                                                ,oitem["refacciones"][j]["idRefaccion"]
                                                ,oitem["refacciones"][j]["nombre"]
                                                ,oitem["refacciones"][j]["cantidad"]
                                                ,oitem["refacciones"][j]["precio"]
                                                ,oitem["refacciones"][j]["tipo"]
                                                ,idServicio
                                                ,oitem["refacciones"][j]["idReal"]
                                            );
                                            var co='';
                                            co+="<tr id='rengRefa"+
                                                oitem["refacciones"][j]["idRefaccion"]+"' rel=\""+
                                                oitem["refacciones"][j]["idRefaccion"]+"\" >";
                                            co+=" <td class='col-xs-7 valign' onClick=\"\">"+
                                                oitem["refacciones"][j]["nombre"]+"</td>";
                                            co+=" <td class='col-xs-2 text-center valign' onClick=\"\">"+
                                                oitem["refacciones"][j]["cantidad"]+"</td>";
                                            co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.cambiarRefaccion('"+
                                                oitem["refacciones"][j]["idRefaccion"]+"','"+
                                                oitem["refacciones"][j]["cantidad"]+"','"+
                                                oitem["refacciones"][j]["tipo"]+
                                                "','"+oitem["refacciones"][j]["nombre"]+"');\" ><i class=\"fa fa-random fa-2x\">&nbsp;</i></td>";
                                            co+="</tr>";
                                            $("#gridRefacciones").append(co);
                                        }//for
                                        //cargamos en local storage las refacciones de todas las operaciones
                                        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                                        //y con esto actualizar los costos del servicio
                                        ////operacion.cargaRefaccionesPorOperacionOrden(folio,idOperacion,idServicio,'',1);
                                        if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                                            almacenamiento.cargoOperacion('1');
                                    });
                                }
                            },
                            error: function(re){
                                _mensaje("Atención","No hay internet, no se pudo obtener la información.","Entendido");
                                //alert("No hay internet, no se pudo obtener información del vehículo.");
                                //callbackError();
                                console.log(re);
                            }
                        });
                    });
                }
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener la información.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
 }

 
operacion.insertarServicios=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
    if($("#servicios").val()!=''){
        //obtenemos el servicio que quiere insertar
        var idServicio = $("#servicios").val();
        var nombreServicio = $("#servicios option:selected").text();
        var precioServicio = $("#servicios option:selected").attr("rel").valueOf().split(',');
        var precioManoObra = precioServicio[1];
        precioServicio = precioServicio[0];

        //verificamos que el servicio no este vacio
        if(idServicio==''){
            _mensaje("Atención","Es necesario seleccionar un servicio para poderlo agregar a la lista","Entendido");
            //alert("Es necesario seleccionar un servicio para poder agregarlo a la tabla");
            return false;
        }

        //verificamos si el servicio que quiere insertar no esta en la tabla
        //si ya esta, le mostramos un mensaje indicandolo
        var existe=false;
        $('#gridServicios tbody tr').each(function() {
            var servicio = $(this).attr("rel").valueOf();
            if(idServicio==servicio){
                existe=true;
            }
        });


        //si existe, mandamos mensaje
        if(existe){
            _mensaje("Atención","El servicio <strong>"+nombreServicio+"</strong> ya se encuentra en la lista.","Entendido");
            //alert("El servicio ya se encuentra en la lista.");
        }else{//si no existe insertamos el nuevo row
            var co='';
            co+="<tr rel=\""+idServicio+"\" >";
            co+=" <td class='col-xs-7 valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">"+nombreServicio+"</td>";
            co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">$"+((parseFloat(precioServicio)+parseFloat(precioManoObra)).toFixed(2))+"</td>";
            co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaServicio('"+idServicio+"');\" ><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
            co+="</tr>";
            $("#gridServicios").append(co);
            //guardamos en localstorage el servicio agregado
            almacenamiento.guardaServicio(idServicio,nombreServicio,precioServicio, precioManoObra);
            //guardamos las operaciones del servicio en local storage
            var clav=clave();
            $.ajax({
                url:      dominio+"dame-operaciones",
                type:     'POST',
                dataType: "json",
                data:	{
                    clave:       clav,
                    codigo:      sha1(clav+palaSecr),
                    idServicio: idServicio
                },
                processData:true,
                success:	function(re){
                    console.log("Servidor responde: ");
                    console.log(re);
                    if(re.length!=0 && re[0].error==""){// a veces el servicio no retorna operaciones
                        //recorremos las operaciones para almacenarlas
                        $.each(re, function(index, item) {
                           //obtenemos los datos de la operacion en curso
                            var idOperacion = item.id;
                            var nombreOperacion = (item.opcional==1 ?"(Opcional) "+item.operacion:item.operacion);
                            var opcional = item.opcional;

                            var co='';
                                    co+="<tr rel=\""+idOperacion+"\" >";
                                    co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
                                    if(item.opcional=='1'){
                                        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                    }else{
                                        co+=" <td class='col-xs-2 text-center valign'></td>";
                                    }
                                    co+="</tr>";
                            $("#gridOperaciones").append(co);
                            almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
                            //cargamos en local storage las refacciones de todas las operaciones
                            // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                            //y con esto actualizar los costos del servicio
                            operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio,'',1);
                        });
                    }
                },
                error: function(re){
                    _mensaje("Atención","No hay internet, no se pudo obtener la información.","Entendido");
                    //alert("No hay internet, no se pudo obtener información del vehículo.");
                    callbackError();
                }
            });

        }
    }else{
        _mensaje("Atención","Es necesario que primero seleccione un servicio.","Entendido");
    }
    

}//function




operacion.eliminaServicio=function(idServicio){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
     $('#gridServicios tbody tr').each(function() {
        var servicio = $(this).attr("rel").valueOf();
        if(idServicio==servicio){
            //eliminamos el servicio del localstorage
            almacenamiento.eliminaUnServicio(idServicio);
            $(this).remove();
            
        }
    });
    //funcion para regresar el area de oportunidad a su estado normal si es que esta ligada a un area de ooportunidad
    operacion.reestablecerAreaOportunidad(idServicio);
    $("#gridOperaciones").html('');
    $("#gridRefacciones").html('');
}//function


operacion.cargarServiciosAlmacenados=function(servicios){
     //recorremos todos los servicios
    $.each(servicios, function(i, item) {
       //obtenemos los datos por separado
        //obtenemos el servicio que quiere insertar
        var idServicio = servicios[i].id;
        var nombreServicio = servicios[i].nombre;
        var precioServicio = servicios[i].precio;
        
        //elaboramos la cadena e insertamos en la tabla
        var co='';
            co+="<tr rel=\""+idServicio+"\" >";
            co+=" <td class='col-xs-7 valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">"+nombreServicio+"</td>";
            co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">"+precioServicio+"</td>";
            co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaServicio('"+idServicio+"');\" ><i class=\"fa fa-times fa-2x\" >&nbsp;</i></td>";
            co+="</tr>";
        $("#gridServicios").append(co);
        
        //leer las operaciones ya almacenadas y pintarlas
            var operaciones_servicio = almacenamiento.dameOperacionesDeUnServicio(idServicio);
             $.each(operaciones_servicio, function(io, itemo) {
                        //obtenemos los datos de la operacion en curso
                        var idOperacion = itemo.id;
                        var nombreOperacion = itemo.nombre;
                        var opcional = itemo.opcional;
                        
                        var co2='';
                                co2+="<tr rel=\""+idOperacion+"\" >";
                                co2+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
                                if(itemo.opcional=='1'){
                                    co2+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                }else{
                                    co2+=" <td class='col-xs-2 text-center valign'></td>";
                                }
                                co2+="</tr>";
                        $("#gridOperaciones").append(co2);
                        //almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
                        //cargamos en local storage las refacciones de todas las operaciones
                        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                        //y con esto actualizar los costos del servicio
                        operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio);
             });
            //leer las refacciones de cada operacion y pintarlas
        
        
        
        //guardamos las operaciones del servicio en local storage
        /*var clav=clave();
        $.ajax({
            url:      dominio+"dame-operaciones",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idServicio: idServicio
            },
            processData:true,
            success:	function(re){
                console.log("Servidor responde: ");
                console.log(re);
                if(re.length!=0 && re[0].error==""){// a veces el servicio no retorna operaciones
                    //recorremos las operaciones para almacenarlas
                    $.each(re, function(index, item) {
                        //obtenemos los datos de la operacion en curso
                       //obtenemos los datos de la operacion en curso
                        var idOperacion = item.id;
                        var nombreOperacion = (item.opcional==1 ?"(Opcional) "+item.operacion:item.operacion);
                        var opcional = item.opcional;
                        
                        var co='';
                                co+="<tr rel=\""+idOperacion+"\" >";
                                co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
                                if(item.opcional=='1'){
                                    co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                }else{
                                    co+=" <td class='col-xs-2 text-center valign'></td>";
                                }
                                co+="</tr>";
                        $("#gridOperaciones").append(co);
                        almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
                        //cargamos en local storage las refacciones de todas las operaciones
                        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                        //y con esto actualizar los costos del servicio
                        operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio);
                        
                    });
                }
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });*/
        
    });
}//function

var idServSele=0;
operacion.seleccionoServicio=function(idServicio){
    idServSele=idServicio;
    var consulta = false;
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        consulta = true;
        
    }
    //obtenemos las operaciones del servicio seleccionado
    operaciones_servicio = almacenamiento.dameOperacionesDeUnServicio(idServicio);    
    $("#gridOperaciones").html('');
    $("#gridRefacciones").html('');
    //primero vaciamos las operaciones que ya se hayan seleccionado anteriormente
    //almacenamiento.vaciarOperaciones();
    //almacenamiento.vaciarRefacciones();

    //recorremos las operaciones para colocarlas en el grid de operaciones
    $.each(operaciones_servicio, function(index, item) {
        //obtenemos los datos de la operacion en curso
        var idOperacion = item.id;
        var nombreOperacion = (item.nombre==1 ?"(Opcional) "+item.nombre:item.nombre);
        var opcional = item.opcional;
                        
        var co='';
        co+="<tr rel=\""+idOperacion+"\" >";
        if(consulta && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
            co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacionOrden('"+almacenamiento.dameFolioActivo().id+"','"+idOperacion+"','"+idServicio+"','1','1');\">"+nombreOperacion+"</td>";
        }else{
            co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
        }
        
        if(item.opcional=='1'){
                co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
        }else{
                co+=" <td class='col-xs-2 text-center valign'></td>";
        }
        co+="</tr>";
        $("#gridOperaciones").append(co);
        //gguardamos las operaciones en localstorage.
        //almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
        //cargamos en local storage las refacciones de todas las operaciones
        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
        //y con esto actualizar los costos del servicio
        if(consulta){
            operacion.cargaRefaccionesPorOperacionOrden(almacenamiento.dameFolioActivo().id,idOperacion,idServicio,'1',1);
        }else{
            operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio);
        }
        
                
    });
    almacenamiento.servicioSeleccionado(idServicio);
    /*//ACTUALIZAMOS EL PRECIO DE LAS REFACCIONES EN CASO DE QUE VUELVAN A SELECCIONAR EL SERVICIO
    //operacion.actualizarPrecioServicio(idServicio);
    total = almacenamiento.dameTotalRefaccionesDeUnServicio(idServicio);
    $('#gridServicios tr').each(function() {

        if(idServicio==$(this).attr("rel").valueOf()){
            //asignamos el total de refacciones al servicio
            $(this).find("td:eq(1)").html(total.toFixed(2));
            //actualizamos los servicios en localstorage
            almacenamiento.actualizarServicio(idServicio,total);
        }
    });*/
        
        /*
        var clav=clave();
        $.ajax({
            url:      dominio+"dame-operaciones",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idServicio: idServicio
            },
            processData:true,
            success:	function(re){
                console.log("Servidor responde: ");
                console.log(re);
                //seleccionamos el servicio
                operacion.marcarSeleccion("gridServicios",idServicio);
                if(re.length==0){// a veces el servicio no retorna operaciones
                    //vaciamos el grid de operaciones
                    var co='';
                                co+="<tr>";
                                co+=" <td class='col-xs-7 valign'>No hay Operaciones relacionadas al servicio seleccionado</td>";
                                co+=" <td class='col-xs-2 text-center valign'></td>";
                                co+="</tr>";
                                $("#gridOperaciones").html(co);
                    //primero vaciamos las operaciones que ya se hayan seleccionado anteriormente
                    almacenamiento.vaciarOperaciones();
                    almacenamiento.limpiarServicioSeleccionado();
                     almacenamiento.vaciarRefacciones();
                }else if(re[0].error==""){
                    $("#gridOperaciones").html('');
                    $("#gridRefacciones").html('');
                    //primero vaciamos las operaciones que ya se hayan seleccionado anteriormente
                    //almacenamiento.vaciarOperaciones();
                    //almacenamiento.vaciarRefacciones();

                    //recorremos las operaciones para colocarlas en el grid de operaciones
                    $.each(re, function(index, item) {
                        //obtenemos los datos de la operacion en curso
                        var idOperacion = item.id;
                        var nombreOperacion = (item.opcional==1 ?"(Opcional) "+item.operacion:item.operacion);
                        var opcional = item.opcional;
                        
                        var co='';
                                co+="<tr rel=\""+idOperacion+"\" >";
                                co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
                                if(item.opcional=='1'){
                                    co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                }else{
                                    co+=" <td class='col-xs-2 text-center valign'></td>";
                                }
                                co+="</tr>";
                        $("#gridOperaciones").append(co);
                        //gguardamos las operaciones en localstorage.
                        almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
                        //cargamos en local storage las refacciones de todas las operaciones
                        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                        //y con esto actualizar los costos del servicio
                        operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio);
                        
                    });
                    almacenamiento.servicioSeleccionado(idServicio);
                    //ACTUALIZAMOS EL PRECIO DE LAS REFACCIONES EN CASO DE QUE VUELVAN A SELECCIONAR EL SERVICIO
                    operacion.actualizarPrecioServicio(idServicio);
                }else{
                    _mensaje("Atención",re.error,"Entendido");
                   // alert(re.error);
                }//if
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });*/
}//function

operacion.marcarSeleccion = function(grid,idSeleccion){
    //recorremos el grid para deseleccionar el que estaba seteado
     $.each($("#"+grid+" tr"), function(i) {
        if( $(this).attr("rel").valueOf()==idSeleccion){
             $(this).css("background","#FF0000");
        }else{
            $(this).css("background","");
        }
    });    
}
operacion.eliminaOperacion = function(idOperacion,idServicio){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
    //obtenemos las refacciones ligadas a la operacion y eliminamos de localstorage, actualizamos precio del grid principal
    total = almacenamiento.eliminaRefaccionesDeOperacion(idOperacion,idServicio);
    //idServicio = almacenamiento.dameServicioSeleccionado();
    //console.log(total);
    $('#gridOperaciones tr').each(function() {
        if(idOperacion==$(this).attr("rel").valueOf()){
           $(this).remove();
            //eliminamos la operacion de localstorage
            almacenamiento.eliminaUnaOperacion(idOperacion);
        }
    });
    almacenamiento.actualizarServicio(idServicio,total);
    operacion.actualizaPrecioDeServicios();
    /*
     $('#gridServicios tr').each(function() {

        if(idServicio==$(this).attr("rel").valueOf()){
            //asignamos el total de refacciones al servicio
            $(this).find("td:eq(1)").html(total.toFixed(2));
            //actualizamos los servicios en localstorage
            almacenamiento. actualizarServicio(idServicio,total);
        }}
    );
    */
    
}
operacion.cargaRefaccionesPorOperacionOrden=function(folio,idOperacion,idServicio,limpiar,extrer){
    console.log("cargaRefaccionesPorOperacionOrden: "+folio+" : "+idOperacion+" : "+idServicio+" : "+limpiar+" : "+extrer);
    if(limpiar!=undefined && limpiar!=''){
        console.log("se limpia el grid de refacciones");
        $("#gridRefacciones").html('');
    }
    
    if(extrer=='1'){
        //alert("extraer1");
        //obtenemos las refacciones de la operacionseleccionada
        var clav=clave();
        $.ajax({
            url:      dominio+"dame-refacciones-orden",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idOperacion: idOperacion,
                folio: folio
            },
            processData:true,
            success:	function(re){
                console.log("dame-refacciones-orden responde: ");
                console.log(re);
                
                if(re.length==0){// a veces la operacion no retorna refacciones
                    
                }else if(re[0].error==""){
                    //recorremos las refacciones

                    $.each(re, function(index, item){
                        //obtenemos los datos de la refaccion en curso
                        var idRefaccion = item.idRefaccion;
                        var idOperacion = item.idOperacion;
                        var nombreRefaccion = item.refaccion;
                        var cantidad = item.cantidad;
                        var precio = item.precio;
                        var tipo = item.tipo;
                        var servicio = item.idServicio;
                        //console.log("Refacciones: ");
                        //console.log(item);
                       //gguardamos las refacciones en localstorage.
                        almacenamiento.guardarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio);
                        operacion.insertarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio)
                    });
                }else{
                    _mensaje("Atención",re.error,"Entendido");
                }//if
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información de la refacción.","Entendido");
                console.log(re);
                //callbackError();
            }
        });
    }else{
        //alert("extraer0");
        refacciones_operacion = almacenamiento.dameRefaccionesDeUnaOperacion(idOperacion,idServicio);
        $.each(refacciones_operacion, function(index, item){
                //obtenemos los datos de la refaccion en curso
                var idRefaccion = item.id;
                var idOperacion = item.idOperacion;
                var nombreRefaccion = item.nombre;
                var cantidad = item.cantidad;
                var precio = item.precio;
                var tipo = item.tipo;
                var servicio = item.idServicio;
                //console.log("Refacciones: ");
                //console.log(item);
                //almacenamiento.guardarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio);
                operacion.insertarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio)
        });
    }
}
operacion.cargaRefaccionesPorOperacion=function(idOperacion,idServicio,limpiar,extrer){
   
    if(limpiar!=undefined && limpiar!=''){
        $("#gridRefacciones").html('');
    }
    
    if(extrer=='1'){
         //obtenemos las refacciones de la operacionseleccionada
        var clav=clave();
        $.ajax({
            url:      dominio+"dame-refacciones",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idOperacion: idOperacion
            },
            processData:true,
            success:	function(re){
                console.log("Servidor responde: ");
                console.log(re);
                
                if(re.length==0){// a veces la operacion no retorna refacciones
                    
                }else if(re[0].error==""){
                    //recorremos las refacciones

                    $.each(re, function(index, item){
                        //obtenemos los datos de la refaccion en curso
                        var idRefaccion = item.idRefaccion;
                        var idOperacion = item.idOperacion;
                        var nombreRefaccion = item.refaccion;
                        var cantidad = item.cantidad;
                        var precio = item.precio;
                        var tipo = item.tipo;
                        var servicio = item.idServicio;
                        //console.log("Refacciones: ");
                        //console.log(item);
                       //gguardamos las refacciones en localstorage.
                        almacenamiento.guardarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio);
                        operacion.insertarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio)
                    });
                }else{
                    _mensaje("Atención",re.error,"Entendido");
                }//if
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información de la refacción.","Entendido");
                callbackError();
            }
        });
    }else{
        refacciones_operacion = almacenamiento.dameRefaccionesDeUnaOperacion(idOperacion,idServicio);
        if(refacciones_operacion!=null)
            $.each(refacciones_operacion, function(index, item){
                    //obtenemos los datos de la refaccion en curso
                    var idRefaccion = item.id;
                    var idOperacion = item.idOperacion;
                    var nombreRefaccion = item.nombre;
                    var cantidad = item.cantidad;
                    var precio = item.precio;
                    var tipo = item.tipo;
                    var servicio = item.idServicio;
                    //console.log("Refacciones: ");
                    //console.log(item);
                    //almacenamiento.guardarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio);
                    operacion.insertarRefaccion(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo,servicio)
            });
    }
    
    
    
    
   
}//function

operacion.actualizarPrecioServicio=function(idServicio){
    //obtenemos las operaciones del servicio seleccionado
        var clav=clave();
        $.ajax({
            url:      dominio+"total-refacciones-servicio",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idServicio: idServicio
            },
            processData:true,
            success:	function(re){
                var total = parseFloat(re[0].totalRefacciones);
                $('#gridServicios tr').each(function() {
                    if(idServicio==$(this).attr("rel").valueOf()){
                        $(this).find("td:eq(1)").html(total.toFixed(2));
                        //actualizamos los servicios en localstorage
                        almacenamiento.actualizarServicio(idServicio,total);
                    }
                });
                
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener el total de refacciones para el servicio.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
}//function

operacion.insertarRefaccion=function(idOperacion,idRefaccion,nombreRefaccion,cantidad,precio,tipo){
   
    //verificamos que la refaccion no este vacio
    if(idRefaccion=='' || idOperacion==''){
        _mensaje("Atención","Es necesario seleccionar una operacion para poder agregar la refaccion a la tabla","Entendido");
        //alert("Es necesario seleccionar una operacion para poder agregar la refaccion a la tabla");
        return false;
    }
    
    //verificamos si la refaccion que quiere insertar no esta en la tabla
    //si ya esta, le mostramos un mensaje indicandolo
    var existe=false;
    $('#gridRefacciones tr').each(function() {
        var refaccion = $(this).attr("rel").valueOf();
        if(idRefaccion==refaccion){
            existe=true;
        }
    });
    
    //console.log("se va a insertar una refaccion al grid");
   // console.log(existe);
    //si existe, no la insertamos
    if(existe==false){
        //console.log("generando cadena");
        var co='';
        co+="<tr id='rengRefa"+idRefaccion+"' rel=\""+idRefaccion+"\" >";
        co+=" <td class='col-xs-7 valign' onClick=\"\">"+nombreRefaccion+"</td>";
        co+=" <td class='col-xs-2 text-center valign' onClick=\"\">"+cantidad+"</td>";
        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.cambiarRefaccion('"+idRefaccion+"','"+cantidad+"','"+tipo+"','"+nombreRefaccion+"');\" ><i class=\"fa fa-random fa-2x\">&nbsp;</i></td>";
        co+="</tr>";
        $("#gridRefacciones").append(co);
        //guardamos en localstorage el servicio agregado
        //almacenamiento.guardaServicio(idServicio,nombreServicio,precioServicio);
        
    }

}//function

var idRefaReng=0;
var idSist=0;
var idGene=0;
var idSubg=0;
var idRefa=0;
var idNomb="";
var idCant=0;
var idPrec=0;
operacion.cambiarRefaccion=function(idRe,cant,tipo,idNo){
    idNomb=idNo;
    //alert(idNomb);
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
    idRefaReng=idRe;
    idCant=cant;
    if(tipo==1){
        $.ajax({
            url:  dominioServicios+"obtener-sistema-genero-subgenero",
            type: 'POST',
            data: {
                idRefaccion: idRe
            },
            success: function(re){
                var indi=JSON.parse(re);
                idSist=indi["sistema"];
                idGene=indi["genero"];
                idSubg=indi["subgenero"];
                idRefa=indi["id"];
                idPrec=indi["precio"];
                operacion.dialogoRefaccionSistema();
            },
            error: function(re){
                alert("Error al comunicarse con servidor.");
            }
        });
    }else{
        idAnoo='';
        idMarc='';
        idMode='';
        idRefa='';
        operacion.dialogoRefaccionAno();
    }//if
}//function

var idAnoo='';
var idMarc='';
var idMode='';
operacion.dialogoRefaccionAno=function(){
    //alert("("+idMarc+","+idMode+")");
    var cont="<table><tr><td> <div class='col-xs-12 sinPaddingLateral'><div class='col-xs-5'>"
    +"  <select id='idAno' style='width:300px;' onChange=\"idMarc=''; idAnoo=this.value; operacion.obtenerMarcas();\"><option value='"+idAnoo+"'>Cargando...Año</option></select></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-5'><select id='idMarca'  style='width:300px;' onChange=\"idMode=''; idMarc=this.value; operacion.obtenerModelos();\"><option value='"+idMarc+"'>- Seleccione marca -</option></select></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-5'><select id='idModelo' style='width:300px;' onChange=\"idRefa=''; idMode=this.value; operacion.obtenerProductosAno();\"><option value='"+idMode+"'>- Seleccione modelo -</option></select></div></div>"
    +" <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-12'><input id='txtBuscarNpc' value='' style='width:300px;'><input type='button' value='Buscar' style='width:100px;' onClick='operacion.buscarNpc();'></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-12'><select id='idRefaccion' style='width:300px;' onChange=\"operacion.cambioRefaccion(this.value);\"><option value='"+idRefa+"'>- Seleccione refacción -</option></select>"
    +"<input type='text' id='idCantidad' onkeyup='operacion.cambioCantidad(this.value);' style='width:100px;' value='"+idCant+"'>"
    +"<input type='text' id='idPrecio' onkeyup='operacion.cambioPrecio(this.value);' style='width:100px;' value='"+idPrec+"' disabled></div></div> </td></tr></table>";
    myApp.modal({
    title: "Cambiar Refacción",
    text:  cont,
    buttons: [
      {
        text: "Guardar",
        onClick: function(){
            //if(idAnoo==""){
            //    alert("Tiene que seleccionar un año.");
            //    operacion.dialogoRefaccionAno();
            //}else if(idMarc==""){
            //    alert("Tiene que seleccionar un marca.");
            //    operacion.dialogoRefaccionAno();
            //}else if(idMode==""){
            //    alert("Tiene que seleccionar un modelo.");
            //    operacion.dialogoRefaccionAno();
            //}else
            if(idRefa==""){
                alert("Tiene que seleccionar una refacción.");
                operacion.dialogoRefaccionAno();
            }else if(idCant==""){
                alert("La cantidad es obligatorio");
                operacion.dialogoRefaccionAno();
            }else if(parseInt(idCant)==NaN){
                alert("La cantidad no es numerica");
                operacion.dialogoRefaccionAno();
            }else{
                operacion.guardarOperacionDesdeApp();
            }//if
        }
      },
      {
        text: "Cancelar",
        onClick: function(){
            //alert("Cancelar");
        }
      }
    ]
    });
    setTimeout("operacion.obtenerAnos();"+(idAnoo!=""?"operacion.obtenerMarcas();":"")+(idMarc!=""?"operacion.obtenerModelos();":"")+(idMode!=""?"operacion.obtenerProductosAno();":""),100);
}//function

operacion.obtenerAnos=function(){
    $.ajax({
		url:  dominioServicios+"obtener-anos",
		type: 'POST',
		data: {
		},
		success: function(re){
            if(re=='Error'){
                alert("Ocurrió un error al momento de consumir los servicios de http://app.ciosa.com/");
                $("#idAno").html("<option value=''>- Error en servicios -</option>");
            }else{
                $("#idAno").html(re);
                $("#idAno").val(idAnoo);
            }//if
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerMarcas=function(){
    //alert("obtener-marcas/idAno/"+idAnoo);
    $("#idMarca").html("<option val=''>Cargando...Marca</option>");
    $.ajax({
		url:  dominioServicios+"obtener-marcas/idAno/"+idAnoo,
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idMarca").html(re);
            $("#idMarca").val(idMarc);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerModelos=function(){
    //alert("obtener-modelos/idAno/"+idAnoo+"/idMarca/"+idMarc);
    $("#idModelo").html("<option val=''>Cargando...Modelo</option>");
    $.ajax({
		url:  dominioServicios+"obtener-modelos/idAno/"+idAnoo+"/idMarca/"+idMarc,
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idModelo").html(re);
            $("#idModelo").val(idMode);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerProductosAno=function(){
    $("#idRefaccion").html("<option val=''>Cargando...Refacción</option>");
    //alert("obtener-refacciones/idAno/"+idAnoo+"/idMarca/"+idMarc+"/idModelo/"+idMode);
    $.ajax({
		url:  dominioServicios+"obtener-refacciones2/idAno/"+idAnoo+"/idMarca/"+idMarc+"/idModelo/"+idMode,
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idRefaccion").html(re);
            $("#idRefaccion").val(idRefa);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.guardarOperacionDesdeApp=function(){
    var refaTemp=almacenamiento.obtenerRefaccion(idRefaReng);
    //alert(refaTemp.idOperacion+","+idCant+","+idNomb+","+idPrec+","+refaTemp.tipo+","+idRefa);
    $.ajax({
        url:  dominioServicios+"guardar-refaccion-desde-app2",
        type: 'POST',
        data:	{
            'idOperacion': refaTemp.idOperacion,
            'cantidad':    idCant,
            'nombre':      idNomb,
            'precio':      idPrec,
            'tipo':        refaTemp.tipo,
            'idRefaccionOriginal': idRefa
        },
        success:	function(re){
            if(almacenamiento.obtenerRefaccion(re)!=undefined && idRefaReng==re || almacenamiento.obtenerRefaccion(re)==undefined){
                var co=" <td class='col-xs-7 valign' onClick=\"\">"+idNomb+"</td>";
                co+=" <td class='col-xs-2 text-center valign' onClick=\"\">"+idCant+"</td>";
                co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.cambiarRefaccion('"+re+"','"+idCant+"','"+refaTemp.tipo+"','"+idNomb+"');\" ><i class=\"fa fa-random fa-2x\">&nbsp;</i></td>";
                $("#rengRefa"+idRefaReng).html(co);
                $("#rengRefa"+idRefaReng).attr('id',"rengRefa"+re);
                almacenamiento.eliminaUnaRefaccion(idRefaReng);
                almacenamiento.guardarRefaccion(refaTemp.idOperacion,re,idNomb,idCant,idPrec,refaTemp.tipo,refaTemp.idServicio);
                almacenamiento.actualizaPrecioDeServicios();
                operacion.actualizaPrecioDeServicios();
            }else{
                alert("La refaccion ya existe para esta Orden, seleccione otra");
                operacion.dialogoRefaccionSistema();
            }//if
        },
        error: function(re){
            alert("Error al comunicarse con servidor.");
        }
    });
}//function

operacion.actualizaPrecioDeServicios=function(){
    ///alert("tres");
    var serv=almacenamiento.dameServicios();
    for(var i=0; i<=serv.length-1; i++){
        $('#gridServicios tr').each(function() {
            /*
            if($(this).attr("rel").valueOf()==idSeleServ){
                alert("Es igual");
                $(this).css('background-color','#FF0000');
            }else{
                alert("No es igual");
                $(this).css('background-color','#FFFFFF');
            }//if
            */
            if(serv[i].id==$(this).attr("rel").valueOf()){
                $(this).find("td:eq(1)").html("$"+(parseFloat(serv[i].precio)+parseFloat(serv[i].precioManoObra)).toFixed(2));
                //alert("$"+(parseFloat(serv[i].precio)+parseFloat(serv[i].precioManoObra)).toFixed(2));
            }//if
        });
    }//for
}//function

operacion.buscarNpc=function(){
    //alert("Buscar npc");
    $("#idRefaccion").html("<option val=''>Cargando... refacción</option>");
    $.ajax({
        url:  dominioServicios+"buscar-refaccion-por-npc2/npc/"+$("#txtBuscarNpc").val(),
        type: 'POST',
        data:	{
        },
        success:	function(re){
            //alert(re);
            $("#idRefaccion").html(re);
            idRefa=$("#idRefaccion").val();
            operacion.cambioRefaccion(idRefa);
        },
        error: function(re){
            alert("Error al comunicarse con servidor.");
        }
    });
}//buscarNpc

operacion.dialogoRefaccionSistema=function(){
    var cont="<table><tr><td> <div class='col-xs-12 sinPaddingLateral'><div class='col-xs-5'>"
    +"  <select id='idSistema' style='width:300px;' onChange=\"idGene=''; operacion.obtenerGeneros();\"><option value='"+idSist+"'>Cargando...Sistema</option></select></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-5'><select id='idGenero'  style='width:300px;' onChange=\"idSubg=''; operacion.obtenerSubgeneros();\"><option value='"+idGene+"'>Cargando...Genero</option></select></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-5'><select id='idSubgenero' style='width:300px;' onChange=\"idRefa=''; operacion.obtenerProductos();\"><option value='"+idSubg+"'>Cargando...Subgenero</option></select></div></div>"
    +" <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-12'><input id='txtBuscarNpc' value='' style='width:300px;'><input type='button' value='Buscar' style='width:100px;' onClick='operacion.buscarNpc();'></div></div>"
    +"  <div class='col-xs-12 paddingTop5px sinPaddingLateral'><div class='col-xs-12'><select id='idRefaccion' style='width:300px;' onChange=\"operacion.cambioRefaccion(this.value);\"><option value='"+idRefa+"'>Cargando...Refacción</option></select>"
    +"<input type='text' id='idCantidad' onkeyup='operacion.cambioCantidad(this.value);' style='width:100px;' value='"+idCant+"'>"
    +"<input type='text' id='idPrecio' onkeyup='operacion.cambioPrecio(this.value);' style='width:100px;' value='"+idPrec+"' disabled></div></div> </td></tr></table>";
    myApp.modal({
        title: "Cambiar Refacción",
        text:  cont,
        buttons: [
          {
            text: "Guardar",
            onClick: function(){
                //if(idSist==""){
                //    alert("Tiene que seleccionar un sistema.");
                //    operacion.dialogoRefaccionSistema();
                //}else if(idGene==""){
                //    alert("Tiene que seleccionar un genero.");
                //    operacion.dialogoRefaccionSistema();
                //}else if(idSubg==""){
                //    alert("Tiene que seleccionar un subgenero.");
                //    operacion.dialogoRefaccionSistema();
                //}else
                if(idRefa==""){
                    alert("Tiene que seleccionar una refacción.");
                    operacion.dialogoRefaccionSistema();
                }else if(idCant==""){
                    alert("La cantidad es obligatorio");
                    operacion.dialogoRefaccionSistema();
                }else if(parseInt(idCant)==NaN){
                    alert("La cantidad no es numerica");
                    operacion.dialogoRefaccionSistema();
                }else{
                    operacion.guardarOperacionDesdeApp();
                }//if
            }//function
          },
          {
            text: "Cancelar",
            onClick: function(){
                //alert("Cancelar");
            }//function
          }
        ]
    })
    setTimeout("operacion.obtenerSistemas(); operacion.obtenerGeneros(); operacion.obtenerSubgeneros(); operacion.obtenerProductos();",100);
}//function

operacion.obtenerSistemas=function(){
    $.ajax({
		url:  dominioServicios+"obtener-sistemas",
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idSistema").html(re);
            $("#idSistema").val(idSist);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerGeneros=function(){
    idSist=$("#idSistema").val();
    $.ajax({
		url:  dominioServicios+"obtener-generos/idSistema/"+$("#idSistema").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idGenero").html(re);
            $("#idGenero").val(idGene);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerSubgeneros=function(){
    idGene=$("#idGenero").val();
    $.ajax({
		url:  dominioServicios+"obtener-subgeneros/idGenero/"+$("#idGenero").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idSubgenero").html(re);
            $("#idSubgenero").val(idSubg);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function

operacion.obtenerProductos=function(){
    idSubg=$("#idSubgenero").val();
    $.ajax({
		url:  dominioServicios+"obtener-productos2/idSubgenero/"+$("#idSubgenero").val(),
		type: 'POST',
		data: {
		},
		success: function(re){
            $("#idRefaccion").html(re);
            $("#idRefaccion").val(idRefa);
            operacion.cambioRefaccion(idRefa);
        },
		error: function(re){
			alert("Error al comunicarse con servidor.");
		}
	});
}//function
operacion.cambioRefaccion=function(idRe){
    //alert(idRe);
    idRefa=idRe;
    idPrec=$("#idRefaccion option:selected").attr('rel');
    idNomb=$("#idRefaccion option:selected").text();
    $("#idPrecio").val(idPrec);
}//function
operacion.cambioCantidad=function(idCa){
    idCant=idCa;
}//function
operacion.cambioPrecio=function(idPr){
    idPrec=idPr;
}//function

operacion.cargarAreasOportunidad=function(){
     var clav=clave();
        $.ajax({
            url:      dominio+"dame-area-oportunidad",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idAutomovil: almacenamiento.dameAutomovil().id
            },
            processData:true,
            success:	function(re){
                console.log("areas de oportunidad: ");
                
                //si no hay areas de oportunidad deshabilitamos el boton de recomendar
                if(re.length<=0){
                    $("#btnRecomendar").addClass("hidden");   
                }
                
                //almacenamiento.vaciarAreasOportunidad();
                $.each(re, function(index, item){
                    console.log(item);
                        //obtenemos los datos de la area
                        var idAreaOportunidad = item.idAreaOportunidad;
                        var areaOportunidad = item.areaOportunidad;
                        var idTipo = item.idTipo;
                        var idServicio = item.idServicio;
                        var estatus = item.estatus;
                        var tipo = item.tipo;
                        var servicio = item.servicio;
                        var totalRefacciones = item.totalRefacciones;
                        var idCalificacion = item.idCalificacion;
                        var calificacion = item.calificacion;
                        var fecha = item.fecha;
                        var idOrdenServicioAreaOportunidad = item.idOrdenServicioAreaOportunidad;
                        console.log("idOrdenServicioAreaOportunidad: "+idOrdenServicioAreaOportunidad);
                      
                        
                         var existe=false;
                        $('#gridAreasOportunidad tr').each(function() {
                             if(idAreaOportunidad==$(this).attr("rel").valueOf()){
                               existe = true;
                            }
                        });
                        //console.log(item);
                        if(existe==false){
                             //gguardamos las areas de oportunidad
                            almacenamiento.guardarAreasOportunidad(idAreaOportunidad,areaOportunidad,idTipo,idServicio,estatus,tipo,servicio,totalRefacciones,idCalificacion,calificacion,fecha,idOrdenServicioAreaOportunidad);   
                            var poder_recomendar
                            var co='';
                                co+='<tr rel="'+idAreaOportunidad+'" onclick="operacion.seleccionarAreaOportunidad(\''+idAreaOportunidad+'\')" servicio_asociado="'+idServicio+'" original="'+idCalificacion+'">';
                                 co+='<td class="col-xs-5 valign">'+areaOportunidad+'</td>';
                                 if(idCalificacion =='BIE'){
                                     co+='<td class="col-xs-1 valign text-center"><div class="circle"><i class="btn fa fa-check color-success">&nbsp;</i></div></td>';
                                 }else if(idCalificacion =='MED'){
                                     co+='<td class="col-xs-1 valign text-center"><div class="circle"><i class="btn fa fa-exclamation-triangle color-warning">&nbsp;</i></div></td>';
                                 }else if(idCalificacion =='MAL'){
                                     co+='<td class="col-xs-1 valign text-center"><div class="circle"><i class="btn fa fa-times color-danger">&nbsp;</i></div></td>';
                                 }
                                 
                                 co+='<td class="col-xs-3 valign text-center">'+fecha+'</td>';
                                 co+='<td class="col-xs-3 valigntext-center">$ '+totalRefacciones+'</td>';
                                co+='</tr>';
                                $("#gridAreasOportunidad").append(co);
                        }
                
                });
                
                //recorar areas de opoortunidad
                areas = almacenamiento.dameAreasOportunidad();
                 $.each(areas, function(ai, aitem){
                        $('#gridAreasOportunidad tr').each(function() {
                             if(aitem.idAreaOportunidad==$(this).attr("rel").valueOf()){
                                 if(aitem.idCalificacion=='BIE'){
                                     $(this).find(' td:eq(1)').html('<div class="circle"><i class="btn fa fa-check color-success">&nbsp;</i></div>');
                                 }else if(aitem.idCalificacion=='MAL'){
                                     $(this).find(' td:eq(1)').html('<div class="circle"><i class="btn fa fa-times color-danger">&nbsp;</i></div>');
                                 }else if(aitem.idCalificacion=='MED'){
                                     $(this).find(' td:eq(1)').html('<div class="circle"><i class="btn fa fa-exclamation-triangle color-warning">&nbsp;</i></div>');
                                 }
                                
                            }
                        });
                });
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información de las áreas de oportunidad.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
}

operacion.obtenerPrecioServicio=function(idServicio){
    //obtenemos las operaciones del servicio seleccionado
        var clav=clave();
        $.ajax({
            url:      dominio+"total-refacciones-servicio",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idServicio: idServicio
            },
            processData:true,
            success:	function(re){
                var total = parseFloat(re[0].totalRefacciones);
                return total;
                
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener el precio del servicio.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
}//function

operacion.seleccionarAreaOportunidad=function(idAreaOportunidad){
    operacion.marcarSeleccion("gridAreasOportunidad",idAreaOportunidad);
    //console.log(idAreaOportunidad+':'+areaOportunidad+':'+idTipo+':'+idServicio+':'+estatus+':'+tipo+':'+servicio+':'+totalRefacciones);
     //obtenemos la area de opportunidad
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-area",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idAreaOportunidad: idAreaOportunidad
            },
            processData:true,
            success:	function(re){
                
                console.log("Servidor responde: ");
                console.log(re);
                almacenamiento.areaOportunidadSeleccionada(idAreaOportunidad);
               
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información del área de oportunidad.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
}
operacion.convertirArea=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
    var areaSeleccionada = almacenamiento.dameAreaOportunidadSeleccionada();
        if(areaSeleccionada!=null && areaSeleccionada!=undefined){
            if(parseInt(areaSeleccionada[0].idServicio)>0){
                    if(areaSeleccionada[0].idCalificacion!='Bie'){
                       var clav=clave();
                        $.ajax({
                            url:      dominio+"dame-servicio",
                            type:     'POST',
                            dataType: "json",
                            data:	{
                                clave:       clav,
                                codigo:      sha1(clav+palaSecr),
                                idServicio: areaSeleccionada[0].idServicio
                            },
                            processData:true,
                            success:	function(re){
                                console.log("convertir area en servicio: ");
                                
                               
                                var idServicio = re[0].id;
                                var precioServicio = re[0].totalRefacciones;
                                var precioManoObra = re[0].manoDeObra*re[0].unidades;
                                var nombreServicio = re[0].servicio;
                                console.log("Servidor responde: ");
                                console.log(re);
                                //seleccionamos el servicio
                                var existe=false;
                                $('#gridServicios tr').each(function() {
                                   
                                    var servicio = $(this).attr("rel").valueOf();
                                     //console.log(servicio+":"+idServicio);
                                    if(idServicio==servicio){
                                            existe=true;
                                    }
                                });
                                //si existe, mandamos mensaje
                                if(existe){
                                    _mensaje("Atención","El servicio <strong>"+nombreServicio+" </strong> ya se encuentra en la lista.","Entendido");
                                        //alert("El servicio <strong>"+nombreServicio+" </strong> ya se encuentra en la lista.");
                                }else{//si no existe insertamos el nuevo row
                                    console.log(parseInt(precioServicio));
                                    var co='';
                                        co+="<tr rel=\""+idServicio+"\" >";
                                        co+=" <td class='col-xs-7 valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">"+nombreServicio+"</td>";
                                        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.seleccionoServicio('"+idServicio+"');\">$"+((parseFloat(precioServicio)+parseFloat(precioManoObra)).toFixed(2))+"</td>";
                                        co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaServicio('"+idServicio+"');\" ><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                        co+="</tr>";
                                        $("#gridServicios").append(co);
                                        //guardamos en localstorage el servicio agregado
                                        almacenamiento.guardaServicio(idServicio,nombreServicio,precioServicio,precioManoObra);
                                    console.log(parseInt(precioServicio));
                                        //obtengo las opoeraciones del servicio
                                        var clav=clave();
                                        $.ajax({
                                            url:      dominio+"dame-operaciones",
                                            type:     'POST',
                                            dataType: "json",
                                            data:	{
                                                clave:       clav,
                                                codigo:      sha1(clav+palaSecr),
                                                idServicio: idServicio
                                            },
                                            processData:true,
                                            success:	function(res){
                                                console.log("Servidor responde: ");
                                                console.log(res);
                                                if(re.length!=0 && re[0].error==""){// a veces el servicio no retorna operaciones
                                                    //recorremos las operaciones para almacenarlas
                                                    $.each(res, function(index, item) {
                                                       //obtenemos los datos de la operacion en curso
                                                        var idOperacion = item.id;
                                                        var nombreOperacion = (item.opcional==1 ?"(Opcional) "+item.operacion:item.operacion);
                                                        var opcional = item.opcional;

                                                        var co='';
                                                                co+="<tr rel=\""+idOperacion+"\" >";
                                                                co+=" <td class='col-xs-7 valign' onClick=\"operacion.cargaRefaccionesPorOperacion('"+idOperacion+"','"+idServicio+"','1');\">"+nombreOperacion+"</td>";
                                                                if(item.opcional=='1'){
                                                                    co+=" <td class='col-xs-2 text-center valign' onClick=\"operacion.eliminaOperacion('"+idOperacion+"','"+idServicio+"');\"><i class=\"fa fa-times fa-2x\">&nbsp;</i></td>";
                                                                }else{
                                                                    co+=" <td class='col-xs-2 text-center valign'></td>";
                                                                }
                                                                co+="</tr>";
                                                        $("#gridOperaciones").append(co);
                                                        almacenamiento.guardarOperacion(idOperacion,nombreOperacion,opcional,idServicio);
                                                        //cargamos en local storage las refacciones de todas las operaciones
                                                        // esto nos servira para que al momento de eliminar la operacion se sepa que refacciones se eliminan
                                                        //y con esto actualizar los costos del servicio
                                                        operacion.cargaRefaccionesPorOperacion(idOperacion,idServicio,'',1);
                                                    });
                                                    console.log(parseInt(precioServicio));
                                                }
                                            },
                                            error: function(res){
                                                _mensaje("Atención","No hay internet, no se pudo obtener la información.","Entendido");
                                                //alert("No hay internet, no se pudo obtener información del vehículo.");
                                                callbackError();
                                            }
                                        });
                                        operacion.seleccionoServicio(idServicio);
                                        almacenamiento.actualizarAreaOportunidad(areaSeleccionada[0].idAreaOportunidad);
                                     
                                }

                            },
                            error: function(re){
                                
                                _mensaje("Atención","No hay internet, no se pudo convertir el área de oportunidad en un servicio.","Entendido");
                                //alert("No hay internet, no se pudo obtener información del vehículo.");
                                callbackError();
                            }
                        });
                    }else{
                        
                        _mensaje("Atención","El Área de oportunidad seleccionada se ecuentra en optimas condiciones.","Entendido");
                       //alert("El Área de oportunidad seleccionada se ecuentra en optimas condiciones."); 
                    }
                }else{
                
                _mensaje("Atención","El Área de oportunidad seleccionada no tiene un servicio ligado.","Entendido");
                //alert("El Área de oportunidad seleccionada no tiene un servicio ligado.");
            }
        }else{
                
         _mensaje("Atención","Es necesario seleccionar un Area de oportunidad.","Entendido");
                //alert("El Área de oportunidad seleccionada no tiene un servicio ligado.");
        }
}

operacion.cargarCategorias=function(){
    //obtenemos el usuario de localstorage
    usuarioFirmado = almacenamiento.dameUsuario();
    //obtenemos las categorias a las que tiene permiso
    //si es administrador obtenemos todas las categorias
    //si no es admin verificamos la sucursal del usuario y solo obtenemos sus categorias
    var admin = usuarioFirmado.administrador==1?'':usuarioFirmado.idSucursal;
    //alert("cargarCate");
        var clav=clave();
        $.ajax({
            url:      dominio+"dame-categorias",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idSucursal: admin
            },
            processData:true,
            success:	function(re){
                //alert("cargarCatesss");
                console.log("Servidor responde: ");
                console.log(re);
                $("#categoria").html('');
                 $("#categoria").append('<option value="" >- Seleccione una categoria -</option>');
                //recorremos los servicios y los insertamos al select
                $.each(re, function(index, item) {
                    //console.log('<option value="'+item.idCategoria+'" rel="'+item.idCategoria+'">'+item.categoria+'</option>');
                   $("#categoria").append('<option value="'+item.idCategoria+'" rel="'+item.idCategoria+'" >'+item.categoria+'</option>');
                });
                
               
            },
            error: function(re){
                
                _mensaje("Atención","No hay internet, no se pudo obtener información de las categorías.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
        
    
    
}
operacion.buscarTalleres=function(){
    var idCategoria = $("#categoria").val();
    //console.log(idCategoria);
   if(idCategoria!=''){
        var clav=clave();
        $.ajax({
            url:      dominio+"dame-talleres",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idCategoria: idCategoria
            },
            processData:true,
            success:	function(re){
                
                console.log("Servidor responde: ");
                console.log(re);
                $("#taller").html('');
                 $("#taller").append('<option value="" >- Seleccione un Taller -</option>');
                //recorremos los servicios y los insertamos al select
                $.each(re, function(index, item) {
                    //console.log('<option value="'+item.idTaller+'" rel="'+item.idTaller+'">'+item.taller+'</option>');
                   $("#taller").append('<option value="'+item.idTaller+'" rel="'+item.idTaller+'" >'+item.taller+'</option>');
                });
                
               
            },
            error: function(re){
               
                _mensaje("Atención","No hay internet, no se pudo obtener los talleres.","Entendido");
                //alert("No hay internet, no se pudo obtener información del vehículo.");
                callbackError();
            }
        });
   }else{
         $("#taller").html('<option value="" >- Seleccione un Taller -</option>');
   }
}

operacion.crearRecomendacion=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
   //asignamos el nombre de la area de opoertunidad
    var area = almacenamiento.dameAreaOportunidadSeleccionada();
    //revisamos si la calificacion es diferente de BIE
    console.log("areas ");
    console.log(area);
    if(area!=undefined && area!=null){
        if(area[0].idCalificacion!='BIE'){
            console.log("area seleccionaa: "+area[0].areaOportunidad);
             $("#area_recomendacion").val(area[0].areaOportunidad);
        }else{

             _mensaje("Atención","Al Área de oportunidad seleccionada no se le pueden hacer recomendaciones.","Entendido");
            //alert("Al Área de oportunidad seleccionada no se le pueden hacer recomendaciones.");
        }
    }else{
        _mensaje("Atención","Es necesario que tenga un area seleccionada.","Entendido");
    }
    
}

operacion.recomendar=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }
//Folio,Fecha,Usuario,Cliente,Placas,Categoría,Taller,Recomendación
    //obtenemos los datos del automovil,usuario,folio y del propietario
    var u = almacenamiento.dameUsuario();
    var a = almacenamiento.dameAutomovil();
    var p = almacenamiento.damePropietario();
    var f = almacenamiento.dameFolioActivo();
    var ao = almacenamiento.dameAreaOportunidadSeleccionada();
    //obtenemos los datos del formulario de recomendacion
    var categoria=$("#categoria option:selected").text();
    var idCategoria=$("#categoria").val();
    var taller=$("#taller option:selected").text();
    var idTaller =$("#taller").val();
    var areaRecomendacion =$("#area_recomendacion").val();
    var folio=f.id;
    var usuarioFirmado=u.id;
    var propietario =p.id;
    var placas =a.placas;
    var recomendacion = $.trim($("#recomendacion").val());
    //console.log("recomendacion lenth: "+recomendacion.length);
    //console.log("recomendacion: "+recomendacion);
    if(idCategoria==''){
        _mensaje("Atención","Es necesario que seleccione una Categoría","Entendido");
        //alert("Es necesario que seleccione una Categoría");
    }else if(idTaller==''){
        _mensaje("Atención","Es necesario que seleccione un Taller","Entendido");
        //alert("Es necesario que seleccione un Taller");
    }else if(areaRecomendacion==''){
        _mensaje("Atención","Es necesario que seleccione un Área de oportunidad y presione la direccional hacia abajo para asignarla al formulario","Entendido");
        //alert("Es necesario que seleccione un Área de oportunidad y presione la direccional hacia abajo para asignarla al formulario");
    }else if(recomendacion==''){
        _mensaje("Atención","Ingrese su recomendación","Entendido");
        //alert("Ingrese su recomendación");
    }else{
       
        console.log(JSON.stringify(ao[0].idOrdenServicioAreaOportunidad));
        almacenamiento.guardarRecomendacion(categoria,idCategoria,taller,idTaller,folio,usuarioFirmado,propietario,placas,recomendacion,ao[0].idOrdenServicioAreaOportunidad);
        $("#categoria").val('');
        $("#taller").val('');
        $("#area_recomendacion").val('');
        $("#recomendacion").val('');
        almacenamiento.actualizarAreaOportunidad(ao[0].idAreaOportunidad);
        
    }
    
    
}

operacion.btnGuardar=function(){
    
}
operacion.btnLimpiar=function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1){
        almacenamiento.salirModoConsulta();
        window.location = 'inicio.html';
    }else{
        _confirmarAntesDeEliminar();
    }
}
operacion.btnImprimir=function(){
    
}
operacion.reestablecerAreaOportunidad=function(idServicio){
    $('#gridAreasOportunidad tr').each(function() {
         var servicio_asociado = $(this).attr("servicio_asociado").valueOf();
         var calificacion_original = $(this).attr("original").valueOf();
         var idAreaOportunidad = $(this).attr("rel").valueOf();
         var calificacion ="";
        if(idServicio==servicio_asociado){
            if(calificacion_original =='BIE'){
                calificacion="Bien";
                $(this).find('td:eq(1)').html('<div class="circle"><i class="btn fa fa-check color-success">&nbsp;</i></div>');
                //co+='<td class="col-xs-1 valign text-center"></td>';
            }else if(calificacion_original =='MED'){
                calificacion="Medio";
                $(this).find('td:eq(1)').html('<div class="circle"><i class="btn fa fa-exclamation-triangle color-warning">&nbsp;</i></div>');
                //co+='<td class="col-xs-1 valign text-center"></td>';
            }else if(calificacion_original =='MAL'){
                calificacion="Mal";
                $(this).find('td:eq(1)').html('<div class="circle"><i class="btn fa fa-times color-danger">&nbsp;</i></div>');
                //co+='<td class="col-xs-1 valign text-center"></td>';
            }
            almacenamiento.setearAreaOportunidad(idAreaOportunidad,calificacion_original,calificacion);
        }
    });
    
}