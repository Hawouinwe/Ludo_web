class Dice {
  constructor() {
    this.element = document.getElementById("dice"); // Id de l'élément DOM
    this.result = 1; // Initialiser avec une face visible par défaut
  }
  /*
  rollDice() {
    const elm = cleanUpEventListeners(document.getElementById('roll'));
    //elm.addEventListener('click', onClick, { once: true });
    return new Promise((resolve) => {
      // Fonction qui sera appelée lorsque l'utilisateur clique sur le bouton
      const onClick = () => {
        // Générer un nombre aléatoire entre 1 et 6
        this.result = Math.floor(Math.random() * 6) + 1;

        // Supprimer toutes les classes 'show-X'
        for (let i = 1; i <= 6; i++) {
          this.element.classList.remove('show-' + i);
        }

        // Ajouter la classe correspondant au résultat
        this.element.classList.add('show-' + this.result);

        console.log('Résultat du dé :', this.result); // Debug

        console.log("A") ;

        // Écouter la fin de l'animation (événement transitionend)
        const onTransitionEnd = () => {
          console.log("B") ;
          // Résoudre la promesse après la fin de l'animation
          this.element.removeEventListener('transitionend', onTransitionEnd);

          console.log("C") ;
          //elm.removeEventListener('click', onClick)
          resolve(this.result);  // Résoudre la promesse avec le résultat

          console.log("D") ;
        };

        console.log("E") ;

        // Ajouter l'événement transitionend à l'élément
        this.element.addEventListener('transitionend', onTransitionEnd, { once: true });

        console.log("F") ;

        // Désabonner l'événement après que l'utilisateur ait cliqué
        elm.removeEventListener('click', onClick);

        console.log("G") ;
      };

      // Ajouter un écouteur d'événement pour le clic sur le dé
      console.log("H") ;

      elm.addEventListener('click', onClick, { once: true });


      console.log("FIN DU rollDice") ;
    });
  }
  */
  rollDice() {
    const elm = document.getElementById('roll');
    return new Promise((resolve) => {
      const onClick = () => {
        // Generate a random number between 1 and 6
        this.result = forTestOnly() ; //Math.floor(Math.random() * 6) + 1; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
        // Remove existing 'show-X' classes
        for (let i = 1; i <= 6; i++) {
          this.element.classList.remove('show-' + i);
        }
  
        // Add the class corresponding to the result
        this.element.classList.add('show-' + this.result);
  
        //console.log('Dice roll result:', this.result);
  
        const onTransitionEnd = () => {
          //console.log("Transition end detected");
          this.element.removeEventListener('transitionend', onTransitionEnd);
          resolve(this.result); // Resolve the promise with the result
        };
  
        // Attach the transitionend listener
        this.element.addEventListener('transitionend', onTransitionEnd, { once: true });
  
        // Fallback in case transitionend is not triggered
        setTimeout(() => {
          // console.warn("Fallback: Transitionend not triggered, resolving.");
          this.element.removeEventListener('transitionend', onTransitionEnd);
          resolve(this.result);
        }, 1500); // Adjust timeout based on CSS transition duration
  
        // Clean up the click listener
        elm.removeEventListener('click', onClick);
      };
  
      // Add the click event listener
      elm.addEventListener('click', onClick, { once: true });
    });
  }
}

// Initialisation
//const dice = new Dice('dice'); // Id de l'élément représentant le dé

/*
// Ajout d'un événement au bouton
const rollButton = document.getElementById('roll');
rollButton.onclick = function () {
  dice.rollDice(); // Appeler la méthode de l'instance
};
*/
/*
const rollButton = document.getElementById('roll');
rollButton.onclick = function () {
  dice.rollDice().then(result => {
    console.log('Résultat du lancer de dé : ', result);
  });
};
*/

function cleanUpEventListeners(element) {
  const clone = element.cloneNode(true); // Clone to remove all attached listeners
  element.parentNode.replaceChild(clone, element);
  return clone;
}



// For Test Only !!!!!!!!!!!!!!!!!!!!!!!!
function forTestOnly() {
  let piece = Math.floor(Math.random() * 2) ;
  if (piece === 0) {
    return 6 ;
  }
  return 1;
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


export { Dice };