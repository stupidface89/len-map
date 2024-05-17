import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';

import './styles/index.css';
import TopMenu from './components/TopMenu/TopMenu';
import MainPage from './pages/MainPage';
import IncidentsMap from './pages/MapIncidentsPage/MapIncidentsPage';
import IncidentPage from "./pages/IncidentPage/IncidentPage";
import Bottom from "./components/Bottom/Bottom";


import {
    BrowserRouter,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import ListIncidentsPage from "./pages/IncidentsListPage/IncidentsListPage";

const root = ReactDOM.createRoot(document.getElementById('root'));

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}


root.render(

    // <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={
                    <>
                        <TopMenu/>
                        <MainPage/>
                        <Bottom/>
                    </>
                }/>
                <Route path={'/incidents'} element={
                    <>
                        <ScrollToTop />
                        <TopMenu/>
                        <ListIncidentsPage/>
                        <Bottom/>
                    </>
                }/>
                <Route path={'/map'} element={
                    <>

                        <TopMenu/>
                        <IncidentsMap/>
                    </>
                }/>

                <Route path={'/incidents/:id'} element={
                    <>
                        <ScrollToTop />
                        <TopMenu/>
                        <IncidentPage/>
                        <Bottom/>
                    </>
                }/>
            </Routes>
        </BrowserRouter>
    // </React.StrictMode>
);

