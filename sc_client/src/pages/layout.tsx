import { Link, Outlet } from "react-router-dom";
import "../css/page_css/layout.css";
import MenuPart from "../components/menu/menu";
import { JSX, useContext, useState } from "react";
import { MenuContext } from "../context/menu-context";
import pdp from "../images/pics/pdp.png";

const Layout = () => {
    const {menuClick, setMenuClick} = useContext(MenuContext)!;
    const [menuFontIcon, setMenuFontIcon] = useState<JSX.Element | null>(null);

    const handleMenuClick = () => {
        
        setMenuClick((prev) => ! prev);
        if(! menuClick){
            setMenuFontIcon(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            );
            return;
        } 
    }
    
    return ( 
        <div className="layout-page">
            <nav className="nav-link">
                <div className="menu-notify">
                    <div onClick={handleMenuClick} className="menubar-open-close">
                        { 
                            menuClick ? menuFontIcon :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="nav-option">
                                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg> 
                        }
                    </div>
                    <Link to={""}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </Link>
                    <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="nav-option">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    </div>
                </div>
                <Link to={""}>
                    <div className="img-pdp">
                        <img src={pdp} alt="profile pic" />
                        <p className="">Ifesinachi .D</p>
                    </div>
                </Link>
            </nav>
            <main className="page-container">
                <div className='MenuWrapper'>
                    { menuClick && <MenuPart /> }
                </div>
                <Outlet />
            </main>
            <footer className="nav-down">

                    <div className="nd-option">
                        <i className="fa-solid fa-comment"></i>
                        <p className="nd-text">chat</p>
                    </div>

                <Link to={""}>
                    <div className="nd-option">
                        <i className="fa-solid fa-lock"></i>
                        <p className="nd-text">lock</p>
                    </div>
                </Link>
                <Link to={""}>
                    <div className="nd-option">
                        <i className="fa-solid fa-coins db-iconx"></i>
                        <p className="nd-text">dashboard</p>
                    </div>
                </Link>
                <Link to={""}>
                    <div className="nd-option">
                        <i className="fa-solid fa-user"></i>
                        <p className="nd-text">profile</p>
                    </div>
                </Link>
                <Link to={""}>
                    <div className="nd-option">
                        <i className="fa-solid fa-gear"></i>
                        <p className="nd-text">setting</p>
                    </div>
                </Link>
            </footer>
        </div>
    );
}
 
export default Layout;