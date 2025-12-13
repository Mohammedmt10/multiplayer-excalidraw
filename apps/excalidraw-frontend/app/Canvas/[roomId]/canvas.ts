type Shape = {
    type : string,
    x : number,
    y : number,
    width : number,
    height : number
}

export default function Draw(canvas : HTMLCanvasElement , ctx : CanvasRenderingContext2D) {
    
    let existingShape : Shape[] = []
    
    //Changing the Background color of canvas
    ctx.fillStyle = "rgba(0 , 0 , 0)"
    ctx.fillRect(0 , 0 , canvas.width , canvas.height)

    let clicked = false
    let startX = 0;
    let startY = 0;

    let width = 0;
    let height = 0;
    canvas.addEventListener("mousedown" , (e) => {
        startX = e.clientX
        startY = e.clientY
        
        clicked = true
    })

    
    canvas.addEventListener("mouseup" , (e) => {
        clicked = false;
        height = e.clientY - startY
        width = e.clientX - startX    
        existingShape.push({
            type : "rect",
            x : startX,
            y : startY,
            width : width,
            height : height
        })
    })
    canvas.addEventListener("mousemove" , (e) => {
        if(clicked) {
            
            height = e.clientY - startY
            width = e.clientX - startX

            renderExistingElements(existingShape , canvas , ctx)
            
            ctx.strokeStyle = "rgba(255 , 255 , 255)"
            ctx.strokeRect(startX , startY , width , height)
        }
    });


}

function renderExistingElements(
    existingShape : Shape[] ,
    canvas : HTMLCanvasElement,
    ctx : CanvasRenderingContext2D
 ) {

     
     ctx.clearRect(0 , 0 , canvas.width , canvas.height)
     
     ctx.fillStyle = "rgba(0 , 0 , 0)"
     ctx.fillRect(0 , 0 , canvas.width , canvas.height)

    existingShape.map((shape) => {
        if(shape.type == "rect") {
            ctx.strokeStyle = "rgba(255 , 255 , 255)"
            ctx.strokeRect(shape.x , shape.y , shape.width , shape.height)
        }
    })
}