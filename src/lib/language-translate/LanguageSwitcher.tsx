"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslate } from "@/hooks/useTranslate";
import { useState, useEffect } from "react";

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("nl");
  const { translateBatch } = useTranslate();

  useEffect(() => {
      localStorage.setItem("selectedLanguage", "nl");
    const storedLang = localStorage.getItem("selectedLanguage");
    if (storedLang) setSelectedLanguage(storedLang);
  }, []);

  const handleChange = async (newLang: string) => {
    setSelectedLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);

    const elements = document.querySelectorAll("[data-translate]");
    const texts = Array.from(elements).map((el) => {
      const original = el.getAttribute("data-original") || el.textContent || "";
      if (!el.getAttribute("data-original")) el.setAttribute("data-original", original);
      return original;
    });

    if (texts.length > 0) {
      const translated = await translateBatch(texts, newLang);
      Array.from(elements).forEach((el, i) => {
        el.textContent = translated[i];
      });
    }
  };

  return (
    <Select onValueChange={handleChange} value={selectedLanguage}>
      <SelectTrigger className="w-auto rounded-full !border-none font-bold text-black/70 ">
        <SelectValue>
          {{
            en: "English",
            nl: "Dutch",
          }[selectedLanguage] || "Select a language"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="nl">Dutch</SelectItem>
      </SelectContent>
    </Select>
  );
}


export function TranslateInitializer() {
  const { translateBatch } = useTranslate();

  useEffect(() => {
    const lang = localStorage.getItem("selectedLanguage") || "en";
    if (lang === "en") return; // default, no need to translate

    const elements = document.querySelectorAll("[data-translate]");
    const texts = Array.from(elements).map((el) => {
      const original = el.getAttribute("data-original") || el.textContent || "";
      if (!el.getAttribute("data-original")) el.setAttribute("data-original", original);
      return original;
    });

    if (texts.length > 0) {
      translateBatch(texts, lang).then((translated) => {
        Array.from(elements).forEach((el, i) => {
          el.textContent = translated[i];
        });
      });
    }
  }, [translateBatch]);

  return null;
}