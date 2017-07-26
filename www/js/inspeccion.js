inspeccion = {};
$(document).ready(function(){
    document.addEventListener("deviceready",function(){
        $("#btnImprimir").css("display",(almacenamiento.dameEstatusModoConsulta().status==1?"":"none"));
        //obtenemos los datos del automovil y propietario seleccionado
        //seteamos los campos del encabezado
        var propietario = almacenamiento.damePropietario();
        var automovil = almacenamiento.dameAutomovil();
        var folio = almacenamiento.dameFolioActivo();
        //folio,modelo,cliente
        
        $("#headerModelo").val(automovil.marca+", "+automovil.modelo+", "+automovil.motor);
        $("#headerCliente").val(propietario.nombre);
        
        if(almacenamiento.dameEstatusModoConsulta().status=='1' && almacenamiento.consultaCargoInspeccion()=='0'){
            $("#headerFolio").val(folio.id);
            $("#servicios").attr("disabled","disabled");
            $("#ModoActivo").html('Consulta');
            //almacenamiento.vaciarInspeccion();
            //obtenemos los servicios relacionados a la orden de servicio seleccionada
            inspeccion.cargarAreasOportunidad(almacenamiento.dameFolioActivo().id);
            //inspeccion.cargarLlantas(almacenamiento.dameFolioActivo().id); //Serializaremos la carga de areas y de llantas para despues marcarlo como cargoInspeccion
            //if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
            //    almacenamiento.cargoInspeccion('1');
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
            //obtenemos los servicios relacionados a la orden de servicio seleccionada
            inspeccion.cargarTodasAreasOportunidad();
            //inspeccion.cargarInspeccion();
            inspeccion.cargarMedicionesLocalmente();
            
        }
        
        var modo=almacenamiento.dameEstatusModoConsulta();
        var modoStatus=modo.status=='1' && almacenamiento.dameIdOrden()["idEstatus"]!="ABI";
        $("#llanta_prof_del_izq")[0].disabled  =modoStatus;
        $("#llanta_pres_del_izq")[0].disabled  =modoStatus;
        $("#llanta_prof_tras_izq")[0].disabled =modoStatus;
        $("#llanta_pres_tras_izq")[0].disabled =modoStatus;
        $("#llanta_prof_del_der")[0].disabled  =modoStatus;
        $("#llanta_pres_del_der")[0].disabled  =modoStatus;
        $("#llanta_prof_tras_der")[0].disabled =modoStatus;
        $("#llanta_pres_tras_der")[0].disabled =modoStatus;
        $("#llanta_prof_ref")[0].disabled      =modoStatus;
        $("#llanta_pres_ref")[0].disabled      =modoStatus;
        $("#freno_delantero_izq")[0].disabled  =modoStatus;
        $("#freno_vida_del_izq")[0].disabled   =modoStatus;
        $("#freno_trasero_izq")[0].disabled    =modoStatus;
        $("#freno_vida_tras_izq")[0].disabled  =modoStatus;
        $("#freno_vida_tras_der")[0].disabled  =modoStatus;
        $("#freno_vida_del_der")[0].disabled   =modoStatus;
        $("#freno_grosor_del_izq")[0].disabled =modoStatus;
        $("#freno_grosor_tras_izq")[0].disabled=modoStatus;
        $("#freno_grosor_del_der")[0].disabled =modoStatus;
        $("#freno_grosor_tras_der")[0].disabled=modoStatus;
        
        $("#chkSinLlantaRefaccion").bind("click",function(){
            var modo=almacenamiento.dameEstatusModoConsulta();
            if(modo.status=='1' && almacenamiento.dameIdOrden()["idEstatus"]!="ABI")
                return false;
            if(this.checked){
                $("#llanta_prof_ref").val("");
                $("#llanta_pres_ref").val("");
                $("#llanta_prof_ref")[0].disabled=true;
                $("#llanta_pres_ref")[0].disabled=true;
            }else{
                $("#llanta_prof_ref")[0].disabled=false;
                $("#llanta_pres_ref")[0].disabled=false;
            }//if
            cambiaColorInspeccion('refaccion','3','');
            inspeccion.ActualizarMedicionLLantas();
        });
        
        inspeccion.bloqueaCampos();
    },false);
});

