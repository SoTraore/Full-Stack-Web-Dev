
function getWantedAction(event) {
  switch (event) {
    case 'w':
    let wAudio = new Audio('./sounds/tom-1.mp3');
    wAudio.play();
    break;
    case 'a':
    let aAudio  = new Audio('./sounds/tom-2.mp3');
    aAudio.play();
    break;
    case 's':
    let sAudio = new Audio('./sounds/tom-3.mp3');
    sAudio.play();
    break;
    case 'd':
    let dAudio = new Audio('./sounds/tom-4.mp3');
    dAudio.play();
    break;
    case 'j':
    let jAudio = new Audio('./sounds/crash.mp3');
    jAudio.play();
    break;
    case 'k':
    let kAudio = new Audio('./sounds/kick-bass.mp3');
    kAudio.play();
    break;
    case 'l':
    let lAudio = new Audio('./sounds/snare.mp3');
    lAudio.play();
    break;
  }
}

let elt = document.querySelectorAll('button') ;

for (let i = 0; i < 7; i++) {
  elt[i].addEventListener('click', function(event) {
    getWantedAction(event.target.textContent);
    elt[i].classList.add('pressed', 'game-over');

    setTimeout(function() {
      elt[i].classList.remove('pressed', 'game-over');
    }, 1000); // Wait for 1 second (1000 milliseconds) before removing the classes
  });
}

document.addEventListener('keypress', function(event) {
  getWantedAction(event.key);
});
