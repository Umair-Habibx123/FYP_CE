import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";
import Loading from "../../../../../Components/loadingIndicator/loading";

ChartJS.register(ArcElement, Tooltip, Legend);

const RolePieChart = ({ data, theme }) => {
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

    const chartData = {
        labels: data.map((item) => item._id),
        datasets: [
            {
                label: "Users by Role",
                data: data.map((item) => item.count),
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)",  // indigo
                    "rgba(236, 72, 153, 0.8)",   // pink
                    "rgba(234, 179, 8, 0.8)",    // yellow
                    "rgba(16, 185, 129, 0.8)",   // emerald
                    "rgba(139, 92, 246, 0.8)",   // violet
                ],
                borderColor: theme === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.8)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: theme === "dark" ? "#e5e7eb" : "#374151",
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                },
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
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '65%',
    };

    return (
        <div className="h-full">
            <Pie data={chartData} options={options} />
        </div>
    );
};

RolePieChart.propTypes = {
    data: PropTypes.array,
    theme: PropTypes.string.isRequired,
};

export default RolePieChart;