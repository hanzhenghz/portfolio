const container = document.getElementById('lightbox');
const img = document.querySelector('#lightbox img')

let zoom = 1

container.addEventListener('wheel', e => {
    img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`

    zoom += e.deltaY * -0.01
    zoom = Math.min(Math.max(1, zoom), 10)

    if (zoom == 1) {
        img.style.left = '10vw'
        img.style.top = '10vh'
    }

    img.style.transform = `scale(${zoom})`
})

let clicked = false
let xAxis;
let x;
let yAxis;
let y;



function checkSize () {
    let containerOut = container.getBoundingClientRect()
    let imgIn = img.getBoundingClientRect()

    if (parseInt(img.style.left) > 0) {
        img.style.left = '0px'
    } else if (imgIn.right < containerOut.right) {
        img.style.left = `-${imgIn.width - containerOut.width}px`
    }
    if (parseInt(img.style.top) > 0) {
        img.style.top = '0px'
    } else if (imgIn.bottom < containerOut.bottom) {
        img.style.top = `-${imgIn.height - containerOut.height}px`
    }
}