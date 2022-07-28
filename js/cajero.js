/*
    ************** Declaración de variables
*/
const renglon1 = document.querySelector('#renglon1');
const renglon2 = document.querySelector('#renglon2');
const ranuraTarjeta = document.querySelector('#ranuraTarjeta');
const tarjeta = document.querySelector('#tarjeta');
const mensajeTarjeta = document.querySelector('#mensaje-tarjeta');
const columnas = [
    document.querySelector('#columna1-1'),
    document.querySelector('#columna2-1'),
    document.querySelector('#columna1-2'),
    document.querySelector('#columna2-2'),
    document.querySelector('#columna1-3'),
    document.querySelector('#columna2-3'),
    document.querySelector('#columna1-4'),
    document.querySelector('#columna2-4')
];
let IDCuenta = -1;
let procedimiento = 0;
let numeroOperacion = 0;
let intentos = 3;
let password = '';
let monto = '';

/*
    ************** Eventos
*/
document.addEventListener('DOMContentLoaded', () => {
   VerificarSaldos();
});

/*
    ************** Funciones
*/
function VerificarSaldos(){
    let saldo = 0;
    cuentas.forEach(cuenta => {
        saldo = localStorage.getItem(cuenta.numeroCuenta);
       
        if(saldo){
            if(Number(cuenta.saldo) != Number(saldo)){
                cuenta.saldo = saldo;
            }
        }
    });

}

function InsetarTarjeta(){
    if(procedimiento==0){
        ranuraTarjeta.classList.add('efecto');
        ranuraTarjeta.classList.remove('borde-ranura');
        tarjeta.classList.remove('move-down');
        tarjeta.classList.add('move-up');
        mensajeTarjeta.textContent = '';
        renglon2.textContent = 'Seleccione una cuenta para comenzar';
        ConsultarCuentas();
        procedimiento++;
    }  
}


function ConsultarCuentas(){
    let i = 0;
    cuentas.forEach(cuenta  => {
        columnas[i].textContent = cuenta.nombre;
        i++;
    });
};

function SeleccionoOpcion(opcion){
    switch(procedimiento){
        case 0:{
            if(opcion == 1){
                IniciarPantalla();
            }
        }break;

        case 1:{
            IDCuenta = opcion;
            LimpiarOpciones();
            renglon1.textContent = `Ingrese su NIP por favor`;
            renglon2.innerHTML = '&nbsp;';
            columnas[5].textContent = 'Borrar';
            columnas[6].textContent = 'Cancelar';
            columnas[6].style.color = 'red';
            procedimiento++;
        }break;

        case 2:{
            if(opcion==5 && password.length > 0){
                password = password.substring(0, password.length - 1);
                renglon2.textContent =  renglon2.textContent.substring(0, renglon2.textContent.length - 1);
                columnas[7].innerHTML = '&nbsp;';
            }else if(opcion == 6){
                IniciarPantalla();
            }else if(opcion == 7){
                if(password.length == 4){
                    ValidarNIP(password);
                }
            }
        }break;

        case 3:{
            RealizaOperacion(opcion);
        }break;

        case 4:{
            if(opcion == 7){
                CargarPantallaInicio();
                monto = '';
                procedimiento = 3;
            }else if(opcion == 6){
                IniciarPantalla();
            }
        }break;

        case 5:{
            if(opcion == 3){
                monto = '';
                renglon2.textContent = `$ 0`; 
            }
            else if(opcion == 5){
                monto = monto.substring(0, monto.length - 1);
                if(monto.length == 0){
                    renglon2.textContent = `$ 0`; 
                }else{
                    renglon2.textContent = `$ ${monto}`; 
                }
            }else if(opcion == 6){
                monto = '';
                CargarPantallaInicio();
                procedimiento = 3;
            }else if(opcion == 7){
                if(numeroOperacion == 1){
                    ValidarIngreso();
                }else{
                    ValidaEgreso();
                }
            }
        }break;

        case 6:{
            if(opcion==6){
                monto = '';
                CargarPantallaInicio();
                procedimiento = 3;
            }else if(opcion==7){
                monto = '';
                LimpiarOpciones();
                if(numeroOperacion == 1){
                    RealizaOperacion(1);
                }else{
                    RealizaOperacion(2);
                }
               
            }
        }break;
    }
};

function SeleccionoNumero(numero){
    switch(procedimiento){
        case 2:{
            if(password.length < 4){
                password += numero;
                renglon2.textContent += '*';
                if(password.length == 4){
                    columnas[7].textContent = 'Continuar';
                }
            }
        }break;

        case 5:{
            if(monto.length < 3){
                monto += numero;
                renglon2.textContent = `$ ${monto}`;
            }
        }break;
    }
}

function IniciarPantalla(){
    password = '';
    procedimiento = 0;
    intentos = 3;
    IDCuenta = -1;
    monto = '';
    numeroOperacion = 0;
    ranuraTarjeta.classList.add('borde-ranura');
    ranuraTarjeta.classList.remove('efecto');
    tarjeta.classList.remove('move-up');
    tarjeta.classList.add('move-down');
    renglon1.textContent = 'Bienvenido al Cajero Automatico JS';
    renglon2.textContent = 'Inserte su tarjeta para comenzar';
    renglon1.style.color = 'black';
    mensajeTarjeta.textContent = 'Da click en la tarjeta para insertar';
    LimpiarOpciones();
}

function LimpiarOpciones(){
    columnas.forEach(columna =>{
        columna.innerHTML = '&nbsp;';
        columna.style.color = 'black';
    });
}

