// Dados dos parâmetros por modelo
const parametersData = {
    datasets: [

        {
            label: 'T20P',
            data: [
                { x: 3.5, y: 5.5, deltaT: '2-4', wind: '3-5', value: 7.0 },
                { x: 7.5, y: 4.5, deltaT: '2-4', wind: '6-9', value: 6.5 },
                { x: 11, y: 3.5, deltaT: '2-4', wind: '10-12', value: 6.0 },
                { x: 3.5, y: 5.5, deltaT: '4-6', wind: '3-5', value: 7.5 },
                { x: 7.5, y: 4.5, deltaT: '4-6', wind: '6-9', value: 7.0 },
                { x: 11, y: 3.5, deltaT: '4-6', wind: '10-12', value: 6.5 },
                { x: 3.5, y: 5.5, deltaT: '6-8', wind: '3-5', value: 8.0 },
                { x: 7.5, y: 4.5, deltaT: '6-8', wind: '6-9', value: 7.5 },
                { x: 11, y: 3.5, deltaT: '6-8', wind: '10-12', value: 7.0 }
            ],
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
            borderColor: '#4CAF50',
            borderWidth: 2,
            pointRadius: 6
        },

        {
            label: 'T40',
            data: [
                { x: 3.5, y: 5.5, deltaT: '2-4', wind: '3-5', value: 10.0 },
                { x: 7.5, y: 4.5, deltaT: '2-4', wind: '6-9', value: 9.0 },
                { x: 11, y: 3.5, deltaT: '2-4', wind: '10-12', value: 8.0 },
                { x: 3.5, y: 5.5, deltaT: '4-6', wind: '3-5', value: 10.5 },
                { x: 7.5, y: 4.5, deltaT: '4-6', wind: '6-9', value: 9.5 },
                { x: 11, y: 3.5, deltaT: '4-6', wind: '10-12', value: 8.5 },
                { x: 3.5, y: 5.5, deltaT: '6-8', wind: '3-5', value: 11.0 },
                { x: 7.5, y: 4.5, deltaT: '6-8', wind: '6-9', value: 10.0 },
                { x: 11, y: 3.5, deltaT: '6-8', wind: '10-12', value: 9.0 }
            ],
            backgroundColor: 'rgba(156, 39, 176, 0.7)',
            borderColor: '#9C27B0',
            borderWidth: 2,
            pointRadius: 6
        },
        {
            label: 'T50',
            data: [
                { x: 3.5, y: 5.5, deltaT: '2-4', wind: '3-5', value: 11.0 },
                { x: 7.5, y: 4.5, deltaT: '2-4', wind: '6-9', value: 10.0 },
                { x: 11, y: 3.5, deltaT: '2-4', wind: '10-12', value: 9.0 },
                { x: 3.5, y: 5.5, deltaT: '4-6', wind: '3-5', value: 11.5 },
                { x: 7.5, y: 4.5, deltaT: '4-6', wind: '6-9', value: 10.5 },
                { x: 11, y: 3.5, deltaT: '4-6', wind: '10-12', value: 9.5 },
                { x: 3.5, y: 5.5, deltaT: '6-8', wind: '3-5', value: 12.0 },
                { x: 7.5, y: 4.5, deltaT: '6-8', wind: '6-9', value: 11.0 },
                { x: 11, y: 3.5, deltaT: '6-8', wind: '10-12', value: 10.0 }
            ],
            backgroundColor: 'rgba(244, 67, 54, 0.7)',
            borderColor: '#F44336',
            borderWidth: 2,
            pointRadius: 6
        }
    ]
};

// Configuração do gráfico
const chartConfig = {
    type: 'scatter',
    data: parametersData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Parâmetros de Qualidade por Modelo de Drone',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                color: '#2E7D32'
            },
            legend: {
                display: false // Usaremos legenda customizada
            },
            tooltip: {
                callbacks: {
                    title: function (context) {
                        const point = context[0];
                        return `${point.dataset.label}`;
                    },
                    label: function (context) {
                        const point = context.parsed;
                        const dataPoint = context.raw;
                        return [
                            `Vento: ${dataPoint.wind} km/h`,
                            `Altura: ${point.y}m`,
                            `Faixa: ${dataPoint.value}m`,
                            `Delta T: ${dataPoint.deltaT}`
                        ];
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#4CAF50',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Velocidade do Vento (km/h)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#2E7D32'
                },
                min: 0,
                max: 15,
                ticks: {
                    stepSize: 2,
                    color: '#666'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Altura de Aplicação (metros)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    color: '#2E7D32'
                },
                min: 2,
                max: 7,
                ticks: {
                    stepSize: 0.5,
                    color: '#666'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'point'
        }
    }
};

// Inicializar o gráfico
let parametersChart;

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('parametersChart').getContext('2d');
    parametersChart = new Chart(ctx, chartConfig);

    // Event listeners para os filtros
    document.getElementById('deltaT-select').addEventListener('change', filterChart);
    document.getElementById('wind-select').addEventListener('change', filterChart);
});

// Função para filtrar o gráfico
function filterChart() {
    const deltaTFilter = document.getElementById('deltaT-select').value;
    const windFilter = document.getElementById('wind-select').value;

    // Filtrar dados baseado na seleção
    const originalData = parametersData.datasets;
    const filteredData = originalData.map(dataset => {
        const filteredPoints = dataset.data.filter(point => {
            let deltaTMatch = deltaTFilter === 'all' || point.deltaT === deltaTFilter;
            let windMatch = windFilter === 'all' || point.wind === windFilter;
            return deltaTMatch && windMatch;
        });

        return {
            ...dataset,
            data: filteredPoints
        };
    });

    parametersChart.data.datasets = filteredData;
    parametersChart.update();
}