/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class GoogleTranslateManager {
  private static instance: GoogleTranslateManager;
  private isInitialized = false;
  private isLoading = false;
  private currentLanguage = "nl"; // Default language set to Dutch
  private observers: Set<(lang: string) => void> = new Set();

  private constructor() {}

  static getInstance(): GoogleTranslateManager {
    if (!GoogleTranslateManager.instance) {
      GoogleTranslateManager.instance = new GoogleTranslateManager();
    }
    return GoogleTranslateManager.instance;
  }

  // Subscribe to language changes
  subscribe(callback: (lang: string) => void) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  private notifyObservers() {
    this.observers.forEach((callback) => callback(this.currentLanguage));
  }

  // Initialize Google Translate
  async initialize(): Promise<void> {
    if (this.isInitialized || this.isLoading) return;

    this.isLoading = true;

    try {
      // Add styles to hide Google Translate UI
      this.addStyles();

      // Set Dutch cookie before script loads
      if (
        !localStorage.getItem("preferred-language") &&
        !this.getCookie("googtrans")
      ) {
        this.setTranslationCookie("nl");
        this.currentLanguage = "nl";
      }

      // Load Google Translate script
      await this.loadScript();

      // Initialize translation element
      this.initializeTranslateElement();

      // Update current language from cookie/localStorage
      this.currentLanguage = this.getCurrentLanguageFromCookie();

      this.isInitialized = true;
      this.notifyObservers();
    } catch (error) {
      console.error("Failed to initialize Google Translate:", error);
    } finally {
      this.isLoading = false;
    }
  }

  private addStyles(): void {
    const styleId = "google-translate-override-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .goog-te-banner-frame,
      .goog-te-ftab,
      .goog-te-balloon-frame, 
      .goog-te-menu-frame,
      .skiptranslate,
      #goog-gt-tt,
      .goog-tooltip,
      .goog-te-spinner-pos,
      .goog-te-gadget,
      .goog-te-combo,
      #google_translate_element,
      #google_translate_element *,
      .goog-te-gadget > span,
      .goog-te-gadget > span > a,
      .goog-te-gadget .goog-te-combo,
      iframe[src*="translate.googleapis.com"],
      iframe[src*="translate.google.com"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        z-index: -99999 !important;
        pointer-events: none !important;
      }
      body { top: 0 !important; position: static !important; }
      body[style*="top"] { top: 0 !important; }
      .goog-te-banner-frame.skiptranslate { display: none !important; }
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById("google-translate-script")) {
        resolve();
        return;
      }

      this.createIsolatedContainer();

      (window as any).googleTranslateElementInit = () => {
        try {
          this.initializeTranslateElement();
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = () =>
        reject(new Error("Failed to load Google Translate script"));

      document.body.appendChild(script);
    });
  }

  private createIsolatedContainer(): void {
    const existing = document.getElementById(
      "google-translate-isolated-container"
    );
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = "google-translate-isolated-container";
    container.style.cssText = `
      position: absolute !important;
      left: -99999px !important;
      top: -99999px !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      visibility: hidden !important;
      display: none !important;
    `;

    const element = document.createElement("div");
    element.id = "google_translate_element";
    container.appendChild(element);
    document.body.appendChild(container);
  }

  private initializeTranslateElement(): void {
    try {
      const google = (window as any).google;
      if (!google?.translate?.TranslateElement)
        throw new Error("Google Translate not available");

      new google.translate.TranslateElement(
        {
          pageLanguage: "nl", // Default source language
          includedLanguages: "en,fr,es,de,ar,pt,hi,bn,nl",
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );

      setTimeout(() => this.hideAllGoogleElements(), 100);
    } catch (error) {
      console.error("Error initializing translate element:", error);
    }
  }

  private hideAllGoogleElements(): void {
    const selectors = [
      ".goog-te-banner-frame",
      ".goog-te-ftab",
      ".goog-te-balloon-frame",
      'iframe[src*="translate.googleapis.com"]',
      ".skiptranslate",
    ];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        const element = el as HTMLElement;
        element.style.cssText = `
          display: none !important;
          visibility: hidden !important;
          position: absolute !important;
          left: -99999px !important;
        `;
      });
    });
  }

  private setTranslationCookie(languageCode: string) {
    const cookieValue = `/nl/${languageCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000`;
    if (window.location.hostname !== "localhost") {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname}; max-age=31536000`;
    }
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Translate to a specific language
  translateTo(languageCode: string): boolean {
    try {
      if (languageCode === this.currentLanguage) {
        // Force reset if nl
        if (languageCode === "nl") {
          this.setTranslationCookie("nl");
          window.location.reload();
        }
        return true;
      }

      this.clearTranslateCookies();

      // Always set the cookie correctly
      this.setTranslationCookie(languageCode);

      this.currentLanguage = languageCode;
      localStorage.setItem("preferred-language", languageCode);
      this.notifyObservers();

      // Reload to apply translation
      setTimeout(() => window.location.reload(), 100);
      return true;
    } catch (error) {
      console.error("Error translating:", error);
      return false;
    }
  }

  private clearTranslateCookies(): void {
    const cookies = ["googtrans", "googtrans=/en/en"];
    cookies.forEach((cookie) => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      if (window.location.hostname !== "localhost") {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }
    });
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  private getCurrentLanguageFromCookie(): string {
    try {
      const stored = localStorage.getItem("preferred-language");
      if (stored) return stored;

      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "googtrans" && value) {
          const match = value.match(/\/nl\/(.+)/); // Source = nl
          if (match && match[1]) return match[1];
        }
      }
      return "nl";
    } catch {
      return "nl";
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}
