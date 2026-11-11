/*
 * Filtro de projetos por tecnologia.
 * Os cards são criados UMA vez, a partir de PROJETOS (dados-projetos.js).
 * Filtrar só liga e desliga o atributo hidden, por isso trocar de filtro
 * várias vezes nunca duplica cards.
 */
(function iniciarFiltroProjetos() {
  const areaFiltro = document.getElementById('filtro-projetos');
  const lista = document.getElementById('lista-projetos');
  const resultado = document.getElementById('resultado-filtro');
  const estadoVazio = document.getElementById('estado-vazio');
  const botaoLimpar = document.getElementById('limpar-filtro');
  if (!areaFiltro || !lista) return;

  const FILTRO_INICIAL = 'Todos';

  // ---------- Criação dos elementos (só texto via textContent) ----------

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto) elemento.textContent = texto;
    return elemento;
  }

  function criarLinhaInfo(rotulo, valor) {
    const linha = criarElemento('p', 'card__info');
    linha.append(criarElemento('strong', '', rotulo + ': '), document.createTextNode(valor));
    return linha;
  }

  function criarLink(texto, url, tituloProjeto) {
    const link = criarElemento('a', 'card__link', texto);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    // Nome acessível completo: "Ver código de Portfólio pessoal (abre em nova aba)"
    link.setAttribute('aria-label', texto + ' de ' + tituloProjeto + ' (abre em nova aba)');
    return link;
  }

  function criarCard(projeto) {
    const item = criarElemento('li', 'card');
    item.dataset.tecnologias = projeto.tecnologias.join('|');

    const imagem = criarElemento('img', 'card__imagem');
    imagem.src = projeto.imagem;
    imagem.alt = projeto.textoAlternativo;
    imagem.width = 640;
    imagem.height = 360;
    imagem.loading = 'lazy';

    const corpo = criarElemento('div', 'card__corpo');
    corpo.append(
      criarElemento('h3', 'card__titulo', projeto.titulo),
      criarElemento('p', 'card__origem', projeto.origem),
      criarLinhaInfo('Problema', projeto.problema),
      criarLinhaInfo('Público', projeto.publico),
      criarLinhaInfo('Minha contribuição', projeto.contribuicao)
    );

    const tags = criarElemento('ul', 'card__tags');
    tags.setAttribute('aria-label', 'Tecnologias');
    projeto.tecnologias.forEach(function (tecnologia) {
      tags.append(criarElemento('li', 'tag', tecnologia));
    });
    corpo.append(tags);

    const links = criarElemento('div', 'card__links');
    if (projeto.links.codigo) links.append(criarLink('Ver código', projeto.links.codigo, projeto.titulo));
    if (projeto.links.site) links.append(criarLink('Ver site', projeto.links.site, projeto.titulo));
    if (!links.children.length) links.append(criarElemento('p', 'card__sem-link', 'Link ainda não publicado.'));
    corpo.append(links);

    item.append(imagem, corpo);
    return item;
  }

  function criarBotaoFiltro(nome) {
    const botao = criarElemento('button', 'filtro__botao', nome);
    botao.type = 'button';
    botao.dataset.filtro = nome;
    botao.setAttribute('aria-pressed', 'false');
    return botao;
  }

  // ---------- Regra do filtro (função pura, fácil de testar) ----------

  function projetoCorresponde(tecnologiasDoCard, filtro) {
    return filtro === FILTRO_INICIAL || tecnologiasDoCard.includes(filtro);
  }

  function textoQuantidade(quantidade, filtro) {
    const palavra = quantidade === 1 ? 'projeto encontrado' : 'projetos encontrados';
    const contexto = filtro === FILTRO_INICIAL ? '' : ' com ' + filtro;
    return quantidade + ' ' + palavra + contexto + '.';
  }

  // ---------- Aplicação na tela ----------

  function aplicarFiltro(filtro) {
    let visiveis = 0;

    lista.querySelectorAll('.card').forEach(function (card) {
      const corresponde = projetoCorresponde(card.dataset.tecnologias.split('|'), filtro);
      card.hidden = !corresponde;
      if (corresponde) visiveis++;
    });

    areaFiltro.querySelectorAll('.filtro__botao').forEach(function (botao) {
      botao.setAttribute('aria-pressed', String(botao.dataset.filtro === filtro));
    });

    resultado.textContent = textoQuantidade(visiveis, filtro);
    estadoVazio.hidden = visiveis > 0;
  }

  // ---------- Montagem inicial ----------

  FILTROS.forEach(function (nome) {
    areaFiltro.append(criarBotaoFiltro(nome));
  });
  PROJETOS.forEach(function (projeto) {
    lista.append(criarCard(projeto));
  });

  // Um único listener no grupo (delegação), em vez de um por botão
  areaFiltro.addEventListener('click', function (evento) {
    const botao = evento.target.closest('.filtro__botao');
    if (botao) aplicarFiltro(botao.dataset.filtro);
  });

  botaoLimpar.addEventListener('click', function () {
    aplicarFiltro(FILTRO_INICIAL);
    areaFiltro.querySelector('[data-filtro="' + FILTRO_INICIAL + '"]').focus();
  });

  aplicarFiltro(FILTRO_INICIAL);
})();
