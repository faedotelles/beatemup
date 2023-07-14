const screen = document.querySelector('.screen');
const screenPosition = screen.getBoundingClientRect();

const canva = document.querySelector('#cenario');
const ctx = canva.getContext('2d');


// Dimensoes
const alturaTotal = 970;
const larguraTotal = 1920;
const proporcaoTela = 60;
const alturaCeu = alturaTotal * proporcaoTela / 100;
const alturaChao = alturaTotal - alturaCeu;
const meioChao = alturaCeu + (alturaChao / 2);

// Variaveis de Jogabilidade
var puloAltura = 200;
var puloTempo = puloAltura * 2;
var larguraBoneco = 80;
var alturaBoneco = 150
var eixoX = 30
var eixoY = alturaTotal - alturaBoneco - 30
let keysPressed = {};

//Variaveis do Boenco
var pulando = false;
var correndo = false;
var passos = 30
var stamina = 100;


function desenhaCeu(){
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0,0,1920,alturaCeu)
    ctx.fillStyle = "dimgrey";
    ctx.fillRect(0,alturaCeu, larguraTotal, alturaChao)
    
}

function desenhaAsfalto(){
    ctx.fillStyle = "black";
    var larguraFaixa = 80;
    for(i = 50; i < larguraTotal; i += (larguraFaixa * 2) ){
        ctx.fillRect(i,meioChao - 10,larguraFaixa,20)
    }
    
}

// Player
var playerCanvas = document.querySelector('#player');
var ctxPlayer = playerCanvas.getContext('2d');
var posX = larguraBoneco / 2;
var posY = alturaTotal - alturaBoneco * 1.3;
var targetX = larguraBoneco / 2;
var targetY = alturaTotal - alturaBoneco * 1.3;
var easing = 0.08;

function desenhaBloco() {
    ctxPlayer.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    ctxPlayer.fillStyle = "orange";
    ctxPlayer.fillRect(posX, posY, larguraBoneco, alturaBoneco);
}

function interpolar() {
    var dx = targetX - posX;
    var dy = targetY - posY;
    posX += dx * easing;
    posY += dy * easing;
}

function loop() {
    interpolar();
    desenhaBloco();
    requestAnimationFrame(loop);
}

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.code];
    if(event.code == 'ShiftLeft'){
        correndo = false;
    }
})



document.addEventListener('keydown', (event) => {
    keysPressed[event.code] = true;d
    if(event.code == 'ShiftLeft'){
        correndo = true;
        drenarStamina()
    }
})

function drenarStamina(){
    const intervalId = setInterval(() =>{
        if(stamina >= 10){
            // stamina -=10;
            for(var i = 0; i < 10; i ++){
                setTimeout(() => {
                stamina -= 1;
                desenhaStamina();
            }, 5);
}
            passos = 50
        }else {
        passos = 30
       }
        if(!correndo){
            clearInterval(intervalId);
        }
    }, 50)
}

//Stamina
var staminaCanvas = document.querySelector('#stamina');
var ctxStamina = staminaCanvas.getContext('2d');
function desenhaStamina(){
    if(stamina > 0){
    ctxStamina.clearRect(0, 0, staminaCanvas.width, staminaCanvas.height);
    ctxStamina.fillStyle = "orange";
    ctxStamina.fillRect(50, 50, stamina * 2, 50)
    };
    
}

function esperar(time) {
    return new  Promise(resolve => setTimeout(resolve, time));
}

setInterval(() => {
    atualizaPosicao(keysPressed)
    desenhaStamina()
    if(stamina < 100){
        stamina ++
    }
}, 50); 

function atualizaPosicao(teclas){
    if(teclas['KeyD']){
        targetX += passos;
    }
    if (teclas['KeyA']){
        targetX -= passos;
    } 
    if (teclas['KeyW']){
        if(!(targetY - passos < alturaChao + (alturaBoneco/ 2) - 20)){
            targetY -= passos;
        } 
    }

     if (teclas['KeyS']){
        var safeZone = alturaTotal - alturaBoneco - 40;
        if(pulando){
            safeZone -= puloAltura
        }
        if(targetY < safeZone){
            targetY += passos;
        } 
    }      
    if (teclas['Space']){
        if(!pulando){
            targetY -= puloAltura;
        pulando = true;
        esperar(puloTempo).then(() => {
            targetY += puloAltura
        }).then(() =>{
           esperar(puloTempo).then(
            ()=>{ pulando = false;}
           )
        });
        }
    }
}

desenhaCeu()
desenhaAsfalto()
loop();
desenhaStamina()