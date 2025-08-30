"use client";

import React, { useEffect } from "react";
import { GoogleTranslateManager } from "./googleTranslate";

interface GoogleTranslateProviderProps {
	children: React.ReactNode;
}

export const GoogleTranslateProvider: React.FC<
	GoogleTranslateProviderProps
> = ({ children }) => {
	useEffect(() => {
		// Initialize Google Translate when component mounts
		if (typeof window !== "undefined") {
			const manager = GoogleTranslateManager.getInstance();
			manager.initialize().catch((error) => {
				console.error("Failed to initialize Google Translate:", error);
			});
		}
	}, []);

	return <>{children}</>;
};
