'use strict';
let stop = false;
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

/*function generateLetter() {
  const code = random(97, 123); // ASCII char codes
  return String.fromCharCode(code);
}*/
function generateColor(){
    //couleur en RGB entre 0 et 255
    const color = random(0, 255);
    return color;
}

class Member {
  constructor(target) {
    this.target = target;
    this.keys = [];

    /*for (let i = 0; i < target.length; i += 1) {
      this.keys[i] = generateLetter();
    }*/
    for (let i =0; i < target.length; i++){
        this.keys[i] = generateColor();
    }
  }

  fitness() {
    // on vérifie que chaque élément du tableau de couleur correspond à la cible 
    let matches = 0;

    for (let i = 0; i < this.keys.length; i++) {
    let diff = Math.abs(this.keys[i]- this.target[i])

            if (this.keys[i] === this.target[i]) {
                matches ++;
            } else if (diff <= 20 ){
                matches ++;
            }
    }

    return matches / this.target.length;
  }

  crossover(partner) {
    const { length } = this.target;
    const child = new Member(this.target);
    const midpoint = random(0, length);

    for (let i = 0; i < length; i ++) {
      if (i > midpoint) {
        child.keys[i] = this.keys[i];
      } else {
        child.keys[i] = partner.keys[i];
      }
    }

    return child;
  }

  mutate(mutationRate) {
    for (let i = 0; i < this.keys.length; i += 1) {
      // If below predefined mutation rate,
      // generate a new random letter on this position.
      if (Math.random() < mutationRate) {
        this.keys[i] = generateColor();
      }
    }
  }
}

class Population {
  constructor(size, target, mutationRate) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;

    for (let i = 0; i < size; i += 1) {
      this.members.push(new Member(target));
      drawCircle(this.members[i].keys[0],this.members[i].keys[1], this.members[i].keys[2], random(0, canvas.width), random(0, canvas.height))

    }
  }

  evolve(generations) {
    for (let i = 0; i < generations && stop==false; i += 1) {
      
        setTimeout(()=>{
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }, "500")
    }
  }

  _selectMembersForMating() {
    const matingPool = [];

    this.members.forEach((m) => {
      // The fitter he/she is, the more often will be present in the mating pool
      // i.e. increasing the chances of selection
      // If fitness == 0, add just one member
      const f = Math.floor(m.fitness() * 100) || 1;

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    });

    return matingPool;
  }

  _reproduce(matingPool) {
    var ctx = canvas.getContext('2d'); 
    ctx.clearRect(0,0,canvas.width, canvas.height);
  
    for (let i = 0; i < this.members.length && stop == false; i += 1) {
      // Pick 2 random members/parent from the mating pool
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];

      // Perform crossover
      const child = parentA.crossover(parentB);
      drawCircle(child.keys[0],child.keys[1], child.keys[2], random(0, canvas.width), random(0, canvas.height))



      // Perform mutation
      child.mutate(this.mutationRate);

      this.members[i] = child;
    }
  }
}

// Init function
function generate(populationSize, target, mutationRate, generations) {
  // Create a population and evolve for N generations
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width, canvas.height);

  const population = new Population(populationSize, target, mutationRate);
  population.evolve(generations);

  // Get the typed words from all members and find if someone was able to type the target
  const membersKeys = population.members.map((m) => m.keys);
 // const perfectCandidatesNum = membersKeys.filter((w) => w === target);

  // Print the results
/*  membersKeys.forEach((element)=> {
    drawCircle(element[0],element[1], element[2], random(0, canvas.width), random(0, canvas.height))
  })*/
  
  console.log(membersKeys);
  //console.log(`${perfectCandidatesNum ? perfectCandidatesNum.length : 0} member(s) typed "${target}"`);
}
const targetHtml = document.getElementById("target")

let click = document.querySelector('#generate');
let num1 = document.querySelector('#num1');
let num2 = document.querySelector('#num2');
let num3 = document.querySelector('#num3');

num1.value = 255; num2.value = 128; num3.value = 2;

// Handle number changes
click.addEventListener('click', function () {
    stop=true;
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`
    stop=false;

    generate(50, target , 0.05, 2000 );
	
   
});
num1.addEventListener('input', function () {
    stop=true;
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});
num2.addEventListener('input', function () {
    stop=true;
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});
num3.addEventListener('input', function () {
    stop=true;
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});


let target = [num1.value, num2.value, num3.value]
targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`

function drawCircle(Red, Green, Blue, X, Y){
    var ctx = canvas.getContext('2d'); 
    var R = 20;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.fillStyle = `rgb(${Red},${Green},${Blue})`;
    ctx.fill();
}

// create a canvas which will contain the mandelbrot drawing
var canvas = document.createElement('canvas');
function draw()
  {
    canvas.width = 900;
    canvas.height = 650;
    
        if (canvas.getContext)
        {  
 
          generate(50, target , 0.05, 2000 );
       
        }
} 
draw();

let body = document.querySelector('body');
body.appendChild(canvas);
canvas.style.border='solid 1px grey';

