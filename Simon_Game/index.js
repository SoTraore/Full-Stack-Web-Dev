function generateSerie(len) {
  let result = [];
  for (let i = 0; i < len; i++) {
    result.push(Math.floor(Math.random() * 4));
  }
  return result;
}

function autoPlay(game) {
  game.forEach((elt, index) => {
    let eltStyle = '';
    setTimeout(function() {
      if (elt === 0) {
        let green = new Audio('./sounds/green.mp3');
        green.play();
        eltStyle = 'green';
      }
      else if (elt === 1) {
        let yellow = new Audio('./sounds/yellow.mp3');
        yellow.play();
        eltStyle = 'yellow';
      }
      else if (elt === 2) {
        let red = new Audio('./sounds/red.mp3');
        red.play();
        eltStyle = 'red';
      }
      else if (elt === 3) {
        let blue = new Audio('./sounds/blue.mp3');
        blue.play();
        eltStyle = 'blue';
      }
      $('.' + eltStyle).addClass('pressed');
      setTimeout(function() {
        $('.' + eltStyle).removeClass('pressed');
      }, 100);
    }, 1000 * index); // Multiply the delay by the index of the current iteration
  });
}

let game = generateSerie(10);

$(document).on('keypress', function() {
  autoPlay(game);
});

let index = 0;

$(".btn").on('click', function(event) {
  let eltStyle;
  let selectedElt = "";
  setTimeout(function() {
    if (index < game.length) {
      if (game[index] === 0 && event.target.id === "green") {
        let green = new Audio('./sounds/green.mp3');
        green.play();
        selectedElt = "green";
      }
      else if (game[index] === 1 && event.target.id === "yellow") {
        let yellow = new Audio('./sounds/yellow.mp3');
        yellow.play();
        selectedElt = "yellow";
      }
      else if (game[index] === 2 && event.target.id === "red") {
        let red = new Audio('./sounds/red.mp3');
        red.play();
        selectedElt = "red";
      }
      else if (game[index] === 3 && event.target.id === "blue") {
        let blue = new Audio('./sounds/blue.mp3');
        blue.play();
        selectedElt = "blue";
      }
      else {
        let wrong = new Audio('./sounds/wrong.mp3');
        wrong.play();
        index = 0;
        setTimeout(function() {
          window.onload = function() {
            autoPlay(game);
          };
        }, 2000);
      }

      if (selectedElt !== '') {
        $("." + selectedElt).addClass("pressed");
      }

      setTimeout(function() {
        $("." + selectedElt).removeClass("pressed");
      }, 100);
      index++;
    }
    else {
      index = 0;
    }
  }, 100);
});
