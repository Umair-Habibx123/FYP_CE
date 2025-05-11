import { Link } from "react-router-dom";
import { Facebook, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-950 text-gray-400 pt-16 pb-8 px-6 sm:px-12 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="flex justify-center w-full">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 max-w-6xl px-4 w-full"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, staggerChildren: 0.2 }}
                    >
                        {/* Logo and Description */}
                        <motion.div className="flex flex-col items-center md:items-start">
                            <Link to="/" className="flex items-center mb-6">
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                                    COLLABORATE<span className="text-blue-500">EDGE</span>
                                </h2>
                            </Link>
                            <p className="text-gray-500 leading-relaxed text-center md:text-left">
                                Bridging the gap between academia and industry through innovative project collaboration.
                            </p>
                            <div className="flex space-x-4 mt-4">
                                {[
                                    { icon: <Facebook size={22} />, url: "https://facebook.com" },
                                    { icon: <Twitter size={22} />, url: "https://twitter.com" },
                                    { icon: <Linkedin size={22} />, url: "https://linkedin.com" }
                                ].map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {social.icon}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div className="flex flex-col items-center md:items-start">
                            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-3">
                                {["About Us", "How It Works", "Project Ideas"].map((name, index) => (
                                    <motion.li key={index} whileHover={{ x: 5 }}>
                                        <Link
                                            to={`/${name.toLowerCase().replace(/ /g, '-')}`}
                                            className="text-gray-500 hover:text-blue-500 transition-colors flex items-center"
                                        >
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                            {name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div className="flex flex-col items-center md:items-start">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: <MapPin size={20} className="text-blue-500" />, text: "123 Street, Islamabad, Pakistan" },
                                    { icon: <Mail size={20} className="text-blue-500" />, text: "collaborateedgeofficials@gmail.com" },
                                    { icon: <Phone size={20} className="text-blue-500" />, text: "+92 (234) 567-1234" }
                                ].map((contact, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        {contact.icon}
                                        <span>{contact.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-8"></div>

                {/* Copyright and Legal */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-center pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Collaborate Edge. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {["Privacy Policy", "Terms and Conditions", "Contact US"].map((name, index) => (
                            <motion.div key={index} whileHover={{ scale: 1.05 }}>
                                <Link to={`/${name.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 hover:text-blue-500 text-sm transition-colors">
                                    {name}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer >
    );
};

export default Footer;