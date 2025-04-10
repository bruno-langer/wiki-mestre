import React from 'react';
import { X, Share2, Trophy, RotateCcw } from 'lucide-react';

export function GameCompletionDialog({ 
  isOpen, 
  onClose, 
  onRestart,
  stats: { clicks, time, path }
}) {
  if (!isOpen) return null;

  const shareResult = () => {
    const shareText = `🎮 Wiki Race: Cheguei de "${path[0]}" até "${path[path.length-1]}" em ${clicks} cliques e ${time} segundos!\n\nCaminho: ${path.join(' → ')}`;
    
    if (false) {
      navigator.share({
        title: 'Meu resultado no Wiki Race',
        text: shareText,
      }).catch(err => {
        // Fallback para copiar para clipboard
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Resultado copiado para a área de transferência!'))
      .catch(err => console.error('Erro ao copiar:', err));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Trophy className="text-yellow-500 mr-2" />
            Parabéns!
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-lg mb-4">
            Você completou o desafio com sucesso!
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Cliques:</span>
              <span className="font-bold">{clicks}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Tempo:</span>
              <span className="font-bold">{time} segundos</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium mb-2">Seu caminho:</p>
            <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
              {path.map((page, index) => (
                <React.Fragment key={index}>
                  <span className="font-medium">{page}</span>
                  {index < path.length - 1 && (
                    <span className="mx-2 text-gray-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={shareResult}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center"
          >
            <Share2 size={18} className="mr-2" />
            Compartilhar
          </button>
          <button
            onClick={onRestart}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium flex items-center justify-center"
          >
            <RotateCcw size={18} className="mr-2" />
            Jogar Novamente
          </button>
        </div>
      </div>
    </div>
  );
}