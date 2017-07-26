almacenamiento={};
almacenamiento.limpiarTodo=function(){
    try{
       localStorage.clear();
        return true;
    }catch(error){
        return false;
    }//try
};
almacenamiento.guardarObservaciones=function(txt){
    localStorage.setItem("observaciones",txt);
}//function

almacenamiento.dameObservaciones=function(){
    var observaciones=localStorage.getItem("observaciones");
    if(observaciones!=null){
        var expr=new RegExp('\n','g');
        var exp2=new RegExp('\r','g');
        eval("observaciones='"+observaciones.replace(expr,"\\n").replace(exp2,"")+"';");
        return observaciones;
    }//if
    return null;
}//function

almacenamiento.modoConsulta=function(btnConsulta){
    almacenamiento.vaciarOperaciones();
    almacenamiento.vaciarRefacciones();
    if(almacenamiento.dameEstatusModoConsulta().status=='1'){
        almacenamiento.salirModoConsulta();
        almacenamiento.limpiaIdOrden();
        window.location = 'inicio.html';
    }else{
        $(btnConsulta).html("<i class='fa fa-exchange'></i>&nbsp;Capturar");
        folio = almacenamiento.dameFolioActivo();
        if(folio!=undefined){
            if(folio.id!=undefined && folio.id!=''){
                localStorage.setItem("modoConsulta",JSON.stringify({status:'1'}));
                $("#ModoActivo").html('Consulta');
                //$('.date').datetimepicker('hide');
                //$('.date').datetimepicker('remove');
                $(".calendario").removeClass('date');
                inicio.revisarSeleccion=false;
                $("#rengAuto"+folio.id).trigger("click");
                
                almacenamiento.actualizarIdOrden(inicio.seleAutoIdOrdenReal,inicio.seleAutoIdEstatus);
                $("#folio").val(inicio.seleAutoIdOrden);
                $("#ingreso").val(inicio.seleAutoFingreso);
                var fech=inicio.seleAutoFentrega.split(" ");
                $("#entrega").val(fech[0]);
                $("#entregaTiempo").val(fech[1]);
                $("#noBahia").val(inicio.seleAutoNoBahia).change();
                
                //alert(almacenamiento.dameIdOrden()["idEstatus"]);
                if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                    $("#noBahia").removeAttr('disabled');
                else
                    $("#noBahia").attr('disabled',"disabled");
                
                almacenamiento.actualizarFechaPromesa(inicio.seleAutoFentrega);
            }else{
                 _mensaje("Selección de una orden de servicio.","Debe seleccionar una orden de servicio antes de entrar al modo consulta.","Entendido");
            }
        }else{
            _mensaje("Selección de una orden de servicio.","Debe seleccionar una orden de servicio antes de entrar al modo consulta.","Entendido");
        }
    }
    
     
}
almacenamiento.salirModoConsulta=function(){
    //vaciamos todo de localstorage menos al usuario firmado
    $.each(localStorage, function(item, valores){
        if(item!='usuario'){
            localStorage.removeItem(item);
        }
    });
    //seteamos el modo consulta a cero
    localStorage.setItem("modoConsulta",JSON.stringify({status:'0'}));
    $("#ModoActivo").html('Captura');
    
    
    $(".calendario").addClass('date');
    $("#noBahia").removeAttr('disabled');
    
    
}
almacenamiento.dameEstatusModoConsulta=function(){
     var modoConsulta=localStorage.getItem("modoConsulta");
    if(modoConsulta!=null){
        eval("modoConsulta="+modoConsulta+";");
        return modoConsulta;
    }//if
    return null;    
}
almacenamiento.loguear=function(id, nombre, idSucursal, email,administrador,noBahia,sucursal){
    localStorage.setItem("usuario",JSON.stringify({id:id,nombre:nombre,idSucursal:idSucursal,email:email,administrador:administrador,noBahia:noBahia,sucursal:sucursal}));
}//function

almacenamiento.dameUsuario=function(){
    var usuario=localStorage.getItem("usuario");
    if(usuario!=null){
        eval("usuario="+usuario+";");
        return usuario;
    }//if
    return null;
}//function

almacenamiento.tomaAutomovil=function(id, idPropietario, placas, noSerie, idAnoRiqs, ano, idMarcaRiqs, marca, kilometraje, idModeloRiqs, modelo, idMotorRiqs, motor){
    localStorage.setItem("automovil", JSON.stringify({id:id,
        idPropietario: idPropietario,
        placas: placas,
        noSerie: noSerie,
        idAnoRiqs: idAnoRiqs,
        ano: ano,
        idMarcaRiqs: idMarcaRiqs,
        marca: marca,
        kilometraje: kilometraje,
        idModeloRiqs: idModeloRiqs,
        modelo: modelo,
        idMotorRiqs: idMotorRiqs,
        motor: motor
    }));
}//function

almacenamiento.tomaIdAutomovil=function(id){
    var automovil=localStorage.getItem("automovil");
    if(automovil!=null){
        eval("automovil="+automovil+";");
        automovil["id"]=id;
        localStorage.setItem("automovil", JSON.stringify(automovil));
    }//if
}//function

almacenamiento.tomaIdPropietario=function(id){
    var propietario=localStorage.getItem("propietario");
    console.log(propietario);
    if(propietario!=null){
        eval("propietario="+propietario+";");
        propietario["id"]=id;
        localStorage.setItem("propietario", JSON.stringify(propietario));
        console.log(JSON.stringify(propietario));
    }//if
}//function

almacenamiento.dameAutomovil=function(){
    var automovil=localStorage.getItem("automovil");
    if(automovil!=null){
        eval("automovil="+automovil+";");
        return automovil;
    }//if
    return null;
}//function

almacenamiento.tomaPropietario=function(id, idPersonaTipo, personaTipo, rfc, nombre, domicilio, codigoPostal, idEstado, estado, idMunicipio, municipio, idCiudad, ciudad, idTelefonoTipo1, telefonoTipo1, lada1, telefono1, extension1, idTelefonoTipo2, telefonoTipo2, lada2, telefono2, extension2, email){
    localStorage.setItem("propietario", JSON.stringify({
        id:id,
        idPersonaTipo:idPersonaTipo, 
        personaTipo:personaTipo, 
        rfc:rfc, 
        nombre:nombre, 
        domicilio:domicilio, 
        codigoPostal:codigoPostal, 
        idEstado:idEstado, 
        estado:estado, 
        idMunicipio:idMunicipio, 
        municipio:municipio, 
        idCiudad:idCiudad, 
        ciudad:ciudad, 
        idTelefonoTipo1:idTelefonoTipo1, 
        telefonoTipo1:telefonoTipo1, 
        lada1:lada1, 
        telefono1:telefono1, 
        extension1:extension1, 
        idTelefonoTipo2:idTelefonoTipo2, 
        telefonoTipo2:telefonoTipo2, 
        lada2:lada2, 
        telefono2:telefono2, 
        extension2:extension2, 
        email:email
    }));
}//function
almacenamiento.limpiaPropietario=function(){
    var propietario=localStorage.removeItem("propietario");
    return null;
}//function
almacenamiento.limpiaAuto=function(){
    var propietario=localStorage.removeItem("automovil");
    return null;
}//function
almacenamiento.vaciarAreaSeleccionada=function(){
    var areaOportunidadSeleccionada=localStorage.removeItem("areaOportunidadSeleccionada");
    return null;
}//function
almacenamiento.vaciarServicioSeleccionado=function(){
    var servicioSeleccionado=localStorage.removeItem("servicioSeleccionado");
    return null;
}//function
almacenamiento.damePropietario=function(){
    var propietario=localStorage.getItem("propietario");
    if(propietario!=null){
        eval("propietario="+propietario+";");
        return propietario;
    }//if
    return null;
}//function

almacenamiento.guardaFolioActivo=function(id){
    localStorage.setItem("folio", JSON.stringify({
        id:id
    }));
}//function
almacenamiento.limpiaFolioActivo=function(){
    var folio=localStorage.removeItem("folio");
    return null;
}//function
almacenamiento.dameFolioActivo=function(){
    var folio=localStorage.getItem("folio");
    if(folio!=null){
        eval("folio="+folio+";");
        return folio;
    }//if
    return null;
}//function

almacenamiento.actualizarBahia=function(bahia){
    localStorage.setItem("bahia", JSON.stringify({
        bahia:bahia
    }));
}//function

