import React, { createContext, useContext, useState, useEffect, use } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, Theme, ColorBlindType } from "../constants/theme";
import { COLORBLIND_PALETTES } from "../constants/theme";
import { CATEGORY_COLORS, TransactionCategory } from "../types/transactions";
import settings from "../app/(tabs)/settings";

const SETTINGS_KEY = "money_manager_settings";

interface Settings {
    darkMode: boolean;
    colorBlindType: ColorBlindType | null;
}

interface SettingsContextType {
    settings: Settings;
    theme: Theme;
    toggleDarkMode: () => void;
    setColorBlindType: (type: ColorBlindType | null) => void;
    categoryColors: Record<TransactionCategory, string>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();

    const [settings, setSettings] = useState<Settings>({
        darkMode: systemScheme === "dark",
        colorBlindType: null,
    });

    const [isLoading, setIsLoading] = useState(true);

    /* LOAD / SAVE SETTINGS */

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const stored = await AsyncStorage.getItem(SETTINGS_KEY);
                if (stored !== null) {
                    setSettings(JSON.parse(stored));
                }
            }catch (error) {
                console.error("Error loading settings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    useEffect(() => {
        if (isLoading) return;
        const saveSettings = async () => {
            try {
                await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            } catch (error) {
                console.error("Error saving settings:", error);
            }
        };
        saveSettings();
    }, [settings]);

    const toggleDarkMode = () => {
        setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
    };

    const setColorBlindType = (type: ColorBlindType | null) => {
        setSettings((prev) => ({ ...prev, colorBlindType: type }));
    };

    const theme = settings.darkMode ? darkTheme : lightTheme;

    const categoryColors = settings.colorBlindType
        ? COLORBLIND_PALETTES[settings.colorBlindType]
        : CATEGORY_COLORS;

    return (
        <SettingsContext.Provider value={{ settings, theme, toggleDarkMode, setColorBlindType, categoryColors }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}