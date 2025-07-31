import { createContext, ReactNode, useState } from 'react';

type PageContextType = {
  activePage: string | undefined;
  setActivePage: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const PageContext = createContext<PageContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const PageProvider = ({ children }: Props) => {
  const [activePage, setActivePage] = useState<string | undefined>(undefined);

  return (
    <PageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </PageContext.Provider>
  );
};


