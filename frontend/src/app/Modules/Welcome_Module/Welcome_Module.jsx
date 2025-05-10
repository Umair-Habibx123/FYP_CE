import Navbar from "./components/Navbar/navbar"
import Footer from "./components/Footer/Footer"
import { Outlet } from "react-router-dom"
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Welcome_Module = () => {

    const ScrollToTop = () => {
        const { pathname } = useLocation();

        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname]);

        return null;
    };

    return (
        <>
            <Navbar />
            <ScrollToTop />
            <Outlet />
            <Footer />
        </>
    )
}

export default Welcome_Module;
