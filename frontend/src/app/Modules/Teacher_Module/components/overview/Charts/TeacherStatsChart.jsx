import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler, ArcElement, PointElement, LineElement } from "chart.js";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { Star, Check, AlertCircle, X, Info, Users, Award } from "lucide-react";
import Loading from "../../../../../Components/loadingIndicator/loading";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler, ArcElement, PointElement, LineElement);

const COLOR_PALETTES = {
    light: {
        approved: 'rgba(16, 185, 129, 0.8)',
        needMoreInfo: 'rgba(245, 158, 11, 0.8)',
        rejected: 'rgba(239, 68, 68, 0.8)',
        pending: 'rgba(156, 163, 175, 0.8)',
        completed: 'rgba(59, 130, 246, 0.8)',
        ongoing: 'rgba(249, 115, 22, 0.8)',
        teacherReviews: 'rgba(99, 102, 241, 0.8)',
        industryReviews: 'rgba(236, 72, 153, 0.8)',
        stars: {
            1: 'rgba(239, 68, 68, 0.8)',
            2: 'rgba(249, 115, 22, 0.8)',
            3: 'rgba(251, 191, 36, 0.8)',
            4: 'rgba(52, 211, 153, 0.8)',
            5: 'rgba(16, 185, 129, 0.8)'
        },
        text: '#1f2937',
        background: '#ffffff',
        grid: 'rgba(0, 0, 0, 0.05)'
    },
    dark: {
        approved: 'rgba(52, 211, 153, 0.8)',
        needMoreInfo: 'rgba(251, 191, 36, 0.8)',
        rejected: 'rgba(239, 68, 68, 0.8)',
        pending: 'rgba(156, 163, 175, 0.8)',
        completed: 'rgba(99, 102, 241, 0.8)',
        ongoing: 'rgba(249, 115, 22, 0.8)',
        teacherReviews: 'rgba(129, 140, 248, 0.8)',
        industryReviews: 'rgba(244, 114, 182, 0.8)',
        stars: {
            1: 'rgba(239, 68, 68, 0.8)',
            2: 'rgba(249, 115, 22, 0.8)',
            3: 'rgba(251, 191, 36, 0.8)',
            4: 'rgba(52, 211, 153, 0.8)',
            5: 'rgba(16, 185, 129, 0.8)'
        },
        text: '#e5e7eb',
        background: '#1f2937',
        grid: 'rgba(255, 255, 255, 0.1)'
    }
};

