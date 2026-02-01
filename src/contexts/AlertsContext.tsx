import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Alert {
  id: number;
  type: string;
  location: string;
  time: string;
  severity: "high" | "medium" | "low";
}

const defaultAlerts: Alert[] = [
  {
    id: 1,
    type: "Contaminated Milk",
    location: "Central Market, Sector 7",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: 2,
    type: "Fake Turmeric",
    location: "Spice Bazaar, Old Town",
    time: "5 hours ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "Unsafe Street Food",
    location: "Railway Station Area",
    time: "1 day ago",
    severity: "high",
  },
  {
    id: 4,
    type: "Adulterated Honey",
    location: "Super Mart, Green Park",
    time: "2 days ago",
    severity: "low",
  },
  {
    id: 5,
    type: "Synthetic Colors in Sweets",
    location: "Festival Market, Main Road",
    time: "3 days ago",
    severity: "medium",
  },
];

interface AlertsContextType {
  alerts: Alert[];
  addAlert: (type: string, location: string) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

const STORAGE_KEY = "pureplate_user_alerts";

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [userAlerts, setUserAlerts] = useState<Alert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userAlerts));
  }, [userAlerts]);

  const addAlert = (type: string, location: string) => {
    const newAlert: Alert = {
      id: Date.now(),
      type,
      location,
      time: "Just now",
      severity: "medium",
    };
    setUserAlerts((prev) => [newAlert, ...prev]);
  };

  // Combine user alerts (at top) with default alerts
  const alerts = [...userAlerts, ...defaultAlerts];

  return (
    <AlertsContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertsProvider");
  }
  return context;
};
