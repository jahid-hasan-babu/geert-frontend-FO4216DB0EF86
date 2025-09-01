"use client";

import React, { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Globe, Loader2 } from "lucide-react";
import { useGoogleTranslate } from "./useGoogleTranslate";

interface LanguageOption {
	code: string;
	name: string;
	nativeName: string;
}

const LANGUAGES: LanguageOption[] = [
	{ code: "en", name: "English", nativeName: "English" },
	{ code: "nl", name: "Dutch", nativeName: "Dutch" },
];

export const LanguageSwitcher: React.FC = () => {
	const { currentLanguage, translateTo, isReady } = useGoogleTranslate();
	const [isChanging, setIsChanging] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLanguageChange = async (newLanguage: string) => {
		if (newLanguage === currentLanguage || isChanging) {
			return;
		}

		setIsChanging(true);

		try {
			translateTo(newLanguage);
			// The page will reload, so we don't need to reset isChanging
		} catch (error) {
			console.error("Error changing language:", error);
			setIsChanging(false);
		}
	};

	// Show loading state until mounted and ready
	if (!mounted || !isReady) {
		return (
			<div className="flex items-center gap-2 opacity-50">
				<Globe className="h-4 w-4 text-muted-foreground" />
				<div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Globe className="h-4 w-4 text-muted-foreground" />
			<Select
				value={currentLanguage}
				onValueChange={handleLanguageChange}
				disabled={isChanging}
			>
				<SelectTrigger className="w-[180px]">
					{isChanging ? (
						<div className="flex items-center gap-2">
							<Loader2 className="h-3 w-3 animate-spin" />
							<span className="text-sm">Changing...</span>
						</div>
					) : (
						<SelectValue placeholder="Select language" />
					)}
				</SelectTrigger>
				<SelectContent>
					{LANGUAGES.map((language) => (
						<SelectItem key={language.code} value={language.code}>
							<div className="flex items-center justify-between w-full">
								<span>{language.name}</span>
								<span className="text-xs text-muted-foreground ml-2">
									{language.nativeName}
								</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