almacenamiento.actualizarIdOrden=function(idOrden,idEstatus){
    localStorage.setItem("idOrden", JSON.stringify({
        idOrden:  idOrden,
        idEstatus:idEstatus
    }));
}//function

almacenamiento.cargoOperacion=function(status){
    localStorage.setItem("cargoOperacion", status+"");
}//function
almacenamiento.consultaCargoOperacion=function(){
    var temp=localStorage.getItem("cargoOperacion");
    if(temp==null)
        return "0";
    return temp;
}//function
almacenamiento.cargoInspeccion=function(status){
    localStorage.setItem("cargoInspeccion", status+"");
}//function
almacenamiento.consultaCargoInspeccion=function(){
    var temp=localStorage.getItem("cargoInspeccion");
    if(temp==null)
        return "0";
    return temp;
}//function
almacenamiento.cargoInventario=function(status){
    localStorage.setItem("cargoInventario", status+"");
}//function
almacenamiento.consultaCargoInventario=function(){
    var temp=localStorage.getItem("cargoInventario");
    if(temp==null)
        return "0";
    return temp;
}//function

almacenamiento.serviciosEliminados=function(idServicio){
    if(idServicio==null)
        return false;
    var temp=localStorage.getItem("serviciosEliminados");
    temp=temp==null ? new Array() : JSON.parse(temp);
    temp[temp.length]=idServicio;
    localStorage.setItem("serviciosEliminados", JSON.stringify(temp));
}//function
almacenamiento.operacionesEliminadas=function(idOperacion){
    if(idOperacion==null)
        return false;
    var temp=localStorage.getItem("operacionesEliminadas");
    temp=temp==null ? new Array() : JSON.parse(temp);
    temp[temp.length]=idOperacion;
    localStorage.setItem("operacionesEliminadas", JSON.stringify(temp));
}//function
almacenamiento.refaccionesEliminadas=function(idRefaccion){
    if(idRefaccion==null)
        return false;
    var temp=localStorage.getItem("refaccionesEliminadas");
    temp=temp==null ? new Array() : JSON.parse(temp);
    temp[temp.length]=idRefaccion;
    localStorage.setItem("refaccionesEliminadas", JSON.stringify(temp));
}//function

almacenamiento.dameServiciosEliminados=function(){
    var temp=localStorage.getItem("serviciosEliminados");
    return temp==null ? new Array() : JSON.parse(temp);
}//function
almacenamiento.dameOperacionesEliminadas=function(){
    var temp=localStorage.getItem("operacionesEliminadas");
    return temp==null ? new Array() : JSON.parse(temp);
}//function
almacenamiento.dameRefaccionesEliminadas=function(){
    var temp=localStorage.getItem("refaccionesEliminadas");
    return temp==null ? new Array() : JSON.parse(temp);
}//function

almacenamiento.limpiaBahia=function(){
    var bahia=localStorage.removeItem("bahia");
    return null;
}//function

almacenamiento.limpiaIdOrden=function(){
    var idOrden=localStorage.removeItem("idOrden");
    return null;
}//function

almacenamiento.dameBahia=function(){
    var bahia=localStorage.getItem("bahia");
    if(bahia!=null){
        eval("bahia="+bahia+";");
        return bahia;
    }//if
    return null;
}//function

almacenamiento.dameIdOrden=function(){
    var idOrden=localStorage.getItem("idOrden");
    if(idOrden!=null){
        eval("idOrden="+idOrden+";");
        return idOrden;
    }//if
    return null;
}//function

almacenamiento.actualizarFechaEntrega=function(fecha_entrega){
    localStorage.setItem("fecha_entrega", JSON.stringify({
        fecha_entrega:fecha_entrega
    }));
}//function

almacenamiento.limpiaFechaEntrega=function(){
    var fecha_entrega=localStorage.removeItem("fecha_entrega");
    return null;
}//function

almacenamiento.dameFechaEntrega=function(){
    var fecha_entrega=localStorage.getItem("fecha_entrega");
    if(fecha_entrega!=null){
        eval("fecha_entrega="+fecha_entrega+";");
        return fecha_entrega;
    }//if
    return null;
}//function

almacenamiento.actualizarFechaPromesa=function(fecha_promesa){
    localStorage.setItem("fecha_promesa", JSON.stringify({
        fecha_promesa:fecha_promesa
    }));
}//function

almacenamiento.limpiaFechaPromesa=function(){
    var fecha_promesa=localStorage.removeItem("fecha_promesa");
    return null;
}//function

almacenamiento.dameFechaPromesa=function(){
    var fecha_promesa=localStorage.getItem("fecha_promesa");
    if(fecha_promesa!=null){
        eval("fecha_promesa="+fecha_promesa+";");
        return fecha_promesa;
    }//if
    return null;
}//function


//servicios
almacenamiento.guardaServicio=function(id,nombre,precio,precioManoObra,idReal){
    //obtenemos los servicios actuales
    var servicios = JSON.parse(localStorage.getItem("servicios")) || [];
    //agregamos el nuevo servicio
    servicios.push({'id':id,'nombre':nombre,'precio':precio,'precioManoObra':precioManoObra,'idReal':idReal});
    //guardamos ahora todos los servicios en localstorage
    localStorage.setItem("servicios", JSON.stringify(servicios));
}//function

almacenamiento.eliminaUnServicio=function(idEliminar){
    //alert(idEliminar);
    //obtenemos los servicios guardados para buscar el id a eliminar
    var servicios = JSON.parse(localStorage.getItem("servicios"));
    var Actuales=[];
    var ActualesOperaciones=[];
    //recorremos los servicios
    $.each(servicios, function(i, item) {
        //si el servicio actual es es diferente al que vmos a eliminar, lo agregamos al objeto nuevo
        if(item.id!=idEliminar){
            Actuales.push({'id':item.id,'nombre':item.nombre,'precio':item.precio,'precioManoObra':item.precioManoObra,'idReal':item.idReal});
        }else{
            almacenamiento.serviciosEliminados(item.idReal);
            //buscamos las operaciones que son del servicio que se esta eliminando
            operaciones = almacenamiento.dameOperaciones()
            if(operaciones!=null)
                $.each(operaciones, function(iop, itemop) {
                    //buscamos las refacciones
                    if(itemop.idServicio!=idEliminar){
                       //alert("v "+itemop.nombre);
                        ActualesOperaciones.push({'id':itemop.id,'nombre':itemop.nombre,'opcional':itemop.opcional,idServicio:itemop.idServicio,idReal:itemop.idReal});
                    }else{
                        //alert("x "+itemop.nombre);
                        almacenamiento.operacionesEliminadas(itemop.idReal);
                        //eliminamos las refacciones de una operacion, mandamos el servicio
                        almacenamiento.eliminaRefaccionesDeOperacion(itemop.id,idEliminar);
                    }
                });
        }
                   
    });
    //guardamos los servicios restantes en loclstorage
    console.log(JSON.stringify(ActualesOperaciones));
    localStorage.setItem("servicios", JSON.stringify(Actuales));
    localStorage.setItem("operaciones", JSON.stringify(ActualesOperaciones));
    
}//function
almacenamiento.dameServicios=function(){
    var servicios=localStorage.getItem("servicios");
    if(servicios!=null){
        eval("servicios="+servicios+";");
        //console.log(servicios);
        return servicios;
    }//if
    return null;
}//function
almacenamiento.limpiarServicioSeleccionado=function(){
    var servicioSeleccionado=localStorage.removeItem("servicioSeleccionado");
    return null;
}
almacenamiento.dameServicioSeleccionado=function(){
    var servicioSeleccionado=localStorage.getItem("servicioSeleccionado");
    if(servicioSeleccionado!=null){
        eval("servicioSeleccionado="+servicioSeleccionado+";");
        return servicioSeleccionado;
    }//if
    return null;
}
almacenamiento.verificaEstatusServicios=function(){
    var servicios = JSON.parse(localStorage.getItem("servicios")) || [];
    var valido=false;
    if(servicios.length<=0){
        return valido;
    }
    //con que tenga servios no importa que cuesten dinero
    valido=true;
    /*
    $.each(servicios, function(i, item) {
        //verificamos que al menos tenga un servicio y que sea mayor a cero pesos
        if(parseFloat(item.precio)>0){
            valido = true;
        }
    });
    */
    return valido;
}
almacenamiento.dameOperacionesDeUnServicio=function(idServicio){
    //actualizamos el servicio en local storage y si esta seleccionado tambien
    var operaciones = JSON.parse(localStorage.getItem("operaciones"));
    var Actuales=[];
    //recorremos los servicios
        $.each(operaciones, function(i, item) {
            if(item.idServicio==idServicio){
                Actuales.push({'id':item.id,'nombre':item.nombre,'opcional':item.opcional,idServicio:item.idServicio});
            }
        });
    return Actuales;
}
almacenamiento.actualizarServicio=function(idServicio,total){
    //actualizamos el servicio en local storage y si esta seleccionado tambien
        var servicios = JSON.parse(localStorage.getItem("servicios"));
        var Actuales=[];
        //recorremos los servicios
    //console.log("total es: "+total);
        $.each(servicios, function(i, item) {
            //si el servicio actual es es diferente al que vmos a eliminar, lo agregamos al objeto nuevo
            if(item.id==idServicio){
                Actuales.push({'id':item.id,'nombre':item.nombre,'precio':total,'precioManoObra':item.precioManoObra,idReal:item.idReal});
               //console.log('id: '+item.id+' nombre: '+item.nombre+' precio: '+total);
            }else{
                Actuales.push({'id':item.id,'nombre':item.nombre,'precio':item.precio,'precioManoObra':item.precioManoObra,idReal:item.idReal});
                //console.log('id: '+item.id+' nombre: '+item.nombre+' precio: '+item.precio);
            }
        });
        //guardamos los servicios restantes en loclstorage
        localStorage.setItem("servicios", JSON.stringify(Actuales));
    
        //verificamos si el servicio actualizado es el mismo
        //actualizamos el servicio en local storage y si esta seleccionado tambien
        var servicioSeleccionado = JSON.parse(localStorage.getItem("servicioSeleccionado"));
        var Actuales2=[];
            if(servicioSeleccionado!=null && servicioSeleccionado[0].id==idServicio){
                Actuales2.push({'id':servicioSeleccionado[0].id,'nombre':servicioSeleccionado[0].nombre,'precio':total});
               // console.log('id: '+servicioSeleccionado[0].id+' nombre: '+servicioSeleccionado[0].nombre+' precio: '+total);
                //guardamos los servicios restantes en loclstorage
                localStorage.setItem("servicioSeleccionado", JSON.stringify(Actuales2));
            }
        
}
almacenamiento.servicioSeleccionado=function(idServicio){
    //buscamos el id seleccionado
    var servicios = JSON.parse(localStorage.getItem("servicios"));
    var Actuales =[];
    //vaciamos el antiguo servicio seleccionado
    almacenamiento.limpiarServicioSeleccionado();
    $.each(servicios, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(servicios[index].id==idServicio){
            //seteamos  los datos del servicio
            var id = servicios[index].id;
            var nombre = servicios[index].nombre;
           // var unidades = servicios[index].unidades;
           // var totalRefacciones = servicios[index].totalRefacciones;
            var precio = servicios[index].precio;
             Actuales.push({'id':id,'nombre':nombre,'precio':precio});
            //guardamos en localstorage
            //localStorage.setItem("servicioSeleccionado", JSON.stringify({id:id,nombre:nombre,unidades:unidades,totalRefacciones:totalRefacciones,precio:precio}));
            //localStorage.setItem("servicioSeleccionado", JSON.stringify({id:id,nombre:nombre,precio:precio}));
            localStorage.setItem("servicioSeleccionado", JSON.stringify(Actuales));
        }
    });
    
}


