const canvas = document.getElementById('pintura');
const ctx = canvas.getContext('2d');
const vidasEl = document.getElementById('vidas');
const puntajeEl = document.getElementById('puntaje');
const reiniciarBtn = document.getElementById('reiniciar');

let nave, disparos, enemigos;
let puntaje = 0;
let vidas = 3;
let finJuego = false;

const imgNave = new Image();
imgNave.src = './imagenes/klipartz.com (4).png';
const imgEnemigo = new Image();
imgEnemigo.src = './imagenes/klipartz.com.png';

function crearNave() {  
    nave = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 120 ,
        width: 100,
        height: 100,
    };
}

function crearEnemigos() {
    enemigos = [];
    for (let i = 0; i < 5; i++) {
        enemigos.push({
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * -200,
            width: 100,
            height: 100,
            velocidad: Math.random() * 1.5 + 1, 
        });
    }
}

function dibujarNave() {
    ctx.drawImage(imgNave, nave.x, nave.y, nave.width, nave.height);
}

function dibujarEnemigos() {
    enemigos.forEach((enemigo) => {
        ctx.drawImage(imgEnemigo, enemigo.x, enemigo.y, enemigo.width, enemigo.height);
    });
}

function dibujarDisparos() {
    disparos.forEach((disparo, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
        disparo.y -= disparo.velocidad;

        // Eliminar disparos fuera de la pantalla
        if (disparo.y < 0) disparos.splice(index, 1);
    });
}
function colision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function actualizar() {
    enemigos.forEach((enemigo, index) => {
        enemigo.y += enemigo.velocidad;

        if (colision(nave, enemigo)) {
            enemigos.splice(index, 1);
            vidas--;
            vidasEl.textContent = vidas;
            if (vidas === 0) finJuego = true;
        }

        if (enemigo.y > canvas.height) {
            enemigos.splice(index, 1);
            enemigos.push({
                x: Math.random() * (canvas.width - 50),
                y: Math.random() * -200,
                width: 50,
                height: 50,
                velocidad: Math.random() * 1.5 + 1,
            });
        }
    });

    // Detectar colisión entre disparos y enemigos
    disparos.forEach((disparo, disparoIndex) => {
        enemigos.forEach((enemigo, enemigoIndex) => {
            if (colision(disparo, enemigo)) {
                enemigos.splice(enemigoIndex, 1);
                disparos.splice(disparoIndex, 1);
                puntaje += 10;
                puntajeEl.textContent = puntaje;

                // Reaparecer enemigo
                enemigos.push({
                    x: Math.random() * (canvas.width - 50),
                    y: Math.random() * -200,
                    width: 50,
                    height: 50,
                    velocidad: Math.random() * 1.5 + 1,
                });
            }
        });
    });
}

// Animar el juego
function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dibujarNave();
    dibujarEnemigos();
    dibujarDisparos();
    actualizar();

    if (!finJuego) {
        requestAnimationFrame(animar);
    } else {
        alert('¡Juego terminado!');
    }
}

// Manejo de eventos
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    nave.x = e.clientX - rect.left - nave.width / 2;
});

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        disparos.push({
            x: nave.x + nave.width / 2 - 5,
            y: nave.y,
            width: 5,
            height: 15,
            velocidad: 5,
        });
    }
});

reiniciarBtn.addEventListener('click', () => {
    vidas = 3;
    puntaje = 0;
    finJuego = false;
    vidasEl.textContent = vidas;
    puntajeEl.textContent = puntaje;
    crearNave();
    crearEnemigos();
    disparos = [];
    animar();
});

crearNave();
crearEnemigos();
disparos = [];
animar();