const TeacherStatsChart = ({ data, theme }) => {
    const [viewMode, setViewMode] = useState('approval');
    const chartRef = useRef(null);

    if (!data || !data.approvalStats || !data.supervisionStats || !data.groupStats || !data.ratingStats) {
        return <Loading />;
    }

    const palette = COLOR_PALETTES[theme === "dark" ? "dark" : "light"];

    // Approval Stats Data
    const approvalData = {
        labels: ['Approved', 'Needs Info', 'Rejected'],
        datasets: [{
            label: 'Project Approvals',
            data: [
                data.approvalStats.approved,
                data.approvalStats.needMoreInfo,
                data.approvalStats.rejected
            ],
            backgroundColor: [
                palette.approved,
                palette.needMoreInfo,
                palette.rejected
            ],
            borderColor: palette.background,
            borderWidth: 1,
            borderRadius: 6
        }]
    };

    // Supervision Stats Data
    const supervisionData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            label: 'Supervisions',
            data: [
                data.supervisionStats.approved,
                data.supervisionStats.pending,
                data.supervisionStats.rejected
            ],
            backgroundColor: [
                palette.approved,
                palette.pending,
                palette.rejected
            ],
            borderColor: palette.background,
            borderWidth: 1,
            borderRadius: 6
        }]
    };

    // Group Stats Data
    const groupData = {
        labels: ['Completed', 'Ongoing'],
        datasets: [{
            label: 'Project Groups Status',
            data: [
                data.groupStats.completed,
                data.groupStats.ongoing
            ],
            backgroundColor: [
                palette.completed,
                palette.ongoing
            ],
            borderColor: palette.background,
            borderWidth: 1,
            borderRadius: 6
        }]
    };

    // Rating Distribution Data
    const ratingDistributionData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [
            {
                label: 'Teacher Reviews',
                data: data.ratingStats.teacherReviews.distribution.map(item => item.count),
                backgroundColor: Object.values(palette.stars),
                borderColor: palette.background,
                borderWidth: 1
            },
            {
                label: 'Industry Reviews',
                data: data.ratingStats.industryReviews.distribution.map(item => item.count),
                backgroundColor: Object.values(palette.stars).map(color => color.replace('0.8', '0.5')),
                borderColor: palette.background,
                borderWidth: 1
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
                    color: palette.text,
                    boxWidth: 12,
                    padding: 16,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: palette.background,
                titleColor: palette.text,
                bodyColor: palette.text,
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                usePointStyle: true,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        let total;

                        if (viewMode === 'approval') {
                            total = data.approvalStats.total;
                        } else if (viewMode === 'supervision') {
                            total = data.supervisionStats.total;
                        } else if (viewMode === 'groups') {
                            total = data.groupStats.total;
                        } else {
                            if (context.datasetIndex === 0) {
                                total = data.ratingStats.teacherReviews.total;
                            } else {
                                total = data.ratingStats.industryReviews.total;
                            }
                        }

                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: palette.grid,
                    drawBorder: false,
                },
                ticks: {
                    color: palette.text,
                    stepSize: 1
                },
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: palette.text,
                },
            },
        }
    };

    const pieOptions = {
        ...options,
        scales: {},
        cutout: '65%'
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setViewMode('approval')}
                    className={`text-xs px-3 py-1 rounded-md flex items-center gap-1 ${viewMode === 'approval' ?
                        (theme === "dark" ? "bg-gray-700 text-white" : "bg-green-100 text-green-600") :
                        (theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                >
                    <Check className="w-3 h-3" />
                    Approvals
                </button>
                <button
                    onClick={() => setViewMode('supervision')}
                    className={`text-xs px-3 py-1 rounded-md flex items-center gap-1 ${viewMode === 'supervision' ?
                        (theme === "dark" ? "bg-gray-700 text-white" : "bg-blue-100 text-blue-600") :
                        (theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                >
                    <Award className="w-3 h-3" />
                    Supervisions
                </button>
                <button
                    onClick={() => setViewMode('groups')}
                    className={`text-xs px-3 py-1 rounded-md flex items-center gap-1 ${viewMode === 'groups' ?
                        (theme === "dark" ? "bg-gray-700 text-white" : "bg-purple-100 text-purple-600") :
                        (theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                >
                    <Users className="w-3 h-3" />
                    Projects
                </button>
                <button
                    onClick={() => setViewMode('ratings')}
                    className={`text-xs px-3 py-1 rounded-md flex items-center gap-1 ${viewMode === 'ratings' ?
                        (theme === "dark" ? "bg-gray-700 text-white" : "bg-yellow-100 text-yellow-600") :
                        (theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600")}`}
                >
                    <Star className="w-3 h-3" />
                    Ratings
                </button>
            </div>

            <div className="flex-grow min-h-[250px]">
                {viewMode === 'approval' ? (
                    <Bar
                        ref={chartRef}
                        data={approvalData}
                        options={options}
                    />
                ) : viewMode === 'supervision' ? (
                    <Bar
                        ref={chartRef}
                        data={supervisionData}
                        options={options}
                    />
                ) : viewMode === 'groups' ? (
                    <Pie
                        ref={chartRef}
                        data={groupData}
                        options={pieOptions}
                    />
                ) : (
                    <Bar
                        ref={chartRef}
                        data={ratingDistributionData}
                        options={options}
                    />
                )}
            </div>

            <div className={`grid grid-cols-2 gap-2 mt-2`}>
                <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Approval Rate
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {data.approvalStats.approvalRate}%
                    </span>
                </div>
                <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Success Rate
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {data.supervisionStats.successRate}%
                    </span>
                </div>
                <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Completion Rate
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {data.groupStats.completionRate}%
                    </span>
                </div>
                <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            Avg Rating
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                        {data.ratingStats.combinedAverage?.toFixed(1) || 'N/A'} / 5
                    </span>
                </div>
            </div>
        </div>
    );
};

TeacherStatsChart.propTypes = {
    data: PropTypes.shape({
        approvalStats: PropTypes.shape({
            total: PropTypes.number,
            approved: PropTypes.number,
            needMoreInfo: PropTypes.number,
            rejected: PropTypes.number,
            approvalRate: PropTypes.number
        }),
        supervisionStats: PropTypes.shape({
            total: PropTypes.number,
            approved: PropTypes.number,
            pending: PropTypes.number,
            rejected: PropTypes.number,
            successRate: PropTypes.number
        }),
        groupStats: PropTypes.shape({
            total: PropTypes.number,
            completed: PropTypes.number,
            ongoing: PropTypes.number,
            completionRate: PropTypes.number
        }),
        ratingStats: PropTypes.shape({
            teacherReviews: PropTypes.shape({
                average: PropTypes.number,
                total: PropTypes.number,
                distribution: PropTypes.arrayOf(
                    PropTypes.shape({
                        stars: PropTypes.number,
                        count: PropTypes.number
                    })
                )
            }),
            industryReviews: PropTypes.shape({
                average: PropTypes.number,
                total: PropTypes.number,
                distribution: PropTypes.arrayOf(
                    PropTypes.shape({
                        stars: PropTypes.number,
                        count: PropTypes.number
                    })
                )
            }),
            combinedAverage: PropTypes.number
        })
    }),
    theme: PropTypes.string.isRequired,
};

export default TeacherStatsChart;