almacenamiento.actualizaPrecioDeServicios=function(){
    var serv    =JSON.parse(localStorage.getItem("servicios"));
    var refa    =JSON.parse(localStorage.getItem("refacciones"));
    var servActu=[];
    for(var i=0; i<=serv.length-1; i++){
        var totaRefa=0.0;
        for(var j=0; j<=refa.length-1; j++){
            if(refa[j].idServicio==serv[i].id)
                totaRefa+=parseFloat(refa[j].precio)*parseFloat(refa[j].cantidad);
        }//for j
        servActu.push({'id':serv[i].id,'nombre':serv[i].nombre,'precio':totaRefa,'precioManoObra':serv[i].precioManoObra,'idReal':serv[i].idReal});
    }//for i
    localStorage.setItem("servicios", JSON.stringify(servActu));
}//function

// operaciones

almacenamiento.guardarOperacion=function(id,nombre,opcional,idServicio,idReal){
    //obtenemos las operaciones actuales
    var operaciones = JSON.parse(localStorage.getItem("operaciones")) || [];
    var existe = true;

    $.each(operaciones, function(i, item) {
        if(item.id==id){
            existe = false;
        }
    });
    if(existe==true){
        console.log("se agrego una operacion");
       //agregamos ela nueva operacion
        operaciones.push({'id':id,'nombre':nombre,'opcional':opcional,idServicio:idServicio,idReal:idReal});
        //guardamos ahora todas las operaciones en localstorage
        localStorage.setItem("operaciones", JSON.stringify(operaciones));
    }
    
}//function

almacenamiento.eliminaUnaOperacion=function(idEliminar){
    //obtenemos las operaciones guardadas para buscar el id a eliminar
    //alert(idEliminar+")))");
    var operaciones = JSON.parse(localStorage.getItem("operaciones"));
     var Actuales=[];
    //recorremos las operaciones
    $.each(operaciones, function(i, item) {
        //si la operacion actual es igual al que hay que eliminar, lo eliminamos
        if(operaciones[i].id!=idEliminar){
            //operaciones.splice(i,item.length);
            Actuales.push({id:item.id,nombre:item.nombre,opcional:item.opcional,idServicio:item.idServicio, idReal:item.idReal});
        }else{
            almacenamiento.operacionesEliminadas(item.idReal);
            almacenamiento.eliminaRefaccionesDeOperacion(operaciones[i].id,operaciones[i].idServicio);
        }//if
    });
    //guardamos los servicios restantes en loclstorage
    localStorage.setItem("operaciones", JSON.stringify(Actuales));
}//function
almacenamiento.vaciarOperaciones=function(){
    var operaciones=localStorage.removeItem("operaciones");
    return null;
}//function
almacenamiento.dameOperaciones=function(){
    var operaciones=localStorage.getItem("operaciones");
    if(operaciones!=null){
        eval("operaciones="+operaciones+";");
        return operaciones;
    }//if
    return null;
}//function


// refacciones

almacenamiento.guardarRefaccion=function(idOperacion,idRefaccion,nombre,cantidad,precio,tipo,idServicio,idReal){
    //alert(idOperacion+","+idRefaccion+","+nombre+","+cantidad+","+precio+","+tipo+","+idServicio);
    //obtenemos las refacciones actuales
    var refacciones = JSON.parse(localStorage.getItem("refacciones")) || [];
    var existe = true;
    ////$.each(refacciones, function(i, item){
    for(var i=0; i<=refacciones.length-1; i++){
        //si la operacion actual es igual al que hay que eliminar, lo eliminamos
        if(refacciones[i].idOperacion==idOperacion && refacciones[i].tipo==tipo && refacciones[i].idRefaccion==idRefaccion){
            existe = false;
            //Actuales.push({idOperacion:item.idOperacion,id:item.id,nombre:item.nombre,cantidad:item.cantidad,precio:item.precio,tipo:item.tipo,idServicio:item.idServicio});
        }
    }//for
    ////});
    if(existe){
        console.log("se agrego una refaccion");
        //alert("refa"+idRefaccion);
        //agregamos ela nueva refaccion
        refacciones.push({'idOperacion':idOperacion,'id':idRefaccion,'nombre':nombre,'cantidad':cantidad,precio:precio,tipo:tipo,idServicio:idServicio,idReal:idReal});
        //guardamos ahora todas las refacciones en localstorage
        localStorage.setItem("refacciones", JSON.stringify(refacciones));
    }
}//function

almacenamiento.eliminaUnaRefaccion=function(idEliminar){
    //obtenemos las operaciones guardadas para buscar el id a eliminar
    var refa=JSON.parse(localStorage.getItem("refacciones"));
    var Actuales=[];
    for(var i=0; i<=refa.length-1; i++){
        if(refa[i].id!=idEliminar){
           var item=refa[i]; Actuales.push({idOperacion:item.idOperacion,id:item.id,nombre:item.nombre,cantidad:item.cantidad,precio:item.precio,tipo:item.tipo,idServicio:item.idServicio,idReal:item.idReal});
        }else{
            var item=refa[i];
            almacenamiento.refaccionesEliminadas(item.idReal);
        }//if
    }//for
    //guardamos los servicios restantes en loclstorage
    localStorage.setItem("refacciones", JSON.stringify(Actuales));
}//function