inspeccion.bloqueaCampos=function(){
    if($("#chkSinLlantaRefaccion")[0].checked){
        $("#llanta_prof_ref")[0].disabled=true;
    }//if
    if($("#chkSinLlantaRefaccion")[0].checked){
        $("#llanta_pres_ref")[0].disabled=true;
    }//if
    if($("#freno_vida_del_izq").val()=='-1'){
        $("#freno_grosor_del_izq")[0].disabled=true;
    }//if
    if($("#freno_vida_del_der").val()=='-1'){
        $("#freno_grosor_del_der")[0].disabled=true;
    }//if
    if($("#freno_vida_tras_izq").val()=='-1'){
        $("#freno_grosor_tras_izq")[0].disabled=true;
    }//if
    if($("#freno_vida_tras_der").val()=='-1'){
        $("#freno_grosor_tras_der")[0].disabled=true;
    }//if
}//function

inspeccion.cargarTodasAreasOportunidad=function(){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-inspeccion-todas-area-oportunidad",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr)
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
                        var idServicio = item.idServicio;
                        var estatus = item.estatus;
                        var tipo = item.tipo;
                        var servicio = item.servicio;
                        var totalRefacciones = item.totalRefacciones;
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
                        }else if(idCalificacion == 'MED'){
                            $("."+elementoHTML+"-warning").removeClass("color-amarillo-standar");
                            $("."+elementoHTML+"-warning").addClass("color-amarillo-habilitado");
                        }else if(idCalificacion == 'MAL'){
                            $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                            $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                        }
                        
                        //guardamos y seteamos los valores de las areas de oportunidad ligadas a la orden de servicio
                    almacenamiento.guardarInspeccion('',idAreaOportunidad,areaOportunidad,idTipo,idServicio,estatus,tipo,servicio,totalRefacciones,idCalificacion,calificacion,fecha);
                     z++;
                    if(z == (cuantos-1)){
                        inspeccion.cargarInspeccion( almacenamiento.dameEstatusModoConsulta().status=='1' ? almacenamiento.dameFolioActivo().id : '' );
                    }
                      
                });
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener información de las áreas de oportunidad.","Entendido");
            }
        });
}

inspeccion.cargarInspeccion=function(folio){
    
     var re = almacenamiento.cargarInspeccion(folio);
    if(re!=undefined && re!=null){
        console.log("areas de oportunidad localmente: ");
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
                if(idCalificacion == 'BIE'){
                    $("."+elementoHTML+"-success").removeClass("color-verde-standar");
                    $("."+elementoHTML+"-success").addClass("color-verde-habilitado");
                    
                    if( $("."+elementoHTML+"-imagen").length>0){
                       $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta.png"); 
                    }
                        
                    if( $("."+elementoHTML+"-imagenFreno").length>0){
                        $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/freno.png");
                    }
                        
                }else if(idCalificacion == 'MED'){
                    $("."+elementoHTML+"-warning").removeClass("color-amarillo-standar");
                    $("."+elementoHTML+"-warning").addClass("color-amarillo-habilitado");
                    
                    if( $("."+elementoHTML+"-imagen").length>0){
                       $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta_med.png"); 
                    }
                        
                    if( $("."+elementoHTML+"-imagenFreno").length>0){
                        $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/freno_med.png");
                    }
                    
                    
                }else if(idCalificacion == 'MAL'){
                    $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                    $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                    
                    
                    if( $("."+elementoHTML+"-imagen").length>0){
                       $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta_mal.png"); 
                    }
                        
                    if( $("."+elementoHTML+"-imagenFreno").length>0){
                        $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/freno_mal.png");
                    }
                    
                }
         });
    }
}


