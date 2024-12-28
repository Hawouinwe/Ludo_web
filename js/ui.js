// - `getPlayerInfo(playerId)` : Récupère les informations d'un joueur (nom, couleur, position, etc.).
// - `getPlayers()` : Récupère la liste de tous les joueurs.
// - `initializeBoard()`: Affiche le plateau (avec une petite animation) et place les joueurs existant dans leur safe zone

// afficher la fin du jeu (donc le gagnant)

import { Player } from "./player.js";

document.addEventListener('keydown', handleEnter);
let players = [];
let numPlayers = prompt("Vous êtes combien à jouer ? (2 à 4 joueurs)", 2);

function createPlayers() {
	numPlayers = Math.max(2, Math.min(4, parseInt(numPlayers))); 
	for (let i = 0; i < numPlayers; i++) {
		let name = prompt(`Entrez le pseudo du joueur ${i + 1} :`, `Player ${i + 1}`);
		createPlayer(name);
	}

	players.forEach((player) => {
		console.log(player)
		const home = document.querySelector(`#home_${player.color}`);
		home.innerHTML = home.innerHTML + "<p style='font-weight:bold;'>" + player.name + "</p>";
	})
}

function createPlayer(name = `Player ${players.length + 1}`) {
	const id = players.length + 1;
	const color = getColor(players.length);
	players.push(new Player(id, name, color));
}

function getColor(idColor) {
	let colors
	if (numPlayers === 2) {
		colors = ["red", "yellow", "blue", "green"];
	} else {
		colors = ["red", "blue", "yellow", "green"];
	}
	return colors[idColor];
}

function printNextTurn(actualPlayer = -1) {
	let nextPlayer;
	if (actualPlayer === -1) {
		nextPlayer = players[0];
	} else {
		nextPlayer = players[(actualPlayer + 1) % numPlayers];
	}
	alert(`${nextPlayer.name}, c'est ton tour!`);
	return nextPlayer;
}


function handleEnter(event) {
	if (event.key === "Enter" || event.key === " ") {
		console.log("Lancer de dé...");
	}
}

function initializeBoard() {
	for (const player of players) {
		for (const pawn of player.pawns) {
			const subhome = document.querySelector(`#subhome_${player.color}_${pawn.id}`);
			subhome.innerHTML = `<img id="${player.id}_${pawn.id}" src="images/icones_joueurs/${player.color}.png">`
		}
	}
}


// Animation fenetre d'alerte
function showCustomAlert(title, content) {
    const overlay = document.getElementById('alertOverlay');
    const alertBox = overlay.querySelector('.custom-alert');
    const titleElement = document.getElementById('alertTitle');
    const contentElement = document.getElementById('alertContent');

    // Set content
    titleElement.textContent = title;
    contentElement.textContent = content;

    // Show overlay
    overlay.style.display = 'block';

    // Animate alert box
    requestAnimationFrame(() => {
        alertBox.classList.add('slide-in');
    });

    // Auto-close after 2 seconds
    setTimeout(() => {
        closeAlert();
    }, 2000);
}

function closeAlert() {
    const overlay = document.getElementById('alertOverlay');
    const alertBox = overlay.querySelector('.custom-alert');

    // Animate out
    alertBox.classList.remove('slide-in');
    alertBox.classList.add('slide-out');

    // Hide overlay after animation
    setTimeout(() => {
        overlay.style.display = 'none';
        alertBox.classList.remove('slide-out');
    }, 1000);
}
document.getElementById('alertButton').addEventListener('click', closeAlert);

createPlayers();
initializeBoard();

export { printNextTurn, showCustomAlert, closeAlert, numPlayers, players };