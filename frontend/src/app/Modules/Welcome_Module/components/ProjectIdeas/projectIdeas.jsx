import { motion } from "framer-motion";
import {
    Code2,
    Database,
    Cpu,
    HeartHandshake,
    Briefcase,
    Puzzle,
    Users,
    BookOpenCheck,
    Brain
} from 'lucide-react';
import { Link } from "react-router-dom";
import image1 from "../../../../../assets/images/fourteen.webp";
import image2 from "../../../../../assets/images/fifteen.webp";
import image3 from "../../../../../assets/images/sixteen.webp";

const ProjectIdeas = () => {
    const sections = [
        {
            title: "Diverse Opportunities for Every Student",
            description: "Our platform offers a wide range of Final Year Projects (FYP) tailored to various interests, skill levels, and career aspirations. Whether you're passionate about software development, data science, hardware innovation, or social impact projects, you'll find a project that aligns with your goals.",
            tags: [
                { name: "Software Development", icon: <Code2 className="w-4 h-4" /> },
                { name: "Data Science", icon: <Database className="w-4 h-4" /> },
                { name: "Hardware Innovation", icon: <Cpu className="w-4 h-4" /> },
                { name: "Social Impact", icon: <HeartHandshake className="w-4 h-4" /> }
            ],
            linkText: "Explore Projects",
            image: image1,
        },
        {
            title: "Real-World Applications and Industry Relevance",
            description: "Engage in projects that bridge the gap between academia and industry. These projects are designed to solve real-world problems, often in collaboration with industry partners, helping you gain hands-on experience and build a standout portfolio.",
            tags: [
                { name: "Industry Collaboration", icon: <Briefcase className="w-4 h-4" /> },
                { name: "Problem Solving", icon: <Puzzle className="w-4 h-4" /> },
                { name: "Hands-On Experience", icon: <Users className="w-4 h-4" /> },
                { name: "Career Readiness", icon: <BookOpenCheck className="w-4 h-4" /> }
            ],
            linkText: "Discover Industry Projects",
            image: image2,
        },
        {
            title: "Skill Enhancement and Personal Growth",
            description: "Develop critical technical and soft skills through projects that foster creativity, critical thinking, and innovation. Gain expertise in cutting-edge technologies while improving teamwork and real-world problem-solving abilities.",
            tags: [
                { name: "Technical Skills", icon: <Code2 className="w-4 h-4" /> },
                { name: "Teamwork", icon: <Users className="w-4 h-4" /> },
                { name: "Critical Thinking", icon: <Brain className="w-4 h-4" /> },
                { name: "Innovation", icon: <Cpu className="w-4 h-4" /> }
            ],
            linkText: "Enhance Your Skills",
            image: image3,
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.p
                        className="text-sm font-semibold text-gray-600 tracking-wide uppercase mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        Innovative Final Year Projects
                    </motion.p>
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Explore <span className="text-gray-600">Exciting</span> Project Ideas
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-600 max-w-3xl mx-auto "
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Discover diverse Final Year Projects that combine academic rigor with real-world applications to enhance your learning and career readiness.
                    </motion.p>
                </motion.div>
            </div>

            {/* Project Sections */}
            <div className="max-w-7xl mx-auto px-6 pb-24 border-t border-gray-700">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 py-12`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        {/* Text Content */}
                        <div className="lg:w-1/2 space-y-6">
                            <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">{section.description}</p>

                            <div className="flex flex-wrap gap-3">
                                {section.tags.map((tag, tagIndex) => (
                                    <motion.span
                                        key={tagIndex}
                                        className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {tag.icon}
                                        {tag.name}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.button
                                className="cursor-pointer inline-flex items-center text-gray-600 font-medium group mt-4"
                                whileHover={{ x: 5 }}
                            >
                                <Link to="/login">
                                    {section.linkText}
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">
                                        ➔
                                    </span>
                                </Link>
                            </motion.button>
                        </div>

                        {/* Image */}
                        <div className="lg:w-1/2">
                            <motion.div
                                className="relative rounded-xl overflow-hidden shadow-lg"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={section.image}
                                    alt={section.title}
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProjectIdeas;