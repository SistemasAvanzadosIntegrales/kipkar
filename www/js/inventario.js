inventario = {};
var propietario = almacenamiento.damePropietario();
var automovil = almacenamiento.dameAutomovil();
$(document).ready(function(){
    document.addEventListener("deviceready",function(){
        $("#btnImprimir").css("display",(almacenamiento.dameEstatusModoConsulta().status==1?"":"none"));
        //obtenemos los datos del automovil y propietario seleccionado
        //seteamos los campos del encabezado
        
        var folio = almacenamiento.dameFolioActivo();
        //folio,modelo,cliente
        
        $("#headerModelo").val(automovil.marca+", "+automovil.modelo+", "+automovil.motor);
        $("#headerCliente").val(propietario.nombre);
        
        if(almacenamiento.dameEstatusModoConsulta().status=='1' && almacenamiento.consultaCargoInventario()=='0'){
            //alert("consulta");
            $("#headerFolio").val(folio.id);
            if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){
                $("#servicios").removeAttr("disabled");
                $("#combustible").removeAttr("disabled");
                //almacenamiento.cargoInventario('1');
            }else{
                $("#servicios").attr("disabled","disabled");
                $("#combustible").attr("disabled","disabled");
            }//if
            $("#ModoActivo").html('Consulta');
            inventario.obtenerCombustible(almacenamiento.dameFolioActivo().id);
            //inventario.cargarInventario(almacenamiento.dameFolioActivo().id);
            //inventario.cargarFotos(almacenamiento.dameFolioActivo().id);
            $("#capturarFoto").attr("onclick","capturar('"+almacenamiento.dameFolioActivo().id+"')");
        }else{
            //alert("edicion");
            if(almacenamiento.dameIdOrden()!=null && almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){
                $("#headerFolio").val(folio.id);
                $("#ModoActivo").html('Consulta');
            }else{
                $("#headerFolio").val('');
                $("#ModoActivo").html('Captura');
            }//if
            $("#servicios").removeAttr("disabled");
            //obtenemos los servicios relacionados a la orden de servicio seleccionada
            
            var combustible = almacenamiento.obtenerCombustible('');
            console.log(combustible);
            if(combustible!=undefined && combustible!='' && combustible !=null){
                $("#porciento").html(combustible.combustible);
                $("#combustible").val(combustible.combustible);
            }else{
                $("#porciento").html('50');
                almacenamiento.setearCombustible(automovil.id,"50");
            }
            //inventario.cargarTodoInventario('');
            inventario.cargarTodoInventario( almacenamiento.dameEstatusModoConsulta().status=='1' ? almacenamiento.dameFolioActivo().id : '');
            //inspeccion.cargarInspeccion();
            if(almacenamiento.dameIdOrden()!=null && almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                inventario.cargarFotos( almacenamiento.dameEstatusModoConsulta().status=='1' ? almacenamiento.dameFolioActivo().id : '' );
            inventario.cargarFotosSinFolio('');
            $("#capturarFoto").attr("onclick","capturar('')");
            $("#observaciones").val(almacenamiento.dameObservaciones());
        }//if

        $("#combustible").on("input change",function(){
            
            console.log($(this).val());
            $("#porciento").html($(this).val());
            almacenamiento.setearCombustible(automovil.id,$(this).val());
            
            
        });
    
        var modo=almacenamiento.dameEstatusModoConsulta();
        var modoStatus=modo.status=='1' && almacenamiento.dameIdOrden()["idEstatus"]!="ABI";
        $("#capturarFoto")[0].disabled =modoStatus;
        $("#eliminarFoto")[0].disabled =modoStatus;
        $("#observaciones")[0].disabled=modoStatus;
    },false);
    
    $("#observaciones").blur(function(){
        almacenamiento.guardarObservaciones(this.value);
        //alert(almacenamiento.dameObservaciones());
    })
});

