// const body = document.querySelector('body');

const btn = document.querySelector('button');
const paraResultado = document.querySelector('.resultado');
const paraProbab = document.querySelector('.probabilidades');

const inputAtacante = document.querySelector('#atacante');
const inputDefensor = document.querySelector('#defensor');

/* Math.random devuelve numero de 0 a 1, multiplica por 6, redondea para abajo 
y agrega 1 para devolver un valor entre 1 y 6  */
function random6() {
  return Math.floor(Math.random() * 6) + 1;
}

/* toma un parametro que es la cantidad de veces que se va a ejecutar
la funcion random6 dentro del loop y agrega el resultado al array definido al principio
devuelve el array con los resultados, ordenando de menora a mayor con .sort()
y cambiando el orden para que quede de mayor a menor con .reverse() */
function rollD6(dice) {
  const results = [];
  for (let i = 0; i < dice; i += 1) {
    results.push(random6());
  }

  return results.sort().reverse();
}

/* dado 2 arrays con el mismo .length
toma los numeros de cada array en el mismo indice y determina el ganador
para cada comparacion */
function compareDice(attacker, defender) {
  const lenghtBatalla = attacker.length;
  let attackerLosses = 0;
  let defenderLosses = 0;

  for (let i = 0; i < lenghtBatalla; i += 1) {
    const diceAttacker = attacker[i];
    const diceDefender = defender[i];

    if (diceDefender >= diceAttacker) {
      attackerLosses += 1;
    } else {
      defenderLosses += 1;
    }
  }

  return [attackerLosses, defenderLosses];
}

/* toma dos arrays para atacante y defensor
los iguala en cantidad de resultados de dados
corre la funcion compareDice para devolver cuantos ejercitos perdio el [atacante,defensor] */
function Results(attacker, defender) {
  const diceDiff = attacker.length - defender.length;

  if (diceDiff > 0) {
    attacker.splice(-diceDiff);
  } else if (diceDiff < 0) {
    defender.splice(diceDiff);
  }
  return compareDice(attacker, defender);
}

/* funcion para determinar cuantos dados usa atacante y defensor */
function cantidadDados(armies, attacker = false) {
  if (attacker) {
    return Math.min(armies - 1, 3);
  }
  return Math.min(armies, 3);
}

/* una funcion mas para pasar la cantidad de ejercitos totales y loopear hasta que 
el atacante quede con 1 ejercito o el defensor con 0
como resultado devuelve el ganador */

function battleLog(attackerArmies, defenderArmies) {
  let totalAttacker = attackerArmies;
  let totalDefender = defenderArmies;

  while (totalAttacker > 1 && totalDefender > 0) {
    const attackerDice = cantidadDados(totalAttacker, true);
    const defenderDice = cantidadDados(totalDefender);
    console.log(attackerDice, defenderDice);

    const attackerRoll = rollD6(attackerDice);
    const defenderRoll = rollD6(defenderDice);
    console.log(attackerRoll, defenderRoll);

    const battleResult = Results(attackerRoll, defenderRoll);
    console.log(battleResult);

    totalAttacker -= battleResult[0];
    totalDefender -= battleResult[1];
    console.log(totalAttacker, totalDefender);
  }

  console.log('-----------------------------------------');

  if (totalAttacker > totalDefender) {
    return 'GANA ATACANTE';
  }
  if (totalAttacker <= totalDefender) {
    return 'GANA DEFENSOR';
  }
  return 'NO DEBE PASAR ESTO';
}

/* devuelve true si gana atacante, false si gana defensor */
function battle(attackerArmies, defenderArmies) {
  let totalAttacker = attackerArmies;
  let totalDefender = defenderArmies;

  while (totalAttacker > 1 && totalDefender > 0) {
    const attackerDice = cantidadDados(totalAttacker, true);
    const defenderDice = cantidadDados(totalDefender);

    const attackerRoll = rollD6(attackerDice);
    const defenderRoll = rollD6(defenderDice);

    const battleResult = Results(attackerRoll, defenderRoll);

    totalAttacker -= battleResult[0];
    totalDefender -= battleResult[1];
  }

  if (totalAttacker > totalDefender) {
    return true;
  }
  return false;
}

/* corre la funcion 10 mil veces para determinar probabilidad de ganar
con una determinada configuracion de ejercitos */

function battleProbabilites(attackerArmies, defenderArmies) {
  const results = [0, 0];

  for (let i = 0; i < 10000; i += 1) {
    const result = battle(attackerArmies, defenderArmies);

    if (result) {
      results[0] += 1;
    } else {
      results[1] += 1;
    }
  }

  return results;
}

btn.addEventListener('click', () => {
  const atacante = Number(inputAtacante.value);
  const defensor = Number(inputDefensor.value);

  paraResultado.textContent = battleLog(atacante, defensor);

  const probabilites = battleProbabilites(atacante, defensor);
  const vecesAtacante = probabilites[0];
  const vecesDefensor = probabilites[1];
  const porcAtacante = (vecesAtacante / 10000) * 100;
  const porcDefensor = (vecesDefensor / 10000) * 100;

  paraProbab.textContent = `El atacante gana ${vecesAtacante} veces (${porcAtacante}%). El defensor gana ${vecesDefensor} veces (${porcDefensor}%)`;

  // inputAtacante.value = '';
  // inputDefensor.value = '';
  inputAtacante.focus();
});
