
//import { idCaseAbs } from "./board";
import { Player, Pawn } from "./player.js"
import { players, numPlayers, showCustomAlert, closeAlert, updateActivePlayer } from "./ui.js";
import { idCaseAbs, relativeIdToAbsoluteId } from "./board.js";


function movable(player, pawn, steps) { // Depend des règles choisies ?
    if (player.pawns[pawn].position === 0) {
        return false ;
    }
    //console.log("ICI", player.isAtHome(pawn)) ;
    //if (player.isAtHome(pawn) ) {
    //    return false ;
    //} 
    if (player.pawns[pawn].endPath === true && player.pawns[pawn].endPosition + steps > 6) {
        return false ;
    }
    return true ;
}


function isSafePos(pos, color) {
    if(idCaseAbs(pos, color).includes("star")) {
        return true ;
    }
    else {
        return false ;
    }
}

function tryAndEat(player, pawn) {
    const pos = relativeIdToAbsoluteId(player.pawns[pawn].position, player.color) ;
    console.log(`pos : ${pos}`)
    if (isSafePos(player.pawns[pawn].position, player.color)) {
        //console.log("La case est safe !") ;
        return false ;
    }
    let hasEaten = false ;
    for(let i = 0 ; i < players.length ; i++) {
        //console.log("a") ;
        if(players[i] !== player) {
            //console.log(`Joueur ${players[i].color}`) ;
            for(let p = 0 ; p < 4 ; p++) {
                //console.log(`Pion ${p}`) ;
                //console.log(`position : ${relativeIdToAbsoluteId(players[i].pawns[p].position, players[i].color)}`) ;
                //console.log(`rel pos : ${players[i].pawns[p].position}, ${players[i].pawns[p].position !== 0}`) ;
                if(players[i].pawns[p].position !== 0 && relativeIdToAbsoluteId(players[i].pawns[p].position, players[i].color) === pos) {
                    players[i].enterStartZone(p) ;
                    hasEaten = true ;
                    //console.log(`${player.color} a mangé ${players[i].color} !`) ;
                }
            }
        }
    }
    return hasEaten ;
}

async function play(player) {
    let consecutiveSixes = 0 ;
    let rollAgain = true ;

    while (rollAgain) {
        rollAgain = false ;
        
        //console.log("Avant attente") ;
        updateActivePlayer(player.id);
        console.log(player.id)
        showCustomAlert(`${player.name}`, "À toi de jouer !")
        //console.log("Lancez le dé") ;
        const dice = await player.dice.rollDice() ;
        //console.log("Après attente") ;
        
        if (dice === 6) {
            consecutiveSixes++;

            const selectableForExit = [] ;
            const selectableForMoving = [] ;
        

            for(let pawn = 0 ; pawn < 4 ; pawn++) {
                if(player.pawns[pawn].isAtHome()) {
                    selectableForExit.push(pawn) ;
                }
                if (movable(player, pawn, dice)) {
                    selectableForMoving.push(pawn) ;
                }
            }

            let p = 0 ;

            if (selectableForExit.length === 0) {
                if (selectableForMoving.length === 1) {
                    p = selectableForMoving[0] ;
                }
                else {
                    p = parseInt(prompt(`Choisissez un pion parmis ${selectableForMoving}`)) ;
                }
                player.move(p, dice) ;
                const hasEaten = tryAndEat(player, p) ;
                if (hasEaten) {
                    rollAgain = true ;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true ;
                }
            }
            else if (selectableForMoving.length === 0) {
                if (selectableForExit.length === 1) {
                    p = selectableForExit[0] ;
                }
                else {
                    p = parseInt(prompt(`Choisissez un pion parmis ${selectableForExit}`)) ;
                }
                player.exitStartZone(p) ;
            }
            else {
                p = parseInt(prompt(`Choisissez un pion parmis ${selectableForExit}, ${selectableForMoving}`)) ;
                if (selectableForExit.includes(p)) {
                    player.exitStartZone(p) ;
                } else {
                    player.move(p, dice) ;
                    const hasEaten = tryAndEat(player, p) ;
                    if (hasEaten) {
                        rollAgain = true ;
                    }
                    if (player.pawns[p].hasFinished) {
                        rollAgain = true ;
                    }
                }
            }

            //console.log("Nouvelle position :", player.pawns[p].position) ;

            if (consecutiveSixes < 3) {
                rollAgain = true ;
            } else {
                console.log('Three consecutive sixes - forfeiting turn.');
                rollAgain = false;
                consecutiveSixes = 0; // Reset counter
                break;
            }
            

        }

        else {
            const selectable = [] ;
            let p = 0; 

            for(let pawn = 0 ; pawn < 4 ; pawn++) {
                if (movable(player, pawn, dice)) {
                    selectable.push(pawn) ;
                }
            }

            if (selectable.length === 0 ) {
                //console.log("Aucun pion déplaceable") ;
            }
            else if (selectable.length === 1) {
                p = selectable[0] ;
                player.move(p, dice) ;
                const hasEaten = tryAndEat(player, p) ;
                if (hasEaten) {
                    rollAgain = true ;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true ;
                }
            }
            else {
                p = parseInt(prompt(`Choisissez un pion parmis ${selectable}`)) ;
                player.move(p, dice) ;
                const hasEaten = tryAndEat(player, p) ;
                if (hasEaten) {
                    rollAgain = true ;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true ;
                }
            }
        }
        //console.log("fin de la boucle while") ;
    }
    //console.log("Fin du play") ;
}


async function gameLoop(n) {
    // Fonction de test maintenant inutilisée
    for (let i = 0; i < n; i++) {
        console.log("joueur :" + (i % numPlayers) + "\n");

        // Utilise `await` ici pour attendre chaque appel à `play` avant de passer à l'itération suivante
        await play(players[i % numPlayers]);

        console.log("----------------*-----------------\n");
    }

    console.log("FIN") ;
}



async function game() {
    let endGame = false ;
    let i = 0 ;
    while (!endGame) {
        //console.log("joueur :" + (i % numPlayers) + "\n");
        await play(players[i % numPlayers]);
        let nb_victorious = 0 ;
        for(let p = 0 ; p < players.length ; p++) {
            if (players[p].hasWon()) {
                nb_victorious++ ;
            }
        }
        if(nb_victorious == players.length - 1) {
            endGame = true ;
        }
        i++ ;
    }
    endOfGame() ;
}

function endOfGame() {
    showCustomAlert("La partie est finie !") ;
}


game() ;

//gameLoop(100);

// Appel de la fonction asynchrone `gameLoop`



