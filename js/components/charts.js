let trendChartInstance = null;
let categoryChartInstance = null;

export function updateCharts(trendData, categoryData) {
    // 1. Line Trend Chart
    const trendCtx = document.getElementById("trendChart");
    if (trendCtx) {
        if (trendChartInstance) trendChartInstance.destroy();

        trendChartInstance = new Chart(trendCtx, {
            type: "line",
            data: {
                labels: trendData.map(item => item.label),
                datasets: [{
                    label: "Pengeluaran",
                    data: trendData.map(item => item.amount),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: "#3b82f6",
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => "Rp " + ctx.parsed.y.toLocaleString("id-ID")
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: "rgba(255, 255, 255, 0.04)" },
                        ticks: { color: "#5e6272", font: { size: 10 } }
                    },
                    y: {
                        grid: { color: "rgba(255, 255, 255, 0.04)" },
                        ticks: {
                            color: "#5e6272",
                            font: { size: 10 },
                            callback: val => val >= 1000000 ? (val / 1000000) + "jt" : (val >= 1000 ? (val / 1000) + "rb" : val)
                        }
                    }
                }
            }
        });
    }

    // 2. Category Donut Chart
    const catCtx = document.getElementById("categoryChart");
    if (catCtx) {
        if (categoryChartInstance) categoryChartInstance.destroy();

        if (categoryData.length > 0) {
            const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#64748b"];
            categoryChartInstance = new Chart(catCtx, {
                type: "doughnut",
                data: {
                    labels: categoryData.map(item => item.category),
                    datasets: [{
                        data: categoryData.map(item => item.total),
                        backgroundColor: palette.slice(0, categoryData.length),
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: { color: "#9da1b2", font: { size: 10 }, boxWidth: 8, padding: 8 }
                        },
                        tooltip: {
                            callbacks: {
                                label: ctx => " Rp " + ctx.parsed.toLocaleString("id-ID")
                            }
                        }
                    }
                }
            });
        }
    }
}