almacenamiento.obtenerRefaccion=function(idRefaccion){
    //alert(idRefaccion);
    var refa=JSON.parse(localStorage.getItem("refacciones"));
    for(var i=0; i<=refa.length-1; i++)
        if(refa[i].id==idRefaccion)
            return refa[i];
}//obtenerRefaccion

almacenamiento.dameRefaccionesDeUnaOperacion=function(idOperacion,idServicio){
    //actualizamos el servicio en local storage y si esta seleccionado tambien
    var refacciones = JSON.parse(localStorage.getItem("refacciones"));
    var Actuales=[];
    //recorremos los servicios
    if(refacciones!=null)
        $.each(refacciones, function(i, item) {
            if(item.idOperacion==idOperacion && item.idServicio == idServicio){
                Actuales.push({'idOperacion':item.idOperacion,id:item.id,'nombre':item.nombre,'cantidad':item.cantidad,precio:item.precio,tipo:item.tipo,idServicio:item.idServicio});
            }
        });
    
    return Actuales;
}

almacenamiento.eliminaRefaccionesDeOperacion=function(idOperacion,idServicio){
    //alert(idOperacion, idServicio);
    //obtenemos las operaciones guardadas para buscar el id a eliminar
    var refacciones = JSON.parse(localStorage.getItem("refacciones"));
    var Actuales=[];
    //recorremos las operaciones
    var total = 0;
    if(refacciones!=null)
        $.each(refacciones, function(i, item) {

            if(item.idOperacion!=idOperacion){
                Actuales.push({idOperacion:item.idOperacion,id:item.id,nombre:item.nombre,cantidad:item.cantidad,precio:item.precio,tipo:item.tipo,idServicio:item.idServicio,idReal:item.idReal});
                //console.log("refaccion a eliminar: idServicio: "+idServicio+" idServicio ligada a la refaccion: "+item.idServicio);
                //al eliminar las operaciones obtenemos el total del servicio en el que se encuentra
                if(item.idServicio == idServicio){
                    total = parseFloat(total) + (parseFloat(item.precio)*parseFloat(item.cantidad));
                }
            }else{
                almacenamiento.refaccionesEliminadas(item.idReal);
                //eliminamos la refaccion de la lista de refacciones
                $('#gridRefacciones tr').each(function() {
                    if(item.id==$(this).attr("rel").valueOf()){
                       $(this).remove();
                    }
                });
            }
        });
    //guardamos los servicios restantes en loclstorage
    localStorage.setItem("refacciones", JSON.stringify(Actuales));
    return total;
}//function

almacenamiento.dameTotalRefaccionesDeServicio=function(idServicio){
    var refacciones=JSON.parse(localStorage.getItem("refacciones"));
    var total=0.0;
    for(var i=0; i<=refacciones.length; i++){
        if(refacciones[i].idServicio==idServicio){
            total+=refacciones[i].precio*refacciones[i].cantidad;
        }//if
    }//for
    return total;
}//function

almacenamiento.vaciarRefacciones=function(){
    var refacciones=localStorage.removeItem("refacciones");
    return null;
}//function
almacenamiento.dameRefacciones=function(){
    var refacciones=localStorage.getItem("refacciones");
    if(refacciones!=null){
        eval("refacciones="+refacciones+";");
        return refacciones;
    }//if
    return null;
}//function

almacenamiento.guardarAreasOportunidad=function(idAreaOportunidad,areaOportunidad,idTipo,idServicio,estatus,tipo,servicio,totalRefacciones,idCalificacion,calificacion,fecha,idOrdenServicioAreaOportunidad){
    //obtenemos las refacciones actuales
    var areas = JSON.parse(localStorage.getItem("areasOportunidad")) || [];
    //agregamos ela nueva refaccion
    //var areasOportunidad = JSON.parse(localStorage.getItem("areasOportunidad"));
    var Actuales =[];
    var existe = false;
    $.each(areas, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(idAreaOportunidad==item.idAreaOportunidad){
            existe=true;
        }
    });
    
    if(existe==false){
        console.log("no existe el area de oportunidad");
         areas.push({'idAreaOportunidad':idAreaOportunidad,'areaOportunidad':areaOportunidad,'idTipo':idTipo,'idServicio':idServicio,estatus:estatus,tipo:tipo,servicio:servicio,totalRefacciones:totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:fecha,idOrdenServicioAreaOportunidad:idOrdenServicioAreaOportunidad});
        //guardamos ahora todas las refacciones en localstorage
        localStorage.setItem("areasOportunidad", JSON.stringify(areas));
    }
   
}//function



almacenamiento.limpiarAreaOportunidadSeleccionada=function(){
    var areaOportunidadSeleccionada=localStorage.removeItem("areaOportunidadSeleccionada");
    return null;
}
almacenamiento.vaciarAreasOportunidad=function(){
    var areasOportunidad=localStorage.removeItem("areasOportunidad");
    return null;
}//function
almacenamiento.areaOportunidadSeleccionada=function(idAreaOportunidad){
    //buscamos el id seleccionado
    var id = idAreaOportunidad;
    var areasOportunidad = JSON.parse(localStorage.getItem("areasOportunidad"));
    var Actuales =[];
    //vaciamos el antiguo servicio seleccionado
    almacenamiento.limpiarAreaOportunidadSeleccionada();
    $.each(areasOportunidad, function(index, item) {

        //obtenemos los datos de la operacion en curso
        if(areasOportunidad[index].idAreaOportunidad==id){

            var idAreaOportunidad = areasOportunidad[index].idAreaOportunidad;
            var areaOportunidad = areasOportunidad[index].areaOportunidad;
            var idTipo = areasOportunidad[index].idTipo;
            var idServicio = areasOportunidad[index].idServicio;
            var estatus = areasOportunidad[index].estatus;
            var tipo = areasOportunidad[index].tipo;
            var servicio = areasOportunidad[index].servicio;
            var totalRefacciones = areasOportunidad[index].totalRefacciones;
            var idCalificacion = areasOportunidad[index].idCalificacion;
            var calificacion = areasOportunidad[index].calificacion;
            var fecha = areasOportunidad[index].fecha;
            var idOrdenServicioAreaOportunidad = areasOportunidad[index].idOrdenServicioAreaOportunidad;
            
            Actuales.push({'idAreaOportunidad':idAreaOportunidad,'areaOportunidad':areaOportunidad,'idTipo':idTipo,idServicio:idServicio,estatus:estatus,tipo:tipo,servicio:servicio,totalRefacciones:totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:fecha,idOrdenServicioAreaOportunidad:idOrdenServicioAreaOportunidad});
            localStorage.setItem("areaOportunidadSeleccionada", JSON.stringify(Actuales));
        }
    });
    
}
almacenamiento.dameAreaOportunidadSeleccionada=function(){
    var areaOportunidadSeleccionada=localStorage.getItem("areaOportunidadSeleccionada");
    if(areaOportunidadSeleccionada!=null){
        eval("areaOportunidadSeleccionada="+areaOportunidadSeleccionada+";");
        return areaOportunidadSeleccionada;
    }//if
    return null;
}
almacenamiento.dameAreasOportunidad=function(){
    var areasOportunidad=localStorage.getItem("areasOportunidad");
    if(areasOportunidad!=null){
        eval("areasOportunidad="+areasOportunidad+";");
        return areasOportunidad;
    }//if
    return null;
}
almacenamiento.guardarRecomendacion=function(categoria,idCategoria,taller,idTaller,folio,usuarioFirmado,propietario,placas,recomendacion,idOrdenServicioAreaOportunidad){
    //alert(idOrdenServicioAreaOportunidad);
    //obtenemos las refacciones actuales
    var recomendaciones = JSON.parse(localStorage.getItem("recomendaciones")) || [];
    //agregamos ela nueva refaccion
    recomendaciones.push({'categoria':categoria,'idCategoria':idCategoria,'taller':taller,'idTaller':idTaller,'folio':folio,usuarioFirmado:usuarioFirmado,propietario:propietario,placas:placas,recomendacion:recomendacion,idOrdenServicioAreaOportunidad:idOrdenServicioAreaOportunidad});
    //guardamos ahora todas las refacciones en localstorage
    localStorage.setItem("recomendaciones", JSON.stringify(recomendaciones));
}//function
almacenamiento.vaciarRecomendaciones=function(){
    var recomendaciones=localStorage.removeItem("recomendaciones");
    return null;
}//function

