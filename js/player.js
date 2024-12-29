// ### 1. **Gestion des joueurs**

// - `createPlayer(name, color)` : Crée un joueur avec un nom et une couleur (ou toute autre propriété nécessaire pour identifier le joueur).
// - `getPlayerInfo(playerId)` : Récupère les informations d'un joueur (nom, couleur, position, etc.).
// - `updatePlayerPosition(playerId, newPosition)` : Met à jour la position d'un joueur (utile lors du déplacement sur le plateau).
// - `getPlayers()` : Récupère la liste de tous les joueurs.
// - `setPlayerTurn(playerId)` : Définit le joueur dont c'est le tour (pour la gestion du tour de jeu).
// - `nextPlayerTurn()` : Passe au joueur suivant dans l'ordre du jeu (utile pour alterner les tours).
// - `setPlayerReady(playerId, isReady)` : Marque un joueur comme étant prêt ou pas pour commencer le jeu.

// ### 2. **Actions des joueurs**

// - `rollDice(playerId)` : Lance un dé pour le joueur et retourne le résultat.
// - `movePlayer(playerId, steps)` : Déplace le joueur d'un certain nombre de cases, en fonction du résultat du dé.
// - `canMove(playerId)` : Vérifie si le joueur peut effectuer un mouvement (par exemple, s'il est "en jeu" ou s'il a une pièce à déplacer).
// - `playerAtHome(playerId)` : Vérifie si le joueur est à la case départ ou chez lui (les cases de départ).
// - `enterBoard(playerId)` : Permet à un joueur d'entrer sur le plateau de jeu si son jet de dé le permet.
// - `isPlayerInSafeZone(playerId)` : Vérifie si le joueur se trouve dans une zone protégée (comme les cases sécurisées du Ludo).

// ### 3. **Interaction avec les autres joueurs**

// - `checkForCollisions(playerId)` : Vérifie si le joueur entre en collision avec un autre joueur sur le plateau (c'est-à-dire si un autre joueur se trouve sur la même case).
// - `eliminatePlayer(playerId)` : Élimine un joueur du jeu ou le renvoie à sa case de départ lorsqu'il est "capturé" par un autre joueur.

// ### 4. **Fin de la partie**

// - `checkIfWinner(playerId)` : Vérifie si un joueur a gagné (par exemple, s'il a toutes ses pièces arrivées à la fin).
// - `endGame()` : Fin du jeu, quand un joueur a gagné.

import { printNextTurn } from "./ui.js";
import { idCaseAbs, idFinalPath } from "./board.js";
import { Dice } from "./dice.js";

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color
        this.pawns = [new Pawn(0,this.color, this.id), new Pawn(1,this.color, this.id), new Pawn(2,this.color, this.id), new Pawn(3,this.color, this.id)];
        this.dice = new Dice();
    }

    hasWon() {
        // Vérifie si tous les pions ont atteint l'objectif
        return this.pawns.every(pawn => pawn.hasFinished);
    }

    endTurn() {
        printNextTurn(this.id);
        return;
    }

    // Ces fonctions vont servir à appelé les fonctions dans la classe Pawn, ca te permettra de juste taper "player[0].move(0)" au lieu de "player[0].pawns[0].move()", c'est pour ca qu'elles ont les mêmes nom dans la classe Pawn
    move(pawnId, steps = 1) {
        // Déplace le pion donné en fonction du résultat du dé
        // const steps = this.dice.roll();

        this.pawns[pawnId].move(steps);

        // const steps = 1;
        // if (steps <= 6) {
        //     this.pawns[pawnId].move(steps);
        // } else {
        //     console.log("La variable 'steps' ne peut pas être supérieur à 6 !");
        // }
    }
    // Pour jouer le cheval 2 :  Joueur.move(2, 6)

    exitStartZone(pawnId) {
        this.pawns[pawnId].exitStartZone();
    }

    enterStartZone(pawnId) {
        this.pawns[pawnId].enterStartZone();
    }

    enterFinalZone(pawnId) {
        this.pawns[pawnId].enterFinalZone();
    }

    isAtHome(pawnId) {
        this.pawns[pawnId].isAtHome();
    }

    // isSafe(pawnId, position) {
    //  // le pion est sur une étoile est ne peut pas etre mangé
    // }
}

