class Dice {
  constructor() {
    this.element = document.getElementById("dice"); // Id de l'élément DOM
    this.result = 1; // Initialiser avec une face visible par défaut
  }

  rollDice() {
    // Générer un nombre aléatoire entre 1 et 6
    this.result = Math.floor(Math.random() * 6) + 1;

    // Supprimer toutes les classes 'show-X'
    for (let i = 1; i <= 6; i++) {
      this.element.classList.remove('show-' + i);
    }

    // Ajouter la classe correspondant au résultat
    this.element.classList.add('show-' + this.result);

    console.log('Résultat du dé :', this.result); // Debug
    return this.result;
    // setTimeout(this.rollDice(), 2000);
  }
}

// Ajout d'un événement au bouton
const rollButton = document.getElementById('roll');
rollButton.onclick = function () {
  dice.rollDice(); // Appeler la méthode de l'instance
};


export { Dice };