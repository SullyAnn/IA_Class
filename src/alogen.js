'use strict';
/* *********** vARIABLES GLOBALES  *********** */

let pas = 0;
let genNumber =100
let XCoordinate=0
const targetHtml = document.getElementById("target")
let click = document.querySelector('#generate');
let num1 = document.querySelector('#num1');
let num2 = document.querySelector('#num2');
let num3 = document.querySelector('#num3');
var canvas = document.createElement('canvas');
let body = document.querySelector('body');

body.appendChild(canvas);
canvas.style.border='solid 1px grey';

/* *********** INITIALISATION *********** */

num1.value = 255; num2.value = 128; num3.value = 2;

let target = [num1.value, num2.value, num3.value]
targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`



 
/* *********** UTILS *********** */
// fonction random
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // Max inclusif et min exclusif 
  return Math.floor(Math.random() * (max - min)) + min;
}

// génération d'un couleur aléatoire
function generateColor(){
    //couleur en RGB entre 0 et 255
    const color = random(0, 255);
    return color;
}

/* *********** POPULATION ET MEMBRES *********** */
class Member {
  constructor(target) {
    this.target = target;
    this.keys = [];

    for (let i =0; i < target.length; i++){
        this.keys[i] = generateColor();
    }
  }

  fitness() {
    // on vérifie que chaque élément du tableau de couleur coresspons a peut près à la cible  
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
    // fusion des partenaires
    const { length } = this.target;
    const child = new Member(this.target);
    const mid = random(0, length);

    for (let i = 0; i < length; i ++) {
      if (i > mid) {
        child.keys[i] = this.keys[i];
      } else {
        child.keys[i] = partner.keys[i];
      }
    }
    return child;
  }

  mutate(mutationRate) {
    //mutation : on génére une couleur aléatoire 
    for (let i = 0; i < this.keys.length; i += 1) {
      if (Math.random() < mutationRate) {
        this.keys[i] = generateColor();
      }
    }
  }
}

class Population {
  // construction d'une population on ajoute dans le tableau membres[] les nouveaux membres et on dessine les premiers membres
  constructor(size, target, mutationRate) {
    size = size || 1;
    this.members = [];
    this.mutationRate = mutationRate;

    for (let i = 0; i < size; i += 1) {
      this.members.push(new Member(target));
      XCoordinate+=0.12;
      drawCircle(this.members[i].keys[0],this.members[i].keys[1], this.members[i].keys[2], XCoordinate, random(0, canvas.height))
    }
  }

  evolve(generations) {
    // Evolution de la population => tant que nb de génération pas atteint on les fait se reproduire 
    for (let i = 0; i < generations ; i++) {
      setTimeout(()=>{
      const pool = this._selectMembersForMating();
      this._reproduce(pool);
    }, "200")
    }
  }

  _selectMembersForMating() {
    // Selection des parents qui s'accouplent 
    const matingPool = [];

    this.members.forEach((m) => {
      const f = Math.floor(m.fitness() * 100) || 1;

      for (let i = 0; i < f; i += 1) {
        matingPool.push(m);
      }
    });

    return matingPool;
  }

  _reproduce(matingPool) {
    console.log(XCoordinate)
  
    for (let i = 0; i < this.members.length ; i += 1) {

      // On choisi 2 parents random dans le tableau matingPool
      const parentA = matingPool[random(0, matingPool.length)];
      const parentB = matingPool[random(0, matingPool.length)];

      // Mélange des parents dans l'enfant 
      const child = parentA.crossover(parentB);
      
      //Dessin de l'enfant avec un timeout
      pas-=0.001;
      setTimeout(()=>{
      XCoordinate +=100
      drawCircle(child.keys[0],child.keys[1], child.keys[2], Math.sqrt(XCoordinate), random(0, canvas.height+(pas)));

    }, "1000")

      // Mutation
      child.mutate(this.mutationRate);
      this.members[i] = child;
    }
  }
}

// Fonction generate qui regroupe le tout 
function generate(populationSize, target, mutationRate, generations) {
  // Acutalisation du canvas quand on appelle la fonction 
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width, canvas.height);

  // Creation de la population et évolution sur un nombre donné de génération
  const population = new Population(populationSize, target, mutationRate);
  population.evolve(generations);
}


/* *********** EVENEMENTS *********** */

// On écoute le click de l'utilisateur 
click.addEventListener('click', function () {
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`
  XCoordinate =0;
  pas=0;
    generate(100, target , 0.05, genNumber );
	
   
});

// Ecoute des input et changement des valeurs
num1.addEventListener('input', function () {
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});
num2.addEventListener('input', function () {
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});
num3.addEventListener('input', function () {
    target = [num1.value, num2.value, num3.value]
    targetHtml.style.background=`rgb(${target[0]},${target[1]},${target[2]})`   
});


/* *********** EVENEMENTS *********** */

//Dessiner un cercle 
function drawCircle(Red, Green, Blue, X, Y){
    var ctx = canvas.getContext('2d'); 
    var R = 15;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.fillStyle = `rgba(${Red},${Green},${Blue}, ${-pas*0.01})`;
    ctx.fill();
}

// Dessiner un canva
function draw(){
  canvas.width = 900;
  canvas.height = 650;
  if (canvas.getContext)
  {  
    generate(200, target , 0.05, genNumber );
  }
} 
draw();



