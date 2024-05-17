import React, {useRef} from 'react';
import {Link} from 'react-router-dom';
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {useNavigate} from 'react-router-dom';

const topmenuClass = `
    
    .burger-menu {
        display: none;
        align-items: center;
        width: 100%;
        justify-content: flex-start;
        padding: 0 5px;
    }
    
    .top-menu {
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
        transition: all 0.3s;
        background-color: rgba(35,40,60, .8);
        backdrop-filter: blur(5px);
        height: var(--top-menu-height);
    }
    
     
    @media only screen and (max-width: 568px) {
        .top-menu > .top-menu-items {
            display: none;
        }
        
        .top-menu {
            height: 70px;
        }
        
        .top-menu > .burger-menu {
            display: flex;
           
        }
    }

    .active-link {
        color: #06b6d4 !important;
    }
    
    .page-link {
        margin: 0 10px;
        padding: 15px 10px;
        color: #f1f1f1;
        font-weight: 600;
        cursor: pointer;
        transition: all .3s;
        border-bottom: 3px solid transparent;
        &:hover {
            border-bottom: 3px solid #06b6d4;
            color: #06b6d4;
        }
    }
   
`

const TopMenu = () => {
    const menuRef = useRef();
    const navigate = useNavigate()

    let items = [
        {
            label: 'Главная',
            command: () => navigate('/')
        },
        {
            label: 'Лента обращений',
            command: () => navigate('/incidents/')
        },
        {
            label: 'Карта обращений',
            command: () => navigate('/map')
        }
    ];

    return (
        <>
            <style>{topmenuClass}</style>
            <div className={"top-menu"}>
                <div className={"burger-menu"}>
                    <Button pt={{root: {style: {height: "55px", width: "55px"}}}} icon={"pi pi-bars"} aria-controls="popup_menu_right" aria-haspopup onClick={(e) => menuRef.current.toggle(e)}/>
                    <Menu popup model={items} ref={menuRef} style={{fontSize: ".9rem"}}/>
                    <div style={{margin: "0 10px", width: "200px"}}>
                        <span style={{color: "#fff", fontWeight: "600"}}>Карта проблем Ленинского района</span>
                    </div>
                </div>
                <div className={"top-menu-items d-flex"}>
                    <Link to="/">
                        <div className={`page-link ${window.location.pathname === '/' ? "active-link" : null}`}>
                            <span>Главная</span>
                        </div>
                    </Link>

                    <Link to="/incidents">
                        <div className={`page-link ${window.location.pathname === '/incidents' ? "active-link" : null}`}>
                            <span>Лента обращений</span>
                        </div>
                    </Link>

                    <Link to="/map">
                        <div className={`page-link ${window.location.pathname === '/map' ? "active-link" : null}`}>
                            <span>Карта обращений</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default TopMenu;