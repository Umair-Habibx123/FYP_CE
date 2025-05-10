import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, Filler } from "chart.js";
import PropTypes from "prop-types";
import Loading from "../../../../../Components/loadingIndicator/loading";
import { useRef, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

// Color schemes for different time periods
const COLOR_SCHEMES = {
  year: {
    light: {
      gradientStart: 'rgba(99, 102, 241, 0.6)',
      gradientEnd: 'rgba(99, 102, 241, 0.1)',
      lineColor: 'rgba(99, 102, 241, 1)',
      pointColor: 'rgba(99, 102, 241, 1)'
    },
    dark: {
      gradientStart: 'rgba(167, 139, 250, 0.6)',
      gradientEnd: 'rgba(167, 139, 250, 0.1)',
      lineColor: 'rgba(167, 139, 250, 1)',
      pointColor: 'rgba(167, 139, 250, 1)'
    }
  },
  month: {
    light: {
      gradientStart: 'rgba(16, 185, 129, 0.6)',
      gradientEnd: 'rgba(16, 185, 129, 0.1)',
      lineColor: 'rgba(16, 185, 129, 1)',
      pointColor: 'rgba(16, 185, 129, 1)'
    },
    dark: {
      gradientStart: 'rgba(74, 222, 128, 0.6)',
      gradientEnd: 'rgba(74, 222, 128, 0.1)',
      lineColor: 'rgba(74, 222, 128, 1)',
      pointColor: 'rgba(74, 222, 128, 1)'
    }
  },
  week: {
    light: {
      gradientStart: 'rgba(236, 72, 153, 0.6)',
      gradientEnd: 'rgba(236, 72, 153, 0.1)',
      lineColor: 'rgba(236, 72, 153, 1)',
      pointColor: 'rgba(236, 72, 153, 1)'
    },
    dark: {
      gradientStart: 'rgba(244, 114, 182, 0.6)',
      gradientEnd: 'rgba(244, 114, 182, 0.1)',
      lineColor: 'rgba(244, 114, 182, 1)',
      pointColor: 'rgba(244, 114, 182, 1)'
    }
  },
  default: {
    light: {
      gradientStart: 'rgba(59, 130, 246, 0.6)',
      gradientEnd: 'rgba(59, 130, 246, 0.1)',
      lineColor: 'rgba(59, 130, 246, 1)',
      pointColor: 'rgba(59, 130, 246, 1)'
    },
    dark: {
      gradientStart: 'rgba(96, 165, 250, 0.6)',
      gradientEnd: 'rgba(96, 165, 250, 0.1)',
      lineColor: 'rgba(96, 165, 250, 1)',
      pointColor: 'rgba(96, 165, 250, 1)'
    }
  }
};

const UserChart = ({ data, xAxisType, theme }) => {
    const chartRef = useRef(null);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        // Force chart update when theme changes
        if (chartRef.current) {
            chartRef.current.update();
        }
    }, [theme]);

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

    const formatXAxisLabels = (item) => {
        if (xAxisType === "year") return item._id.year.toString();
        if (xAxisType === "month") return `${monthNames[item._id.month - 1]} ${item._id.year}`;
        if (xAxisType === "week") return `Week ${item._id.week}, ${item._id.year}`;
        return item._id;
    };

    const getColorScheme = () => {
        return COLOR_SCHEMES[xAxisType] || COLOR_SCHEMES.default;
    };

    const colors = getColorScheme()[theme === "dark" ? "dark" : "light"];

    const chartData = {
        labels: data.map(formatXAxisLabels),
        datasets: [
            {
                label: "User Count",
                data: data.map((item) => item.count),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, colors.gradientStart);
                    gradient.addColorStop(1, colors.gradientEnd);
                    return gradient;
                },
                borderColor: colors.lineColor,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: colors.pointColor,
                pointBorderColor: theme === "dark" ? '#1f2937' : '#f9fafb',
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBorderWidth: 2,
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
                        return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                    },
                    labelColor: () => {
                        return {
                            borderColor: 'transparent',
                            backgroundColor: colors.lineColor,
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
                    callback: (value) => value.toLocaleString()
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
                    maxRotation: 45,
                    minRotation: 45
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
        },
        interaction: {
            intersect: false,
            mode: 'index',
        }
    };

    return (
        <div className="h-full">
            <Line 
                ref={chartRef}
                data={chartData} 
                options={options} 
            />
        </div>
    );
};

UserChart.propTypes = {
    data: PropTypes.array,
    xAxisType: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
};

export default UserChart;