almacenamiento.dameRecomendaciones=function(){
    var recomendaciones=localStorage.getItem("recomendaciones");
    if(recomendaciones!=null){
        eval("recomendaciones="+recomendaciones+";");
        return recomendaciones;
    }//if
    return null;
}

almacenamiento.actualizarAreaOportunidad=function(idAreaOportunidad){
    //actualizamos el servicio en local storage y si esta seleccionado tambien
        var areasOportunidad = JSON.parse(localStorage.getItem("areasOportunidad"));
        var Actuales=[];
        
        $.each(areasOportunidad, function(i, item) {
            //si el servicio actual es es diferente al que vmos a eliminar, lo agregamos al objeto nuevo
            console.log();
            if(item.idAreaOportunidad==idAreaOportunidad){
                Actuales.push({idAreaOportunidad:item.idAreaOportunidad,areaOportunidad:item.areaOportunidad,idTipo:item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:'BIE',calificacion:'Bien',fecha:item.fecha,idOrdenServicioAreaOportunidad:item.idOrdenServicioAreaOportunidad});
            }else{
                Actuales.push({idAreaOportunidad:item.idAreaOportunidad,areaOportunidad:item.areaOportunidad,idTipo:item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha,idOrdenServicioAreaOportunidad:item.idOrdenServicioAreaOportunidad});
            }
        });
        //guardamos los servicios restantes en loclstorage
        localStorage.setItem("areasOportunidad", JSON.stringify(Actuales));

        var areaOportunidadSeleccionada = JSON.parse(localStorage.getItem("areaOportunidadSeleccionada"));
        var Actuales2=[];
            if(areaOportunidadSeleccionada[0].idAreaOportunidad==idAreaOportunidad){
               Actuales2.push({idAreaOportunidad:areaOportunidadSeleccionada[0].idAreaOportunidad,areaOportunidad:areaOportunidadSeleccionada[0].areaOportunidad,idTipo:areaOportunidadSeleccionada[0].idTipo,idServicio:areaOportunidadSeleccionada[0].idServicio,estatus:areaOportunidadSeleccionada[0].estatus,tipo:areaOportunidadSeleccionada[0].tipo,servicio:areaOportunidadSeleccionada[0].servicio,totalRefacciones:areaOportunidadSeleccionada[0].totalRefacciones,idCalificacion:'BIE',calificacion:'Bien',fecha:areaOportunidadSeleccionada[0].fecha, idOrdenServicioAreaOportunidad:areaOportunidadSeleccionada[0].idOrdenServicioAreaOportunidad});
                //guardamos los servicios restantes en loclstorage
                localStorage.setItem("areaOportunidadSeleccionada", JSON.stringify(Actuales2));
            }
    
    //actualizamos el grid
    //console.log(total);
    $('#gridAreasOportunidad tr').each(function() {
        if(areaOportunidadSeleccionada[0].idAreaOportunidad==$(this).attr("rel").valueOf()){
            console.log("cambia el status del area de oportunidad");
           $(this).find("td:eq(1) i").removeClass("btn fa fa-times color-danger").removeClass("btn fa fa-exclamation-triangle color-warning").addClass("btn fa fa-check color-success");
        }
    });
}

almacenamiento.setearAreaOportunidad=function(idAreaOportunidad,idCalificacion,calificacion){
    //actualizamos el servicio en local storage y si esta seleccionado tambien
        var areasOportunidad = JSON.parse(localStorage.getItem("areasOportunidad"));
        var Actuales=[];
        
        $.each(areasOportunidad, function(i, item) {
            if(item.idAreaOportunidad==idAreaOportunidad){
                Actuales.push({idAreaOportunidad:item.idAreaOportunidad,areaOportunidad:item.areaOportunidad,idTipo:item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:item.fecha, idOrdenServicioAreaOportunidad:item.idOrdenServicioAreaOportunidad});
            }else{
                Actuales.push({idAreaOportunidad:item.idAreaOportunidad,areaOportunidad:item.areaOportunidad,idTipo:item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha, idOrdenServicioAreaOportunidad:item.idOrdenServicioAreaOportunidad});
            }
        });
        //guardamos los servicios restantes en loclstorage
        localStorage.setItem("areasOportunidad", JSON.stringify(Actuales));

        var areaOportunidadSeleccionada = JSON.parse(localStorage.getItem("areaOportunidadSeleccionada"));
        var Actuales2=[];
        if(areaOportunidadSeleccionada!=undefined){
            if(areaOportunidadSeleccionada[0].idAreaOportunidad==idAreaOportunidad){
               Actuales2.push({idAreaOportunidad:areaOportunidadSeleccionada[0].idAreaOportunidad,areaOportunidad:areaOportunidadSeleccionada[0].areaOportunidad,idTipo:areaOportunidadSeleccionada[0].idTipo,idServicio:areaOportunidadSeleccionada[0].idServicio,estatus:areaOportunidadSeleccionada[0].estatus,tipo:areaOportunidadSeleccionada[0].tipo,servicio:areaOportunidadSeleccionada[0].servicio,totalRefacciones:areaOportunidadSeleccionada[0].totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:areaOportunidadSeleccionada[0].fecha});
                //guardamos los servicios restantes en loclstorage
                localStorage.setItem("areaOportunidadSeleccionada", JSON.stringify(Actuales2));
            }
        }
            
}


almacenamiento.guardarInspeccion = function(folio,idAreaOportunidad,areaOportunidad,idTipo,idServicio,estatus,tipo,servicio,totalRefacciones,idCalificacion,calificacion,fecha){
    //obtenemos la inspeccion almacenada
    var inspeccion = JSON.parse(localStorage.getItem("inspeccion")) || [];
    var Actuales =[];
    var existe = false;
    $.each(inspeccion, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(idAreaOportunidad==item.idAreaOportunidad){
            existe=true;
        }
    });
    
    if(existe==false){
        console.log("no existe el area de oportunidad en inspeccion");
         inspeccion.push({'folio':folio,'idAreaOportunidad':idAreaOportunidad,'areaOportunidad':areaOportunidad,'idTipo':idTipo,idServicio:idServicio,estatus:estatus,tipo:tipo,servicio:servicio,totalRefacciones:totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:fecha});
        //guardamos ahora todas las refacciones en localstorage
        localStorage.setItem("inspeccion", JSON.stringify(inspeccion));
    }
}
almacenamiento.vaciarInspeccion=function(){
    var inspeccion=localStorage.removeItem("inspeccion");
    return null;
}//function
almacenamiento.actualizarInspeccion = function(idAreaOportunidad,idCalificacion){
    //obtenemos la inspeccion almacenada
    var inspeccion = JSON.parse(localStorage.getItem("inspeccion")) || [];
    var Actuales =[];
    var existe = false;
    if(idCalificacion=='BIE'){
        calificacion = 'Bien';
    }else if(idCalificacion=='MED'){
        calificacion = 'Medio';
    }else{
        calificacion = 'Mal';
    }
    $.each(inspeccion, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(idAreaOportunidad==item.idAreaOportunidad){
            Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:idCalificacion,calificacion:calificacion,fecha:item.fecha});
        }else{
            Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha});
        }
    });
    
    //guardamos ahora todas las refacciones en localstorage
    localStorage.setItem("inspeccion", JSON.stringify(Actuales));  
}
almacenamiento.cargarInspeccion=function(folio){
     //actualizamos el servicio en local storage y si esta seleccionado tambien
    var inspeccion = JSON.parse(localStorage.getItem("inspeccion"));
    var Actuales=[];
    //recorremos los servicios
        $.each(inspeccion, function(i, item) {
            if(item.folio==folio){
                 Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,idServicio:item.idServicio,estatus:item.estatus,tipo:item.tipo,servicio:item.servicio,totalRefacciones:item.totalRefacciones,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha});
            }
        });
    
    return Actuales;
    /*var inspeccion=localStorage.getItem("inspeccion");
    if(inspeccion!=null){
        eval("inspeccion="+inspeccion+";");
        return inspeccion;
    }//if
    return null;*/
}
almacenamiento.verificaEstatusInspeccion=function(){
    //obtenemos las mediciones guardadas
    var inspeccion = JSON.parse(localStorage.getItem("inspeccion")) || [];
    var vacio = false;
    if(inspeccion.length<=0){
        vacio=true;
            console.log(inspeccion);
    }
    var inspeccion_llantas_frenos = JSON.parse(localStorage.getItem("inspeccion_llantas_frenos")) || [];
    //console.log(JSON.stringify(inspeccion_llantas_frenos)+"]]]");
    //console.log(JSON.stringify(inspeccion_llantas_frenos[0].chkSinLlantaRefaccion)+"]]]]]]");
    $.each(inspeccion, function(index, item) {
        //obtenemos los datos de la operacion en curso   && 
                
        //if(item.idCalificacion==null && !(inspeccion_llantas_frenos[0].chkSinLlantaRefaccion+""!="undefined" && inspeccion_llantas_frenos[0].chkSinLlantaRefaccion && item.idAreaOportunidad=='34')){
        //34 Refacción, 37 Freno delantero Izq, 38 Freno delantero der, 39 Freno trasero 1zq, 40 Freno trasero der
        var sinRevision=almacenamiento.dameEstatusSinRevision();
        //alert("("+sinRevision.chkSinLlantaRefaccion+","+sinRevision.freno_vida_del_izq+")");
        if(item.idCalificacion==null && !(item.idAreaOportunidad=='34' || item.idAreaOportunidad=='37' || item.idAreaOportunidad=='38' || item.idAreaOportunidad=='39' || item.idAreaOportunidad=='40')
           || item.idCalificacion==null && item.idAreaOportunidad=='34' && !sinRevision.chkSinLlantaRefaccion /*!$("#chkSinLlantaRefaccion")[0].checked*/
           || item.idCalificacion==null && item.idAreaOportunidad=='37' && sinRevision.freno_vida_del_izq !='-1'
           || item.idCalificacion==null && item.idAreaOportunidad=='38' && sinRevision.freno_vida_del_der !='-1'
           || item.idCalificacion==null && item.idAreaOportunidad=='39' && sinRevision.freno_vida_tras_izq!='-1'
           || item.idCalificacion==null && item.idAreaOportunidad=='40' && sinRevision.freno_vida_tras_der!='-1'
        ){
            //alert(JSON.stringify(item));
            vacio=true;
            console.log(item);
            console.log("???"+JSON.stringify(item));
        }
    });
    //alert(vacio);
    return vacio;
}

