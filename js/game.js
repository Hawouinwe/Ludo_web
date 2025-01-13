// pions mangé redevenir taille grand
import { Player, Pawn } from "./player.js"
import { players, numPlayers, showCustomAlert, closeAlert, updateActivePlayer } from "./ui.js";
import { idCaseAbs, relativeIdToAbsoluteId } from "./board.js";

// Vérifie si un pion peut être déplacé
function movable(player, pawn, steps) {
    if (player.pawns[pawn].position === 0) {
        return false;
    }

    // Vérifie si le pion ne dépasse pas la zone d'arrivée
    if (player.pawns[pawn].endPath === true && player.pawns[pawn].endPosition + steps > 6) {
        return false;
    }
    return true;
}

// Vérifie si une position est une case "étoile" (sûre)
function isSafePos(pos, color) {
    return idCaseAbs(pos, color).includes("star");
}

// Tente de manger un pion adverse sur la même case
function tryAndEat(player, pawn) {
    if (player.pawns[pawn].endPath === true || player.pawns[pawn].hasFinished) {
        return;
    }
    const pos = relativeIdToAbsoluteId(player.pawns[pawn].position, player.color);
    
    if (isSafePos(player.pawns[pawn].position, player.color)) {
        return false;
    }

    let hasEaten = false;
    // Vérifie pour chaque joueur adverse s'il y a un pion à manger
    for(let i = 0; i < players.length; i++) {
        if(players[i] !== player) {
            for(let p = 0; p < 4; p++) {
                if(players[i].pawns[p].position !== 0 && !players[i].pawns[p].hasFinished && 
                   !players[i].pawns[p].endPath && 
                   relativeIdToAbsoluteId(players[i].pawns[p].position, players[i].color) === pos) {
                    players[i].enterStartZone(p);
                    hasEaten = true;
                    console.log("Le pion pawn:" + pawn);
                    
                    const temp = document.getElementById(`${player.id}_${pawn}`);
                    temp.classList.remove('multiple');
                }
            }
        }
    }
    return hasEaten;
}

// Gère le tour d'un joueur
async function play(player) {
    let consecutiveSixes = 0;
    let rollAgain = true;

    const delay = ms => new Promise(res => setTimeout(res, ms));

    await delay(500);
    updateActivePlayer(player.id);
    showCustomAlert(`${player.name}`, "À toi de jouer !")

    while (rollAgain) {
        rollAgain = false;
        const dice = await player.dice.rollDice();
        
        if (dice === 6) {
            // Logique pour un lancer de 6
            consecutiveSixes++;
            const selectableForExit = [];    // Pions pouvant sortir
            const selectableForMoving = [];  // Pions pouvant se déplacer
            
            for(let pawn = 0; pawn < 4; pawn++) {
                if(player.pawns[pawn].isAtHome()) {
                    selectableForExit.push(pawn);
                }
                if (movable(player, pawn, dice)) {
                    selectableForMoving.push(pawn);
                }
            }

            let p = 0;

            if (selectableForExit.length === 0) {
                if (selectableForMoving.length === 0) {
                    // On ne fait rien
                }
                else if (selectableForMoving.length === 1) {
                    p = selectableForMoving[0];
                }
                else {
                    p = await selectPawn([], selectableForMoving, player); // Remplace le prompt par click sur un pion
                }
                await player.move(p, dice);
                const hasEaten = tryAndEat(player, p);
                if (hasEaten) {
                    rollAgain = true;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true;
                }
            }
            else if (selectableForMoving.length === 0) {
                if (selectableForExit.length === 1) {
                    p = selectableForExit[0];
                }
                else {
                    p = await selectPawn(selectableForExit, [], player); // Remplace le prompt par click sur un pion
                }
                player.exitStartZone(p);
            }
            else {
                p = await selectPawn(selectableForExit, selectableForMoving, player); // Remplace le prompt par click sur un pion
                if (selectableForExit.includes(p)) {
                    player.exitStartZone(p);
                } else {
                    await player.move(p, dice);
                    const hasEaten = tryAndEat(player, p);
                    if (hasEaten) {
                        rollAgain = true;
                    }
                    if (player.pawns[p].hasFinished) {
                        rollAgain = true;
                    }
                }
            }
            
            if (consecutiveSixes < 3) {
                rollAgain = true;
            } else {
                console.log('Three consecutive sixes - forfeiting turn.');
                rollAgain = false;
                consecutiveSixes = 0; // Reset counter
                break;
            }
            
        }
        else {
            // Logique pour un lancer différent de 6
            const selectable = [];

            for(let pawn = 0; pawn < 4; pawn++) {
                if (movable(player, pawn, dice)) {
                    selectable.push(pawn);
                }
            }

            
            let p = 0; 

            if (selectable.length === 0 ) {
                //console.log("Aucun pion déplaceable");
            }
            else if (selectable.length === 1) {
                p = selectable[0];
                await player.move(p, dice);
                const hasEaten = tryAndEat(player, p);
                if (hasEaten) {
                    rollAgain = true;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true;
                }
            }
            else {
                p = await selectPawn(selectable, [], player); // Remplace le prompt par click sur un pion
                await player.move(p, dice);
                const hasEaten = tryAndEat(player, p);
                if (hasEaten) {
                    rollAgain = true;
                }
                if (player.pawns[p].hasFinished) {
                    rollAgain = true;
                }
            }
        }
    }
}

// Permet au joueur de sélectionner un pion en le cliquant
function selectPawn(selectableForExit, selectableForMoving, player) {
    return new Promise((resolve) => {
        const allSelectable = [...selectableForExit, ...selectableForMoving];
        
        // Met en surbrillance les pions sélectionnables et gère les clics
        allSelectable.forEach((pawnIndex) => {
            const pawnElement = player.pawns[pawnIndex].currentElement; 
            // console.log(`pawnElement : ${pawnElement}`);
            pawnElement.classList.add('highlight'); 
            pawnElement.classList.add('highlight');

            const onClick = () => {
                allSelectable.forEach((idx) => {
                    const el = player.pawns[idx].currentElement;
                    el.classList.remove('highlight');
                    el.removeEventListener('click', onClick);
                });

                console.log(`${pawnIndex} choisi`);
                resolve(pawnIndex); 
            };

            pawnElement.addEventListener('click', onClick);
        });
    });
}

// Gère le déroulement complet de la partie
async function game() {
    let endGame = false;
    let i = 0;
    let classment = [];
    
    while (!endGame) {
        await play(players[i % numPlayers]);
        // Vérifie les conditions de fin de partie
        let nb_victorious = 0;
        for(let p = 0; p < players.length; p++) {
            if (players[p].hasWon()) {
                nb_victorious++;
                classment.push(players[p].name);
            }
        }
        if(nb_victorious == players.length - 1) {
            endGame = true;
        }
        i++;
    }
    endOfGame(classment);
}

// Affiche le classement final
function endOfGame(classment) {
    showCustomAlert("Classement final !", classment, true);
}

export { game };