function ValidarNIP(NIP){
    if(cuentas[IDCuenta].NIP == NIP){
        procedimiento++;
        password = '';
        CargarPantallaInicio();
    }else{
        if(intentos-1 == -1){
            IniciarPantalla();
            renglon1.textContent = 'Número de intentos superados';
            renglon2.textContent = 'Intente más tarde o otra cuenta';
            renglon1.style.color = 'red';

            columnas[1].textContent = 'Continuar';
            columnas[1].style.color = 'black';

            procedimiento = 0;
        }else{
            columnas[0].textContent = 'NIP Incorrrecto intente de nuevo';
            columnas[0].style.color = 'red';
            columnas[1].textContent = `Numero de intentos restante: ${intentos}`;
            columnas[1].style.color = 'red';
            columnas[7].innerHTML = '&nbsp;';
            intentos--;

            renglon2.innerHTML = '&nbsp;';
            password = '';
        }
    }
}

function CargarPantallaInicio(){
    LimpiarOpciones();
    monto = '';
    renglon1.textContent = `Bienvenido ${cuentas[IDCuenta].nombre} con el numero de cuenta ${cuentas[IDCuenta].numeroCuenta}`;
    renglon1.style.color = 'black';
    renglon2.textContent = 'Seleccione la operación a realizar'
    columnas[0].textContent = 'Consultar saldo';
    columnas[1].textContent = 'Ingresar monto';
    columnas[2].textContent = 'Retirar Monto';
    columnas[6].textContent = 'Salir de la Sesión';
}

function Continuar(){
    SeleccionoOpcion(7);
}

function Anular(){
    SeleccionoOpcion(5);
}

function Cancelar(){
    SeleccionoOpcion(6);
}

function RealizaOperacion(operacion){
    switch(operacion){
        case 0:{
            LimpiarOpciones();
            renglon1.textContent = 'Tu saldo actual es de: ';
            renglon2.textContent = `$ ${cuentas[IDCuenta].saldo}`;
            columnas[6].textContent = 'Salir de la Sesión';
            columnas[7].textContent = 'Realizar otra operación';
            procedimiento = 4;
        }break;

        case 1:{
            LimpiarOpciones();
            renglon1.textContent = 'Tecleé el monto a ingresar: ';
            renglon1.style.color = 'black';
            renglon2.textContent = '$ 0';
            columnas[3].textContent = 'Borrar Todo';
            columnas[5].textContent = 'Borrar';
            columnas[6].textContent = 'Cancelar';
            columnas[6].style.color = 'red';
            columnas[7].textContent = 'Confirmar';
            columnas[7].style.color = 'green';
            procedimiento = 5;
            numeroOperacion = 1;
            monto = '';
        }break;

        case 2:{
            LimpiarOpciones();
            renglon1.textContent = 'Tecleé el monto a retirar';
            renglon1.style.color = 'black';
            renglon2.textContent = '$ 0';
            columnas[3].textContent = 'Borrar Todo';
            columnas[5].textContent = 'Borrar';
            columnas[6].textContent = 'Cancelar';
            columnas[6].style.color = 'red';
            columnas[7].textContent = 'Confirmar';
            columnas[7].style.color = 'green';
            procedimiento = 5;
            numeroOperacion = 2;
            monto = '';
        }break;

        case 6:{
            IniciarPantalla();
        }break;
    }
}

function ValidarIngreso(){
    let saldo = Number(cuentas[IDCuenta].saldo);
    if(Number(monto) + saldo > 990){
        LimpiarOpciones();
        renglon1.textContent = 'El monto ingresado más su saldo actual supera los $990';
        renglon1.style.color = 'red';
        renglon2.innerHTML = '&nbsp;';
        columnas[6].textContent = 'Volver al inicio';
        columnas[7].textContent = 'Ingresar otro monto';
        monto = '';
        procedimiento = 6;
    }else if(monto == ''){
        columnas[0].textContent = 'Ingrese un Numero Mayor a 0';
        monto = '';
        columnas[0].style.color = 'red';
    }else{
        cuentas[IDCuenta].saldo = saldo + Number(monto);
        localStorage.setItem(cuentas[IDCuenta].numeroCuenta, cuentas[IDCuenta].saldo);
        LimpiarOpciones();
        renglon1.textContent = 'Tú nuevo saldo es: ';
        renglon2.textContent = `$ ${cuentas[IDCuenta].saldo}`;
        columnas[6].textContent = 'Salir de la Sesión';
        columnas[7].textContent = 'Realizar otra operación';
        procedimiento = 4;
    }
};

function ValidaEgreso(){
    let saldo = Number(cuentas[IDCuenta].saldo);
    if(saldo - Number(monto) < 10){
        LimpiarOpciones();
        renglon1.textContent = 'Su saldo actual menos el monto ingresado no supera los $10';
        renglon1.style.color = 'red';
        renglon2.innerHTML = '&nbsp;';
        columnas[6].textContent = 'Volver al inicio';
        columnas[7].textContent = 'Ingresar otro monto a retirar';
        monto = '';
        procedimiento = 6;
    }else if(monto == ''){
        columnas[0].textContent = 'Ingrese un Numero Mayor a 0';
        monto = '';
        columnas[0].style.color = 'red';
    }else{
        cuentas[IDCuenta].saldo = saldo - Number(monto);
        localStorage.setItem(cuentas[IDCuenta].numeroCuenta, cuentas[IDCuenta].saldo);
        LimpiarOpciones();
        renglon1.textContent = 'Tú nuevo saldo es: ';
        renglon2.textContent = `$ ${cuentas[IDCuenta].saldo}`;
        columnas[6].textContent = 'Salir de la Sesión';
        columnas[7].textContent = 'Realizar otra operación';
        procedimiento = 4;
    }
}

