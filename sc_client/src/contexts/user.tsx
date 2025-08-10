import { createContext, ReactNode, useEffect, useState } from "react";
import { detailUser } from "../controllers/dashboard";

type UserType = {
    _id: string,
    first_name: string,
    last_name: string,
    user_name: string,
    email: string,
    pdp_url: string
}

type UserContextType = {
  user: UserType | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserType | undefined>>;
};

export const UserContext = createContext<UserContextType | null>(null);

type userProviderProps = {
    children: ReactNode
}

export const UserProvider = ({children} : userProviderProps) => {
  
    const [user, setUser] = useState<UserType | undefined>(undefined);

    useEffect(() => {
        setTimeout( async () => {
            try {
                const {data} = await detailUser();
                setUser(data);
            } catch(err){
                console.log((err as Error).message);
            } 
        }, 0);
    }, []);
    
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )

}