import { Player } from "./player.js";
import { game } from "./game.js";

let players;
let numPlayers;

// Initialise une nouvelle partie
function initGame() {
    players = [];
    numPlayers = prompt("Vous êtes combien à jouer ? (2 à 4 joueurs)", 2);
    createPlayers();
    initializeBoard();
    game();
}

// Crée les joueurs en fonction du nombre choisi
function createPlayers() {
    // Limite le nombre de joueurs entre 2 et 4
    numPlayers = Math.max(2, Math.min(4, parseInt(numPlayers))); 
    
    // Demande le pseudo de chaque joueur
    for (let i = 0; i < numPlayers; i++) {
        let name = prompt(`Entrez le pseudo du joueur ${i + 1} :`, `Joueur ${i + 1}`);
        createPlayer(name);
    }

    // Affiche les pseudos des joueurs sur le plateau
    players.forEach((player) => {
        const home = document.querySelector(`#home_${player.color}`);
        // Supprime les anciens pseudos s'il y en a
        const pseudoElements = home.querySelectorAll('.pseudo');
        pseudoElements.forEach(pseudo => {
            pseudo.remove();
        });
        // Ajoute le nouveau pseudo
        home.innerHTML = `${home.innerHTML} <p class='pseudo' id='pseudo_player_${player.id}'>${player.name}</p>`;
    })
}

// Crée un nouveau joueur avec un nom et une couleur
function createPlayer(name = `Player ${players.length + 1}`) {
    const id = players.length + 1;
    const color = getColor(players.length);
    players.push(new Player(id, name, color));
}

// Attribue une couleur en fonction du nombre de joueurs
function getColor(idColor) {
    let colors
    if (numPlayers === 2) {
        colors = ["red", "yellow", "blue", "green"];
    } else {
        colors = ["red", "blue", "yellow", "green"];
    }
    return colors[idColor];
}

// Met en évidence le joueur actif
function updateActivePlayer(playerId) {
    document.querySelectorAll('.pseudo').forEach(player => {
        player.classList.remove('active-player');
    });
    document.querySelector(`#pseudo_player_${playerId}`).classList.add('active-player');
}

// Gère l'événement de la touche Entrée
function handleEnter(event) {
    if (event.key === "Enter" || event.key === " ") {
        console.log("Lancer de dé...");
    }
}

// Initialise le plateau de jeu
function initializeBoard() {
    // Supprime tous les pions existants
    for (let playerId = 1; playerId <= 4; playerId++) {
        for (let pawnId = 0; pawnId <= 3; pawnId++) {
            const pawnElement = document.getElementById(`${playerId}_${pawnId}`);
            if (pawnElement) {
                pawnElement.remove();
            }
        }
    }
    
    // Place les pions dans leur position initiale
    for (const player of players) {
        for (const pawn of player.pawns) {
            const subhome = document.querySelector(`#subhome_${player.color}_${pawn.id}`);
            subhome.innerHTML = `<img id="${player.id}_${pawn.id}" src="images/icones_joueurs/${player.color}.png">`
        }
    }
}

// Affiche une alerte personnalisée
function showCustomAlert(title, content, end = false) {
    const overlay = document.getElementById('alertOverlay');
    const alertBox = overlay.querySelector('.custom-alert');
    const titleElement = document.getElementById('alertTitle');
    const contentElement = document.getElementById('alertContent');
    const replayButton = document.getElementById('replayButton');
    const okButton = document.getElementById('alertButton');
    
    titleElement.textContent = title;

    if (end) {
        // Affiche le classement final
        const classment = content.map((pseudo, index) => {
            if (index === 0) {
                return `<div class="ranking-item">${index + 1} - ${pseudo} 👑</div>`;
            } else {
                return `<div class="ranking-item">${index + 1} - ${pseudo}</div>`;
            }
        }).join('');
        contentElement.innerHTML = classment;
        
        // Affiche le bouton pour rejouer
        replayButton.style.display = 'inline-block';
        replayButton.onclick = () => {
            closeAlert();
            initGame();
        };
    } else {
        contentElement.innerHTML = content;
        replayButton.style.display = 'none';
        setTimeout(() => {
            closeAlert();
        }, 2000);
    }

    overlay.style.display = 'block';
    requestAnimationFrame(() => {
        alertBox.classList.add('slide-in');
    });
}

// Ferme l'alerte personnalisée avec animation
function closeAlert() {
    const overlay = document.getElementById('alertOverlay');
    const alertBox = overlay.querySelector('.custom-alert');

    alertBox.classList.remove('slide-in');
    alertBox.classList.add('slide-out');

    setTimeout(() => {
        overlay.style.display = 'none';
        alertBox.classList.remove('slide-out');
    }, 1000);
}

document.getElementById('alertButton').addEventListener('click', closeAlert);

// Lance le jeu
initGame();

export { showCustomAlert, closeAlert, numPlayers, players, updateActivePlayer, initGame };