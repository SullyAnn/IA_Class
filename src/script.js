window.addEventListener("load", function () {
    var slider = document.getElementById("myRange");
    var slider2 = document.getElementById("myRange2");
    var slider3 = document.getElementById("myRange3");

    let modification2 = 1;
    let modification = 1;
    let modification3 = 1;

    function mandelIter(cx, cy, maxIter) {
        var x = 0.0;
        var y = 0.0;
        var xx = 0;
        var yy = 0;
        var xy = 0;
      
        var i = maxIter;
        while (i-- && xx + yy <= 4) {
          xy = x * y*modification3;
          xx = x * x*modification;
          yy = y * y;
          x = xx - yy + cx;
          y = xy + xy + cy*modification2;
        }
        return maxIter - i;
      }
      
      function mandelbrot(canvas, xmin, xmax, ymin, ymax, iterations) {
        var width = canvas.width;
        var height = canvas.height;
      
        var ctx = canvas.getContext('2d', { willReadFrequently: true });;
        var img = ctx.getImageData(0, 0, width, height);
        var pix = img.data;
        
        for (var ix = 0; ix < width; ++ix) {
          for (var iy = 0; iy < height; ++iy) {
            var x = xmin + (xmax - xmin) * ix / (width - 1);
            var y = ymin + (ymax - ymin) * iy / (height - 1);
            var i = mandelIter(x, y, iterations);
            var ppos = 4 * (width * iy + ix);
            
            if (i > iterations) {
              pix[ppos] = 0;
              pix[ppos + 1] = 0;
              pix[ppos + 2] = 0;
            } else {
              var c = 1 * Math.log(i) / Math.log(iterations - 1.0);
              
              if (c < 1) {
                pix[ppos] = 255 * c;
                pix[ppos + 1] = 0;
                pix[ppos + 2] = 0;
              }
              else if ( c < 2 ) {
                pix[ppos] = 255;
                pix[ppos + 1] = 255 * (c - 1);
                pix[ppos + 2] = 0;
              } else {
                pix[ppos] = 255;
                pix[ppos + 1] = 255;
                pix[ppos + 2] = 255 * (c - 2);
              }
            }
            pix[ppos + 3] = 255;
          }
        }
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.putImageData(img, 0, 0);
      }
      
      var canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 150;

       
      let jeu = document.getElementById("jeu")
      
      jeu.appendChild(canvas);

      const context = canvas.getContext('2d', { willReadFrequently: true });

// See individual pixels when zooming
context.imageSmoothingEnabled = false;

// Simply used to display the mouse position and transformed mouse position


let isDragging = false;
let dragStartPosition = { x: 0, y: 0 };
let currentTransformedCursor;


function onMouseUp() {
	isDragging = false;
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);


let scrollX     = 0;
let scrollY     = 0;
let scale       = 1;
let scaleFactor = 0.02;

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
  };
}

// Handle mousenwheel zoom
canvas.onwheel =  function(e){
  e.preventDefault();
  let previousScale= scale;
  
    var mousePos = getMousePos(canvas, e);
    console.log(mousePos)

  // calculate scale direction 6 new scale value
  let direction = e.deltaY > 0 ? 1 : -1;
  scale += scaleFactor * direction;

  // calculate the new scroll values
  scrollX += ( e.offsetX / previousScale )  - (e.offsetX  / scale);
  scrollY += ( e.offsetY / previousScale ) - ( e.offsetY / scale);
  
  // apply new scale in a non acumulative way
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);
  canvas.focus()
mandelbrot(canvas, -2*scale, 1*scale, -1*scale, 1*scale, 3000);
}


function onMouseDown(event) {
	isDragging = true;
	dragStartPosition = getTransformedPoint(event.offsetX, event.offsetY);
}

function getTransformedPoint(x, y) {
	const originalPoint = new DOMPoint(x, y);
  return context.getTransform().invertSelf().transformPoint(originalPoint);
}

function onMouseMove(event) {
  currentTransformedCursor = getTransformedPoint(event.offsetX, event.offsetY)

  if (isDragging) {

  	context.translate(currentTransformedCursor.x - dragStartPosition.x, currentTransformedCursor.y - dragStartPosition.y);
    mandelbrot(canvas, -2*scale, 1*scale, -1*scale, 1*scale, 3000);
		
    //drawImageToCanvas();
  }
}


canvas.focus()
mandelbrot(canvas, -2, 1, -1, 1, 1000);


// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  modification = this.value;
  mandelbrot(canvas, -2, 1, -1, 1, 1000);

}

slider2.oninput = function() {
  modification2 = this.value;
  mandelbrot(canvas, -2, 1, -1, 1, 1000);

}

slider3.oninput = function() {
  modification3 = this.value;
  mandelbrot(canvas, -2, 1, -1, 1, 1000);

}

let reset = document.getElementById('reset');
reset.addEventListener('click', () => {
  modification = 1;
  modification2 = 1;
  modification3 = 1;
  canvas.style.filter='invert(0)';
  invert.checked = false;
  mandelbrot(canvas, -2, 1, -1, 1, 1000);

})

let invert = this.document.getElementById('invert');
invert.addEventListener('click', ()=> {
  if(invert.checked == true){
    canvas.style.filter='invert(1)';
    mandelbrot(canvas, -2, 1, -1, 1, 1000);
  
  } else {
    canvas.style.filter='invert(0)';
    invert.checked = false;
    mandelbrot(canvas, -2, 1, -1, 1, 1000);
  
  }
})


})