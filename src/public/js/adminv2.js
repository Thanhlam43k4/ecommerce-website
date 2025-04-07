document.addEventListener('DOMContentLoaded', () => {
    // Donut Chart
    const donutChart = new Chart(document.getElementById('donutChart'), {
        type: 'doughnut',
        data: {
            labels: ['In-Store Sales', 'Other'],
            datasets: [{
                data: [30, 70],
                backgroundColor: ['#007bff', '#6f42c1'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Area Chart
    const areaChart = new Chart(document.getElementById('areaChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [100, 200, 300, 250, 400, 300],
                    fill: true,
                    backgroundColor: 'rgba(111, 66, 193, 0.2)',
                    borderColor: '#6f42c1',
                    tension: 0.4
                },
                {
                    label: 'Dataset 2',
                    data: [50, 150, 200, 300, 350, 200],
                    fill: true,
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    borderColor: '#007bff',
                    tension: 0.4
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Bar Chart
    const barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            datasets: [
                {
                    label: 'Dataset 1',
                    data: [75, 150, 225, 100, 200, 150, 225, 75, 150, 225, 100, 200],
                    backgroundColor: '#007bff'
                },
                {
                    label: 'Dataset 2',
                    data: [50, 100, 150, 75, 150, 100, 150, 50, 100, 150, 75, 150],
                    backgroundColor: '#6f42c1'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});