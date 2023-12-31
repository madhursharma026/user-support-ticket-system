import { useEffect } from "react";
import { useRouter } from 'next/router';
import Footer from "./components/Footer";
import HeaderNav from "./components/Header";
import SupportModule from "./components/Support/SupportModule";
import ProtectedRoute from "./AuthCheck/ProtectedRoute";

const Home = () => {
    const router = useRouter();
    
    return (
        <>
            <HeaderNav pageName='homePage' />
            <SupportModule />
            <Footer />
        </>
    )
}

export default ProtectedRoute(Home);

