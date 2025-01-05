import { idCaseAbs, idFinalPath } from "./board.js";
import { Dice } from "./dice.js";

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color
        // Création des 4 pions du joueur
        this.pawns = [new Pawn(0,this.color, this.id), new Pawn(1,this.color, this.id), 
                      new Pawn(2,this.color, this.id), new Pawn(3,this.color, this.id)];
        this.dice = new Dice();
    }

    // Vérifie si le joueur a gagné (tous ses pions ont atteint l'objectif)
    hasWon() {
        return this.pawns.every(pawn => pawn.hasFinished);
    }

    // Méthodes de délégation vers les pions
    async move(pawnId, steps = 1) {
        await this.pawns[pawnId].move(steps);
    }

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
}

class Pawn {
    constructor(id, color, playerId) {
        this.id = id;
        this.color = color;
        this.playerId = playerId;
        this.start = `#subhome_${color}_${id}`;
        this.position = 0;  // Position 0 = dans la maison de départ
        this.htmlIcon = `<img id="${this.playerId}_${this.id}" src="images/icones_joueurs/${this.color}.png">`;
        this.endPath = false;  // Indique si le pion est dans le chemin final
        this.endPosition = null;  // Position dans le chemin final
        this.hasFinished = false;  // Indique si le pion a atteint l'arrivée
    }

    // Récupère l'élément DOM du pion
    get currentElement() {
        return document.getElementById(`${this.playerId}_${this.id}`);
    }

    // Met à jour le contenu d'une case (gestion des étoiles)
    updateCaseContent(caseElement, newContent) {
        if (caseElement.id.includes("star_")) {
            const starImg = '<img src="images/star.png" alt="etoile" class="star-image">';
            caseElement.innerHTML = newContent ? `${starImg}${newContent}` : starImg;
        } else {
            caseElement.innerHTML = newContent || "";
        }
    }

    // Met à jour l'affichage du plateau après un déplacement
    updateBoard(newPosition) {
        const currentPawn = this.currentElement;
        if (!currentPawn) return;

        const currentCase = currentPawn.parentElement;
        const nextCase = document.getElementById(newPosition);

        // Gérer la case actuelle
        const otherPawnsInCurrentCase = Array.from(currentCase.getElementsByTagName('img'))
            .filter(img => !img.alt.includes('etoile') && img !== currentPawn);
        
        // Mettre à jour les classes des pions restants dans la case actuelle
        if (otherPawnsInCurrentCase.length === 1) {
            otherPawnsInCurrentCase[0].classList.remove('multiple');
        }
        this.updateCaseContent(currentCase, otherPawnsInCurrentCase.map(img => img.outerHTML).join(''));

        // Récupérer les pions existants dans la nouvelle case
        const existingPawns = Array.from(nextCase.getElementsByTagName('img'))
            .filter(img => !img.alt.includes('etoile'));
        
        const pawnsCount = existingPawns.length + 1;

        let newContent = '';
        
        if (nextCase.id.includes("star_")) {
            newContent += '<img src="images/star.png" alt="etoile" class="star-image">';
        }

        if (pawnsCount > 1) {
            newContent += '<div class="pawns-container">';
        }

        // Ajouter les pions existants avec la classe appropriée
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

    // Fait sortir le pion de sa zone de départ
    exitStartZone() {
        const subhome = document.querySelector(this.start);
        const startCase = document.querySelector(`#start_${this.color}`);
        subhome.innerHTML = "";
        
        const existingPawns = Array.from(startCase.getElementsByTagName('img'));
        const pawnsCount = existingPawns.length + 1;

        let newContent = '';
        
        if (pawnsCount > 1) {
            newContent += '<div class="pawns-container">';
        }

        // Ajouter les pions existants avec la classe appropriée
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

    // Fait rentrer le pion dans sa zone de départ
    enterStartZone() {
        const currentCase = this.currentElement.parentElement;
        const subhome = document.querySelector(this.start);
        this.updateCaseContent(currentCase, this.getOtherPawnsHtml(currentCase));
        subhome.innerHTML = this.htmlIcon;
        this.position = 0;
    }

    // Fait entrer le pion dans le chemin final
    enterFinalZone() {
        this.endPath = true;
        this.endPosition = 0;
    }

    // Récupère le HTML des autres pions sur une case
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

    // Déplace le pion d'un certain nombre de cases
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

    // Gère le déplacement dans le chemin final
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

    // Anime le déplacement du pion
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
    
    // Vérifie si le pion est dans sa maison de départ
    isAtHome() {
        return this.position === 0;
    }
}


export { Player, Pawn };