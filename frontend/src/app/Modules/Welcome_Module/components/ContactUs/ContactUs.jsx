import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const contactDetails = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description:
        "For any inquiries, support, or collaboration opportunities, reach out at support@collaborativeedge.com. We typically respond within 24 hours.",
      highlight: "support@collaborativeedge.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description:
        "Speak with our support team at (123) 456-7890, Monday to Friday from 9 AM to 5 PM.",
      highlight: "(123) 456-7890",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description:
        "123 Collaborative Edge Lane, Education City, EC 12345. Schedule a visit to meet our team.",
      highlight: "123 Collaborative Edge Lane",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Success - show toast/notification
      toast.success("Message sent successfully! We will get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <ToastContainer />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch with{" "}
            <span className="text-gray-600">CollaborativeEdge</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about FYPs, partnerships, or support? Reach out via
            form, email, phone, or visit our office.
          </p>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <motion.div
            className="lg:w-1/2 "
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="border-2 border-gray-300 h-full bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 ">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {contactDetails.map((item, index) => (
                <motion.div
                  key={index}
                  className="border-2 border-gray-300 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <div className="text-gray-600">{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <p className="text-gray-600 font-medium">
                        {item.highlight}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
