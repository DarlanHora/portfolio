function abrirMenu() {
  var menu = document.getElementById('menu');
  if (menu.style.display == 'block') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'block';
  }
}

function filtrar(tipo) {
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    if (tipo == 'todos') {
      cards[i].style.display = 'block';
    } else if (cards[i].classList.contains(tipo)) {
      cards[i].style.display = 'block';
    } else {
      cards[i].style.display = 'none';
    }
  }
}

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Mensagem enviada!');
  document.getElementById('form').reset();
});

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('enviado');
});
