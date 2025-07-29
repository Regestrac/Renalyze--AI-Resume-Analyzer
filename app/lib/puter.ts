import { create } from "zustand";

declare global {
  interface Window {
    puter: {

    }
  }
};

type PuterStoreType = {
  isLoading: boolean;
  puterReady: boolean;
  error: string | null;
  init: () => void;
};

const getPuter = (): typeof window.puter | null => (
  typeof window !== 'undefined' && window.puter ? window.puter : null
);

export const usePuterStore = create<PuterStoreType>((set, get) => {
  const setError = (message: string) => {
    set({
      error: message,
      isLoading: false,
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return false;
    }

    set({ isLoading: true, error: null })

    try {

      return true;
    } catch {
      return false;
    }
  }

  const init = () => {
    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100)

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) {
        setError("Puter.js failed to load within 10 seconds")
      }
    }, 10000)
  }

  return {
    isLoading: true,
    puterReady: false,
    error: null,
    init,
  }
})