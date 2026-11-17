/*
 * Vídeo de fundo do topo.
 * Regras:
 *  - Quem pediu "reduzir movimento" no sistema não vê o vídeo rodando.
 *  - Para os demais, o vídeo toca sem som e pode ser pausado por um botão.
 *  - Se o vídeo falhar, nada quebra: o fundo azul do CSS continua.
 */
(function iniciarVideoFundo() {
  const video = document.querySelector('.hero__video');
  const botao = document.getElementById('pausar-video');
  if (!video || !botao) return;

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

  function atualizarBotao() {
    botao.textContent = video.paused ? 'Reproduzir vídeo' : 'Pausar vídeo';
  }

  function tocar() {
    // play() devolve uma Promise; o catch evita erro no console
    // quando o navegador bloqueia a reprodução automática.
    const promessa = video.play();
    if (promessa) promessa.catch(atualizarBotao);
  }

  function aplicarPreferencia() {
    if (reduzirMovimento.matches) {
      video.pause();
      botao.hidden = true;
      video.classList.remove('hero__video--visivel');
    } else {
      botao.hidden = false;
      tocar();
    }
  }

  // Só mostra o vídeo quando ele de fato tem imagem para exibir
  video.addEventListener('playing', function () {
    video.classList.add('hero__video--visivel');
    atualizarBotao();
  });
  video.addEventListener('pause', atualizarBotao);
  video.addEventListener('error', function () { botao.hidden = true; }, true);

  botao.addEventListener('click', function () {
    if (video.paused) tocar();
    else video.pause();
  });

  // Se a pessoa mudar a preferência com a página aberta, respeita na hora
  reduzirMovimento.addEventListener('change', aplicarPreferencia);
  aplicarPreferencia();
})();