inventario.obtenerCombustible = function(folio){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-combustible",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                folio: folio
            },
            processData:true, 
            success:	function(re){
                console.log("el servidor responde: ");
                console.log(re);
                $("#porciento").html(re[0].combustible);
                $("#combustible").val(re[0].combustible);
                //$("#combustible").attr("value",re[0].combustible).trigger("change"); 
                //$("#combustible").val(re[0].combustible).trigger("change"); 
                almacenamiento.guardarObservaciones(re[0].observaciones);
                $("#observaciones").val(almacenamiento.dameObservaciones());
                almacenamiento.setearCombustible(re[0].folio,re[0].combustible);
                
                inventario.cargarInventario(almacenamiento.dameFolioActivo().id);
            },
            error: function(re){
                _mensaje("Atención","No hay internet, No se pudo establecer el combustible del Automóvil.","Entendido");
            }
        });
}

inventario.cargarInventario = function(folio){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-inventario-area-oportunidad",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                folio: folio
            },
            processData:true, 
            success:	function(re){
                var cuantos = re.length;
                var z =0;
                $.each(re, function(index, item){
                    //console.log(re);
                        //obtenemos los datos de la area
                        var idAreaOportunidad = item.idAreaOportunidad;
                        var areaOportunidad = item.areaOportunidad;
                        var idTipo = item.idTipo;
                        var estatus = item.estatus;
                        var tipo = item.tipo;
                        var idCalificacion = item.idCalificacion;
                        var calificacion = item.calificacion;
                        var fecha = item.fecha;
                        var elementoHTML = areaOportunidad;
                        elementoHTML = elementoHTML.replace( RegExp(" ", 'g'), "_");
                        elementoHTML = elementoHTML.replace( RegExp("é", 'g'), "e");
                        elementoHTML = elementoHTML.replace( RegExp("í", 'g'), "i");
                        elementoHTML = elementoHTML.replace( RegExp("ó", 'g'), "o");
                        elementoHTML = elementoHTML.replace( RegExp("ú", 'g'), "u");
                        elementoHTML = elementoHTML.replace( RegExp("á", 'g'), "a");
                        elementoHTML = elementoHTML.replace( RegExp("ñ", 'g'), "n");
                        elementoHTML = elementoHTML.toLowerCase();
                        console.log("elemento: "+elementoHTML);
                    
                        $("#"+elementoHTML).attr("rel",idAreaOportunidad);
                    
                        if(idCalificacion == 'BIE'){
                            $("."+elementoHTML+"-success").removeClass("color-verde-standar");
                            $("."+elementoHTML+"-success").addClass("color-verde-habilitado");
                        }else if(idCalificacion == 'MAL'){
                            $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                            $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                        }
                        
                        //guardamos y seteamos los valores de las areas de oportunidad ligadas a la orden de servicio
                    almacenamiento.guardarInventario(folio,idAreaOportunidad,areaOportunidad,idTipo,estatus,tipo,idCalificacion,calificacion,fecha);
                     z++;
                    if(z == (cuantos-1)){
                        inventario.cargarInventarioLocal(folio);
                    }
                });
                inventario.cargarFotos(almacenamiento.dameFolioActivo().id);
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener información de las áreas de oportunidad.","Entendido");
            }
        });
}
inventario.cargarTodoInventario = function(folio){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-todo-inventario-area-oportunidad",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
            },
            processData:true, 
            success:	function(re){
                var cuantos = re.length;
                var z =0;
                $.each(re, function(index, item){
                    console.log(item);
                        //obtenemos los datos de la area
                        var idAreaOportunidad = item.idAreaOportunidad;
                        var areaOportunidad = item.areaOportunidad;
                        var idTipo = item.idTipo;
                        var estatus = item.estatus;
                        var tipo = item.tipo;
                        var idCalificacion = item.idCalificacion;
                        var calificacion = item.calificacion;
                        var fecha = item.fecha;
                        var elementoHTML = areaOportunidad;
                        elementoHTML = elementoHTML.replace( RegExp(" ", 'g'), "_");
                        elementoHTML = elementoHTML.replace( RegExp("é", 'g'), "e");
                        elementoHTML = elementoHTML.replace( RegExp("í", 'g'), "i");
                        elementoHTML = elementoHTML.replace( RegExp("ó", 'g'), "o");
                        elementoHTML = elementoHTML.replace( RegExp("ú", 'g'), "u");
                        elementoHTML = elementoHTML.replace( RegExp("á", 'g'), "a");
                        elementoHTML = elementoHTML.replace( RegExp("ñ", 'g'), "n");
                        elementoHTML = elementoHTML.toLowerCase();
                        console.log("elemento: "+elementoHTML);
                    
                        $("#"+elementoHTML).attr("rel",idAreaOportunidad);
                    
                        if(idCalificacion == 'BIE'){
                            $("."+elementoHTML+"-success").removeClass("color-verde-standar");
                            $("."+elementoHTML+"-success").addClass("color-verde-habilitado");
                        }else if(idCalificacion == 'MAL'){
                            $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                            $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                        }
                        
                        //guardamos y seteamos los valores de las areas de oportunidad ligadas a la orden de servicio
                    almacenamiento.guardarInventario('',idAreaOportunidad,areaOportunidad,idTipo,estatus,tipo,idCalificacion,calificacion,fecha);
                     z++;
                    if(z == (cuantos-1)){
                        inventario.cargarInventarioLocal(folio);
                    }
                      
                });
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener información de las áreas de oportunidad.","Entendido");
            }
        });
}


