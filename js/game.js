
//import { idCaseAbs } from "./board";
import { Player, Pawn } from "./player.js"
import { players } from "./ui.js"
import { numPlayers } from "./ui.js"


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


function play(player) {
    let consecutiveSixes = 0 ;
    let rollAgain = true ;

    while (rollAgain) {
        rollAgain = false ;
        const dice = player.dice.rollDice() ;

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

            console.log("Pion bougé : ", p, "de" , dice, "cases")
            console.log("Ancienne position :", player.pawns[p].position) ;

            if (selectableForExit.includes(p)) {
                player.exitStartZone(p) ;
            } else {
                player.move(p, dice) ;
                tryAndEat(player, p) ;
            }

            console.log("Nouvelle position :", player.pawns[p].position) ;

            if (consecutiveSixes < 3) {
                rollAgain = true ;
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
                console.log("Aucun pion déplaceable") ;
            }
            else {
                const p = parseInt(prompt(`Choisissez un pion parmis ${selectable}`)) ;
                player.move(p, dice) ;
                tryAndEat(player, p) ;

                console.log("Pion bougé : ", p, "de" , dice, "cases")
                console.log("Nouvelle position :", player.pawns[p].position) ;
            }

        }


    }
}



// ============================================================================= //
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ============================================================================= //
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ============================================================================= //

/*
function play(player) {

    let consecutiveSixes = 0; // Pour suivre les 3 six consécutifs
    let rollAgain = true; // Indique si le joueur peut relancer le dé

    while (rollAgain) {
        rollAgain = false; // Par défaut, ne pas relancer le dé
        const dice = player.dice.roll();
        console.log(`Player rolled: ${dice}`);

        if (dice === 6) {
            consecutiveSixes++;
        } else {
            consecutiveSixes = 0;
        }

        if (consecutiveSixes === 3) {
            console.log("Player rolled three consecutive sixes, turn ends!");
            return; // Terminer le tour
        }

        // Vérifier si tous les pions sont dans le home
        const pawnsAtHome = player.pawns.filter((_, i) => player.isAtHome(i));
        const pawnsOutside = player.pawns.filter((_, i) => !player.isAtHome(i));
        
        if (dice !== 6) {
            if (pawnsAtHome.length === 4) {
                console.log("All pawns are at home, turn ends!");
                return;
            } else if (pawnsOutside.length === 1) {
                const pawnIndex = player.pawns.findIndex((_, i) => !player.isAtHome(i));
                if (canMove(player, pawnIndex, dice)) {
                    player.move(pawnIndex, dice);
                    if (player.pawns[pawnIndex].hasWon) {
                        console.log(`Pawn ${pawnIndex} has reached the end! Player plays again.`);
                        rollAgain = true;
                    }
                }
            } else {
                const movablePawns = pawnsOutside.filter((_, i) => canMove(player, i, dice));
                if (movablePawns.length > 0) {
                    const pawnIndex = selectPawn(movablePawns); // Fonction pour choisir un pion
                    player.move(pawnIndex, dice);

                    if (player.pawns[pawnIndex].hasWon) {
                        console.log(`Pawn ${pawnIndex} has reached the end! Player plays again.`);
                        rollAgain = true;
                    } else if (canCapture(player, pawnIndex)) {
                        capturePawn(player, pawnIndex);
                        console.log(`Pawn ${pawnIndex} captured another pawn! Player rolls again.`);
                        rollAgain = true;
                    }
                }
            }
        } else {
            if (pawnsAtHome.length > 0) {
                const pawnIndex = player.pawns.findIndex((_, i) => player.isAtHome(i));
                console.log(`Pawn ${pawnIndex} is moved out of home.`);
                // Déplacer un pion hors du home
                player.move(pawnIndex, 1); // 1 case pour sortir
            } else {
                const movablePawns = pawnsOutside.filter((_, i) => canMove(player, i, dice));
                if (movablePawns.length > 0) {
                    const pawnIndex = selectPawn(movablePawns); // Fonction pour choisir un pion
                    player.move(pawnIndex, dice);

                    if (player.pawns[pawnIndex].hasWon) {
                        console.log(`Pawn ${pawnIndex} has reached the end! Player plays again.`);
                        rollAgain = true;
                    } else if (canCapture(player, pawnIndex)) {
                        capturePawn(player, pawnIndex);
                        console.log(`Pawn ${pawnIndex} captured another pawn! Player rolls again.`);
                        rollAgain = true;
                    }
                }
            }

            // Permettre une relance sauf si 3 six consécutifs ou tous les pions restants sur chemin final
            if (consecutiveSixes < 3 && !player.pawns.every(p => p.endPath)) {
                rollAgain = true;
            }
        }
    }
}


function canMove(player, pawnIndex, steps) {
    if (player.pawns[pawnIndex].isAtHome ){
        return false ;
        // teste si le pion est à home
    }
    if (player.pawns[pawnIndex].endPath && player.pawns[pawnIndex].endPosition + steps > 6 ) {
        return false ;
        // teste si le pion est sur son chemin final et peut avancer
    }
    return true ;
    // en fonction des règles, tester si pas une case avec déjà un pion de sa couleur
}

// Fonction utilitaire pour vérifier si un pion peut capturer un autre
function canCapture(player, pawnIndex) {
    // Logique pour déterminer si le pion peut capturer un autre
    // Cette partie dépend de l'implémentation des positions du plateau
    return false; // Exemple de base
}

// Fonction utilitaire pour capturer un autre pion
function capturePawn(player, pawnIndex) {
    // Logique pour capturer un autre pion
    // Exemple : Trouver l'autre pion sur la case et l'envoyer à son home
}

// Fonction utilitaire pour sélectionner un pion parmi plusieurs
function selectPawn(movablePawns) {
    // Logique pour choisir un pion, ici on choisit arbitrairement le premier
    return movablePawns[0];
}
*/

