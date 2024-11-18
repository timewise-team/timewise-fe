import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Workspace } from '@/types/Board';

interface StateContextProps {
  stateLinkedEmails: string[];
  setStateLinkedEmails: React.Dispatch<React.SetStateAction<string[]>>;
  stateWorkspacesByEmail: Record<string, Workspace[]>;
  setStateWorkspacesByEmail: React.Dispatch<React.SetStateAction<Record<string, Workspace[]>>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [stateLinkedEmails, setStateLinkedEmails] = useState<string[]>([]);
  const [stateWorkspacesByEmail, setStateWorkspacesByEmail] = useState<Record<string, Workspace[]>>({});

  return (
    <StateContext.Provider value={{ stateLinkedEmails, setStateLinkedEmails, stateWorkspacesByEmail, setStateWorkspacesByEmail }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};