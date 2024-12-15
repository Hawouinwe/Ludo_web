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

class Player {
	constructor(id, name, color) {
		this.id = id;
		this.name = name;
		this.color = color
		this.pawns = [new Pawn(0,this.color), new Pawn(1,this.color), new Pawn(2,this.color), new Pawn(3,this.color)];
        this.dice = new Dice();
    }

    move(pawn) {
        // Déplace le pion donné en fonction du résultat du dé
    	const steps = this.dice.roll();
        pawn.move(steps); // Déplace le pion
    }
    // Pour jouer le cheval 2 :  Joueur.move(2)

    hasWon() {
        // Vérifie si tous les pions ont atteint l'objectif
    	return this.pawns.every(pawn => pawn.hasFinished());
    }

    endTurn() {
        printNextTurn(this.id);
        return;
    }
}



// Fonction qui associe des positions relatives aux couleurs des pions


// Pawn.js
class Pawn {
	constructor(id, color) {
		this.id = id;
        this.color = color;
        this.position = null; // Position du pion sur le plateau au départ
        this.start = `#subhome_${color}_${id}`;
        this.end = 0;

        this.hasWon = false ; // Si le pion a atteint l'arrivée devient true

        this.endPath = false;
        this.endPosition = null;


        // position = 0 <=> position départ bleu
        // (il y a 56-24 cases !)
    }

    canMove() {
    	return this.hasFinished() === false;
    }


    exitStartZone() {}

    enterStartZone() {}

    enterFinalZone() {}


    move(steps) {
        if (!this.endPath) {

        } else {

        }
        // Distinction de cas : this.end_path

            // Gères les déplacements sur le chemin principal (pas chemins finaux)

            // Lorsqu'on passe (strictement) la case this.end : entrée sur le chemin final, this.end_position = 0, this.position = null

            // --> Vérifier qu'il n'y a pas déjà un pion avec le board.js de la position et couleur du pion
    	   this.position += steps;
            // Vérifie les règles de déplacement selon le jeu

        // else

           // Tester si steps <= n (nb avant victoire) -> gérer le cas de victoire (case centrale n'est pas une case de déplacement ?) + appel fonction graphique
            this.end_position += steps
    }

    goHome() {
        element = this.position
        this.position = null; // Exemple de position "maison"
        // Appelle une fonction pour retirer le pion graphiquement
    }

    isAtHome() {
        return this.position === 0; // Exemple de la condition pour être à la maison
    }

    isSafe() {

    	// le pion est sur une étoile est ne peut pas etre mangé
    }

    hasFinished() {
    	return this.position === 56;
    	// le pion ne peut plus bouger car il est arrivé au bout
    }
}


// Dice.js
class Dice {
  constructor() {
    this.result = 0;
  }

  roll() {
    this.result = Math.floor(Math.random() * 6) + 1;
    this.animateRoll();
    return this.result;
  }

  animateRoll() {
    console.log("Animation du dé...");
  }

  getResult() {
    return this.result;
  }
}

export { Player, Pawn }