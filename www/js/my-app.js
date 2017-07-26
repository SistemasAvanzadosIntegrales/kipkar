// Initialize your app
var myApp = new Framework7({
    modalPreloaderTitle:'Cargando...Espere un momento por favor.',
    //onAjaxStart: function (xhr) {
        //myApp.showIndicator();
        //alert("comenzo");
    //}
});
var inspeccion ={
    cofre:[{}],
    interior_exterior:[{}]
}

        $(document).ready(function(){
                    // Wait for PhoneGap to load
                    document.addEventListener("deviceready", onDeviceReady, false);
                    /*if(cordova.plugins.backgroundMode.isEnabled()==false){
                        cordova.plugins.backgroundMode.enable();
                    }
                    if(cordova.plugins.backgroundMode.isActive()){
                        cordova.plugins.backgroundMode.disable();
                    }*/
                    function onDeviceReady() {
                        document.getElementById('exitApp').addEventListener('click', function() {
                            almacenamiento.limpiarTodo();
                            navigator.app.exitApp();
                        });
                    }
        });//function








var dominio ="http://kipkar.solucionesoftware.com.mx/sincronizacion/";
var dominioServicios ="http://kipkar.solucionesoftware.com.mx/servicios/";
var imagenesInventario ="http://kipkar.solucionesoftware.com.mx/cargas/fotosInventario/";
var palaSecr="miCar";
        
function clave(){
    var cara="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    clav="";
    for(var i=0; i<=20-1; i++){
        clav+=cara.substr(parseInt(Math.random()*cara.length),1);
    }//for
    return clav;
}//function

function quitaNull(txt){
    return txt==null?"":txt;
}//function


function _mensaje(titulo,texto,btnLabel,callback){
                myApp.modal({
                    title: titulo,
                    text: texto,
                    buttons: [
                      {
                        text: btnLabel,
                        onClick: function(){
                            if(callback!==undefined){
                                callback();
                            }//if
                        }//function
                      }
                    ]
                  })
}
function _mensajeCallback(titulo,texto,btnLabel,funcion){
                myApp.modal({
                    title: titulo,
                    text: texto,
                    buttons: [
                      {
                        text: btnLabel,
                        onClick: function() {
                           funcion();
                        }
                      }
                    ]
                  })
}

