import React, {createContext, ReactNode, useContext, useState} from 'react';
import {NotificationItem, Workspace} from '@/types/Board';

interface StateContextProps {
    stateLinkedEmails: string[];
    setStateLinkedEmails: React.Dispatch<React.SetStateAction<string[]>>;
    stateWorkspacesByEmail: Record<string, Workspace[]>;
    setStateWorkspacesByEmail: React.Dispatch<React.SetStateAction<Record<string, Workspace[]>>>;
    stateNotifications: NotificationItem[];
    setStateNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
    stateUserEmails: { email: string, id: number, status: string }[];
    setStateUserEmails: React.Dispatch<React.SetStateAction<{ email: string; id: number, status: string }[]>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({children}: { children: ReactNode }) => {
    const [stateLinkedEmails, setStateLinkedEmails] = useState<string[]>([]);
    const [stateWorkspacesByEmail, setStateWorkspacesByEmail] = useState<Record<string, Workspace[]>>({});
    const [stateNotifications, setStateNotifications] = useState<NotificationItem[]>([]);
    const [stateUserEmails, setStateUserEmails] = useState<{ email: string; id: number, status: string }[]>([]);

    return (
        <StateContext.Provider value={{
            stateLinkedEmails,
            setStateLinkedEmails,
            stateWorkspacesByEmail,
            setStateWorkspacesByEmail,
            stateNotifications,
            setStateNotifications,
            stateUserEmails,
            setStateUserEmails
        }}>
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