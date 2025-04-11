# Wiki Mestre

<div style="display: flex; align-items: center; gap: 20px;">
  <img src="public/wiki-mestre.svg" alt="Logo do Wiki Mestre" width="80" />
  <p>
    <strong>Wiki Mestre</strong> é um jogo divertido e desafiador no qual o objetivo é ir de uma página da Wikipédia até outra em até <strong>7 cliques</strong>, usando apenas os links internos dos artigos. Teste seus conhecimentos e habilidades de navegação e descubra quantas conexões você consegue fazer entre temas aparentemente distantes!
  </p>
</div>


## 📦 Funcionalidades

- 🔍 Defina a página de origem e o destino.
- ⏱️ Cronômetro para medir o tempo da jogada.
- 🖱️ Contador de cliques.
- 🏆 Ranking local com as melhores jogadas.
- 🔗 Compartilhamento com link do desafio.
- 📅 Desafios diários sugeridos automaticamente.
- 🎨 Interface com **TailwindCSS** e design responsivo.

## 🚀 Começando

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn

### Instalação

```bash
git clone https://github.com/bruno-langer/wiki-mestre.git
cd wiki-mestre
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) para jogar localmente.

## 📁 Estrutura

```
src/
├── components/
│   └── ui/ (componentes reutilizáveis como botão e input)
├── App.jsx
├── index.css
└── main.jsx
```

## 🧠 Como jogar

1. Escolha uma **página de início** e uma **página de destino**.
2. Clique em "Começar".
3. Use apenas os **links internos** da Wikipédia para navegar.
4. Tente chegar ao destino com o **mínimo de cliques possível** (máximo 7).
5. Compartilhe seu caminho e desafie amigos!

## 📲 Compartilhamento

Após completar um desafio, um link personalizado é gerado para que outros possam jogar a mesma rodada que você completou:

```
🎮 Wiki Mestre: Cheguei de "Brasil" até "Pelé" em 5 cliques e 60 segundos!

Jogue agora esse mesmo desafio: https://wiki-mestre.vercel.app
```

## 🛠 Tecnologias utilizadas

- React
- TailwindCSS
- DOMPurify
- Vite
- Wikipedia REST API

## 📅 Desafio do Dia

O jogo sugere automaticamente desafios diários com base em uma lista predefinida de pares interessantes de páginas.

## 🧙 Nome

O nome **Wiki Mestre** remete à figura de um sábio ou mestre das conexões do conhecimento – como um sensei da Wikipédia 🧠✨

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Feito com ❤️ por [Bruno Langer](https://www.linkedin.com/in/brunolanger)
