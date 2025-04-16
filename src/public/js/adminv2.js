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
            labels: mostRecentlyMonth.label,
            datasets: [
                {
                    label: 'Dataset 1',
                    data: mostRecentlyMonth.users,
                    fill: true,
                    backgroundColor: 'rgba(111, 66, 193, 0.2)',
                    borderColor: '#6f42c1',
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
            labels: mostRecentlyMonth.label,
            datasets: [
                {
                    label: 'Dataset 1',
                    data: mostRecentlyMonth.orders,
                    backgroundColor: '#007bff'
                },
                
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

    // Line Chart
    const lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: mostRecentlyMonth.label,
            datasets: [
                {
                    label: 'Dataset 1',
                    data: mostRecentlyMonth.revenue,
                    fill: true,
                    backgroundColor: '#072ef0',
                    borderColor: '#6f42c1',
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
});