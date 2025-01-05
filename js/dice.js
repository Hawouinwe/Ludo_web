class Dice {
  constructor() {
    this.element = document.getElementById("dice"); // Récupère l'élément dé dans le DOM
    this.result = 1; // Initialise la face visible du dé à 1
  }

  rollDice() {
    const elm = document.getElementById('roll'); // Récupère le bouton de lancement
    return new Promise((resolve) => {
      const onClick = () => {
        // Génère un nombre aléatoire entre 1 et 6
        this.result = Math.floor(Math.random() * 6) + 1;
  
        // Supprime toutes les classes 'show-X' existantes
        for (let i = 1; i <= 6; i++) {
          this.element.classList.remove('show-' + i);
        }
  
        // Ajoute la classe correspondant au résultat du lancer
        this.element.classList.add('show-' + this.result);
  
        const onTransitionEnd = () => {
          this.element.removeEventListener('transitionend', onTransitionEnd);
          resolve(this.result); // Résout la promesse avec le résultat du lancer
        };
  
        // Ajoute l'écouteur d'événement pour la fin de l'animation
        this.element.addEventListener('transitionend', onTransitionEnd, { once: true });
  
        // Solution de secours si l'événement transitionend n'est pas déclenché
        setTimeout(() => {
          this.element.removeEventListener('transitionend', onTransitionEnd);
          resolve(this.result);
        }, 1500); // Délai basé sur la durée de la transition CSS
  
        // Nettoie l'écouteur d'événement du clic
        elm.removeEventListener('click', onClick);
      };
  
      // Ajoute l'écouteur d'événement pour le clic
      elm.addEventListener('click', onClick, { once: true });
    });
  }
}

export { Dice };