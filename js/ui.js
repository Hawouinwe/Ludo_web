import { Player } from "./player.js";
import { Pawn } from "./player.js";

// - `createPlayer(name, color)` : Crée un joueur avec un nom et une couleur (ou toute autre propriété nécessaire pour identifier le joueur).
// - `getPlayerInfo(playerId)` : Récupère les informations d'un joueur (nom, couleur, position, etc.).
// - `getPlayers()` : Récupère la liste de tous les joueurs.
// - `initializeBoard()`: Affiche le plateau (avec une petite animation) et place les joueurs existant dans leur safe zone
// - `affichageNextTurn(playerId)`: Affiche une fenetre pour dire que c'est le tour de qui
// - `handleEnter()`: permet de gérer si l'utilisateur appuie juste sur entrée pour lancer le dé

// "vous etes combien à jouer: "

// entrez votre pseudo ou laissez par défaut

// si defaut alors:
// 	Player 1
// 	Player 2
// 	etc
// sinon:
// 	ils entrent leurs pseudo

// fonction pour voir qui commence
// pour chaque joueur attribuer couleur
// gerer c le tour de qui (affichage + logique)
// afficher la fin du jeu (donc le gagnant)

document.addEventListener('keydown', handleEnter);

let players = [];

function createPlayers() {
	let numPlayers = prompt("Vous êtes combien à jouer ? (2 à 4 joueurs)", 4);
	numPlayers = Math.max(2, Math.min(4, parseInt(numPlayers))); 
	for (let i = 0; i < numPlayers; i++) {
		let name = prompt(`Entrez le pseudo du joueur ${i + 1} :`, `Player ${i + 1}`);
		createPlayer(name);
	}
}

function createPlayer(name = `Player ${players.length + 1}`) {
	const id = players.length + 1;
	const color = getColor(players.length);
	players.push(new Player(id, name, color));
}

function getColor(idColor) {
	const colors = ["red", "yellow", "blue", "green"];
	return colors[idColor];
}

function printNextTurn(actualPlayer) {
	const nextPlayer = players[(actualPlayer.id + 1) % numPlayers];
	alert(`${nextPlayer.name}, c'est ton tour!`);
}

function handleEnter(event) {
	if (event.key === "Enter") {
		console.log("Lancer de dé...");
	}
}

function determineFirstPlayer() {
	const randomIndex = Math.floor(Math.random() * players.length);
	return players[randomIndex];
}

createPlayers();
