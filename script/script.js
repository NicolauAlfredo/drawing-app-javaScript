const canvas = document.querySelector('canvas'),
toolBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
sizeSlider = document.querySelector('#size-slider'),
colorBtns = document.querySelectorAll('.colors .option'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.clear-canvas'),
saveImage = document.querySelector('.save-img'),
ctx = canvas.getContext('2d')

// Global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = 'brush',
brushWidth = 5,
selectedColor = '#000'

const setCanvasBackground = () => {
    // Setting whole canvas background to while, so the downloaded img background will be white
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height) // Setting fillStyle back to the selectedColor, it'll be the brush color
    ctx.fillStyle = selectedColor
}

window.addEventListener('load', () => {
    // Setting canvas width/height... OffsetWidth returns viewable width/height of an element
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground()
})

const drawRect = (e) => {
    // If fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // Creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
    ctx.beginPath() // Creating new path to draw circle
    // Getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI) // Creating circle according to the mouse pointer
    fillColor.checked ? ctx.fill() : ctx.stroke() // If fillColor is checked fill circle else draw border circle
} 

const drawTriangle = (e) => {
    ctx.beginPath() // Creating new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY) // Moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) // Creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // Creating  bottom line of triangle
    ctx.closePath() // Closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke() // If fillColor is checked fill triangle else draw border
} 

const startDraw = (e) => {
    isDrawing = true
    prevMouseX = e.offsetX // Passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY // Passing current mouseX position as prevMouseY value
    ctx.beginPath() // Creating new path to draw
    ctx.lineWidth = brushWidth // Passing brushsize as line width
    ctx.strokeStyle = selectedColor // Passsing selectedColor as stroke style
    ctx.fillStyle = selectedColor // Passing selectedColor as fill style
    // Copyng canvas data & passing as snapshot value... This avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const drawing = (e) => {
    if(!isDrawing) return // If is Drawing is false return from here
    ctx.putImageData(snapshot, 0, 0) // Adding copied canvas data on to this canvas

    if(selectedTool === 'brush' || selectedTool === 'eraser') {
        // If selected tool is eraser the set strokeStyke to white
        // To paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#FFF' : selectedColor
        ctx.lineTo(e.offsetX, e.offsetY) // Creating line according to the mouse pointer
        ctx.stroke() // Drawing/filling line with color 
    } else if(selectedTool === 'rectangle'){
        drawRect(e)
    } else if(selectedTool === 'circle'){
        drawCircle(e)
    } else if(selectedTool === 'triangle'){
        drawTriangle(e)
    }
}
   

toolBtns.forEach(btn => {
    btn.addEventListener('click', () => { // Adding click event to all tool option
        // Removing active class from the previuos option and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active')
        btn.classList.add('active')
        selectedTool = btn.id
        console.log(selectedTool)
    })
})

sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value) // Passing slider value as brushWidth

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => { // Adding click event to all color button
     // Removing selected class from the previuos option and adding on current clicked option
     document.querySelector('.options .selected').classList.remove('selected')
     btn.classList.add('selected')
     // Passing selected btn background-color as selectedColor value
     selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color')
    })
})

colorPicker.addEventListener('change', () => {
    // Passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clearing whole canvas
    setCanvasBackground()
})

saveImage.addEventListener('click', () => {
    const link = document.createElement('a') // Creating <a> element  
    link.download = `${Date.now()}.jpg` // Passing current date as link download value
    link.href = canvas.toDataURL() // Passing canvasData as link href value
    link.click() // Clicking link to download image 
})

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', () => isDrawing = false)