inventario.cargarInventarioLocal = function(folio){
    var re = almacenamiento.cargarInventario(folio);
    //alert(JSON.stringify(re));
    if(re!=undefined && re!=null){
        console.log("inventario localmente: ");
         $.each(re, function(index, item){
                console.log(item);
                
                //obtenemos los datos de la area
                var idAreaOportunidad = item.idAreaOportunidad;
                var areaOportunidad = item.areaOportunidad; 
                var idTipo = item.idTipo;
                var estatus = item.estatus;
                var tipo = item.tipo;
                var idCalificacion = item.idCalificacion;
                var calificacion = item.calificacion;
                var fecha = item.fecha;
                var elementoHTML = areaOportunidad;
                elementoHTML = elementoHTML.replace(new RegExp(" ", 'g'), "_");
                elementoHTML = elementoHTML.replace(new RegExp("é", 'g'), "e");
                elementoHTML = elementoHTML.replace(new RegExp("í", 'g'), "i");
                elementoHTML = elementoHTML.replace(new RegExp("ó", 'g'), "o");
                elementoHTML = elementoHTML.replace(new RegExp("ú", 'g'), "u");
                elementoHTML = elementoHTML.replace(new RegExp("á", 'g'), "a");
                elementoHTML = elementoHTML.replace(new RegExp("ñ", 'g'), "n");
                elementoHTML = elementoHTML.toLowerCase();
                console.log("elemento: "+elementoHTML+" calificacion: "+idCalificacion);
                
                $("#"+elementoHTML).attr("rel",idAreaOportunidad);
                //alert(elementoHTML+","+idAreaOportunidad);
                if(idCalificacion == 'BIE'){
                    $("."+elementoHTML+"-success").removeClass("color-verde-standar");
                    $("."+elementoHTML+"-success").addClass("color-verde-habilitado");
                    
                }else if(idCalificacion == 'MAL'){
                    $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                    $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                }
         });
    }
}



