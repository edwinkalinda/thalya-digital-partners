
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AIAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'coming_soon';
  personality?: string;
  voice?: string;
  calls?: number;
  satisfaction?: number;
}

interface AppState {
  user: User | null;
  agents: AIAgent[];
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
  }>;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_AGENT'; payload: AIAgent }
  | { type: 'UPDATE_AGENT'; payload: { id: string; updates: Partial<AIAgent> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: { type: 'success' | 'error' | 'info'; message: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  agents: [
    {
      id: '1',
      name: 'Clara',
      type: 'Réceptionniste',
      status: 'active',
      personality: 'Professionnelle et amicale',
      voice: 'Française naturelle',
      calls: 127,
      satisfaction: 4.8
    }
  ],
  isLoading: false,
  notifications: []
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'LOGOUT':
      return { ...state, user: null };
    
    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] };
    
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map(agent =>
          agent.id === action.payload.id
            ? { ...agent, ...action.payload.updates }
            : agent
        )
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            type: action.payload.type,
            message: action.payload.message,
            timestamp: Date.now()
          }
        ]
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for common actions
export const useAuth = () => {
  const { state, dispatch } = useAppContext();
  
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  return {
    user: state.user,
    isAuthenticated: !!state.user,
    login,
    logout
  };
};

export const useAgents = () => {
  const { state, dispatch } = useAppContext();
  
  const addAgent = (agent: Omit<AIAgent, 'id'>) => {
    const newAgent = { ...agent, id: Date.now().toString() };
    dispatch({ type: 'ADD_AGENT', payload: newAgent });
  };
  
  const updateAgent = (id: string, updates: Partial<AIAgent>) => {
    dispatch({ type: 'UPDATE_AGENT', payload: { id, updates } });
  };
  
  return {
    agents: state.agents,
    addAgent,
    updateAgent
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useAppContext();
  
  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { type, message } });
  };
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };
  
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification
  };
};
