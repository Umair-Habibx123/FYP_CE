import { motion } from "framer-motion";
import { Users, Lightbulb, CheckCircle2, Briefcase, ListChecks, GraduationCap } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="bg-white">
            {/* Section 1: Mission Statement */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-16 lg:px-24 py-16 md:py-24 bg-gradient-to-br from-gray-200 to-white"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="md:col-start-2 md:col-span-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        About <span className="text-gray-600">Collaborative Edge</span>: Bridging Academia and Industry
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        Collaborative Edge is a revolutionary platform designed to transform the Final Year Project (FYP) experience for students, educators, and industry professionals. Our mission is to bridge the gap between academia and industry by creating a collaborative ecosystem where innovative ideas thrive.
                    </p>
                </div>
            </motion.div>

            {/* Section 2: Features Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                    Our <span className="text-gray-600">Key Features</span>
                </h2>
                <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
                    Discover how Collaborative Edge enhances the FYP experience for all stakeholders
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1: Collaborative Learning */}
                    <motion.div
                        className="border-2 border-gray-300 cursor-pointer hover:shadow-2xl bg-white rounded-xl shadow-lg transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <Users className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Collaborative Learning</h3>
                        <p className="text-gray-600">
                            Fosters a collaborative environment where students, educators, and industry professionals work together seamlessly to enhance learning outcomes and encourage innovation.
                        </p>
                    </motion.div>

                    {/* Feature 2: Industry-Driven Projects */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-300 cursor-pointer hover:shadow-2xl  transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <Lightbulb className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Industry-Driven Projects</h3>
                        <p className="text-gray-600">
                            Industry experts submit real-world project ideas, reviewed by educators to ensure academic relevance and alignment with industry needs.
                        </p>
                    </motion.div>

                    {/* Feature 3: Quality Assurance */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-300 cursor-pointer hover:shadow-2xl  transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <CheckCircle2 className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assurance</h3>
                        <p className="text-gray-600">
                            Rigorous review process ensures projects meet academic standards and provide valuable learning experiences for students.
                        </p>
                    </motion.div>

                    {/* Feature 4: Real-World Experience */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-300 cursor-pointer hover:shadow-2xl  transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <Briefcase className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Real-World Experience</h3>
                        <p className="text-gray-600">
                            Students gain hands-on experience with industry-vetted projects, preparing them for professional challenges.
                        </p>
                    </motion.div>

                    {/* Feature 5: Seamless Project Management */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-300 cursor-pointer hover:shadow-2xl  transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <ListChecks className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Project Management</h3>
                        <p className="text-gray-600">
                            Tools for tracking progress, facilitating communication, and ensuring timely completion for all stakeholders.
                        </p>
                    </motion.div>

                    {/* Feature 6: Mentorship and Guidance */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg border-2 border-gray-300 cursor-pointer hover:shadow-2xl  transition-shadow p-8 flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="bg-gray-100 p-4 rounded-full mb-6">
                            <GraduationCap className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Mentorship and Guidance</h3>
                        <p className="text-gray-600">
                            Students receive mentorship from industry professionals and educators to help them succeed.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Section 3: Why Choose Collaborative Edge? */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Why Choose <span className="">Collaborative Edge</span>?
                        </h2>
                        <p className="text-lg text-gray-900 max-w-3xl mx-auto">
                            A platform designed to benefit all stakeholders in the FYP ecosystem.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* For Students */}
                        <motion.div
                            className="bg-gradient-to-br from-gray-900 to-gray-600 text-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold flex items-center gap-4 mb-4">
                                <span className="bg-gray-700 p-3 rounded-full">
                                    <Users className="w-6 h-6 text-gray-300" />
                                </span>
                                For Students
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                Collaborative Edge empowers students to take charge of their Final Year Projects by providing access to industry-approved ideas, mentorship, and tools for success. Gain real-world experience, develop practical skills, and build a strong foundation for your career.
                            </p>
                        </motion.div>

                        {/* For Educators & Industry */}
                        <motion.div
                            className="bg-gradient-to-br from-gray-900 to-gray-600 text-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transition-all"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold flex items-center gap-4 mb-4">
                                <span className="bg-gray-700 p-3 rounded-full">
                                    <Briefcase className="w-6 h-6 text-gray-300" />
                                </span>
                                For Educators & Industry
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                Educators and industry professionals can collaborate effectively through Collaborative Edge, ensuring that projects are academically rigorous and industry-relevant. Contribute to the development of future talent while staying connected with the academic community.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AboutUs;