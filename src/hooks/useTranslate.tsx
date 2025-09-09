"use client";
import { useState } from "react";

const cache: Record<string, Record<string, string>> = {}; 

export function useTranslate() {
  const [loading, setLoading] = useState(false);

  const translateBatch = async (texts: string[], target: string) => {
    setLoading(true);
    try {
      // load from localStorage if exists
      if (!cache[target]) {
        const stored = localStorage.getItem(`translations_${target}`);
        cache[target] = stored ? JSON.parse(stored) : {};
      }

      const textsToTranslate = texts.filter(
        (text) => !(cache[target] && cache[target][text])
      );

      let translations: string[] = [];

      if (textsToTranslate.length > 0) {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: textsToTranslate, target }),
        });
        const data = await res.json();
        translations = data.translations;

        // store in cache and localStorage
        textsToTranslate.forEach((text, i) => {
          cache[target][text] = translations[i];
        });
        localStorage.setItem(`translations_${target}`, JSON.stringify(cache[target]));
      }

      // return translations from cache
      return texts.map((text) => cache[target][text] || text);
    } catch (e) {
      console.error(e);
      return texts;
    } finally {
      setLoading(false);
    }
  };

  return { translateBatch, loading };
}