inspeccion.cargarAreasOportunidad=function(folio){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-inspeccion-area-oportunidad",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                folio: folio
            },
            processData:true, 
            success:	function(re){
                console.log("areas de oportunidad: ");
                var cuantos = re.length;
                var z =0;
                $.each(re, function(index, item){
                    //console.log(re);
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
                        var elementoHTML = areaOportunidad;
                        elementoHTML = elementoHTML.replace(new RegExp(" ", 'g'), "_");
                        elementoHTML = elementoHTML.replace(new RegExp("é", 'g'), "e");
                        elementoHTML = elementoHTML.replace(new RegExp("í", 'g'), "i");
                        elementoHTML = elementoHTML.replace(new RegExp("ó", 'g'), "o");
                        elementoHTML = elementoHTML.replace(new RegExp("ú", 'g'), "u");
                        elementoHTML = elementoHTML.replace(new RegExp("á", 'g'), "a");
                        elementoHTML = elementoHTML.replace(new RegExp("ñ", 'g'), "n");
                        elementoHTML = elementoHTML.toLowerCase();
                        console.log("elemento: "+elementoHTML);
                    
                        $("#"+elementoHTML).attr("rel",idAreaOportunidad);
                    
                        if(idCalificacion == 'BIE'){
                            $("."+elementoHTML+"-success").removeClass("color-verde-standar");
                            $("."+elementoHTML+"-success").addClass("color-verde-habilitado");
                            if( $("."+elementoHTML+"-imagen").length>0)
                                $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta.png");
                            if( $("."+elementoHTML+"-imagenFreno").length>0)
                                $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/freno.png");
                        }else if(idCalificacion == 'MED'){
                            $("."+elementoHTML+"-warning").removeClass("color-amarillo-standar");
                            $("."+elementoHTML+"-warning").addClass("color-amarillo-habilitado");
                            
                            if( $("."+elementoHTML+"-imagen").length>0)
                                $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta_med.png");
                            if( $("."+elementoHTML+"-imagenFreno").length>0)
                                $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/freno_med.png");
                        }else if(idCalificacion == 'MAL'){
                            $("."+elementoHTML+"-danger").removeClass("color-rojo-standar");
                            $("."+elementoHTML+"-danger").addClass("color-rojo-habilitado");
                            
                            if( $("."+elementoHTML+"-imagen").length>0)
                                $("."+elementoHTML+"-imagen").attr("src","imagenes/llanta_mal.png");
                            if( $("."+elementoHTML+"-imagenFreno").length>0)
                                $("."+elementoHTML+"-imagenFreno").attr("src","imagenes/llanta_mal.png");
                        }
                        
                        //guardamos y seteamos los valores de las areas de oportunidad ligadas a la orden de servicio
                        almacenamiento.guardarInspeccion(folio,idAreaOportunidad,areaOportunidad,idTipo,idServicio,estatus,tipo,servicio,totalRefacciones,idCalificacion,calificacion,fecha);
                    z++;
                    console.log(z);
                    if(z == (cuantos-1)){
                        inspeccion.cargarInspeccion(folio);
                    } 
                });
                inspeccion.cargarLlantas(almacenamiento.dameFolioActivo().id);
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener información de las áreas de oportunidad.","Entendido");
            }
        });
}

