import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../auth/AuthContext";
import Loading from "../../../../Components/loadingIndicator/loading";
import axios from "axios";

const IndustryPrivacyPolicy = ({ theme }) => {
    const { user, isAuthLoading } = useAuth();
    const [policy, setPolicy] = useState(null);

    useEffect(() => {
        if (user) {
            axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/get-privacy-policy`, {
                params: { role: user.role }
            })
                .then(response => setPolicy(response.data))
                .catch(error => console.error("Error fetching privacy policy:", error));
        }
    }, [user]);

    if (isAuthLoading || !policy) {
        return (
            <Loading />
        );
    }

    return (
        <div className={`rounded-2xl min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
            <div className="max-w-4xl sm:max-w-[80%] mx-auto">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <p className="text-sm mb-6">Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}</p>

                {policy.sections.map((section, index) => (
                    <section key={index} className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                        <p className="mb-4">{section.content}</p>
                        {section.listItems.length > 0 && (
                            <ul className="list-disc pl-8 mb-4">
                                {section.listItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

IndustryPrivacyPolicy.propTypes = {
    theme: PropTypes.string.isRequired,
};

export default IndustryPrivacyPolicy;