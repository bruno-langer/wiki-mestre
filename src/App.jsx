import React, { useMemo, useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { Input } from "./componentes/ui/Input";
import { Button } from "./componentes/ui/Button";
import { wikiDailyPairs } from "./assets/list.js";
import { GameCompletionDialog } from "./componentes/GameCompletionDialog.jsx";
import { Trophy, Clock, History, Target, RefreshCw, Home } from "lucide-react";
import logo from "./assets/icon.svg";

export default function WikiGame() {
  const [startPage, setStartPage] = useState("");
  const [targetPage, setTargetPage] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [articleHtml, setArticleHtml] = useState("");
  const [clicks, setClicks] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const [rankings, setRankings] = useState(() => {
    const stored = localStorage.getItem("wiki-rankings");
    return stored ? JSON.parse(stored) : [];
  });
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const articleRef = useRef(null);

  startTimeRef.current = startTime;

  useEffect(() => {
    if (currentPage) fetchArticle(currentPage);
  }, [currentPage]);
  
  const fetchArticle = async (title) => {
    try {
      const response = await fetch(
        `https://pt.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
          title
        )}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
      }
      const html = await response.text();
      setArticleHtml(
        DOMPurify.sanitize(html, {
          ADD_ATTR: ["target", "class", "style", "id", "rel", "src", "href"],
          ADD_TAGS: ["style", "link"],
          // ALLOW_DATA_ATTR: true,
        })
      );
      articleRef.current.scrollTo(0, 0);
    } catch (error) {
      console.error("Error fetching article:", error);
      setArticleHtml(
        `<div class="error">Failed to load article. Please try again.</div>`
      );
    }
  };

  // Função para iniciar o jogo
  const startGame = () => {

    setCurrentPage(startPage);
    setHistory([startPage]);
    setClicks(0);
    setElapsedTime(0);
    setStartTime(Date.now());
    setGameStarted(true);

    // Limpe qualquer timer existente
    if (timerRef.current) clearTimeout(timerRef.current);

    // Inicie o timer
    updateTimer();
  };

  // Função para atualizar o timer
  const updateTimer = () => {
    // if (!startTime) return;

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setElapsedTime(elapsed);

    if (timerRef.current) clearTimeout(timerRef.current);

    // Agende a próxima atualização
    timerRef.current = setTimeout(updateTimer, 1000);
  };

  const loadGame = () => {
    const today = new Date().toISOString().split("T")[0];
    const pair = wikiDailyPairs[today];
    if (pair) {
      setStartPage(pair[0]);
      setTargetPage(pair[1]);
    }
  };

  useEffect(() => {
    // load game
    loadGame();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleArticleClick = (e) => {
    e.preventDefault();
    const link = e.target.closest("a");

    if (!link) return;

    const href = link.getAttribute("href");

    if (!href) return;

    console.log(JSON.stringify(href));

    // Para links no formato "./República"

    if (href.includes(".png") || href.includes(".jpg")) {
      console.log("Imagem clicada");
      alert(
        "Esse link não é válido, você clicou em uma imagem mas seu progresso ainda continua!"
      );
      return;
    }

    if (href.startsWith("./")) {
      e.preventDefault();

      // Extrai o título do artigo (tudo após "./")
      const articleTitle = href.substring(2);
      const articleTitleReadable = articleTitle.replace(/_/g, " ");


      console.log("Navegando para artigo:", articleTitleReadable);
      setCurrentPage(articleTitleReadable);
      setHistory((prev) => [...prev, articleTitleReadable]);
      setClicks((prev) => prev + 1);
      return;
    }

    // Ignora outros tipos de links
    e.preventDefault();
    console.log("Link não processado:", href);
  };

  useEffect(() => {
    if (currentPage === targetPage && gameStarted) {
      if (timerRef.current) clearTimeout(timerRef.current);

      setShowCompletionDialog(true);

      const newRecord = { path: [...history], clicks, time: elapsedTime };
      const updatedRankings = [newRecord, ...rankings].slice(0, 10);
      setRankings(updatedRankings);
      localStorage.setItem("wiki-rankings", JSON.stringify(updatedRankings));
      setGameStarted(false);
    }
  }, [currentPage, targetPage, clicks, gameStarted]);

  const Article = useMemo(
    () => (
      <div
        ref={articleRef}
        className="prose max-w-full p-4 overflow-y-auto h-[calc(100vh-250px)] bg-white"
        onClick={handleArticleClick}
        dangerouslySetInnerHTML={{
          __html: articleHtml,
        }}
      />
    ),
    [articleHtml]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {!gameStarted ? (
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center space-x-4 mx-auto">
              <img src={logo} alt="" />
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-2 font-[Rubik]">
                  Wiki Mestre!
                </h1>
                <p className="text-gray-600">
                  Encontre o artigo final com menos cliques e se torne o Wiki
                  Mestre! <br />
                  Cada dia um desafio diferente para você!
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="startPage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Página inicial
                </label>
                <Input
                  id="startPage"
                  placeholder="Ex: Albert Einstein"
                  value={startPage}
                  className="text-black w-full"
                  onChange={(e) => setStartPage(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="targetPage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Página alvo
                </label>
                <Input
                  id="targetPage"
                  placeholder="Ex: Football"
                  value={targetPage}
                  className="text-black w-full"
                  onChange={(e) => setTargetPage(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full bg-purple-800 hover:bg-indigo-700 transition-colors py-3 text-lg font-[Rubik] font-bold"
              onClick={startGame}
              disabled={!startPage || !targetPage}
            >
              Começar Desafio
            </Button>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-indigo-800">
                <Trophy className="mr-2" size={20} />
                Suas últimas partidas
              </h2>
              {rankings.length > 0 ? (
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          De → Para
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Cliques
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Tempo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rankings.map((r, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 truncate max-w-xs">
                            {r.path[0]} → {r.path[r.path.length - 1]}
                          </td>
                          <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">
                            {r.clicks}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">
                            {r.time}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  Ainda não há registros. Complete um desafio para salvar seu
                  resultado.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-indigo-700 text-white p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center">
                  <Button
                    onClick={() => setGameStarted(false)}
                    className="p-2 bg-indigo-600 hover:bg-indigo-800 mr-3"
                    aria-label="Voltar"
                  >
                    <Home size={18} />
                  </Button>
                  <h2 className="text-lg font-bold truncate">{currentPage}</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-indigo-800 rounded-lg px-3 py-1 flex items-center">
                    <Target size={16} className="mr-1" />
                    <span className="text-sm">{targetPage}</span>
                  </div>
                  <div className="bg-indigo-800 rounded-lg px-3 py-1 flex items-center">
                    <RefreshCw size={16} className="mr-1" />
                    <span className="text-sm">{clicks} cliques</span>
                  </div>
                  <div className="bg-indigo-800 rounded-lg px-3 py-1 flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{elapsedTime}s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-100 p-2 overflow-x-auto">
              <div className="whitespace-nowrap flex items-center">
                <History
                  size={16}
                  className="text-indigo-600 mx-2 flex-shrink-0"
                />
                {history.map((page, index) => (
                  <React.Fragment key={index}>
                    <span className="bg-white px-2 py-1 rounded text-sm">
                      {page}
                    </span>
                    {index < history.length - 1 && (
                      <span className="mx-1 text-indigo-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {Article}
          </div>
        )}

        <GameCompletionDialog
          isOpen={showCompletionDialog}
          onClose={() => setShowCompletionDialog(false)}
          onRestart={() => {
            setShowCompletionDialog(false);
            // Resetar estados para que o usuário possa configurar um novo jogo
            setStartPage("");
            setTargetPage("");
            loadGame();
          }}
          stats={{
            clicks,
            time: elapsedTime,
            path: history,
          }}
        />
      </div>
    </div>
  );
}