inspeccion.cargarLlantas=function(folio){
    var clav=clave();
        $.ajax({
            url:      dominio+"dame-inspeccion-llantas",
            type:     'POST',
            dataType: "json",
            data:	{
                clave:       clav,
                codigo:      sha1(clav+palaSecr),
                idOrden: folio
            },
            processData:true,
            success:	function(re){
                console.log("llantas: ");
                console.log(re);
                
                if(re!=undefined && re!=''){
                    $("#llanta_prof_del_izq").val(re.profLlanDelaIzqu);
                    $("#llanta_pres_del_izq").val(re.presLlanDelaIzqu);
                    $("#llanta_prof_del_der").val(re.profLlanDelaDere);
                    $("#llanta_pres_del_der").val(re.presLlanDelaDere);
                    $("#llanta_prof_tras_izq").val(re.profLlanTrasIzqu);
                    $("#llanta_pres_tras_izq").val(re.presLlanTrasIzqu);
                    $("#llanta_prof_tras_der").val(re.profLlanTrasDere);
                    $("#llanta_pres_tras_der").val(re.presLlanTrasDere);
                    $("#llanta_prof_ref").val(re.profLlanRefa==0?"":re.profLlanRefa);
                    $("#llanta_pres_ref").val(re.presLlanRefa==0?"":re.presLlanRefa);
                    if($("#llanta_prof_ref").val()==''){
                        $("#chkSinLlantaRefaccion")[0].checked=true;
                    }//if
                    
                    $("#freno_vida_del_izq").val(re.porcFrenDelaIzqu=='0'?'':re.porcFrenDelaIzqu);
                    $("#freno_grosor_del_izq").val(re.frenGrosDelaIzqu==0?"":re.frenGrosDelaIzqu);
                    $("#freno_vida_del_der").val(re.porcFrenDelaDere=='0'?'':re.porcFrenDelaDere); 
                    $("#freno_grosor_del_der").val(re.frenGrosDelaDere==0?"":re.frenGrosDelaDere);
                    $("#freno_vida_tras_izq").val(re.porcFrenTrasIzqu=='0'?'':re.porcFrenTrasIzqu);
                    $("#freno_grosor_tras_izq").val(re.frenGrosTrasIzqu==0?"":re.frenGrosTrasIzqu);
                    $("#freno_vida_tras_der").val(re.porcFrenTrasDere=='0'?'':re.porcFrenTrasDere);
                    $("#freno_grosor_tras_der").val(re.frenGrosTrasDere==0?"":re.frenGrosTrasDere);
                    almacenamiento.guardarMedicionLlantas(folio,re.id,re.idOrdenServicio,re.profLlanDelaIzqu,re.profLlanDelaDere,re.profLlanTrasIzqu,re.profLlanTrasDere,re.profLlanRefa,re.presLlanDelaIzqu,re.presLlanDelaDere,re.presLlanTrasIzqu,re.presLlanTrasDere,re.presLlanRefa,re.porcFrenDelaIzqu,re.porcFrenDelaDere,re.porcFrenTrasIzqu,re.porcFrenTrasDere,re.frenGrosDelaIzqu,re.frenGrosDelaDere,re.frenGrosTrasIzqu,re.frenGrosTrasDere);    
                }
                if(almacenamiento.dameIdOrden()["idEstatus"]=="ABI")
                    almacenamiento.cargoInspeccion('1');
                inspeccion.bloqueaCampos();
            },
            error: function(re){
                _mensaje("Atención","No hay internet, no se pudo obtener información de las Llantas.","Entendido");
            }
        });
}


inspeccion.btnLimpiar = function(){
    if(almacenamiento.dameEstatusModoConsulta().status==1){
        almacenamiento.salirModoConsulta();
        window.location = 'inicio.html';
    }else{
        _confirmarAntesDeEliminar();
    }
}