// Pawn.js
class Pawn {
    constructor(id, color, playerId) {
        this.id = id;
        this.color = color;
        this.playerId = playerId;
        this.start = `#subhome_${color}_${id}`;
        this.position = 0;
        this.htmlIcon = `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png">`;
        this.endPath = false;
        this.endPosition = null;
        this.hasFinished = false;
    }

    get currentElement() {
        return document.getElementById(`${this.playerId}_${this.id}`);
    }

    updateCaseContent(caseElement, newContent) {
        if (caseElement.id.includes("star_")) {
            const starImg = '<img src="images/star.png" alt="etoile">';
            caseElement.innerHTML = newContent ? `${starImg}${newContent}` : starImg;
        } else {
            caseElement.innerHTML = newContent || "";
        }
    }

    exitStartZone() {
        const subhome = document.querySelector(this.start);
        const startCase = document.querySelector(`#start_${this.color}`);
        subhome.innerHTML = "";
        this.updateCaseContent(startCase, this.htmlIcon);
        this.position = 1;
    }

    enterStartZone() {
        const currentCase = this.currentElement.parentElement;
        const subhome = document.querySelector(this.start);
        this.updateCaseContent(currentCase, this.getOtherPawnsHtml(currentCase));
        subhome.innerHTML = this.htmlIcon;
        this.position = 0;
    }

    enterFinalZone() {
        this.endPath = true;
        this.endPosition = 0;
    }

    getOtherPawnsHtml(caseElement) {
        return Array.from(caseElement.getElementsByTagName('img'))
            .filter(img => img.id !== `${this.playerId}_${this.id}` && !img.alt.includes('etoile'))
            .map(img => img.outerHTML)
            .join('');
    }

    updateBoard(newPosition) {
        const currentPawn = this.currentElement;
        if (!currentPawn) return;

        const currentCase = currentPawn.parentElement;
        const nextCase = document.getElementById(newPosition);

        // Gérer la case actuelle
        if (currentCase.id.includes("star_")) {
            currentCase.innerHTML = '<img src="images/star.png" alt="etoile">';
        } else {
            currentCase.innerHTML = "";
        }

        // Gérer la nouvelle case
        let newContent = '';
        if (nextCase.id.includes("star_")) {
            newContent = '<img src="images/star.png" alt="etoile">';
        }
        
        // Ajouter tous les pions existants et le nouveau pion
        const existingPawns = nextCase.getElementsByTagName('img');
        const pawnsCount = Array.from(existingPawns).filter(img => !img.alt.includes('etoile')).length + 1;

        // Style pour la case contenant plusieurs pions
        const caseStyle = pawnsCount > 1 ? 'style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center;"' : '';

        nextCase.setAttribute('style', caseStyle);

        // Style pour les pions
        const pawnStyle = pawnsCount > 1 ? ' style="width: 45%; height: auto;"' : '';
        
        for (let pawn of existingPawns) {
            if (!pawn.alt.includes('etoile')) {
                newContent += `<img id="${pawn.id}" src="${pawn.src}"${pawnStyle}>`;
            }
        }
        // Ajouter le nouveau pion
        newContent += `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png"${pawnStyle}>`;
        
        nextCase.innerHTML = newContent;
    }

    move(steps) {
        if (this.position === 0) {
            console.log("Tu ne peux pas bouger un pion qui n'est pas sortit de sa maison !");
            return;
        }

        if (!this.endPath) {
            this.position += steps;

            if (this.position > 51) {
                this.enterFinalZone();
                this.move(this.position - 51);
                return;
            }

            const idNextPosition = idCaseAbs(this.position, this.color);
            this.updateBoard(idNextPosition);
        } else {
            this.moveInFinalPath(steps);
        }
    }

    moveInFinalPath(steps) {
        this.endPosition += steps;
        const idCaseFinalPath = idFinalPath(this.color, this.endPosition);
        this.updateBoard(idCaseFinalPath);
    }
    

    isAtHome() {
        return this.position === 0; // Exemple de la condition pour être à la maison
    }

    // isSafe() {
    //  // le pion est sur une étoile et les cases de départ (position 1) et ne peut pas etre mangé
    // }
}


export { Player, Pawn };