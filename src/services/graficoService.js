const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Doacao = require('../models/Doacao');
const Item = require('../models/Item');

class GraficoService {
  constructor() {
    this.chartWidth = 1000;
    this.chartHeight = 600;
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({ 
      width: this.chartWidth, 
      height: this.chartHeight 
    });
  }

  // Função para obter a evolução do valor de todos os itens
  async obterEvolucaoValorItens(limiteDoacoes = null) {
    try {
      // Obter todas as doações ordenadas por data
      let doacoesQuery = Doacao.find()
        .populate('item', 'nome valorFixo')
        .sort({ createdAt: 1 })
        .select('item multiplicadorAplicado createdAt')
        .lean();

      if (limiteDoacoes) {
        doacoesQuery = doacoesQuery.limit(limiteDoacoes);
      }

      const doacoes = await doacoesQuery;

      // Obter todos os itens existentes no sistema
      const todosItens = await Item.find().select('nome valorFixo').lean();
      
      // Inicializar estrutura de dados
      const dadosPorItem = {};
      const indicesDoacoes = doacoes.map((_, index) => `Doação ${index + 1}`);

      // Inicializar arrays para cada item com valores nulos
      for (const item of todosItens) {
        dadosPorItem[item.nome] = {
          valores: new Array(doacoes.length).fill(null),
          cor: this.gerarCorAleatoria(),
          valorFixo: item.valorFixo
        };
      }

      // Manter registro do último valor conhecido de cada item
      const ultimoValorConhecido = {};
      for (const item of todosItens) {
        ultimoValorConhecido[item.nome] = item.valorFixo; // Valor inicial é o valorFixo
      }

      // Processar cada doação sequencialmente
      for (let i = 0; i < doacoes.length; i++) {
        const doacao = doacoes[i];
        const itemDoacaoNome = doacao.item.nome;
        const valorFixoItemDoacao = doacao.item.valorFixo;

        // Calcular valor atual do item que foi doado
        const valorAtualItemDoacao = valorFixoItemDoacao * doacao.multiplicadorAplicado;
        
        // Atualizar o último valor conhecido para o item que foi doado
        ultimoValorConhecido[itemDoacaoNome] = valorAtualItemDoacao;

        // Para TODOS os itens, usar o último valor conhecido
        for (const itemNome in dadosPorItem) {
          dadosPorItem[itemNome].valores[i] = ultimoValorConhecido[itemNome];
        }
      }

      return { indices: indicesDoacoes, dados: dadosPorItem };

    } catch (error) {
      console.error('Erro ao obter evolução do valor dos itens:', error);
      throw error;
    }
  }

