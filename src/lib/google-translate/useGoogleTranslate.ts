"use client";

import { useState, useEffect } from "react";
import { GoogleTranslateManager } from "./googleTranslate";

export const useGoogleTranslate = () => {
  const [currentLanguage, setCurrentLanguage] = useState("nl");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const manager = GoogleTranslateManager.getInstance();

    const unsubscribe = manager.subscribe((lang) => {
      setCurrentLanguage(lang);
    });

    const initializeManager = async () => {
      setIsLoading(true);
      try {
        await manager.initialize();

        // Automatically translate to Netherlands if first load
        if (!localStorage.getItem("preferred-language") && manager.getCurrentLanguage() !== "nl") {
          manager.translateTo("nl");
        }

        setCurrentLanguage(manager.getCurrentLanguage());
        setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Google Translate:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      initializeManager();
    }

    return () => { unsubscribe(); };
  }, []);

  const translateTo = (languageCode: string) => {
    const manager = GoogleTranslateManager.getInstance();
    return manager.translateTo(languageCode);
  };

  return {
    currentLanguage,
    translateTo,
    isReady,
    isLoading,
  };
};
