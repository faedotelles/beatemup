const screen = document.querySelector('.screen');
const screenPosition = screen.getBoundingClientRect();


const canva = document.querySelector('#cenario');
const ctx = canva.getContext('2d');


//aqui irei desenhar o personagem

const alturaTotal = 970;
const larguraTotal = 1920;

const proporcaoTela = 60;

const alturaCeu = alturaTotal * proporcaoTela / 100;
const alturaChao = alturaTotal - alturaCeu;
const meioChao = alturaCeu + (alturaChao / 2);



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



var larguraBoneco = 80;
var alturaBoneco = 150

var eixoX = 30
var eixoY = alturaTotal - alturaBoneco - 30

desenhaCeu()
desenhaAsfalto()

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

let keysPressed = {};

let keyMapping = {
    'KeyW': 'cima',
    'KeyD': 'direita',
    'KeyS': 'baixo',
    'KeyA': 'esquerda',
    'Space': 'pulo'
}

document.addEventListener('keydown', (event) => {
   keysPressed[event.code] = true;
   console.log(keysPressed)

   if(event.code in keyMapping){
    atualizaPosicao(keyMapping[event.code]);
   }
   if(keysPressed['KeyW'] && keysPressed['KeyD']){
    atualizaPosicao('direita-cima');
   }
});



document.addEventListener('keyup', (event) => {
    delete keysPressed[event.code];
     if (keysPressed['KeyW'] && keysPressed['KeyD']) {
        atualizaPosicao('diagonal-cima-direita');
    } else if (keysPressed['KeyW']) {
        atualizaPosicao('KeyW');
    } else if (keysPressed['KeyS']) {
        atualizaPosicao('KeyS');
    } else if (keysPressed['KeyA']) {
        atualizaPosicao('KeyA');
    } else if (keysPressed['KeyD']) {
        atualizaPosicao(keyMapping['KeyD']);
    } else if (keysPressed['Space']) {
        atualizaPosicao('Space');
    }

})

var correndo = false;


document.addEventListener('keydown', (event) => {
    if(event.code == 'ShiftLeft'){
        correndo = true;
        drenarStamina()
    }
})

document.addEventListener('keyup', (event) => {
    if(event.code == 'ShiftLeft'){
        correndo = false;
        resetarStamina();
    }
})

function drenarStamina(){
    const intervalId = setInterval(() =>{
        stamina -= 3;
        desenhaStamina();
       if(stamina > 0){
        passos = 70
       } else {
        passos = 25
       }
        if(!correndo){
            clearInterval(intervalId);
            resetarStamina()
        }
    }, 100)
}

function resetarStamina(){
    passos = 25;
    stamina = 100
}


var staminaCanvas = document.querySelector('#stamina');
var ctxStamina = staminaCanvas.getContext('2d');
function desenhaStamina(){
    if(stamina > 0){
    ctxStamina.clearRect(0, 0, staminaCanvas.width, staminaCanvas.height);
    ctxStamina.fillStyle = "orange";
    ctxStamina.fillRect(50, 50, stamina * 2, 50)
    };
    
}
loop();

desenhaStamina()

function esperar(time) {
    return new  Promise(resolve => setTimeout(resolve, time));
}



setInterval(() => {
    atualizaPosicao(keysPressed)
}, 50);

function atualizaPosicao(teclas){
    if(teclas['KeyD']){
        targetX += passos;
    }
    if (teclas['KeyA']){
        targetX -= passos;
    } 
    if (teclas['KeyW']){
        if(targetY - passos < alturaChao + (alturaBoneco/ 2) - 20){
            // targetY = alturaChao + (alturaBoneco/ 2) - 20;
        } else {
            targetY -= passos;
        }
        
    }
     if (teclas['KeyS']){
        if(!targetY - passos > alturaTotal - alturaBoneco - 60){
            targetY += passos;
        }  
    }      
    if (teclas['Space']){
        targetY -= 50;
        esperar(600).then(() => {
            if(targetY + 50 > targetY - passos > alturaTotal - alturaBoneco - 60){
                targetY = targetY - passos > alturaTotal - alturaBoneco - 60
            } else {
                targetY+= 50
            };
        });
    }
}
