
//import { idCaseAbs } from "./board";
import { Player, Pawn } from "./player.js"
import { players, numPlayers, showCustomAlert, closeAlert } from "./ui.js";


function movable(player, pawn, steps) { // Depend des règles choisies ?
    if (player.pawns[pawn].position === 0) {
        return false ;
    }
    //console.log("ICI", player.isAtHome(pawn)) ;
    //if (player.isAtHome(pawn) ) {
    //    return false ;
    //} 
    if (player.pawns[pawn].endPath === true && player.pawns[pawnIndex].endPosition + steps > 6) {
        return false ;
    }
    return true ;
}


function tryAndEat(player, pawn) {
    // Verifie si on a mangé un pion
}

async function play(player) {
    let consecutiveSixes = 0 ;
    let rollAgain = true ;

    while (rollAgain) {
        rollAgain = false ;
        
        //console.log("Avant attente") ;
        showCustomAlert(`Joueur ${player.id}`, "À toi de jouer !")
        console.log("Lancez le dé") ;
        const dice = await player.dice.rollDice() ;
        console.log("Après attente") ;
        
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


            const p = parseInt(prompt(`Choisissez un pion parmis ${selectableForExit}, ${selectableForMoving}`)) ;

            //console.log("Pion bougé : ", p, "de" , dice, "cases")
            //console.log("Ancienne position :", player.pawns[p].position) ;

            if (selectableForExit.includes(p)) {
                player.exitStartZone(p) ;
            } else {
                player.move(p, dice) ;
                tryAndEat(player, p) ;
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

            for(let pawn = 0 ; pawn < 4 ; pawn++) {
                if (movable(player, pawn, dice)) {
                    selectable.push(pawn) ;
                }
            }

            if (selectable.length === 0 ) {
                //console.log("Aucun pion déplaceable") ;
            }
            else {
                const p = parseInt(prompt(`Choisissez un pion parmis ${selectable}`)) ;
                player.move(p, dice) ;
                tryAndEat(player, p) ;

                //console.log("Pion bougé : ", p, "de" , dice, "cases")
                //console.log("Nouvelle position :", player.pawns[p].position) ;
            }

        }

        //console.log("fin de la boucle while") ;
    }
    //console.log("Fin du play") ;
}



async function gameLoop(n) {
    for (let i = 0; i < n; i++) {
        console.log("joueur :" + (i % numPlayers) + "\n");

        // Utilise `await` ici pour attendre chaque appel à `play` avant de passer à l'itération suivante
        await play(players[i % numPlayers]);

        console.log("----------------*-----------------\n");
    }

    console.log("FIN") ;
}


gameLoop(10);

// Appel de la fonction asynchrone `gameLoop`



