import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../css/page_css/layout.css";
import MenuPart from "../components/menu/menu";
import { JSX, useContext, useEffect, useState } from "react";
import { MenuContext } from "../contexts/menu";
import pdp from "../images/pics/pdp.png";
import { UserContext } from "../contexts/user";
import { PageContext } from "../contexts/active-page";
import DarkModeToggle from "../components/button/toggle-mode";

const Layout = () => {
    
    const {menuClick, setMenuClick} = useContext(MenuContext)!;
    const [menuFontIcon, setMenuFontIcon] = useState<JSX.Element | null>(null);

    const {user} = useContext(UserContext)!;
    const {activePage, setActivePage} = useContext(PageContext)!;

    const location = useLocation();
    useEffect(() => {
        const path = location.pathname.split('/').filter(Boolean).pop();
        setActivePage(path);
    }, [location.pathname, setActivePage]);
        
  
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

    const navigate = useNavigate();
    const handlePage = (pageLink: string) => {
        navigate(`${pageLink}`);
    }

    const [mode, setMode] = useState<boolean>(false);
    useEffect(() => {
        const darkPref = localStorage.getItem("dark-mode");
        if (darkPref === "true") {
            setMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const bgMode = () => {
        console.log(mode);
        setMode(prev => {
            const newMode = !prev;
            localStorage.setItem("dark-mode", String(newMode));
            if (newMode) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newMode;
        });
    };

    if(! user) return (
        <div>
            <i className="fa-solid fa-spinner lazy-page-load-icon"></i>
        </div>
    )

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
                    <Link to={"/history"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="nav-option">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                        </svg>
                    </Link>
                    <div onClick={bgMode}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="nav-option">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    </div>
                    <div>
                        <DarkModeToggle />
                    </div>
                </div>
                <Link to={"/update-profile"}>
                    <div className="img-pdp">
                        <img src={pdp} alt="profile pic" />
                        <p className="">{user.first_name} {user.last_name && '.' + user.last_name.charAt(0).toUpperCase()}</p>
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
                <div onClick={() => handlePage("all-post")} className={activePage ===  "all-post"  ? `nd-option option-active` : "nd-option" }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                    </svg>
                    <p>feeds</p>
                </div>
                <div onClick={() => handlePage("dashboard")} className={activePage ===  "dashboard" ? `nd-option option-active` : "nd-option" }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                    </svg>
                    <p>dashboard</p>
                </div>
                <div onClick={() => handlePage("select-pkg")} className={activePage ===  "select-pkg" ? `nd-option option-active` : "nd-option" }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <p>lock</p>
                </div>
                <div onClick={() => handlePage("setting")} className={activePage ===  "setting" ? `nd-option option-active` : "nd-option" }>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <p>setting</p>
                </div>
            </footer>
        </div>
    );
}
 
export default Layout;