almacenamiento.guardaEstatusSinRevision=function(){
    localStorage.setItem('sinRevision', JSON.stringify({
        chkSinLlantaRefaccion:$("#chkSinLlantaRefaccion")[0].checked,
        freno_vida_del_izq:   $("#freno_vida_del_izq").val(),
        freno_vida_del_der:   $("#freno_vida_del_der").val(),
        freno_vida_tras_izq:  $("#freno_vida_tras_izq").val(),
        freno_vida_tras_der:  $("#freno_vida_tras_der").val()
    }));
}//function

almacenamiento.dameEstatusSinRevision=function(){
    var sinRevision=JSON.parse(localStorage.getItem('sinRevision'));
    return sinRevision;
}//function

almacenamiento.dameInspeccion=function(){
    var inspeccion=localStorage.getItem("inspeccion");
    if(inspeccion!=null){
        eval("inspeccion="+inspeccion+";");
        return inspeccion;
    }//if
    return null;
}
almacenamiento.verificaMedicionesInspeccion=function(){
    //obtenemos las mediciones guardadas
    var inspeccion_llantas_frenos = JSON.parse(localStorage.getItem("inspeccion_llantas_frenos")) || [];
    var vacio = false;
    $.each(inspeccion_llantas_frenos, function(index, item) {
        //obtenemos los datos de la operacion en curso
         $.each(item, function(k, v) {
             console.log(k+"...");
             console.log(v+"+++");
            if(k!='id' && k!='folio' && k!="chkSinLlantaRefaccion"
               && !(inspeccion_llantas_frenos[0].chkSinLlantaRefaccion && (k=='prof_refa' || k=='pres_refa'))
               && !(inspeccion_llantas_frenos[0].vida_del_izq==-1  && k=='grosor_del_izq')
               && !(inspeccion_llantas_frenos[0].vida_del_der==-1  && k=='grosor_del_der')
               && !(inspeccion_llantas_frenos[0].vida_tras_izq==-1 && k=='grosor_tras_izq')
               && !(inspeccion_llantas_frenos[0].vida_tras_der==-1 && k=='grosor_tras_der')
            ){
                if(v<=0 && v==''){
                   vacio=true;
                   console.log("???");
                }
            }
         });
        
    });
    //alert(vacio);
    return vacio;
}
almacenamiento.dameMediciones=function(){
    var inspeccion_llantas_frenos=localStorage.getItem("inspeccion_llantas_frenos");
    if(inspeccion_llantas_frenos!=null){
        eval("inspeccion_llantas_frenos="+inspeccion_llantas_frenos+";");
        return inspeccion_llantas_frenos;
    }//if
    return null;
}
almacenamiento.guardarInventario = function(folio,idAreaOportunidad,areaOportunidad,idTipo,estatus,tipo,idCalificacion,calificacion,fecha){
    //obtenemos la inspeccion almacenada
    var inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    var Actuales =[];
    var existe = false;
    $.each(inventario, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(idAreaOportunidad==item.idAreaOportunidad){
            existe=true;
        }
    });
    
    if(existe==false){
        console.log("no existe el inventario");
         inventario.push({'folio':folio,'idAreaOportunidad':idAreaOportunidad,'areaOportunidad':areaOportunidad,'idTipo':idTipo,estatus:estatus,tipo:tipo,idCalificacion:idCalificacion,calificacion:calificacion,fecha:fecha});
        //guardamos ahora todas las refacciones en localstorage
        localStorage.setItem("inventario", JSON.stringify(inventario));
    }
}
almacenamiento.cargarInventario=function(folio){
     //actualizamos el servicio en local storage y si esta seleccionado tambien
    var inventario = JSON.parse(localStorage.getItem("inventario"));
    var Actuales=[];
    //recorremos los servicios
        $.each(inventario, function(i, item) {
            if(item.folio==folio){
                 Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,estatus:item.estatus,tipo:item.tipo,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha});
            }
        });
    
    return Actuales;
}
almacenamiento.dameInventario=function(){
    var inventario=localStorage.getItem("inventario");
    if(inventario!=null){
        eval("inventario="+inventario+";");
        return inventario;
    }//if
    return null;
}
almacenamiento.actualizarInventario = function(idAreaOportunidad,idCalificacion){
    //obtenemos la inspeccion almacenada
    var inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    var Actuales =[];
    var existe = false;
    if(idCalificacion=='BIE'){
        calificacion = 'Bien';
    }else if(idCalificacion=='MAL'){
        calificacion = 'Mal';
    }
    $.each(inventario, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(idAreaOportunidad==item.idAreaOportunidad){
            Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,estatus:item.estatus,tipo:item.tipo,idCalificacion:idCalificacion,calificacion:calificacion,fecha:item.fecha});
        }else{
            Actuales.push({'folio':item.folio,'idAreaOportunidad':item.idAreaOportunidad,'areaOportunidad':item.areaOportunidad,'idTipo':item.idTipo,estatus:item.estatus,tipo:item.tipo,idCalificacion:item.idCalificacion,calificacion:item.calificacion,fecha:item.fecha});
        }
    });
    
    //guardamos ahora todas las refacciones en localstorage
    localStorage.setItem("inventario", JSON.stringify(Actuales));
    
}
almacenamiento.guardarMedicionLlantas = function(folio, id, idOrdenServicio,prof_del_izq,prof_del_der,prof_tras_izq,prof_tras_der,prof_refa,pres_del_izq,pres_del_der,pres_tras_izq,pres_tras_der,pres_refa,vida_del_izq,vida_del_der,vida_tras_izq,vida_tras_der,grosor_del_izq,grosor_del_der,grosor_tras_izq,grosor_tras_der){
    //obtenemos las mediciones guardadas
    var inspeccion_llantas_frenos = JSON.parse(localStorage.getItem("inspeccion_llantas_frenos")) || [];
    var Actuales =[];
    var existe = false;
    $.each(inspeccion_llantas_frenos, function(index, item) {
        //obtenemos los datos de la operacion en curso
        if(id==item.id){
            existe=true;
        }
    });
     
    if(existe==false){
        console.log("no existe la medicion llanta_freno");
         inspeccion_llantas_frenos.push({folio:folio, id:id,idOrdenServicio:idOrdenServicio, prof_del_izq:prof_del_izq,prof_del_der:prof_del_der,prof_tras_izq:prof_tras_izq,prof_tras_der:prof_tras_der,prof_refa:prof_refa,pres_del_izq:pres_del_izq,pres_del_der:pres_del_der,pres_tras_izq:pres_tras_izq,pres_tras_der:pres_tras_der,pres_refa:pres_refa,vida_del_izq:vida_del_izq,vida_del_der:vida_del_der,vida_tras_izq:vida_tras_izq,vida_tras_der:vida_tras_der,grosor_del_izq:grosor_del_izq,grosor_del_der:grosor_del_der,grosor_tras_izq:grosor_tras_izq,grosor_tras_der:grosor_tras_der});
        //guardamos ahora todas las refacciones en localstorage
        localStorage.setItem("inspeccion_llantas_frenos", JSON.stringify(inspeccion_llantas_frenos));
    }
}
almacenamiento.dameMedicionesLlantas=function(){
    var inspeccion_llantas_frenos=localStorage.getItem("inspeccion_llantas_frenos");
    if(inspeccion_llantas_frenos!=null){
        eval("inspeccion_llantas_frenos="+inspeccion_llantas_frenos+";");
        return inspeccion_llantas_frenos[0];
    }//if
    return null;
}
almacenamiento.actualizarMedicionLlantas = function(folio, id, prof_del_izq,prof_del_der,prof_tras_izq,prof_tras_der,prof_refa,pres_del_izq,pres_del_der,pres_tras_izq,pres_tras_der,pres_refa,vida_del_izq,vida_del_der,vida_tras_izq,vida_tras_der,grosor_del_izq,grosor_del_der,grosor_tras_izq,grosor_tras_der,chkSinLlantaRefaccion){
    //alert("entro");
    //obtenemos la inspeccion almacenada
    var inspeccion_llantas_frenos = JSON.parse(localStorage.getItem("inspeccion_llantas_frenos")) || [];
    var Actuales =[];
    //if(inspeccion_llantas_frenos.length<=0){
        Actuales.push({folio:folio, id:id, prof_del_izq:prof_del_izq,prof_del_der:prof_del_der,prof_tras_izq:prof_tras_izq,prof_tras_der:prof_tras_der,prof_refa:prof_refa,pres_del_izq:pres_del_izq,pres_del_der:pres_del_der,pres_tras_izq:pres_tras_izq,pres_tras_der:pres_tras_der,pres_refa:pres_refa,vida_del_izq:vida_del_izq,vida_del_der:vida_del_der,vida_tras_izq:vida_tras_izq,vida_tras_der:vida_tras_der,grosor_del_izq:grosor_del_izq,grosor_del_der:grosor_del_der,grosor_tras_izq:grosor_tras_izq,grosor_tras_der:grosor_tras_der,chkSinLlantaRefaccion:chkSinLlantaRefaccion});
    /*}else{
         $.each(inspeccion_llantas_frenos, function(index, item) {
            //obtenemos los datos de la operacion en curso
            if(id==item.id){
                Actuales.push({folio:item.folio, id:item.id, prof_del_izq:prof_del_izq,prof_del_der:prof_del_der,prof_tras_izq:prof_tras_izq,prof_tras_der:prof_tras_der,prof_refa:prof_refa,pres_del_izq:pres_del_izq,pres_del_der:pres_del_der,pres_tras_izq:pres_tras_izq,pres_tras_der:pres_tras_der,pres_refa:pres_refa,vida_del_izq:vida_del_izq,vida_del_der:vida_del_der,vida_tras_izq:vida_tras_izq,vida_tras_der:vida_tras_der,grosor_del_izq:grosor_del_izq,grosor_del_der:grosor_del_der,grosor_tras_izq:grosor_tras_izq,grosor_tras_der:grosor_tras_der,chkSinLlantaRefaccion:chkSinLlantaRefaccion});
            }else{
                Actuales.push({folio:item.folio, id:item.id, prof_del_izq:item.prof_del_izq,prof_del_der:item.prof_del_der,prof_tras_izq:item.prof_tras_izq,prof_tras_der:item.prof_tras_der,prof_refa:item.prof_refa,pres_del_izq:pres_del_izq,pres_del_der:item.pres_del_der,pres_tras_izq:item.pres_tras_izq,pres_tras_der:item.pres_tras_der,pres_refa:item.pres_refa,vida_del_izq:item.vida_del_izq,vida_del_der:item.vida_del_der,vida_tras_izq:item.vida_tras_izq,vida_tras_der:item.vida_tras_der,grosor_del_izq:item.grosor_del_izq,grosor_del_der:item.grosor_del_der,grosor_tras_izq:item.grosor_tras_izq,grosor_tras_der:item.grosor_tras_der,chkSinLlantaRefaccion:item.chkSinLlantaRefaccion});
            }
        });
    }*/
   
    
    //guardamos ahora todas las refacciones en localstorage
    localStorage.setItem("inspeccion_llantas_frenos", JSON.stringify(Actuales));
    
}
almacenamiento.setearCombustible=function(idAutomovil,combustible){
    //guardamos ahora todas las refacciones en localstorage
    localStorage.setItem("combustible", JSON.stringify({idAutomovil:idAutomovil,combustible:combustible}));
}
almacenamiento.obtenerCombustible=function(idAutomovil){

    var combustible = JSON.parse(localStorage.getItem("combustible"))|| [];
    /*var Actuales=[];
    //recorremos los servicios
        $.each(combustible, function(i, item) {
            if(item.idAutomovil==idAutomovil){
                 Actuales.push({idAutomovil:item.idAutomovil,combustible:item.combustible});
            }
        });*/
    
    return combustible;
}

