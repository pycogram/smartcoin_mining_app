import { createContext, ReactNode, useEffect, useState } from "react";

type MenuContextType = {
    menuClick: boolean,
    setMenuClick: React.Dispatch<React.SetStateAction<boolean>>
}
export const MenuContext = createContext<MenuContextType | undefined>(undefined);

type MenuProviderType = {
    children: ReactNode
}
const MenuProvider = ({ children } : MenuProviderType) => {
    const [menuClick, setMenuClick] = useState<boolean>(false);
    useEffect(() => {
        const updateMenuState = () => {
            if(window.innerWidth >= 768){
                setMenuClick(true) // show menu on tablet and desktop
            }else{
                setMenuClick(false); // hide menu initially on mobile
            };
        };
        updateMenuState(); // check on load
        window.addEventListener("resize", updateMenuState);
        return () => window.removeEventListener("resize", updateMenuState);
    }, []);
    return(
        <MenuContext.Provider value={{menuClick, setMenuClick}}>
            {children}
        </MenuContext.Provider>
    )
}
export default MenuProvider;