  // Gerar gráfico da evolução do valor de todos os itens
  async gerarGraficoEvolucaoValor(limiteDoacoes = null) {
    try {
      const { indices, dados } = await this.obterEvolucaoValorItens(limiteDoacoes);

      // Preparar datasets para o gráfico
      const datasets = [];
      for (const itemNome in dados) {
        // Verificar se este item aparece em alguma doação
        const temDados = dados[itemNome].valores.some(valor => valor !== null);
        
        if (temDados) {
          datasets.push({
            label: `${itemNome} (R$ ${dados[itemNome].valorFixo.toFixed(2)} base)`,
            data: dados[itemNome].valores.map((valor, index) => ({
              x: index,
              y: valor
            })),
            borderColor: dados[itemNome].cor,
            backgroundColor: dados[itemNome].cor + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: dados[itemNome].cor,
            showLine: true
          });
        }
      }

      const configuration = {
        type: 'line',
        data: {
          labels: indices,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Evolução do Valor dos Itens${limiteDoacoes ? ` (Últimas ${limiteDoacoes} doações)` : ''}`,
              font: { size: 18, weight: 'bold' }
            },
            legend: {
              position: 'top',
              labels: { 
                font: { size: 12 },
                usePointStyle: true
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset;
                  const value = dataset.data[context.dataIndex].y;
                  const itemNome = dataset.label.split(' (')[0];
                  return `${itemNome}: R$ ${value.toFixed(2)}`;
                },
                afterLabel: function(context) {
                  const dataset = context.dataset;
                  const value = dataset.data[context.dataIndex].y;
                  const itemNome = dataset.label.split(' (')[0];
                  const valorBase = dados[itemNome].valorFixo;
                  const multiplicador = (value / valorBase).toFixed(2);
                  
                  if (multiplicador === '1.00') {
                    return `Valor base | Doação ${context.dataIndex + 1}`;
                  } else {
                    return `Multiplicador: ${multiplicador}x | Doação ${context.dataIndex + 1}`;
                  }
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Número da Doação',
                font: { size: 14, weight: 'bold' }
              },
              ticks: {
                callback: function(value, index) {
                  return `Doação ${index + 1}`;
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valor do Item (R$)',
                font: { size: 14, weight: 'bold' }
              },
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toFixed(2);
                }
              }
            }
          }
        }
      };

      return await this.chartJSNodeCanvas.renderToBuffer(configuration);

    } catch (error) {
      console.error('Erro ao gerar gráfico de evolução do valor:', error);
      throw error;
    }
  }

  // Gerar gráfico focado em itens específicos
  async gerarGraficoItensEspecificos(itensNomes, limiteDoacoes = null) {
    try {
      const { indices, dados } = await this.obterEvolucaoValorItens(limiteDoacoes);

      // Filtrar apenas os itens solicitados
      const datasets = itensNomes
        .filter(itemNome => dados[itemNome])
        .map(itemNome => ({
          label: `${itemNome} (R$ ${dados[itemNome].valorFixo.toFixed(2)} base)`,
          data: dados[itemNome].valores.map((valor, index) => ({
            x: index,
            y: valor
          })),
          borderColor: dados[itemNome].cor,
          backgroundColor: dados[itemNome].cor + '20',
          borderWidth: 3,
          fill: false,
          tension: 0.1,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: dados[itemNome].cor,
          showLine: true
        }));

      if (datasets.length === 0) {
        throw new Error('Nenhum dos itens solicitados foi encontrado');
      }

      const configuration = {
        type: 'line',
        data: {
          labels: indices,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Evolução do Valor - ${itensNomes.join(', ')}${limiteDoacoes ? ` (Últimas ${limiteDoacoes} doações)` : ''}`,
              font: { size: 18, weight: 'bold' }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset;
                  const value = dataset.data[context.dataIndex].y;
                  const itemNome = dataset.label.split(' (')[0];
                  return `${itemNome}: R$ ${value.toFixed(2)}`;
                },
                afterLabel: function(context) {
                  const dataset = context.dataset;
                  const value = dataset.data[context.dataIndex].y;
                  const itemNome = dataset.label.split(' (')[0];
                  const valorBase = dados[itemNome].valorFixo;
                  const multiplicador = (value / valorBase).toFixed(2);
                  
                  if (multiplicador === '1.00') {
                    return `Valor base | Doação ${context.dataIndex + 1}`;
                  } else {
                    return `Multiplicador: ${multiplicador}x | Doação ${context.dataIndex + 1}`;
                  }
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Número da Doação',
                font: { size: 14, weight: 'bold' }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Valor do Item (R$)',
                font: { size: 14, weight: 'bold' }
              },
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toFixed(2);
                }
              }
            }
          }
        }
      };

      return await this.chartJSNodeCanvas.renderToBuffer(configuration);

    } catch (error) {
      console.error('Erro ao gerar gráfico de itens específicos:', error);
      throw error;
    }
  }

  // Gerar cor aleatória para cada linha do gráfico
  gerarCorAleatoria() {
    const cores = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#EA80FC', '#8C9EFF', '#B9F6CA', '#FFE57F',
      '#FF80AB', '#64B5F6', '#AED581', '#FFB74D', '#9575CD'
    ];
    return cores[Math.floor(Math.random() * cores.length)];
  }
}

module.exports = new GraficoService();