// ============================================================================= //
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ============================================================================= //
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
// ============================================================================= //

/*
Joueur : player, élément de la classe Player
pion : nombre pawn entre 0 et 3, Player.pawns[pawn] donne un élément de la classe Pawn
pour lancer un dé pour un joueur : Player.roll() -> renvoie un nombre entre 1 et 6
pour tester si un pion est dans son home : player.isAtHome(pawn)
pour vérifier si un pion peut avancer : canMove(player, pawn)
pour faire avancer un pion : player.move(pawn, steps)
pour renvoyer un pion sur son home : player.pawns[pawn].enterStartZone()
pour savoir si un pion arrive à la fin : player.pawns[pawn].hasWon = true (false par défaut)
pour savoir si un pion est sur un chemin final : player.pawns[pawn].endPath : true (false par défaut)


play(player) :
    On commence par tirer un dé :
        Si dé != 6
            Si tous les pions sont dans le home : rien
            Si un unique pion hors du home : il avance de dé cases (si il peut*)
            Si plusieurs, on choisit un pion qui avance de dé cases (parmis ceux qui peuvent)
                Si un pion arrive sur une case où il peut en manger un autre : le renvoie à son home et relance un dé
                Si un pion arrive à la fin : rejouer
        
        Si dé = 6
            Si il reste >= 1 pion dans le home on peut le sortir
            Sinon on peut faire avancer un pion sorti (si possible)
                Si un pion arrive sur une case où il peut en manger un autre : le renvoie à son home
                Si un pion arrive à la fin : rejouer
            On relance le dé (sauf si 3e d'affilée et sauf si tous les pions restants sont sur chemin final)

*/


// * : pas une case avec un autre pion de sa couleur sauf cases de départ, pas si chemin final et nb trop grand


console.log("AVANT\n") ;

for(let i = 0 ; i < 10 ; i++) {
    console.log("joueur :"+i % numPlayers + "\n") ;
    play(players[i % numPlayers]) ;
    console.log("-------------------------------\n")
}

console.log("APRES\n") ;



