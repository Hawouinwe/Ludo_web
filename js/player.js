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
    async move(pawnId, steps = 1) {
        // Déplace le pion donné en fonction du résultat du dé
        // const steps = this.dice.roll();

        await this.pawns[pawnId].move(steps);

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
            const starImg = '<img src="images/star.png" alt="etoile" class="star-image">';
            caseElement.innerHTML = newContent ? `${starImg}${newContent}` : starImg;
        } else {
            caseElement.innerHTML = newContent || "";
        }
    }

    updateBoard(newPosition) {
        const currentPawn = this.currentElement;
        if (!currentPawn) return;

        const currentCase = currentPawn.parentElement;
        const nextCase = document.getElementById(newPosition);

        // Gérer la case actuelle
        const otherPawnsInCurrentCase = this.getOtherPawnsHtml(currentCase);
        this.updateCaseContent(currentCase, otherPawnsInCurrentCase);

        // Récupérer les pions existants dans la nouvelle case
        const existingPawns = Array.from(nextCase.getElementsByTagName('img'))
            .filter(img => !img.alt.includes('etoile'));
        
        const pawnsCount = existingPawns.length + 1;

        // Préparer le contenu de la nouvelle case
        let newContent = '';
        
        // Ajouter l'étoile si nécessaire
        if (nextCase.id.includes("star_")) {
            newContent += '<img src="images/star.png" alt="etoile" class="star-image">';
        }

        // Créer un conteneur pour les pions si nécessaire
        if (pawnsCount > 1) {
            newContent += '<div class="pawns-container">';
        }

        // Ajouter les pions existants
        existingPawns.forEach(pawn => {
            newContent += `<img id="${pawn.id}" src="${pawn.src}" class="pawn-image${pawnsCount > 1 ? ' multiple' : ''}">`; 
        });

        // Ajouter le nouveau pion
        newContent += `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png" class="pawn-image${pawnsCount > 1 ? ' multiple' : ''}">`;

        if (pawnsCount > 1) {
            newContent += '</div>';
        }
        
        nextCase.innerHTML = newContent;
    }

    exitStartZone() {
        const subhome = document.querySelector(this.start);
        const startCase = document.querySelector(`#start_${this.color}`);
        subhome.innerHTML = "";
        
        // Récupérer les pions existants dans la case de départ
        const existingPawns = Array.from(startCase.getElementsByTagName('img'));
        const pawnsCount = existingPawns.length + 1;

        let newContent = '';
        
        // Créer un conteneur pour les pions si nécessaire
        if (pawnsCount > 1) {
            newContent += '<div class="pawns-container">';
        }

        // Ajouter les pions existants
        existingPawns.forEach(pawn => {
            newContent += `<img id="${pawn.id}" src="${pawn.src}" class="pawn-image${pawnsCount > 1 ? ' multiple' : ''}">`; 
        });

        // Ajouter le nouveau pion
        newContent += `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png" class="pawn-image${pawnsCount > 1 ? ' multiple' : ''}">`;

        if (pawnsCount > 1) {
            newContent += '</div>';
        }
        
        startCase.innerHTML = newContent;
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
        // Si c'est une case de départ ou du chemin final
        if (caseElement.classList.contains('start') || caseElement.classList.contains('final-path')) {
            return Array.from(caseElement.getElementsByTagName('img'))
                .filter(img => img.id !== `${this.playerId}_${this.id}`)
                .map(img => img.outerHTML)
                .join('');
        }
        // Pour les autres cases (avec potentiellement des étoiles)
        return Array.from(caseElement.getElementsByTagName('img'))
            .filter(img => img.id !== `${this.playerId}_${this.id}` && !img.alt.includes('etoile'))
            .map(img => img.outerHTML)
            .join('');
    }

    async move(steps) {
        if (this.position === 0) {
            console.log("Tu ne peux pas bouger un pion qui n'est pas sortit de sa maison !");
            return;
        }
        if (this.hasFinished) {
            console.log("Tu ne peux pas bouger un pion qui a finit !");
            return;
        }

        if (!this.endPath) {
            const targetPosition = this.position + steps;
            
            // Déplacement pas à pas
            for (let i = this.position + 1; i <= targetPosition; i++) {
                if (i > 51) {
                    this.enterFinalZone();
                    await this.move(targetPosition - 51);
                    return;
                }
                
                this.position = i;
                const idNextPosition = idCaseAbs(this.position, this.color);
                await this.animateMove(idNextPosition);
                await new Promise(resolve => setTimeout(resolve, 200)); // Délai entre chaque saut
            }
        } else {
            await this.moveInFinalPath(steps);
        }
    }

    async moveInFinalPath(steps) {
        const targetPosition = this.endPosition + steps;
        
        // Déplacement pas à pas dans le chemin final
        for (let i = this.endPosition + 1; i <= targetPosition; i++) {
            this.endPosition = i;
            let idCaseFinalPath = idFinalPath(this.color, this.endPosition);
            
            if (this.endPosition === 6) {
                this.hasFinished = true;
                console.log(`${this.id} a fini !!!!!`);
                idCaseFinalPath = `subcenter_${this.color}_${this.id}`;
            }
            await this.animateMove(idCaseFinalPath);
            await new Promise(resolve => setTimeout(resolve, 50)); // Délai entre chaque saut
            
        }
    }

    async animateMove(newPosition) {
        const currentPawn = this.currentElement;
        if (!currentPawn) return;

        const currentCase = currentPawn.parentElement;
        const nextCase = document.getElementById(newPosition);
        
        // Sauvegarder la position initiale
        const startRect = currentPawn.getBoundingClientRect();
        const endRect = nextCase.getBoundingClientRect();
        
        // Créer un clone pour l'animation
        const clone = currentPawn.cloneNode(true);
        document.body.appendChild(clone);
        
        // Positionner le clone
        clone.style.position = 'fixed';
        clone.style.left = startRect.left + 'px';
        clone.style.top = startRect.top + 'px';
        clone.style.zIndex = '1000';
        clone.style.width = startRect.width + 'px';
        clone.style.height = startRect.height + 'px';
        
        // Cacher le pion original
        currentPawn.style.visibility = 'hidden';
        
        // Animer le saut
        await clone.animate([
            {
                left: startRect.left + 'px',
                top: startRect.top + 'px'
            },
            {
                left: (startRect.left + endRect.left) / 2 + 'px',
                top: Math.min(startRect.top, endRect.top) - 30 + 'px' // Point culminant du saut
            },
            {
                left: endRect.left + 'px',
                top: endRect.top + 'px'
            }
        ], {
            duration: 100,
            easing: 'ease-in-out'
        }).finished;

        // Supprimer le clone
        clone.remove();
        
        // Mettre à jour le plateau
        this.updateBoard(newPosition);
        
        // Rendre le pion visible à sa nouvelle position
        const updatedPawn = this.currentElement;
        if (updatedPawn) {
            updatedPawn.style.visibility = 'visible';
        }
    }
    

    isAtHome() {
        return this.position === 0; // Exemple de la condition pour être à la maison
    }

    // isSafe() {
    //  // le pion est sur une étoile et les cases de départ (position 1) et ne peut pas etre mangé
    // }
}


export { Player, Pawn };