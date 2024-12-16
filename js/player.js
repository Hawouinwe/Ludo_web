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
import { idCaseAbs } from "./board.js";

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
    move(pawnId) {
        // Déplace le pion donné en fonction du résultat du dé
    	const steps = this.dice.roll();
        this.pawns[pawnId].move(steps);
    }
    // Pour jouer le cheval 2 :  Joueur.move(2)

    exitStartZone(pawnId) {
        this.pawns[pawnId].exitStartZone();
    }

    enterStartZone(pawnId) {
        this.pawns[pawnId].enterStartZone();
    }

    enterFinalZone(pawnId) {
        this.pawns[pawnId].enterFinalZone();
    }
}

// Pawn.js
class Pawn {
	constructor(id, color, playerId) {
		this.id = id;
        this.color = color;
        this.playerId = playerId;
        this.start = `#subhome_${color}_${id}`;
        this.position = 0; // Si le pion a fini ca vaut null, s'il est dans le home (ou la startzone si tu preferes) alors 0, cette position ne prend pas en compte le chemin final
        this.htmlIcon = `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png">`;

        this.endPath = false; // Si le pion est entré dans le chemin final alors true, sinon false
        this.endPosition = null; // Si endPath est à true, alors c'est la position sur le chemin final 

        this.hasFinished = false; // Permet de savoir si un pion a atteint l'arrivée
    }


    exitStartZone() {
        const subhome = document.querySelector(this.start);
        const start_case = document.querySelector(`#start_${this.color}`);
        subhome.innerHTML = "";
        start_case.innerHTML = this.htmlIcon;
        this.position = 1;
        return;
    }

    enterStartZone() {
        const actual_position = document.getElementById(`${this.playerId}_${this.id}`);
        const subhome = document.querySelector(this.start);
        if (actual_position.parentElement.id.includes("star_")) { // Pour ne pas enlever l'image de l'étoile s'il y en a une
            actual_position.parentElement.innerHTML = '<img src="images/star.png" alt="etoile">';
        } else {
            actual_position.parentElement.innerHTML = "";
        }
        subhome.innerHTML = this.htmlIcon;
        this.position = 0;
    }

    enterFinalZone() {
        this.endPath = true;
        this.endPosition = 0;
        // Le reste est à gérer mais je le ferais plus tard.
    }


    move(steps) {
        if (this.position === 0) { // Le pion ne peut pas bouger s'il n'est pas sortie de sa maison
            return;
        } else {
            const actual_position = document.getElementById(`${this.playerId}_${this.id}`);
            if (!this.endPath) { // Si le pion n'est pas dans le chemin final
                this.position += steps;
                console.log("prochaine position index: " + this.position);
                const idNextPosition = idCaseAbs(this.position, this.color);
                console.log("valeur absolue de l'index: " + idNextPosition);

                if (actual_position.parentElement.id.includes("star_")) { // Pour ne pas enlever l'image de l'étoile s'il y en a une
                    actual_position.parentElement.innerHTML = '<img src="images/star.png" alt="etoile">';
                } else {
                    actual_position.parentElement.innerHTML = "";
                }

                const caseNextPosition = document.getElementById(idNextPosition);
                caseNextPosition.innerHTML = this.htmlIcon;
            } else {

            }
        }
    }

    isAtHome() {
        return this.position === 0; // Exemple de la condition pour être à la maison
    }

    isSafe() {
    	// le pion est sur une étoile est ne peut pas etre mangé
    }
}


// Dice.js
class Dice {
  constructor() {
    this.result = 0;
  }

  roll() {
    this.result = Math.floor(Math.random() * 6) + 1;
    // this.animateRoll();
    console.log("Résulat du dé: " + this.result);
    return this.result;
  }

  animateRoll() {
    console.log("Animation du dé...");
  }

  getResult() {
    return this.result;
  }
}


export { Player, Pawn };