inventario.btnLimpiar = function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1){
        almacenamiento.salirModoConsulta();
        window.location = 'inicio.html';
    }else{
        _confirmarAntesDeEliminar();
    }
}
function cargarIdFoto(id){
    $("#eliminarFoto").attr("onclick","eliminarFoto('"+id+"')");
    
}
inventario.cargarFotos = function(folioa){
    myApp.showPreloader('Cargando imagen...Espere un momento por favor.');
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-fotografias-con-folio",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                folio:folioa
            },
            processData:true, 
            success:	function(re){
                 if(re!=undefined && re!=null){
                    console.log("inventario localmente: ");
                     $.each(re, function(index, item){
                            console.log(item);
                         var imagen = '<img src="'+imagenesInventario+item.imagen+'" rel="'+item.id+'" onclick="cargarIdFoto(\''+item.id+'\')" class="col-xs-12 radius hauto bcenter fondo-azul-claro bordeClaro conFoto" style="display: block;">';
                         $("#imagenes").append(imagen);
                     });
                 }
               myApp.hidePreloader();
               if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                    almacenamiento.cargoInventario('1');
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo cargar las fotografías del inventario.","Entendido");
                myApp.hidePreloader();
            }
        });
}
inventario.cargarFotosSinFolio = function(){
    myApp.showPreloader('Cargando imagen...Espere un momento por favor.');
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-fotografias-sin-folio",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idAutomovil:automovil.id,
                idPropietario:propietario.id
            },
            processData:true, 
            success:	function(re){
                 if(re!=undefined && re!=null){
                    console.log("inventario localmente: ");
                     $.each(re, function(index, item){
                            console.log(item);
                         var imagen = '<img src="'+imagenesInventario+item.imagen+'" rel="'+item.id+'" onclick="cargarIdFoto(\''+item.id+'\')" class="col-xs-12 radius hauto bcenter fondo-azul-claro bordeClaro conFoto" style="display: block;">';
                         $("#imagenes").append(imagen);
                     });
                 }
               myApp.hidePreloader();
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo cargar las fotografías del inventario.","Entendido");
                myApp.hidePreloader();
            }
        });
}
function eliminarFoto(id){
    
    if(id>0){
        
         myApp.modal({
                    title: 'Atención',
                    text: '¿Estas seguro de querer eliminar esta fotografía?',
                    buttons: [
                      {
                        text: 'Eliminar',
                        onClick: function() {
                            myApp.showPreloader('Eliminando imagen...');
                                var clav=clave();
                                $.ajax({
                                    url:      dominio+"elimina-fotografia",
                                    type:     'POST',
                                    dataType: "json",
                                    data:	{
                                        clave:       clav,
                                        codigo:      sha1(clav+palaSecr),
                                        id:id
                                    },
                                    processData:true, 
                                    success:	function(re){
                                         if(re!=undefined && re!=null){
                                            $("#imagenes .conFoto").each(function( index ) {
                                               if($(this).attr("rel").valueOf()==re){
                                                   $(this).remove();
                                               }
                                            }); 
                                         }
                                        myApp.hidePreloader();

                                    },
                                    error: function(re){
                                        myApp.hidePreloader();
                                        _mensaje("Atención","No hay internet, no se pudo eliminar la imagen.","Entendido");
                                    }
                                });
                        }
                      },
                    {
                        text: 'Cancelar',
                        onClick: function() {
                                myApp.closeModal();
                        }
                      }
                    ]
                  })
    
    }else{
         _mensaje("Atención","Seleccione la foto que desea eliminar y después de click en el boton de eliminar","Entendido");
    }
   
    
    
    
    
}

inventario.generarPedido=function(pendiente){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){//modo consulta
        _mensaje("Atención","No es posible guardar en modo consulta.","Entendido");
    }else{
        if(!pendiente && almacenamiento.verificaEstatusInspeccion()){
            _mensaje("Atención","En la inspección visual, debe checar todas las áreas de oportunidad","Entendido");
        }else if(!pendiente && almacenamiento.verificaMedicionesInspeccion()){
            _mensaje("Atención","En la inspección visual, Verifique los campos de Profundidad, Presión y Grosor sean mayor a cero.","Entendido");
        }else if(!pendiente && almacenamiento.verificarEstatusInventario()){
            _mensaje("Atención","No es posible guardar la orden. Debe checar todos las items del inventario y debe tener al menos una fotografía del automóvil.","Entendido");
        }else{
            ordenAutomovil = almacenamiento.obtenerOrdenAutomovil(pendiente);
        }//if
    }//if
}//function
