import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from "chart.js";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import Loading from "../../../../../Components/loadingIndicator/loading";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const COLOR_PALETTES = {
    light: {
      student: ['rgba(99, 102, 241, 0.8)', 'rgba(79, 70, 229, 0.8)'],
      teacherApproval: ['rgba(236, 72, 153, 0.8)', 'rgba(219, 39, 119, 0.8)'],
      teacherSupervision: ['rgba(16, 185, 129, 0.8)', 'rgba(5, 150, 105, 0.8)'],
      engagementLevel: {
        'Very High': 'rgba(16, 185, 129, 0.8)',
        'High': 'rgba(52, 211, 153, 0.8)',
        'Medium': 'rgba(251, 191, 36, 0.8)',
        'Low': 'rgba(249, 115, 22, 0.8)',
        'Very Low': 'rgba(239, 68, 68, 0.8)'
      }
    },
    dark: {
      student: ['rgba(129, 140, 248, 0.8)', 'rgba(99, 102, 241, 0.8)'],
      teacherApproval: ['rgba(244, 114, 182, 0.8)', 'rgba(236, 72, 153, 0.8)'],
      teacherSupervision: ['rgba(52, 211, 153, 0.8)', 'rgba(16, 185, 129, 0.8)'],
      engagementLevel: {
        'Very High': 'rgba(52, 211, 153, 0.8)',
        'High': 'rgba(16, 185, 129, 0.8)',
        'Medium': 'rgba(251, 191, 36, 0.8)',
        'Low': 'rgba(249, 115, 22, 0.8)',
        'Very Low': 'rgba(239, 68, 68, 0.8)'
      }
    }
};