almacenamiento.verificarEstatusInventario=function(){
    //obtenemos las mediciones guardadas
    var inventario = JSON.parse(localStorage.getItem("inventario")) || [];
    var vacio = false;
    console.log("Elementos vacios");
    $.each(inventario, function(index, item) {
        //obtenemos los datos del inventario
         $.each(item, function(k, v) {
            //alert(k);
            if(k!='fecha' && k!='folio'){
                //console.log(k+"-+"+v+"-+");
                if(v<=0 || v=='' || v==null){
                   vacio=true; 
                   //console.log(k+"-+-+");
                }//if
            }//if
         });
    });
    
    if($(".conFoto").length<=0){
        vacio=true;
        console.log("foto faltante");
    }
    
    return vacio;
}

almacenamiento.guardandoOrden=false;
almacenamiento.obtenerOrdenAutomovil=function(pendiente){
    if(almacenamiento.guardandoOrden)
        return false;
    almacenamiento.guardandoOrden=true;
    myApp.showPreloader('Mandando información, espere un momento...');
    var ordenAutomovil={};
     ordenAutomovil.auto=[];
     ordenAutomovil.propietario=[];
     ordenAutomovil.servicios=[];
     ordenAutomovil.operaciones=[];
     ordenAutomovil.refacciones=[];
     ordenAutomovil.areas=[];
     ordenAutomovil.recomendaciones=[];
     ordenAutomovil.inspeccion=[];
     ordenAutomovil.mediciones=[];
     ordenAutomovil.inventario=[];
    
    var auto = almacenamiento.dameAutomovil();
    var asesor = almacenamiento.dameUsuario();
    var bahia = almacenamiento.dameBahia();
    var gas = almacenamiento.obtenerCombustible();
    var propietario = almacenamiento.damePropietario();
    var servicios = almacenamiento.dameServicios();
    var operaciones = almacenamiento.dameOperaciones();
    var refacciones = almacenamiento.dameRefacciones();
    var areas = almacenamiento.dameAreasOportunidad();
    var recomendaciones = almacenamiento.dameRecomendaciones();
    var inspeccion = almacenamiento.dameInspeccion();
    var mediciones = almacenamiento.dameMediciones();
    var inventario = almacenamiento.dameInventario();
    var fecha_entrega = almacenamiento.dameFechaEntrega();
    var fecha_promesa = almacenamiento.dameFechaPromesa();
   
        if(auto!=null){
            //obtengo el automovil + asesor + fecha de ingreso + fecha promesa de entrega + numero de bahia + combustible
            ordenAutomovil.auto.push({id:auto.id, idPropietario:auto.idPropietario, placas:auto.placas, noSerie:auto.noSerie, idAnoRiqs:auto.idAnoRiqs, ano:auto.ano, idMarcaRiqs:auto.idMarcaRiqs, marca:auto.marca, kilometraje:auto.kilometraje, idModeloRiqs:auto.idModeloRiqs, modelo:auto.modelo, idMotorRiqs:auto.idMotorRiqs, motor:auto.motor,asesor:[{id:asesor.id,nombre:asesor.nombre,idSucursal:asesor.idSucursal,email:asesor.email,administrador:asesor.administrador,noBahia:asesor.noBahia}],fecha_ingreso:fecha_entrega.fecha_entrega,fecha_promesa:fecha_promesa.fecha_promesa,combustible:gas.combustible,noBahia:bahia.bahia});
            
            //obtengo el propietario
             ordenAutomovil.propietario.push({id:propietario.id, idPersonaTipo:propietario.idPersonaTipo, personaTipo:propietario.personaTipo, rfc:propietario.rfc, nombre:propietario.nombre, domicilio:propietario.domicilio, codigoPostal:propietario.codigoPostal, idEstado:propietario.idEstado, estado:propietario.estado, idMunicipio:propietario.idMunicipio, municipio:propietario.municipio, idCiudad:propietario.idCiudad, ciudad:propietario.ciudad, idTelefonoTipo1:propietario.idTelefonoTipo1, telefonoTipo1:propietario.telefonoTipo1, lada1:propietario.lada1, telefono1:propietario.telefono1, extension1:propietario.extension1, idTelefonoTipo2:propietario.idTelefonoTipo2, telefonoTipo2:propietario.telefonoTipo2, lada2:propietario.lada2, telefono2:propietario.telefono2, extension2:propietario.extension2, email:propietario.email});
            
            //obtengo los servicios
            if(servicios!=null){
                $.each(servicios, function(servicios_i, servicios_item){
                    ordenAutomovil.servicios.push({id:servicios_item.id,nombre:servicios_item.nombre,precio:servicios_item.precio, idReal:servicios_item.idReal});
                });
             }
            //obtengo las operaciones
            if(operaciones!=null){
                $.each(operaciones, function(operaciones_i, operaciones_item){
                    ordenAutomovil.operaciones.push({id:operaciones_item.id,nombre:operaciones_item.nombre,opcional:operaciones_item.opcional,idServicio:operaciones_item.idServicio, idReal:operaciones_item.idReal});
                });
             }
            //obtengo las refacciones
            if(refacciones!=null){
                $.each(refacciones, function(refacciones_i, refacciones_item){
                    ordenAutomovil.refacciones.push({idOperacion:refacciones_item.idOperacion,id:refacciones_item.id,nombre:refacciones_item.nombre,cantidad:refacciones_item.cantidad,precio:refacciones_item.precio,tipo:refacciones_item.tipo,idServicio:refacciones_item.idServicio, idReal:refacciones_item.idReal});
                });
             }
            //obtengo las areas de oportunidad
            if(areas!=null){
                $.each(areas, function(areas_i, areas_item){
                    ordenAutomovil.areas.push({idAreaOportunidad:areas_item.idAreaOportunidad,areaOportunidad:areas_item.areaOportunidad,idTipo:areas_item.idTipo,idServicio:areas_item.idServicio,estatus:areas_item.estatus,tipo:areas_item.tipo,servicio:areas_item.servicio,totalRefacciones:areas_item.totalRefacciones,idCalificacion:areas_item.idCalificacion,calificacion:areas_item.calificacion,fecha:areas_item.fecha,idOrdenServicioAreaOportunidad:areas_item.idOrdenServicioAreaOportunidad});
                });
             }
            
            //obtengo las recomendaciones
            if(recomendaciones!=null){
                $.each(recomendaciones, function(recomendaciones_i, recomendaciones_item){
                    ordenAutomovil.recomendaciones.push({categoria:recomendaciones_item.categoria,idCategoria:recomendaciones_item.idCategoria,taller:recomendaciones_item.taller,idTaller:recomendaciones_item.idTaller,folio:recomendaciones_item.folio,usuarioFirmado:recomendaciones_item.usuarioFirmado,propietario:recomendaciones_item.propietario,placas:recomendaciones_item.placas,recomendacion:recomendaciones_item.recomendacion, idOrdenServicioAreaOportunidad:recomendaciones_item.idOrdenServicioAreaOportunidad});
                });
             }
            //obtengo la inspeccion visual + mediciones
            if(inspeccion!=null){
                $.each(inspeccion, function(inspeccion_i, inspeccion_item){
                    ordenAutomovil.inspeccion.push({folio:inspeccion_item.folio,idAreaOportunidad:inspeccion_item.idAreaOportunidad,areaOportunidad:inspeccion_item.areaOportunidad,idTipo:inspeccion_item.idTipo,idServicio:inspeccion_item.idServicio,estatus:inspeccion_item.estatus,tipo:inspeccion_item.tipo,servicio:inspeccion_item.servicio,totalRefacciones:inspeccion_item.totalRefacciones,idCalificacion:inspeccion_item.idCalificacion,calificacion:inspeccion_item.calificacion,fecha:inspeccion_item.fecha});
                });
            }
            //obtengo las mediciones de la inspeccion
            if(mediciones!=null){
                $.each(mediciones, function(mediciones_i, mediciones_item){
                    ordenAutomovil.mediciones.push({folio:mediciones_item.folio, id:mediciones_item.id, prof_del_izq:mediciones_item.prof_del_izq,prof_del_der:mediciones_item.prof_del_der,prof_tras_izq:mediciones_item.prof_tras_izq,prof_tras_der:mediciones_item.prof_tras_der,prof_refa:mediciones_item.prof_refa,pres_del_izq:mediciones_item.pres_del_izq,pres_del_der:mediciones_item.pres_del_der,pres_tras_izq:mediciones_item.pres_tras_izq,pres_tras_der:mediciones_item.pres_tras_der,pres_refa:mediciones_item.pres_refa,vida_del_izq:mediciones_item.vida_del_izq,vida_del_der:mediciones_item.vida_del_der,vida_tras_izq:mediciones_item.vida_tras_izq,vida_tras_der:mediciones_item.vida_tras_der,grosor_del_izq:mediciones_item.grosor_del_izq,grosor_del_der:mediciones_item.grosor_del_der,grosor_tras_izq:mediciones_item.grosor_tras_izq,grosor_tras_der:mediciones_item.grosor_tras_der});
                });
            }
            
            //obtengo el inventario
            if(inventario!=null){
                $.each(inventario, function(inventario_i, inventario_item){
                    ordenAutomovil.inventario.push({folio:inventario_item.folio,idAreaOportunidad:inventario_item.idAreaOportunidad,areaOportunidad:inventario_item.areaOportunidad,idTipo:inventario_item.idTipo,estatus:inventario_item.estatus,tipo:inventario_item.tipo,idCalificacion:inventario_item.idCalificacion,calificacion:inventario_item.calificacion,fecha:inventario_item.fecha});
                });
            }
            //las fotografias se conforman de idAutomovil + idPropietario + sha1 fecha
            
            
        }
        
        var clav=clave();
        //alert($("#observaciones").val());
        var idOrden=almacenamiento.dameIdOrden();
        idOrden=idOrden==null?0:idOrden["idOrden"];
        $.ajax({
            url:      dominio+"mandar-orden-automovil",
            type:     'POST',
            data:	{
                clave:                clav,
                codigo:               sha1(clav+palaSecr),
                orden:                ordenAutomovil,
                observaciones:        $("#observaciones").val(),
                pendiente:            pendiente,
                idOrden:              idOrden,
                serviciosEliminados:  almacenamiento.dameServiciosEliminados(),
                operacionesEliminadas:almacenamiento.dameOperacionesEliminadas(),
                refaccionesEliminadas:almacenamiento.dameRefaccionesEliminadas()
            },
            success:	function(re){
                console.log("se mando la orden: "+re);
                almacenamiento.guardandoOrden=false;
                 if(re!=undefined && re!=null){
                     if(!isNaN(re)){
                        almacenamiento.salirModoConsulta();
                        alert("La orden de servicio se almaceno de manera correcta, Folio: "+re);
                        window.location = 'inicio.html';
                     }else{
                        //alert(re);
                        console.log(re);
                        _mensaje("Atención","Hubo problemas al guardar la orden. inténtelo de nuevo más tarde.","Entendido");
                     }
                 }
               myApp.hidePreloader();
            },
            error: function(re){
                almacenamiento.guardandoOrden=false;
                _mensaje("Atención","No hay internet, no se pudo mandar la información de la orden de servicio.","Entendido");
                myApp.hidePreloader();
            }
        });
    
     
}

almacenamiento.imprimirFacturaPorFolio=function(){
    var folio=almacenamiento.dameFolioActivo();
    if(folio!=null)
        console.log('http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?folio='+folio["id"]);
        window.open('http://kipkar.solucionesoftware.com.mx/sincronizacion/pdf-orden-servicio?folio='+folio["id"], '_blank','location=0','closebuttoncaption=Cerrar');
}//function