function _confirmarAntesDeEliminar(){
     myApp.modal({
                    title: 'Atención',
                    text: '¿Estas seguro de querer limpiar esta y todas las secciones?',
                    buttons: [
                      {
                        text: 'Limpiar',
                        onClick: function() {
                                //inicio.seleccionoOrde('');
                                almacenamiento.limpiaFolioActivo();
                                $("#ingreso").val('');
                                $("#entrega").val('');
                                $("#noBahia").val('').change();
                                almacenamiento.salirModoConsulta();
                                window.location = 'inicio.html';
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

}
function modoConsultaActivado(){
                myApp.modal({
                    title: "El modo consulta esta activado",
                    text: "Con el modo consulta solo podrá visualizar la información.<br/>Para desactivarlo presione cualquier botón de Limpiar.",
                    buttons: [
                      {
                        text: "Entendido",
                        onClick: function() {
                           
                        }
                      },
                        {
                        text: "Regresar al modo captura",
                        onClick: function() {
                            almacenamiento.salirModoConsulta();
                             window.location = 'inicio.html';
                        }
                      }
                    ]
                  })
}


function irA(peticion){
    var url='';

    switch(peticion){
        case "login":
            url='index.html';
            break;
        case "inicio":
            url='inicio.html';
            break;
        case "operacion":
            //verificar si hay  asesor, fecha del registro, bahia y exista automovil.
            //if(almacenamiento.dameEstatusModoConsulta().status=='0'){
            var automovil = almacenamiento.dameAutomovil();
                if($("#idUsuario").val()==''){
                    _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>El asesor no esta seleccionado.","Entendido");
                    //alert("No es posible pasar a la siguiente sección operaciones. El asesor no esta seleccionado.");
                    return null;
                }else if(almacenamiento.dameFechaPromesa()==null || almacenamiento.dameFechaPromesa()["fecha_promesa"].length<=12){
                    _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>La fecha y hora entrega.","Entendido");
                    //alert("No es posible pasar a la siguiente sección operaciones. El asesor no esta seleccionado.");
                    return null;
                }else if(automovil.id<=0 || automovil.id=='' || automovil.id==undefined){
                    _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>No ha seleccionado un Automovil.","Entendido");
                    //alert("No es posible pasar a la sección. operaciones. No ha seleccionado un Automovil.");
                    return null;
                }else if($("#ingreso").val()==''){
                    _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>Debe seleccionar una orden de servicio.","Entendido");
                    //alert("No es posible pasar a la sección operaciones. Debe seleccionar una orden de servicio.");
                    return null;
                }else if($("#noBahia").val()==''){
                   _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>Debe seleccionar la bahía de la sucursal","Entendido");
                    //alert("No es posible pasar a la sección operaciones. Debe seleccionar la bahía");
                    return null;
                }
           //}
            url='operacion.html';
            break;
        case "inspeccion":
             var automovil = almacenamiento.dameAutomovil();
             if(almacenamiento.dameEstatusModoConsulta().status=='0' || almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){//modo captura
                 if(almacenamiento.verificaEstatusServicios()==false){
                    _mensaje("Nos es posible moverse a esta pestaña hasta que se haya capturado al menos un servicio.","<br/>Verifique que tenga un servicio agregado y su precio sea mayor a cero.","Entendido");
                     return null; 
                 }
             }else{
                 
             }
                 
             
            url='inspeccion.html';
            break;
        case "inventario":
             //alert("Quiere entrar a inventario");
             var automovil = almacenamiento.dameAutomovil();
             if(almacenamiento.dameEstatusModoConsulta().status=='0' || almacenamiento.dameIdOrden()["idEstatus"]=="ABI"){//modo captura
                 almacenamiento.guardaEstatusSinRevision();
                 /*if(almacenamiento.verificaEstatusInspeccion()){
                      _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>Debe checar todas las áreas de oportunidad","Entendido");
                     return null;
                 }else if(almacenamiento.verificaMedicionesInspeccion()){
                      _mensaje("Nos es posible moverse a esta pestaña hasta que se hayan capturado todos los datos requeridos.","<br/>Verifique los campos de Profundidad, Presión y Grosor sean mayor a cero.","Entendido");
                     return null
                 }*/
             }//if
            url='inventario.html';
            break;
        case "salir":
            
            break;
    }
    window.location = ''+url;
    
    
           /* $.ajax({
                 url: "http://www.google.com",
                 context: document.body,
                 success: function() {
                     window.location = ''+url;
                },
                 error: function(jqXHR, exception) {
                    _mensajeCallback("Sin Conexión a Internet","No existe conexión a internet", " Ok ",inicio);
                }

            });*/
    
}

function cambiaColorInspeccion(elemento,semaforo,status,id){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }else{
        idElemento = $("#"+elemento).attr("rel").valueOf();
        var calificacion='';
        
        if(status=='success'){
            calificacion='BIE';
        }else if(status=='warning'){
            calificacion='MED';
        }else if(status=='danger'){
            calificacion='MAL';
        }
        
        console.log(idElemento+", "+calificacion);
        //actualizar el area de oportunidad en la inspeccion
        almacenamiento.actualizarInspeccion(idElemento,calificacion);
            if(semaforo=='2'){//solo hay rojo y verde
                if( status=='success'){
                    $("."+elemento+"-"+status).removeClass("color-verde-standar");
                    $("."+elemento+"-"+status).addClass("color-verde-habilitado");

                    $("."+elemento+"-danger").removeClass("color-rojo-habilitado");
                    $("."+elemento+"-danger").addClass("color-rojo-standar");
                }else{
                    $("."+elemento+"-"+status).removeClass("color-rojo-standar");
                    $("."+elemento+"-"+status).addClass("color-rojo-habilitado");

                    $("."+elemento+"-success").removeClass("color-verde-habilitado");
                    $("."+elemento+"-success").addClass("color-verde-standar");
                }
            }else{//hay rojo,amarillo y verde
                if( status=='success'){
                    $("."+elemento+"-"+status).removeClass("color-verde-standar");
                    $("."+elemento+"-"+status).addClass("color-verde-habilitado");

                    $("."+elemento+"-danger").removeClass("color-rojo-habilitado");
                    $("."+elemento+"-danger").addClass("color-rojo-standar");
                    $("."+elemento+"-warning").removeClass("color-amarillo-habilitado");
                    $("."+elemento+"-warning").addClass("color-amarillo-standar");
                    $("."+elemento+"-imagen").attr("src","imagenes/llanta.png");
                    $("."+elemento+"-imagenFreno").attr("src","imagenes/freno.png");
                }else if(status=='danger'){
                    $("."+elemento+"-"+status).removeClass("color-rojo-standar");
                    $("."+elemento+"-"+status).addClass("color-rojo-habilitado");

                    $("."+elemento+"-success").removeClass("color-verde-habilitado");
                    $("."+elemento+"-success").addClass("color-verde-standar");
                    $("."+elemento+"-warning").removeClass("color-amarillo-habilitado");
                    $("."+elemento+"-warning").addClass("color-amarillo-standar");
                     $("."+elemento+"-imagen").attr("src","imagenes/llanta_mal.png");
                    $("."+elemento+"-imagenFreno").attr("src","imagenes/freno_mal.png");
                    
                }else if(status=='warning'){
                    $("."+elemento+"-warning").removeClass("color-amarillo-standar");
                    $("."+elemento+"-warning").addClass("color-amarillo-habilitado");
                    
                    $("."+elemento+"-success").removeClass("color-verde-habilitado");
                    $("."+elemento+"-success").addClass("color-verde-standar");
                    $("."+elemento+"-danger").removeClass("color-rojo-habilitado");
                    $("."+elemento+"-danger").addClass("color-rojo-standar");
                    $("."+elemento+"-imagen").attr("src","imagenes/llanta_med.png");
                    $("."+elemento+"-imagenFreno").attr("src","imagenes/freno_med.png");
                }else{
                    $("."+elemento+"-success").removeClass("color-verde-habilitado");
                    $("."+elemento+"-success").addClass("color-verde-standar");
                    $("."+elemento+"-warning").removeClass("color-amarillo-habilitado");
                    $("."+elemento+"-warning").addClass("color-amarillo-standar");
                    $("."+elemento+"-danger").removeClass("color-rojo-habilitado");
                    $("."+elemento+"-danger").addClass("color-rojo-standar");
                    $("."+elemento+"-imagen").attr("src","imagenes/llanta_med.png");
                    $("."+elemento+"-imagenFreno").attr("src","imagenes/freno_med.png");
                }
            }
    }
    
}


function cambiaColorInventario(elemento,semaforo,status,id){
    if(almacenamiento.dameEstatusModoConsulta().status==1 && almacenamiento.dameIdOrden()["idEstatus"]!="ABI"){
        modoConsultaActivado();
        return null;
    }else{
        idElemento = $("#"+elemento).attr("rel").valueOf();
        var calificacion='';
        
        if(status=='success'){
            calificacion='BIE';
        }else{
            calificacion='MAL';
        }
        
        console.log(idElemento+", "+calificacion);
        //actualizar el area de oportunidad en la inspeccion
        almacenamiento.actualizarInventario(idElemento,calificacion);
            if(semaforo=='2'){//solo hay rojo y verde
                if( status=='success'){
                    $("."+elemento+"-"+status).removeClass("color-verde-standar");
                    $("."+elemento+"-"+status).addClass("color-verde-habilitado");

                    $("."+elemento+"-danger").removeClass("color-rojo-habilitado");
                    $("."+elemento+"-danger").addClass("color-rojo-standar");
                }else{
                    $("."+elemento+"-"+status).removeClass("color-rojo-standar");
                    $("."+elemento+"-"+status).addClass("color-rojo-habilitado");

                    $("."+elemento+"-success").removeClass("color-verde-habilitado");
                    $("."+elemento+"-success").addClass("color-verde-standar");
                }
            }
    }
    
}
function deleteAndInsert(id,calificacion){
    valor='';
    if(calificacion=='success'){
                valor = 'BIE';
    }else if(calificacion=='danger'){
                valor = 'MAL';
    }else{
                valor = 'MED';
    }
    if(inspeccion.cofre.length>0){
         jQuery.each(inspeccion.cofre, function(indice, elemento) {
            console.log(elemento);
           if(elemento.id == id){ // delete index
                delete inspeccion.cofre[indice];
                //insertamos el nuevo valor
                inspeccion.cofre.push({id:id,calificacion: valor});

            }
        });
    }else{
         //insertamos el nuevo valor
        inspeccion.cofre.push({id:id,calificacion: valor});
        console.log("Nuevo");
        console.log(inspeccion.cofre);
    }
   
}


function permiteNumerosConDecimal(evt, obj)
{
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    var value = obj.value;

    if(charCode==127 ||charCode==37 ||charCode==39)
        return true;
        
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains)
        if (charCode == 46) return false;
    if (charCode == 46 && value!='') return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;

}
function permiteNumerosConDosDecimales(evt, obj)
{
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    var value = obj.value;

    if(charCode==127 ||charCode==37 ||charCode==39)
        return true;
        
    var dotcontains = value.indexOf(".") != -1;
    if (dotcontains)
        if (charCode == 46) return false;
    if(dotcontains){
        valor = value.split(".");
        if(valor[1].length>=2){
            return false;
        }
    }
    if (charCode == 46 && value!='') return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;

}
function permiteNumerosSinDecimal(evt, obj)
{
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    var value = obj.value;
    if(charCode==127 ||charCode==37 ||charCode==39)
        return true;
    var dotcontains = value.indexOf(".") != 1;
    if (dotcontains)
        if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;

}

function permiteNumerosSinDecimalConGuionConEspacio(evt, obj)
{
    
    var charCode = (evt.which) ? evt.which : event.keyCode
    var value = obj.value;
    if(charCode==127 ||charCode==37 ||charCode==39)
        return true;
    var dotcontains = value.indexOf(".") != 1;
    var spacecontains = value.indexOf(" ") != -1;
    var guioncontains = value.indexOf("-") != -1;
    if (dotcontains)
        if (charCode == 46) return false;
    if (spacecontains)
        if (charCode == 32) return false;
    if (guioncontains)
        if (charCode == 45) return false;

    if (charCode == 46) return true;
    if (charCode == 32) return true;
    if (charCode == 45) return true;

    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;

}

function hoy(){
    var hoy = new Date();
    var anio = hoy.getFullYear();
    var mes = ((hoy.getMonth()+1) <10)?'0'+(hoy.getMonth()+1) : (hoy.getMonth()+1);
    var dia = ((hoy.getDate()) <10) ?'0'+(hoy.getDate()+1) : (hoy.getDate());
    console.log(anio+"-"+mes+"-"+dia+" "+hoy.getHours()+":"+hoy.getMinutes()+":"+hoy.getMilliseconds());
    
    return (anio+"-"+mes+"-"+dia+" "+hoy.getHours()+":"+(((hoy.getMinutes()).length<10)?'0'+hoy.getMinutes():hoy.getMinutes())+":00");
}
