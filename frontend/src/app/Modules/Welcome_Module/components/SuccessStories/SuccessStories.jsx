import { motion } from "framer-motion";
import { Lightbulb, ClipboardCheck, Users, Award, Star } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import image1 from "../../../../../assets/images/seven.webp";
import image2 from "../../../../../assets/images/eight.webp";
import image3 from "../../../../../assets/images/nine.webp";
import Loading from "../../../../Components/loadingIndicator/loading";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/success-stories`);
        setStories(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching success stories:", error);
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const getRandomImage = () => {
    const images = [image1, image2, image3];
    return images[Math.floor(Math.random() * images.length)];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success <span className="text-gray-600">Stories</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Discover how students, educators, and industry professionals collaborate to create impactful Final Year Projects. These success stories showcase the power of our platform in bridging academia and industry.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Celebrating Academic Excellence
            </h2>
            <p className="text-gray-600">
              Each project represents months of dedication, collaboration, and innovation. See how our platform helps turn ideas into reality with real-world impact.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Success Stories Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured <span className="text-gray-600">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through our collection of successfully completed projects
            </p>
          </motion.div>

          {stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No success stories available yet.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {stories.map((story, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getRandomImage()}
                      alt={story.project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center bg-white/90 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-800">
                          {story.reviews.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{story.project.title}</h3>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {story.project.projectType}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {story.project.description}
                    </p>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex -space-x-2">
                          {story.studentGroup.members.map((member, i) => (
                            <div key={i} className="relative">
                              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                {member.profilePic ? (
                                  <img
                                    src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}${member.profilePic}`}
                                    alt={member.name.charAt(0).toUpperCase()}
                                    className="w-full h-full object-cover"
                                  />

                                ) : (
                                  <span className="text-xs text-gray-600">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Team</p>
                          <p className="text-sm font-medium text-gray-700">
                            {story.studentGroup.members.map(m => m.name).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Supervisor</p>
                          <p className="font-medium text-gray-700">{story.supervisor.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Completed</p>
                          <p className="font-medium text-gray-700">
                            {formatDate(story.studentGroup.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-gray-600">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our simple process for creating successful collaborations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Ideas</h3>
              <p className="text-gray-600">
                Industry professionals propose project ideas with clear objectives and expected outcomes.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Review & Approval</h3>
              <p className="text-gray-600">
                Teachers evaluate proposals for academic value and feasibility before approval.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="bg-gray-50 p-6 rounded-xl border border-gray-200"
            >
              <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Students work with peers and mentors to bring projects to successful completion.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      {stories.length > 0 && (
        <div className="bg-gradient-to-br from-gray-200 to-white py-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What <span className="text-gray-600">They Say</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Feedback from our academic and industry partners
              </p>
            </motion.div>

            <div className="relative">
              {/* Carousel container */}
              <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 -mx-4 px-4 hide-scrollbar">
                {/* Teacher Review Card */}
                {stories[0].reviews.teacherReview && (
                  <div className="flex-shrink-0 w-full md:w-1/2 px-4 snap-start">
                    <motion.div
                      className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center mb-6">
                        <div className="flex items-center mr-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(stories[0].reviews.teacherReview.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {formatDate(stories[0].reviews.teacherReview.reviewedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-lg italic mb-6">
                        "{stories[0].reviews.teacherReview.comments}"
                      </p>
                      <div className="flex items-center">
                        <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <span className="text-gray-600 font-medium">
                            {stories[0].reviews.teacherReview.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{stories[0].reviews.teacherReview.fullName}</p>
                          <p className="text-sm text-gray-600">Supervisor, {stories[0].supervisor.university}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Industry Review Card */}
                {stories[0].reviews.industryReview && (
                  <div className="flex-shrink-0 w-full md:w-1/2 px-4 snap-start">
                    <motion.div
                      className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center mb-6">
                        <div className="flex items-center mr-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(stories[0].reviews.industryReview.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {formatDate(stories[0].reviews.industryReview.reviewedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-lg italic mb-6">
                        "{stories[0].reviews.industryReview.comments}"
                      </p>
                      <div className="flex items-center">
                        <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <span className="text-gray-600 font-medium">
                            {stories[0].reviews.industryReview.fullName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{stories[0].reviews.industryReview.fullName}</p>
                          <p className="text-sm text-gray-600">{stories[0].project.industry.designation}, {stories[0].project.industry.name}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Carousel Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {stories[0].reviews.teacherReview && (
                  <button
                    className="w-3 h-3 rounded-full bg-gray-200 hover:text-gray-600 transition-colors"
                    aria-label="Go to teacher review"
                  />
                )}
                {stories[0].reviews.industryReview && (
                  <button
                    className="w-3 h-3 rounded-full bg-gray-200 hover:text-gray-600 transition-colors"
                    aria-label="Go to industry review"
                  />
                )}
              </div>
            </div>
          </div>

          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default SuccessStories;