// DOM

const horas = document.querySelector('#horas')
const minutos = document.querySelector('#minutos')
const segundos = document.querySelector('#segundos')

// EVENTO

setInterval(relogio, 1000)

// FUNÇÃO

function relogio(){
    hoje = new Date()

    hr = hoje.getHours()
    min = hoje.getMinutes()
    sec = hoje.getSeconds()

    if(sec < 10){
        sec = '0' + sec
    }

    if(min < 10){
        min = '0' + min
    }

    if(hr < 10){
        hr = '0' + hr
    }

    horas.textContent = hr
    minutos.textContent = min
    segundos.textContent = sec
}

