# Etapa 1 · Diagnóstico orientado a impacto

Versão auditada: primeira versão do portfólio (pasta `versao-inicial/`, primeiro commit do repositório).
Ambiente: Google Chrome, DevTools com emulação de 360 px, 768 px e 1280 px.

A ordem de trabalho segue o impacto no visitante: primeiro o que impede alguém de chegar ao conteúdo ou falar comigo, depois o que exclui quem usa teclado, por último o que só afeta a manutenção.

| # | Tipo | Prioridade | Resumo |
|---|------|-----------|--------|
| P1 | Funcional | Alta | Link "Projetos" do menu e botões de currículo e projetos não levam a lugar nenhum |
| P2 | Responsividade | Alta | Em 360 px a página fica com 1040 px de largura e rola para o lado |
| P3 | Acessibilidade | Alta | Menu móvel não funciona por teclado e o foco é invisível em toda a página |
| P4 | Formulário (funcional) | Alta | Formulário aceita tudo vazio e diz "Mensagem enviada!" sem enviar nada |
| P5 | Organização do código | Média | Cards repetidos no HTML, dois listeners de submit e estilos inline pelo JS |

---

## P1 · Ações vazias e âncora quebrada (Funcional, alta)

- **Local:** `index.html`, menu (`href="#projeto"`), botão "Baixar currículo" (`href="#"`), links "Ver site" e "Ver código" dos cards (`href="#"`).
- **Passos para reproduzir:** abrir a página, clicar em "Projetos" no menu; voltar ao topo e clicar em "Baixar currículo"; clicar em "Ver site" em qualquer card.
- **Comportamento atual:** "Projetos" não rola, porque a seção tem `id="projetos"` e o link aponta para `#projeto`. Os outros links só pulam para o topo.
- **Comportamento esperado:** o menu leva à seção certa, o currículo baixa o PDF e cada link de projeto abre o código ou o site. Onde ainda não existe link, o card diz isso em vez de mostrar um botão falso.
- **Por que alta:** o visitante (recrutador) tenta ver projetos e currículo, que são o motivo de ele estar ali, e não consegue.
- **Proposta:** corrigir o `href` do menu, apontar o currículo para `assets/curriculo-darlan-hora.pdf` com `download`, e gerar os links dos cards a partir dos dados, só quando o link existir.

## P2 · Rolagem horizontal em tela estreita (Responsividade, alta)

- **Local:** `style.css`, `.cards { grid-template-columns: repeat(3, 320px) }` e `input, textarea { width: 400px }`.
- **Passos para reproduzir:** DevTools, modo dispositivo, largura 360 px. Rolar até Projetos e Contato. No console: `document.documentElement.scrollWidth`.
- **Comportamento atual:** `scrollWidth` = 1040 px numa tela de 360 px. Os cards e os campos saem da tela; o visitante precisa arrastar para o lado.
- **Comportamento esperado:** `scrollWidth` igual à largura da tela em 360, 768 e 1280 px e com zoom de 200%.
- **Por que alta:** a maioria das visitas vem do celular, e o conteúdo principal (projetos e contato) fica cortado.
- **Proposta:** grade com `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`, campos com `width: 100%`, e imagens com `aspect-ratio` em vez de altura fixa.

## P3 · Menu móvel e foco inacessíveis por teclado (Acessibilidade, alta)

- **Local:** `index.html` (`<div class="menu-icone" onclick="abrirMenu()">`) e `style.css` (`* { outline: none; }`).
- **Passos para reproduzir:** largura 360 px, clicar na barra de endereço e apertar Tab várias vezes.
- **Comportamento atual:** o ícone do menu nunca recebe foco (é uma `div`), então quem usa teclado não abre o menu. Em toda a página não dá para ver onde o foco está. Leitores de tela não sabem se o menu está aberto.
- **Comportamento esperado:** botão real, alcançável por Tab, com `aria-expanded` refletindo o estado, Esc para fechar e foco sempre visível.
- **Por que alta:** exclui completamente quem navega sem mouse.
- **Proposta:** trocar a `div` por `<button aria-expanded aria-controls>`, deixar o CSS ler o `aria-expanded`, remover o `outline: none` e criar um estilo `:focus-visible`.

## P4 · Formulário sem validação e com sucesso falso (Funcional/formulário, alta)

- **Local:** `index.html` (campos sem `label`, `name`, `type`) e `script.js` (listener de submit).
- **Passos para reproduzir:** ir até Contato, deixar tudo vazio e clicar em Enviar.
- **Comportamento atual:** aparece um `alert("Mensagem enviada!")` e o formulário é limpo, mas nada foi enviado nem validado. Os campos só têm placeholder, que some ao digitar.
- **Comportamento esperado:** erros específicos junto a cada campo, foco no primeiro campo inválido, estado de processamento, sucesso só após a operação concluir, falha que preserva os dados, e aviso claro de que é uma demonstração.
- **Por que alta:** o visitante acredita que entrou em contato e nunca recebe resposta.
- **Proposta:** reconstruir o formulário com as regras da Etapa 6 (detalhes em `js/formulario.js`).

## P5 · Código duplicado e responsabilidades misturadas (Organização, média)

- **Local:** `index.html` (três cards escritos à mão, `onclick` no HTML) e `script.js`.
- **Passos para reproduzir:** abrir `script.js`: há dois `addEventListener('submit', ...)` no mesmo formulário. No HTML, cada card repete a mesma estrutura. O filtro muda `style.display` direto.
- **Comportamento atual:** para adicionar um projeto é preciso copiar marcação e lembrar da classe certa para o filtro. Dois listeners rodam a cada envio. O filtro não informa quantidade nem estado ativo.
- **Comportamento esperado:** uma fonte única de dados dos projetos, cards gerados a partir dela, um listener por evento e funções com nomes que dizem o que fazem.
- **Por que média:** o visitante quase não percebe, mas cada mudança futura fica mais cara e mais sujeita a erro.
- **Proposta:** criar `js/dados-projetos.js`, gerar os cards em `js/filtro-projetos.js` com `textContent`, usar delegação de eventos e separar o formulário em leitura, validação, apresentação de erros e processamento.

---

## Evidências de antes e depois

Tire os prints nas mesmas condições (mesma largura, mesmo passo) e salve em `docs/evidencias/`.

| Problema | Antes | Depois |
|----------|-------|--------|
| P2 | `antes-p2-360px.png` (scrollWidth 1040) | `depois-p2-360px.png` (scrollWidth 360) |
| P3 | `antes-p3-tab.png` (foco invisível) | `depois-p3-tab.png` (anel de foco no menu) |
| P4 | `antes-p4-alert.png` (alert com tudo vazio) | `depois-p4-erros.png` (resumo de erros e foco no nome) |
