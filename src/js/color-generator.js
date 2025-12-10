/**
 * Gerador de Cores Divertido
 * Funções para gerar e manipular cores
 */

// Namespace para o gerador de cores
const ColorGenerator = (function() {
  
  // Histórico de cores geradas
  let colorHistory = [];
  const MAX_HISTORY = 10;
  
  // Gerar cor hexadecimal aleatória
  function generateRandomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
  
  // Gerar cor RGB aleatória
  function generateRandomRgb() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Gerar cor HSL aleatória
  function generateRandomHsl() {
    const h = Math.floor(Math.random() * 361);
    const s = Math.floor(Math.random() * 101);
    const l = Math.floor(Math.random() * 101);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  // Converter hexadecimal para RGB
  function hexToRgb(hex) {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    return { r, g, b };
  }
  
  // Converter RGB para hexadecimal
  function rgbToHex(r, g, b) {
    return '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
  }
  
  // Calcular luminosidade (para determinar cor do texto)
  function calculateLuminance(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  
  // Adicionar cor ao histórico
  function addToHistory(color) {
    colorHistory.unshift(color);
    if (colorHistory.length > MAX_HISTORY) {
      colorHistory.pop();
    }
  }
  
  // Obter histórico de cores
  function getHistory() {
    return [...colorHistory];
  }
  
  // Limpar histórico
  function clearHistory() {
    colorHistory = [];
  }
  
  // Gerar cor com base em um tipo específico
  function generateColor(type = 'hex') {
    let color;
    
    switch(type) {
      case 'hex':
        color = generateRandomHex();
        break;
      case 'rgb':
        color = generateRandomRgb();
        break;
      case 'hsl':
        color = generateRandomHsl();
        break;
      default:
        color = generateRandomHex();
    }
    
    addToHistory(color);
    return color;
  }
  
  // Gerar paleta de cores complementares
  function generateComplementaryPalette(baseColor) {
    if (!baseColor.startsWith('#')) {
      baseColor = generateRandomHex();
    }
    
    const rgb = hexToRgb(baseColor);
    
    // Cor complementar (oposta no círculo cromático)
    const compR = 255 - rgb.r;
    const compG = 255 - rgb.g;
    const compB = 255 - rgb.b;
    
    // Cores análogas (+30 e -30 graus no círculo cromático)
    // Implementação simplificada
    const analog1R = Math.min(255, Math.max(0, rgb.r + 30));
    const analog1G = Math.min(255, Math.max(0, rgb.g - 15));
    const analog1B = Math.min(255, Math.max(0, rgb.b + 15));
    
    const analog2R = Math.min(255, Math.max(0, rgb.r - 30));
    const analog2G = Math.min(255, Math.max(0, rgb.g + 15));
    const analog2B = Math.min(255, Math.max(0, rgb.b - 15));
    
    return {
      base: baseColor,
      complementary: rgbToHex(compR, compG, compB),
      analogous1: rgbToHex(analog1R, analog1G, analog1B),
      analogous2: rgbToHex(analog2R, analog2G, analog2B),
      triad1: rgbToHex(rgb.g, rgb.b, rgb.r),
      triad2: rgbToHex(rgb.b, rgb.r, rgb.g)
    };
  }
  
  // Interface pública
  return {
    generateHex: generateRandomHex,
    generateRgb: generateRandomRgb,
    generateHsl: generateRandomHsl,
    generateColor,
    hexToRgb,
    rgbToHex,
    calculateLuminance,
    addToHistory,
    getHistory,
    clearHistory,
    generateComplementaryPalette
  };
  
})();