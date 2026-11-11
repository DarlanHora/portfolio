/*
 * Formulário de contato.
 *
 * Organização (Etapa 5): cada bloco tem uma responsabilidade.
 *   1. Seleção dos elementos
 *   2. Leitura e normalização dos dados
 *   3. Regras de validação (funções que só devolvem texto de erro)
 *   4. Apresentação de erros
 *   5. Regra condicional do assunto
 *   6. Estados do formulário e envio simulado
 *   7. Eventos
 *
 * Decisão sobre novalidate: o <form> usa novalidate para que o navegador
 * não mostre os balões nativos na hora errada. Os atributos required,
 * minlength, maxlength e type="email" continuam no HTML e são usados aqui:
 * os limites são lidos dos próprios atributos e o formato do e-mail vem de
 * input.validity.typeMismatch. Assim o HTML é a fonte dos limites e o JS
 * decide quando e como mostrar o feedback.
 */
(function iniciarFormulario() {
  // ---------------------------------------------------------------
  // 1. Seleção dos elementos
  // ---------------------------------------------------------------
  const form = document.getElementById('form-contato');
  if (!form) return;

  const campos = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    motivo: document.getElementById('motivo'),
    assunto: document.getElementById('assunto'),
    mensagem: document.getElementById('mensagem')
  };
  const blocoAssunto = document.getElementById('campo-assunto');
  const contador = document.getElementById('mensagem-contador');
  const resumo = document.getElementById('resumo-erros');
  const resumoLista = document.getElementById('resumo-lista');
  const botaoEnviar = document.getElementById('botao-enviar');
  const status = document.getElementById('status-envio');
  const saidaDados = document.getElementById('dados-processados');

  const MOTIVO_COM_ASSUNTO = 'outro';
  const TEXTO_BOTAO = botaoEnviar.textContent;

  // Estado interno do formulário
  const camposUsados = new Set(); // campos que o visitante já alterou
  let tentouEnviar = false;
  let enviando = false;
  let estadoAtual = 'edicao'; // edicao | erro | processando | sucesso | falha

  // ---------------------------------------------------------------
  // 2. Leitura e normalização
  // ---------------------------------------------------------------

  /*
   * Critério único de contagem: tamanho do texto depois do trim(),
   * medido com .length. É a mesma unidade que o maxlength do navegador usa,
   * então contador, regra e bloqueio nunca discordam.
   * Limitação documentada: um emoji conta como 2.
   */
  function contarCaracteres(texto) {
    return texto.trim().length;
  }

  function assuntoSeAplica() {
    return campos.motivo.value === MOTIVO_COM_ASSUNTO;
  }

  /*
   * trim() só tira espaços do início e do fim. O conteúdo interno da
   * mensagem (quebras de linha, espaços no meio) não é alterado.
   * O assunto só entra nos dados quando o motivo é "Outro".
   */
  function lerDados() {
    const dados = {
      nome: campos.nome.value.trim(),
      email: campos.email.value.trim(),
      motivo: campos.motivo.value,
      mensagem: campos.mensagem.value.trim()
    };
    if (assuntoSeAplica()) dados.assunto = campos.assunto.value.trim();
    return dados;
  }

  function camposAplicaveis() {
    const lista = ['nome', 'email', 'motivo'];
    if (assuntoSeAplica()) lista.push('assunto');
    lista.push('mensagem');
    return lista;
  }

  // ---------------------------------------------------------------
  // 3. Regras de validação
  //    Cada função recebe os dados normalizados e devolve
  //    '' (válido) ou o texto do erro.
  // ---------------------------------------------------------------

  // Letras de qualquer idioma (com acento), espaço, hífen e apóstrofo
  const CARACTERES_NOME = /^[\p{L}\p{M}' ’-]+$/u;

  function validarTamanho(texto, campo, rotulo) {
    const minimo = campo.minLength;
    const maximo = campo.maxLength;
    const tamanho = contarCaracteres(texto);
    if (tamanho < minimo) return rotulo + ' precisa ter pelo menos ' + minimo + ' caracteres (agora tem ' + tamanho + ').';
    if (tamanho > maximo) return rotulo + ' pode ter no máximo ' + maximo + ' caracteres (agora tem ' + tamanho + ').';
    return '';
  }

  const regras = {
    nome: function (dados) {
      if (!dados.nome) return 'Informe seu nome. Só espaços não contam.';
      const erroTamanho = validarTamanho(dados.nome, campos.nome, 'O nome');
      if (erroTamanho) return erroTamanho;
      if (!CARACTERES_NOME.test(dados.nome)) return 'Use apenas letras, espaços, hífen e apóstrofo no nome.';
      return '';
    },
    email: function (dados) {
      if (!dados.email) return 'Informe seu e-mail.';
      // Formato válido não prova que a conta existe; só confere a estrutura.
      if (campos.email.validity.typeMismatch) return 'O e-mail precisa estar no formato nome@dominio.com.';
      return '';
    },
    motivo: function (dados) {
      return dados.motivo ? '' : 'Escolha o motivo do contato.';
    },
    assunto: function (dados) {
      if (!dados.assunto) return 'Informe o assunto, já que o motivo é "Outro".';
      return validarTamanho(dados.assunto, campos.assunto, 'O assunto');
    },
    mensagem: function (dados) {
      if (!dados.mensagem) return 'Escreva sua mensagem.';
      return validarTamanho(dados.mensagem, campos.mensagem, 'A mensagem');
    }
  };

  function validarCampo(nomeCampo, dados) {
    return regras[nomeCampo](dados);
  }

  function listarErros(dados) {
    return camposAplicaveis()
      .map(function (nomeCampo) {
        return { campo: nomeCampo, mensagem: validarCampo(nomeCampo, dados) };
      })
      .filter(function (item) {
        return item.mensagem !== '';
      });
  }

  // ---------------------------------------------------------------
  // 4. Apresentação de erros
  // ---------------------------------------------------------------

  function mostrarErroCampo(nomeCampo, mensagem) {
    const campo = campos[nomeCampo];
    const areaErro = document.getElementById(nomeCampo + '-erro');
    campo.setAttribute('aria-invalid', 'true');
    campo.setCustomValidity(mensagem); // mantém campo.validity coerente com a regra própria
    areaErro.textContent = 'Erro: ' + mensagem; // texto, não só cor
    areaErro.hidden = false;
  }

  function limparErroCampo(nomeCampo) {
    const campo = campos[nomeCampo];
    const areaErro = document.getElementById(nomeCampo + '-erro');
    campo.removeAttribute('aria-invalid');
    campo.setCustomValidity(''); // string vazia remove o erro personalizado
    areaErro.textContent = '';
    areaErro.hidden = true;
  }

  function deveMostrarFeedback(nomeCampo) {
    return tentouEnviar || camposUsados.has(nomeCampo);
  }

  function atualizarFeedbackCampo(nomeCampo) {
    if (!camposAplicaveis().includes(nomeCampo) || !deveMostrarFeedback(nomeCampo)) return;
    const erro = validarCampo(nomeCampo, lerDados());
    if (erro) mostrarErroCampo(nomeCampo, erro);
    else limparErroCampo(nomeCampo);
  }

  function mostrarResumo(erros) {
    resumoLista.replaceChildren();
    erros.forEach(function (item) {
      const linha = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + item.campo;
      link.dataset.campo = item.campo;
      link.textContent = item.mensagem;
      linha.append(link);
      resumoLista.append(linha);
    });
    resumo.hidden = false;
  }

  function esconderResumo() {
    resumo.hidden = true;
    resumoLista.replaceChildren();
  }

  // Depois de uma tentativa de envio, o resumo acompanha as correções
  function atualizarResumo() {
    if (resumo.hidden) return;
    const erros = listarErros(lerDados());
    if (erros.length) {
      mostrarResumo(erros);
    } else {
      esconderResumo();
      definirEstado('edicao', '');
    }
  }

  function atualizarContador() {
    const tamanho = contarCaracteres(campos.mensagem.value);
    const minimo = campos.mensagem.minLength;
    const maximo = campos.mensagem.maxLength;
    let texto = tamanho + ' de ' + maximo + ' caracteres';
    const faltam = minimo - tamanho;
    if (faltam > 0) texto += ' (' + (faltam === 1 ? 'falta 1' : 'faltam ' + faltam) + ' para o mínimo de ' + minimo + ')';
    contador.textContent = texto;
  }

  // ---------------------------------------------------------------
  // 5. Regra condicional do assunto
  // ---------------------------------------------------------------

  /*
   * Fora do motivo "Outro", o assunto fica hidden e disabled.
   * disabled tira o campo do FormData e da validação nativa;
   * lerDados() e camposAplicaveis() tiram o campo das regras próprias.
   * O erro antigo é apagado para não travar o envio.
   */
  function atualizarCampoAssunto() {
    const seAplica = assuntoSeAplica();
    blocoAssunto.hidden = !seAplica;
    campos.assunto.disabled = !seAplica;
    campos.assunto.required = seAplica;
    if (!seAplica) {
      limparErroCampo('assunto');
      camposUsados.delete('assunto');
    }
    atualizarResumo();
  }

  // ---------------------------------------------------------------
  // 6. Estados e envio simulado
  // ---------------------------------------------------------------

  const PREFIXOS_STATUS = {
    edicao: '',
    erro: 'Atenção: ',
    processando: 'Aguarde: ',
    sucesso: 'Sucesso: ',
    falha: 'Falha: '
  };

  function definirEstado(estado, mensagem) {
    estadoAtual = estado;
    form.dataset.estado = estado; // o CSS usa isso para cor e ícone
    status.textContent = mensagem ? PREFIXOS_STATUS[estado] + mensagem : '';
  }

  function resultadoEscolhido() {
    return form.querySelector('input[name="resultado-simulado"]:checked').value;
  }

  /*
   * Envio de demonstração: nenhum e-mail sai daqui.
   * Resolve ou rejeita conforme o controle de teste, sem sorteio.
   */
  function enviarDemonstracao(dados, resultado) {
    return new Promise(function (resolver, rejeitar) {
      setTimeout(function () {
        if (resultado === 'sucesso') resolver({ recebidoEm: new Date().toISOString(), dados: dados });
        else rejeitar(new Error('Falha simulada pelo modo de teste.'));
      }, 1500);
    });
  }

  function bloquearEnvio(bloquear) {
    enviando = bloquear;
    // aria-disabled em vez de disabled: o botão continua focável,
    // e a trava real é a variável "enviando".
    botaoEnviar.setAttribute('aria-disabled', String(bloquear));
    botaoEnviar.textContent = bloquear ? 'Enviando...' : TEXTO_BOTAO;
    form.setAttribute('aria-busy', String(bloquear));
  }

  function mostrarDadosProcessados(dados) {
    saidaDados.textContent = JSON.stringify(dados, null, 2);
  }

  function reiniciarFormulario() {
    form.reset();
    tentouEnviar = false;
    camposUsados.clear();
    camposAplicaveis().concat('assunto').forEach(limparErroCampo);
    atualizarCampoAssunto();
    atualizarContador();
  }

  async function processarEnvio(dados) {
    bloquearEnvio(true);
    definirEstado('processando', 'enviando sua mensagem (simulação)...');
    try {
      await enviarDemonstracao(dados, resultadoEscolhido());
      mostrarDadosProcessados(dados);
      reiniciarFormulario(); // limpa só depois da confirmação de sucesso
      definirEstado('sucesso', 'mensagem registrada. Isto é uma simulação: nenhum e-mail foi enviado. Para falar comigo de verdade, use o e-mail ou o LinkedIn.');
    } catch (erro) {
      // Na falha os dados continuam no formulário
      definirEstado('falha', 'não foi possível enviar (falha simulada). Seus dados foram mantidos. Tente novamente.');
    } finally {
      bloquearEnvio(false);
    }
  }

  function tratarTentativaEnvio(evento) {
    evento.preventDefault();
    if (enviando) return; // trava contra cliques rápidos e Enter repetido

    tentouEnviar = true;
    const dados = lerDados();
    const erros = listarErros(dados);

    camposAplicaveis().forEach(atualizarFeedbackCampo);

    if (erros.length) {
      mostrarResumo(erros);
      const quantidade = erros.length === 1 ? '1 campo precisa' : erros.length + ' campos precisam';
      definirEstado('erro', quantidade + ' de correção.');
      // Rola até o resumo (para ele não ficar atrás do cabeçalho fixo)
      // e coloca o foco no primeiro campo inválido sem rolar de novo.
      resumo.scrollIntoView({ block: 'start' });
      campos[erros[0].campo].focus({ preventScroll: true });
      return;
    }

    esconderResumo();
    processarEnvio(dados);
  }

  // ---------------------------------------------------------------
  // 7. Eventos (um listener por tipo, no form, por delegação)
  // ---------------------------------------------------------------

  form.addEventListener('submit', tratarTentativaEnvio);

  form.addEventListener('input', function (evento) {
    const nomeCampo = evento.target.name;
    if (!(nomeCampo in campos)) return;

    // Retomar a edição apaga o status antigo de sucesso ou falha
    if (estadoAtual === 'sucesso' || estadoAtual === 'falha') definirEstado('edicao', '');

    if (nomeCampo === 'mensagem') atualizarContador();
    atualizarFeedbackCampo(nomeCampo);
    atualizarResumo();
  });

  // "change" dispara ao sair de um campo alterado ou ao escolher no select:
  // é o momento em que o campo passa a ser considerado "usado".
  form.addEventListener('change', function (evento) {
    const nomeCampo = evento.target.name;
    if (!(nomeCampo in campos)) return;

    camposUsados.add(nomeCampo);
    if (nomeCampo === 'motivo') atualizarCampoAssunto();
    atualizarFeedbackCampo(nomeCampo);
    atualizarResumo();
  });

  // Links do resumo levam o foco direto ao campo
  resumoLista.addEventListener('click', function (evento) {
    const link = evento.target.closest('a');
    if (!link) return;
    evento.preventDefault();
    campos[link.dataset.campo].focus();
  });

  atualizarCampoAssunto();
  atualizarContador();
})();
