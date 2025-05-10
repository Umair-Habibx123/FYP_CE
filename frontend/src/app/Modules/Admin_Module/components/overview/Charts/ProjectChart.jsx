import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler } from "chart.js";
import PropTypes from "prop-types";
import { RefreshCw } from "lucide-react"
import Loading from "../../../../../Components/loadingIndicator/loading";
import { useState } from "react";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler
);

const COLOR_PALETTE = [
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#36A2EB',
    '#FFCD56',
    '#FF6384',
    '#4D5360',
    '#00BFFF',
    '#7CFC00',
    '#FF69B4',
    '#9370DB',
    '#3CB371',
];

const ProjectChart = ({ data, theme, initialChartType = "bar" }) => {
    const [chartType, setChartType] = useState(initialChartType);
    const [sortOrder, setSortOrder] = useState("desc");
    const [limit, setLimit] = useState(10);

    const resetChart = () => {
        setChartType(initialChartType);
        setSortOrder("desc");
        setLimit(10);
    };

    if (!data || !Array.isArray(data)) {
        return <Loading />;
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm font-medium">
                No data available
            </div>
        );
    }

    let filteredData = [...data];

    filteredData.sort((a, b) =>
        sortOrder === 'asc' ? a.count - b.count : b.count - a.count
    );

    if (limit > 0) {
        filteredData = filteredData.slice(0, limit);
    }

    const backgroundColors = filteredData.map((_, index) => {
        const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
        return theme === "dark"
            ? `${color}CC`
            : color;
    });

    const borderColors = filteredData.map((_, index) => {
        const color = COLOR_PALETTE[index % COLOR_PALETTE.length];
        return theme === "dark"
            ? `${color}FF`
            : color;
    });

    const chartData = {
        labels: filteredData.map((item) => item._id),
        datasets: [
            {
                label: "Project Count",
                data: filteredData.map((item) => item.count),
                backgroundColor: chartType === "bar"
                    ? backgroundColors
                    : theme === "dark"
                        ? 'rgba(75, 192, 192, 0.2)'
                        : 'rgba(75, 192, 192, 0.2)',
                borderColor: chartType === "bar"
                    ? borderColors
                    : theme === "dark"
                        ? 'rgba(75, 192, 192, 0.8)'
                        : 'rgba(75, 192, 192, 1)',
                borderWidth: chartType === "bar" ? 1 : 2,
                borderRadius: chartType === "bar" ? 6 : 0,
                borderSkipped: false,
                tension: chartType === "line" ? 0.4 : 0,
                fill: chartType === "line" ? {
                    target: 'origin',
                    above: theme === "dark"
                        ? 'rgba(75, 192, 192, 0.1)'
                        : 'rgba(75, 192, 192, 0.1)'
                } : false,
                pointBackgroundColor: chartType === "line"
                    ? backgroundColors
                    : 'transparent',
                pointBorderColor: '#fff',
                pointRadius: chartType === "line" ? 4 : 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: theme === "dark"
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'rgba(0, 0, 0, 0.8)',
                pointHitRadius: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                titleColor: theme === "dark" ? "#ffffff" : "#111827",
                bodyColor: theme === "dark" ? "#e5e7eb" : "#374151",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                    labelColor: (context) => {
                        return {
                            borderColor: 'transparent',
                            backgroundColor: chartType === "bar"
                                ? backgroundColors[context.dataIndex]
                                : borderColors[0],
                            borderRadius: 4,
                        };
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    drawBorder: false,
                },
                ticks: {
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    padding: 8,
                },
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    padding: 8,
                    callback: function (value) {
                        const label = this.getLabelForValue(value);
                        return label.length > 10 ? `${label.substring(0, 8)}...` : label;
                    }
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
        },
        elements: {
            bar: {
                hoverBackgroundColor: (context) => {
                    const index = context.dataIndex;
                    return theme === "dark"
                        ? `${COLOR_PALETTE[index % COLOR_PALETTE.length]}FF`
                        : `${COLOR_PALETTE[index % COLOR_PALETTE.length]}CC`;
                },
                hoverBorderColor: theme === "dark" ? '#fff' : 'rgba(0, 0, 0, 0.1)',
                hoverBorderWidth: 1,
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-2 mb-2 flex-wrap">
                <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value="desc">Highest First</option>
                    <option value="asc">Lowest First</option>
                </select>

                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={15}>Top 15</option>
                    <option value={data.length}>Show All</option>
                </select>

                {/* <button
                    onClick={resetChart}
                    className={`p-2 text-xs rounded-md ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-white text-gray-800 border hover:bg-gray-50"} shadow-sm`}
                >
                    <RefreshCw className="w-3 h-3 inline-flex mr-2" />
                    Reset
                </button> */}

                <button
                    onClick={resetChart}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95"
                >
                    <RefreshCw className="w-4 h-4" strokeWidth={2} />
                    Reset Filters
                </button>
            </div>

            <div className="flex-grow">
                {chartType === "bar" ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <Line data={chartData} options={options} />
                )}
            </div>
            <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Showing {limit === data.length ? 'all' : `top ${limit}`} data
            </span>
        </div>
    );
};

ProjectChart.propTypes = {
    data: PropTypes.array,
    theme: PropTypes.string.isRequired,
    initialChartType: PropTypes.oneOf(["bar", "line"]),
};

ProjectChart.defaultProps = {
    initialChartType: "bar",
};

export default ProjectChart;