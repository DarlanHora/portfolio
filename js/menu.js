/*
 * Menu móvel.
 * O estado (aberto/fechado) mora em um lugar só: o aria-expanded do botão.
 * O CSS lê esse atributo para mostrar ou esconder a lista.
 */
(function iniciarMenu() {
  const botao = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu-principal');
  if (!botao || !menu) return;

  function menuEstaAberto() {
    return botao.getAttribute('aria-expanded') === 'true';
  }

  function definirMenuAberto(aberto) {
    botao.setAttribute('aria-expanded', String(aberto));
    botao.querySelector('.menu-botao__texto').textContent = aberto ? 'Fechar' : 'Menu';
  }

  botao.addEventListener('click', function () {
    definirMenuAberto(!menuEstaAberto());
  });

  // Ao escolher uma seção, o menu fecha para não cobrir o conteúdo
  menu.addEventListener('click', function (evento) {
    if (evento.target.closest('a')) definirMenuAberto(false);
  });

  // Esc fecha o menu e devolve o foco ao botão (quem usa teclado não se perde)
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menuEstaAberto()) {
      definirMenuAberto(false);
      botao.focus();
    }
  });
})();