const UniversityEngagementChart = ({ data, theme }) => {
    const [itemCount, setItemCount] = useState(8);
    const [sortOrder, setSortOrder] = useState('most');
    const [viewMode, setViewMode] = useState('total'); // 'total', 'completed', 'active'
    const chartRef = useRef(null);

    if (!data || !Array.isArray(data)) {
        return <Loading />;
    }

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                No data available
            </div>
        );
    }

    const sortedData = [...data]
        .sort((a, b) => sortOrder === 'most' ? b.engagementScore - a.engagementScore : a.engagementScore - b.engagementScore)
        .slice(0, itemCount);

    const palette = COLOR_PALETTES[theme === "dark" ? "dark" : "light"];

    const getDataValue = (item, type) => {
        switch (type) {
            case 'student':
                switch (viewMode) {
                    case 'total': return item.studentSelections.total;
                    case 'completed': return item.studentSelections.completed;
                    case 'active': return item.studentSelections.active;
                    default: return item.studentSelections.total;
                }
            case 'approval':
                switch (viewMode) {
                    case 'total': return item.teacherApprovals.total;
                    case 'completed': return item.teacherApprovals.approved;
                    case 'active': return item.teacherApprovals.pending + item.teacherApprovals.needMoreInfo;
                    default: return item.teacherApprovals.total;
                }
            case 'supervision':
                switch (viewMode) {
                    case 'total': return item.teacherSupervisions.total;
                    case 'completed': return item.teacherSupervisions.approved;
                    case 'active': return item.teacherSupervisions.pending;
                    default: return item.teacherSupervisions.total;
                }
            default:
                return 0;
        }
    };

    const chartData = {
        labels: sortedData.map(item => item.university),
        datasets: [
            {
                label: 'Student Selections',
                data: sortedData.map(item => getDataValue(item, 'student')),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    
                    if (!chartArea) return palette.student[0];
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, palette.student[0]);
                    gradient.addColorStop(1, palette.student[1]);
                    return gradient;
                },
                borderColor: theme === "dark" ? 'rgba(79, 70, 229, 1)' : 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
                borderRadius: {
                    topLeft: 4,
                    topRight: 4,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                hoverBackgroundColor: theme === "dark" ? 'rgba(79, 70, 229, 0.9)' : 'rgba(99, 102, 241, 0.9)',
                categoryPercentage: 0.8,
                barPercentage: 0.9
            },
            {
                label: 'Teacher Approvals',
                data: sortedData.map(item => getDataValue(item, 'approval')),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    
                    if (!chartArea) return palette.teacherApproval[0];
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, palette.teacherApproval[0]);
                    gradient.addColorStop(1, palette.teacherApproval[1]);
                    return gradient;
                },
                borderColor: theme === "dark" ? 'rgba(236, 72, 153, 1)' : 'rgba(219, 39, 119, 1)',
                borderWidth: 1,
                borderRadius: {
                    topLeft: 0,
                    topRight: 0,
                    bottomLeft: 0,
                    bottomRight: 0
                },
                hoverBackgroundColor: theme === "dark" ? 'rgba(236, 72, 153, 0.9)' : 'rgba(219, 39, 119, 0.9)',
                categoryPercentage: 0.8,
                barPercentage: 0.9
            },
            {
                label: 'Teacher Supervisions',
                data: sortedData.map(item => getDataValue(item, 'supervision')),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    
                    if (!chartArea) return palette.teacherSupervision[0];
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, palette.teacherSupervision[0]);
                    gradient.addColorStop(1, palette.teacherSupervision[1]);
                    return gradient;
                },
                borderColor: theme === "dark" ? 'rgba(5, 150, 105, 1)' : 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
                borderRadius: {
                    topLeft: 0,
                    topRight: 0,
                    bottomLeft: 4,
                    bottomRight: 4
                },
                hoverBackgroundColor: theme === "dark" ? 'rgba(5, 150, 105, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                categoryPercentage: 0.8,
                barPercentage: 0.9
            },
            {
                label: 'Engagement Level',
                data: sortedData.map(item => item.engagementScore),
                backgroundColor: sortedData.map(item => palette.engagementLevel[item.engagementLevel]),
                borderColor: theme === "dark" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderRadius: 4,
                type: 'line',
                pointBackgroundColor: sortedData.map(item => palette.engagementLevel[item.engagementLevel]),
                pointBorderColor: theme === "dark" ? '#1f2937' : '#f9fafb',
                pointRadius: 5,
                pointHoverRadius: 7,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme === "dark" ? "#e5e7eb" : "#374151",
                    boxWidth: 12,
                    padding: 16,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                titleColor: theme === "dark" ? "#ffffff" : "#111827",
                bodyColor: theme === "dark" ? "#e5e7eb" : "#374151",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                usePointStyle: true,
                callbacks: {
                    labelColor: (context) => {
                        const colors = [
                            palette.student[0],
                            palette.teacherApproval[0],
                            palette.teacherSupervision[0],
                            palette.engagementLevel[sortedData[context.dataIndex].engagementLevel]
                        ];
                        return {
                            borderColor: 'transparent',
                            backgroundColor: colors[context.datasetIndex],
                            borderRadius: 4
                        };
                    },
                    label: (context) => {
                        const label = context.dataset.label || '';
                        if (label === 'Engagement Level') {
                            return `${label}: ${sortedData[context.dataIndex].engagementLevel} (${context.raw})`;
                        }
                        return `${label}: ${context.raw}`;
                    },
                    afterBody: (context) => {
                        const dataIndex = context[0].dataIndex;
                        const universityData = sortedData[dataIndex];
                        
                        // Format dates
                        const formatDate = (timestamp) => {
                            if (!timestamp) return 'N/A';
                            const date = new Date(timestamp);
                            return date.toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            });
                        };

                        return [
                            `Engagement Level: ${universityData.engagementLevel}`,
                            `Score: ${universityData.engagementScore}`,
                            `Timeline: ${formatDate(universityData.engagementTimeline.firstActivity)} - ${formatDate(universityData.engagementTimeline.lastActivity)}`,
                            '',
                            'Student Selections:',
                            `• Total: ${universityData.studentSelections.total}`,
                            `• Completed: ${universityData.studentSelections.completed}`,
                            `• Active: ${universityData.studentSelections.active}`,
                            `• Unique Groups: ${universityData.studentSelections.uniqueGroups}`,
                            '',
                            'Teacher Approvals:',
                            `• Total: ${universityData.teacherApprovals.total}`,
                            `• Approved: ${universityData.teacherApprovals.approved}`,
                            `• Rejected: ${universityData.teacherApprovals.rejected}`,
                            `• Pending: ${universityData.teacherApprovals.pending}`,
                            `• Need More Info: ${universityData.teacherApprovals.needMoreInfo}`,
                            '',
                            'Teacher Supervisions:',
                            `• Total: ${universityData.teacherSupervisions.total}`,
                            `• Approved: ${universityData.teacherSupervisions.approved}`,
                            `• Rejected: ${universityData.teacherSupervisions.rejected}`,
                            `• Pending: ${universityData.teacherSupervisions.pending}`
                        ];
                    }
                }
            },
            title: {
                display: true,
                text: 'University Engagement Overview',
                color: theme === "dark" ? "#e5e7eb" : "#374151",
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                stacked: viewMode === 'total',
                grid: {
                    color: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
                    drawBorder: false,
                },
                ticks: {
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    callback: (value) => Number.isInteger(value) ? value : ''
                },
            },
            y1: {
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                }
            },
            x: {
                stacked: viewMode === 'total',
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    callback: function(value) {
                        const label = this.getLabelForValue(value);
                        return label.length > 15 ? `${label.substring(0, 12)}...` : label;
                    }
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value="most">Most Engaged</option>
                    <option value="least">Least Engaged</option>
                </select>
                <select
                    value={itemCount}
                    onChange={(e) => setItemCount(Number(e.target.value))}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value={5}>Top 5</option>
                    <option value={8}>Top 8</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={data.length}>All</option>
                </select>
                <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className={`text-xs p-1.5 rounded-md ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800 border"} shadow-sm`}
                >
                    <option value="total">Total</option>
                    <option value="completed">Completed</option>
                    <option value="active">Active</option>
                </select>
            </div>

            <div className="flex-grow">
                <Bar 
                    ref={chartRef}
                    data={chartData} 
                    options={options} 
                />
            </div>
        </div>
    );
};

UniversityEngagementChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            university: PropTypes.string.isRequired,
            studentSelections: PropTypes.shape({
                total: PropTypes.number.isRequired,
                completed: PropTypes.number.isRequired,
                active: PropTypes.number.isRequired,
                uniqueGroups: PropTypes.number.isRequired
            }).isRequired,
            teacherApprovals: PropTypes.shape({
                total: PropTypes.number.isRequired,
                approved: PropTypes.number.isRequired,
                rejected: PropTypes.number.isRequired,
                pending: PropTypes.number.isRequired,
                needMoreInfo: PropTypes.number.isRequired
            }).isRequired,
            teacherSupervisions: PropTypes.shape({
                total: PropTypes.number.isRequired,
                approved: PropTypes.number.isRequired,
                rejected: PropTypes.number.isRequired,
                pending: PropTypes.number.isRequired
            }).isRequired,
            engagementTimeline: PropTypes.shape({
                firstActivity: PropTypes.number.isRequired,
                lastActivity: PropTypes.number.isRequired
            }).isRequired,
            engagementScore: PropTypes.number.isRequired,
            engagementLevel: PropTypes.string.isRequired
        })
    ),
    theme: PropTypes.string.isRequired,
};

export default UniversityEngagementChart;