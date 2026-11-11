# Portfólio · Darlan Hora

Portfólio da disciplina de Programação Front-End (UCSAL, 2026.2). Apresenta trajetória, habilidades, projetos com filtro por tecnologia e um formulário de contato com validação e envio simulado.

Publicado em: https://darlanhora.github.io/portfolio/

## Como executar

Não precisa instalar nada. Baixe o repositório e abra `index.html` no navegador.
Os scripts usam `<script defer>` comum (sem módulos), então a página funciona também aberta direto do disco.

## Estrutura

```
index.html               estrutura e conteúdo
css/styles.css           estilos (mobile first)
js/dados-projetos.js     fonte única dos projetos e das opções do filtro
js/menu.js               menu móvel com aria-expanded
js/filtro-projetos.js    criação dos cards e filtro
js/formulario.js         leitura, validação, erros, regra condicional e envio simulado
assets/                  currículo e imagens
docs/diagnostico.md      Etapa 1: cinco problemas, prioridades e evidências
```

## Como o contato funciona

O formulário **não envia e-mail**. Ele valida os dados no navegador e chama uma função assíncrona de demonstração (`enviarDemonstracao`) que resolve ou rejeita depois de 1,5 s, conforme o "Modo de teste" escolhido na tela. Os dados que seriam enviados aparecem em "Ver dados processados".
Os canais reais são o e-mail darlanhora37@gmail.com e o LinkedIn. Em uma aplicação real a validação também teria de ser feita no servidor.