inspeccion.cargarMedicionesLocalmente=function(){

    var re = almacenamiento.dameMedicionesLlantas();
    if(re!=undefined && re!=null){
        $("#llanta_prof_del_izq").val(re.prof_del_izq);
        $("#llanta_pres_del_izq").val(re.pres_del_izq);
        $("#llanta_prof_del_der").val(re.prof_del_der);
        $("#llanta_pres_del_der").val(re.pres_del_der);
        $("#llanta_prof_tras_izq").val(re.prof_tras_izq);
        $("#llanta_pres_tras_izq").val(re.pres_tras_izq);
        $("#llanta_prof_tras_der").val(re.prof_tras_der);
        $("#llanta_pres_tras_der").val(re.pres_tras_der);
        $("#llanta_prof_ref").val(re.prof_refa==0?"":re.prof_refa);
        $("#llanta_pres_ref").val(re.pres_refa==0?"":re.pres_refa);
        //alert(re.prof_refa);
        if($("#llanta_pres_ref").val()==''){
            $("#chkSinLlantaRefaccion")[0].checked=true;
            //$("#chkSinLlantaRefaccion").trigger("click");
        }//if

        $("#freno_vida_del_izq").val(re.vida_del_izq);
        $("#freno_grosor_del_izq").val(re.grosor_del_izq==0?"":re.grosor_del_izq);
        $("#freno_vida_del_der").val(re.vida_del_der); 
        $("#freno_grosor_del_der").val(re.grosor_del_der==0?"":re.grosor_del_der);
        $("#freno_vida_tras_izq").val(re.vida_tras_izq);
        $("#freno_grosor_tras_izq").val(re.grosor_tras_izq==0?"":re.grosor_tras_izq);
        $("#freno_vida_tras_der").val(re.vida_tras_der);
        $("#freno_grosor_tras_der").val(re.grosor_tras_der==0?"":re.grosor_tras_der);
    }
                    
}
inspeccion.ActualizarMedicionLLantas=function(){
    
    if($("#freno_vida_del_izq").val()=='-1'){
        $("#freno_grosor_del_izq").val('');
        $("#freno_grosor_del_izq")[0].disabled=true;
    }else{
        $("#freno_grosor_del_izq")[0].disabled=false;
    }//if
    if($("#freno_vida_tras_izq").val()=='-1'){
        $("#freno_grosor_tras_izq").val('');
        $("#freno_grosor_tras_izq")[0].disabled=true;
    }else{
        $("#freno_grosor_tras_izq")[0].disabled=false;
    }//if
    if($("#freno_vida_del_der").val()=='-1'){
        $("#freno_grosor_del_der").val('');
        $("#freno_grosor_del_der")[0].disabled=true;
    }else{
        $("#freno_grosor_del_der")[0].disabled=false;
    }//if
    if($("#freno_vida_tras_der").val()=='-1'){
        $("#freno_grosor_tras_der").val('');
        $("#freno_grosor_tras_der")[0].disabled=true;
    }else{
        $("#freno_grosor_tras_der")[0].disabled=false;
    }//if
    
    almacenamiento.actualizarMedicionLlantas('',
                                             '',
                                             $("#llanta_prof_del_izq").val(),
                                             $("#llanta_prof_del_der").val(),
                                             $("#llanta_prof_tras_izq").val(),
                                             $("#llanta_prof_tras_der").val(),
                                             $("#llanta_prof_ref").val(),
                                             $("#llanta_pres_del_izq").val(),
                                             $("#llanta_pres_del_der").val(),
                                             $("#llanta_pres_tras_izq").val(),
                                             $("#llanta_pres_tras_der").val(),
                                             $("#llanta_pres_ref").val(),
                                             $("#freno_vida_del_izq").val(),
                                             $("#freno_vida_del_der").val(),
                                             $("#freno_vida_tras_izq").val(),
                                             $("#freno_vida_tras_der").val(),
                                             $("#freno_grosor_del_izq").val(),
                                             $("#freno_grosor_del_der").val(),
                                             $("#freno_grosor_tras_izq").val(),
                                             $("#freno_grosor_tras_der").val(),
                                             $("#chkSinLlantaRefaccion")[0].checked
                                            );    
}

function cambiarColorLlanta(cual,mili){
    var icono=(mili<=2
        ?'danger'
        :(mili>2 && mili<=5
            ?'warning'
            :'success'
        )
    );
    cambiaColorInspeccion(cual,'3',icono);
}//function

function cambiarColorFreno(cual,valo){
    var icono=(valo=='1'
        ?'success'
        :(valo=='2'
            ?'warning'
            :(valo=='3'
                ?'danger'
                :""
            )
        )
    );
    cambiaColorInspeccion(cual,'3',icono);
}//function