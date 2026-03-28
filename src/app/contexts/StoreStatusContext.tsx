import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiUrl } from "../lib/api";

interface StoreStatusContextValue {
  storeOpen: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const StoreStatusContext = createContext<StoreStatusContextValue | undefined>(
  undefined
);

export function StoreStatusProvider({ children }: { children: ReactNode }) {
  const [storeOpen, setStoreOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/store/status"));
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStoreOpen(Boolean(data.storeOpen));
    } catch {
      setStoreOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const id = window.setInterval(refetch, 60_000);
    const onFocus = () => {
      refetch();
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [refetch]);

  return (
    <StoreStatusContext.Provider value={{ storeOpen, loading, refetch }}>
      {children}
    </StoreStatusContext.Provider>
  );
}

export function useStoreStatus() {
  const ctx = useContext(StoreStatusContext);
  if (!ctx) {
    throw new Error("useStoreStatus must be used within StoreStatusProvider");
  }
  return ctx;
}
