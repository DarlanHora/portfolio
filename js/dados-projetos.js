/*
 * Fonte única dos projetos.
 * Para adicionar um projeto, acrescente um objeto aqui. O HTML dos cards
 * é gerado em filtro-projetos.js, então não existe card duplicado no index.html.
 *
 * links: só entram os que existem de verdade. Um link vazio não gera botão.
 */
const PROJETOS = [
  {
    id: 'portfolio',
    titulo: 'Portfólio pessoal',
    origem: 'Projeto de aula · Programação Front-End, UCSAL',
    problema: 'Eu não tinha um lugar único para mostrar o que sei fazer e como entrar em contato comigo.',
    publico: 'Recrutadores de estágio e professores.',
    contribuicao: 'Desenvolvimento individual completo: estrutura, layout responsivo, filtro de projetos, formulário com validação e testes documentados.',
    tecnologias: ['HTML', 'CSS', 'JavaScript'],
    imagem: 'assets/img/projeto-portfolio.svg',
    textoAlternativo: 'Ilustração do portfólio: página com cabeçalho azul, cards de projetos e formulário de contato.',
    links: {
      codigo: 'https://github.com/DarlanHora/portfolio',
      site: 'https://darlanhora.github.io/portfolio/'
    }
  },
  {
    id: 'site-darlan-hora',
    titulo: 'Site da marca Darlan Hora',
    origem: 'Projeto pessoal · em desenvolvimento',
    problema: 'Autônomos e pequenos negócios precisam de um site simples, mas não sabem por onde começar nem quanto custa.',
    publico: 'Autônomos e pequenos negócios que querem uma landing page ou um site institucional.',
    contribuicao: 'Defini a identidade visual, a lista de serviços e estou construindo o protótipo do front-end.',
    tecnologias: ['HTML', 'CSS', 'JavaScript'],
    imagem: 'assets/img/projeto-darlan-hora.svg',
    textoAlternativo: 'Ilustração do site Darlan Hora: página inicial com chamada para orçamento e lista de serviços.',
    links: {
      codigo: '', // TODO: preencher quando o repositório for publicado
      site: ''
    }
  },
  {
    id: 'poo-java',
    // TODO (Darlan): troque pelo seu projeto real de POO. Mantenha a estrutura.
    titulo: 'Projeto de POO em Java',
    origem: 'Projeto de aula · Programação Orientada a Objetos, UCSAL',
    problema: 'PREENCHER: qual problema o programa resolve.',
    publico: 'PREENCHER: quem usaria o programa.',
    contribuicao: 'PREENCHER: o que você fez (classes, regras, telas, testes).',
    tecnologias: ['Java'],
    imagem: 'assets/img/projeto-java.svg',
    textoAlternativo: 'Ilustração de um diagrama de classes em Java.',
    links: {
      codigo: '', // TODO: link do repositório no GitHub
      site: ''
    }
  }
];

/*
 * Opções do filtro. Ficam separadas dos dados de propósito:
 * Python aparece porque estou estudando, mesmo sem projeto ainda,
 * e isso gera o estado vazio de forma real.
 */
const FILTROS = ['Todos', 'HTML', 'CSS', 'JavaScript', 'Java', 'Python'];
