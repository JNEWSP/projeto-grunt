/**
 * Aplicação Principal - Gerador de Cores Divertido
 */

// Esperar o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos do DOM
  const colorDisplay = document.getElementById('color-display');
  const hexValue = document.getElementById('hex-value');
  const rgbValue = document.getElementById('rgb-value');
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const saveBtn = document.getElementById('save-btn');
  const historyContainer = document.getElementById('history-container');
  
  // Cor atual
  let currentColor = '#3498db';
  
  // Inicializar
  init();
  
  function init() {
    // Definir cor inicial
    updateColor(currentColor);
    
    // Configurar eventos
    generateBtn.addEventListener('click', generateNewColor);
    copyBtn.addEventListener('click', copyColorToClipboard);
    saveBtn.addEventListener('click', saveColorToHistory);
    
    // Gerar algumas cores iniciais para o histórico
    for (let i = 0; i < 5; i++) {
      const color = ColorGenerator.generateColor();
      ColorGenerator.addToHistory(color);
    }
    updateHistoryDisplay();
  }
  
  // Gerar nova cor
  function generateNewColor() {
    // Decidir aleatoriamente qual tipo de cor gerar (70% HEX, 20% RGB, 10% HSL)
    const random = Math.random();
    let type;
    
    if (random < 0.7) {
      type = 'hex';
    } else if (random < 0.9) {
      type = 'rgb';
    } else {
      type = 'hsl';
    }
    
    currentColor = ColorGenerator.generateColor(type);
    updateColor(currentColor);
    
    // Efeito visual divertido no botão
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      generateBtn.style.transform = 'scale(1)';
    }, 100);
  }
  
  // Atualizar exibição da cor
  function updateColor(color) {
    // Definir cor de fundo
    colorDisplay.style.backgroundColor = color;
    
    // Atualizar valores de texto
    hexValue.textContent = color;
    
    // Converter para RGB se necessário
    if (color.startsWith('#')) {
      const rgb = ColorGenerator.hexToRgb(color);
      rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      
      // Calcular luminosidade para definir cor do texto
      const luminance = ColorGenerator.calculateLuminance(rgb.r, rgb.g, rgb.b);
      colorDisplay.style.color = luminance > 0.5 ? '#000' : '#FFF';
      hexValue.style.color = luminance > 0.5 ? '#000' : '#FFF';
      rgbValue.style.color = luminance > 0.5 ? '#000' : '#FFF';
    } else if (color.startsWith('rgb')) {
      rgbValue.textContent = color;
      
      // Extrair valores RGB da string
      const matches = color.match(/\d+/g);
      if (matches && matches.length >= 3) {
        const r = parseInt(matches[0]);
        const g = parseInt(matches[1]);
        const b = parseInt(matches[2]);
        const luminance = ColorGenerator.calculateLuminance(r, g, b);
        colorDisplay.style.color = luminance > 0.5 ? '#000' : '#FFF';
      }
    } else if (color.startsWith('hsl')) {
      rgbValue.textContent = color;
      colorDisplay.style.color = '#000'; // Simplificado para HSL
    }
    
    // Adicionar sombra com a cor complementar
    const palette = ColorGenerator.generateComplementaryPalette(
      color.startsWith('#') ? color : ColorGenerator.generateHex()
    );
    colorDisplay.style.boxShadow = `0 10px 20px ${palette.complementary}80`;
  }
  
  // Copiar cor para área de transferência
  function copyColorToClipboard() {
    navigator.clipboard.writeText(currentColor)
      .then(() => {
        // Feedback visual
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.style.backgroundColor = '#2ecc71';
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = '';
        }, 1500);
      })
      .catch(err => {
        console.error('Erro ao copiar: ', err);
        alert('Não foi possível copiar a cor. Tente manualmente: ' + currentColor);
      });
  }
  
  // Salvar cor no histórico
  function saveColorToHistory() {
    ColorGenerator.addToHistory(currentColor);
    updateHistoryDisplay();
    
    // Feedback visual
    saveBtn.style.backgroundColor = '#f39c12';
    setTimeout(() => {
      saveBtn.style.backgroundColor = '';
    }, 300);
  }
  
  // Atualizar exibição do histórico
  function updateHistoryDisplay() {
    const history = ColorGenerator.getHistory();
    historyContainer.innerHTML = '';
    
    history.forEach((color, index) => {
      const colorElement = document.createElement('div');
      colorElement.className = 'history-color';
      colorElement.style.backgroundColor = color;
      colorElement.title = color;
      
      // Adicionar evento de clique para restaurar a cor
      colorElement.addEventListener('click', () => {
        currentColor = color;
        updateColor(color);
        
        // Efeito visual
        colorElement.style.transform = 'scale(1.3)';
        setTimeout(() => {
          colorElement.style.transform = 'scale(1)';
        }, 200);
      });
      
      historyContainer.appendChild(colorElement);
    });
  }
  
  // Gerar cor ao pressionar barra de espaço
  document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      generateNewColor();
    }
  });
  
  // Função divertida adicional: clique na área de cor para gerar tons relacionados
  colorDisplay.addEventListener('click', function() {
    const palette = ColorGenerator.generateComplementaryPalette(
      currentColor.startsWith('#') ? currentColor : ColorGenerator.generateHex()
    );
    
    // Criar uma animação mostrando a paleta
    const colors = Object.values(palette);
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < colors.length) {
        colorDisplay.style.backgroundColor = colors[i];
        i++;
      } else {
        clearInterval(interval);
        // Voltar à cor original após um tempo
        setTimeout(() => {
          colorDisplay.style.backgroundColor = currentColor;
        }, 500);
      }
    }, 200);
  });
  
  // Adicionar data de build dinamicamente
  const buildDate = document.getElementById('build-date');
  if (buildDate) {
    buildDate.textContent = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
});