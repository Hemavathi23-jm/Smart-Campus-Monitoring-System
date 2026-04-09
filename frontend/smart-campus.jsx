import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

// ─── i18n Dictionary ───────────────────────────────────────────────────────────
const translations = {
    en: {
        // login
        "auth.title": "SMART CAMPUS AUTHENTICATION",
        "auth.select": "SELECT ROLE",
        "auth.gardener": "🌿 GARDENER",
        "auth.management": "👔 MANAGEMENT",
        "auth.access": "ACCESS CODE",
        "auth.placeholder": "Enter 1234",
        "auth.button": "INITIALIZE SESSION",
        "auth.error": "INVALID PASSCODE. Default is 1234",
        "auth.footer": "AUTHORIZED PERSONNEL ONLY",
        // sidebar
        "sidebar.sys": "ENVIRO",
        "sidebar.subtitle": "CAMPUS SYS v2.1",
        "sidebar.identity": "ACTIVE IDENTITY",
        "sidebar.exit": "EXIT",
        "sidebar.nav.dashboard": "Dashboard",
        "sidebar.nav.map": "Campus Map",
        "sidebar.nav.reports": "Reports",
        "sidebar.nav.alerts": "Alerts",
        "sidebar.online": "ALL SENSORS ONLINE",
        // header
        "header.title": "SMART CAMPUS MONITORING",
        "header.subtitle": "ENVIRONMENTAL INTELLIGENCE SYSTEM",
        "header.live": "LIVE",
        "header.critical": "CRITICAL",
        // zone types
        "zone.veg": "Vegetation Zone",
        "zone.water": "Water Zone",
        // statuses
        "status.critical": "Critical",
        "status.warning": "Warning",
        "status.good": "Good",
        "status.waterNeeded": "Water Needed",
        "status.lowMoisture": "Low Moisture",
        // metrics
        "metric.temp": "Temp",
        "metric.temperature": "Temperature",
        "metric.humidity": "Humidity",
        "metric.moisture": "Moisture",
        "metric.soilMoisture": "Soil Moisture",
        "metric.quality": "Quality",
        "metric.turbidity": "Water Turbidity",
        "metric.ph": "pH Level",
        "sidebar.espIp": "API ENDPOINT URL:",
        // common
        "common.lastSync": "LAST SYNC:",
        "common.autoRefresh": "Auto-refresh every 5s",
        "common.clickZone": "Click a zone to inspect live readings",
        "common.selectZone": "▲ SELECT A ZONE ABOVE TO VIEW LIVE DATA",
        // views
        "dash.title": "ZONE OVERVIEW",
        "dash.subtitle": "Real-time environmental telemetry — 3 active zones",
        "dash.soilTitle": "SOIL MOISTURE TREND",
        "dash.soilSub": "Last 7 days — Garden zones",
        "dash.tempTitle": "TEMPERATURE TREND",
        "dash.tempSub": "Last 7 days — All zones (°C)",
        "dash.phTitle": "pH LEVEL TREND",
        "dash.phSub": "Last 7 days — Garden zones",
        // map
        "map.title": "CAMPUS MAP",
        "map.garden": "GARDEN",
        "map.pond_1": "POND 1",
        "map.pond_2": "POND 2",
        // alerts
        "alerts.title": "ALERTS",
        "alerts.sub1": "active alert",
        "alerts.sub2": "active alerts",
        "alerts.auto": "auto-refreshed",
        "alerts.nominal": "ALL SYSTEMS NOMINAL",
        "alerts.none": "No active alerts detected.",
        "alerts.summary": "ALERT SUMMARY",
        "alerts.warnings": "WARNINGS",
        // reports
        "reports.title": "SYSTEM REPORTS",
        "reports.subtitle": "Generate and download historical data reports",
        "reports.startDate": "Start Date",
        "reports.endDate": "End Date",
        "reports.generate": "Generate Report",
        "reports.download": "Download PDF",
        "reports.weekly": "Weekly Report Summary",
    },
    kn: {
        // login
        "auth.title": "ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಂಪಸ್ ದೃಢೀಕರಣ",
        "auth.select": "ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        "auth.gardener": "🌿 ತೋಟಗಾರ",
        "auth.management": "👔 ಆಡಳಿತ",
        "auth.access": "ಪ್ರವೇಶ ಕೋಡ್",
        "auth.placeholder": "1234 ನಮೂದಿಸಿ",
        "auth.button": "ಅಧಿವೇಶನವನ್ನು ಪ್ರಾರಂಭಿಸಿ",
        "auth.error": "ಅಮಾನ್ಯವಾದ ಪಾಸ್‌ಕೋಡ್. ಡಿಫಾಲ್ಟ್ 1234",
        "auth.footer": "ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ",
        // sidebar
        "sidebar.sys": "ಎನ್ವಿರೋ",
        "sidebar.subtitle": "ಕ್ಯಾಂಪಸ್ ಸಿಸ್ v2.1",
        "sidebar.identity": "ಸಕ್ರಿಯ ಗುರುತು",
        "sidebar.exit": "ಬದಲಾಯಿಸಿ",
        "sidebar.nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "sidebar.nav.map": "ಕ್ಯಾಂಪಸ್ ನಕ್ಷೆ",
        "sidebar.nav.reports": "ವರದಿಗಳು",
        "sidebar.nav.alerts": "ಎಚ್ಚರಿಕೆಗಳು",
        "sidebar.online": "ಎಲ್ಲಾ ಸಂವೇದಕಗಳು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿವೆ",
        // header
        "header.title": "ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಂಪಸ್ ಮೇಲ್ವಿಚಾರಣೆ",
        "header.subtitle": "ಪರಿಸರ ಗುಪ್ತಚರ ವ್ಯವಸ್ಥೆ",
        "header.live": "ಲೈವ್",
        "header.critical": "ಗಂಭೀರ",
        // zone types
        "zone.veg": "ಸಸ್ಯವರ್ಗ ವಲಯ",
        "zone.water": "ನೀರಿನ ವಲಯ",
        // statuses
        "status.critical": "ಗಂಭೀರ",
        "status.warning": "ಎಚ್ಚರಿಕೆ",
        "status.good": "ಉತ್ತಮ",
        "status.waterNeeded": "ನೀರು ಬೇಕಾಗಿದೆ",
        "status.lowMoisture": "ಕಡಿಮೆ ತೇವಾಂಶ",
        // metrics
        "metric.temp": "ತಾಪಮಾನ",
        "metric.temperature": "ತಾಪಮಾನ",
        "metric.humidity": "ಆರ್ದ್ರತೆ",
        "metric.moisture": "ತೇವಾಂಶ",
        "metric.soilMoisture": "ಮಣ್ಣಿನ ತೇವಾಂಶ",
        "metric.quality": "ಗುಣಮಟ್ಟ",
        "metric.turbidity": "ನೀರಿನ ಪ್ರಕ್ಷುಬ್ಧತೆ",
        "metric.ph": "pH ಮಟ್ಟ",
        "sidebar.espIp": "API ENDPOINT URL:",
        // common
        "common.lastSync": "ಕೊನೆಯ ಸಿಂಕ್:",
        "common.autoRefresh": "ಪ್ರತಿ 5 ಸೆಕೆಂಡಿಗೆ ಸ್ವಯಂ-ರಿಫ್ರೆಶ್",
        "common.clickZone": "ವೀಕ್ಷಿಸಲು ವಲಯವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ",
        "common.selectZone": "▲ ಲೈವ್ ಡೇಟಾವನ್ನು ವೀಕ್ಷಿಸಲು ಮೇಲಿನ ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
        // views
        "dash.title": "ವಲಯದ ಅವಲೋಕನ",
        "dash.subtitle": "ನೈಜ-ಸಮಯದ ಪರಿಸರ ಟೆಲಿಮೆಟ್ರಿ - 3 ಸಕ್ರಿಯ ವಲಯಗಳು",
        "dash.soilTitle": "ಮಣ್ಣಿನ ತೇವಾಂಶ ಟ್ರೆಂಡ್",
        "dash.soilSub": "ಕಳೆದ 7 ದಿನಗಳು - ಉದ್ಯಾನಗಳು",
        "dash.tempTitle": "ತಾಪಮಾನ ಟ್ರೆಂಡ್",
        "dash.tempSub": "ಕಳೆದ 7 ದಿನಗಳು - ಎಲ್ಲಾ ವಲಯಗಳು",
        "dash.phTitle": "pH ಮಟ್ಟ ಟ್ರೆಂಡ್",
        "dash.phSub": "ಕಳೆದ 7 ದಿನಗಳು - ಉದ್ಯಾನಗಳು",
        // map
        "map.title": "ಕ್ಯಾಂಪಸ್ ನಕ್ಷೆ",
        "map.garden": "ಉದ್ಯಾನ",
        "map.pond_1": "ಕೊಳ 1",
        "map.pond_2": "ಕೊಳ 2",
        // alerts
        "alerts.title": "ಎಚ್ಚರಿಕೆಗಳು",
        "alerts.sub1": "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆ",
        "alerts.sub2": "ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು",
        "alerts.auto": "ಸ್ವಯಂ-ರಿಫ್ರೆಶ್",
        "alerts.nominal": "ಎಲ್ಲಾ ವ್ಯವಸ್ಥೆಗಳು ಸಾಮಾನ್ಯ",
        "alerts.none": "ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.",
        "alerts.summary": "ಎಚ್ಚರಿಕೆಯ ಸಾರಾಂಶ",
        "alerts.warnings": "ಎಚ್ಚರಿಕೆಗಳು",
        // reports
        "reports.title": "ಸಿಸ್ಟಮ್ ವರದಿಗಳು",
        "reports.subtitle": "ಐತಿಹಾಸಿಕ ಡೇಟಾ ವರದಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
        "reports.startDate": "ಪ್ರಾರಂಭ ದಿನಾಂಕ",
        "reports.endDate": "ಅಂತ್ಯ ದಿನಾಂಕ",
        "reports.generate": "ವರದಿ ರಚಿಸಿ",
        "reports.download": "ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
        "reports.weekly": "ವಾರದ ವರದಿಯ ಸಾರಾಂಶ",
    }
};

const LanguageContext = createContext();

const useTranslation = () => {
    const { lang, setLang } = useContext(LanguageContext);
    const t = (key) => translations[lang][key] || key;
    return { t, lang, setLang };
};

const LanguageToggle = () => {
    const { lang, setLang } = useTranslation();
    return (
        <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/50">
            <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${lang === 'en' ? 'bg-emerald-600/50 text-emerald-100 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
                ENG
            </button>
            <button
                onClick={() => setLang('kn')}
                className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all ${lang === 'kn' ? 'bg-emerald-600/50 text-emerald-100 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
                ಕನ್ನಡ
            </button>
        </div>
    );
};

// ─── Palette & Theme ───────────────────────────────────────────────────────────
// Aesthetic direction: "Biopunk Terminal" — deep forest greens, amber warnings,
// monospaced data-feel, subtle scanline texture, organic yet industrial.

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_ZONES = [
    {
        id: "garden-a",
        name: "Garden",
        nameKn: "ಉದ್ಯಾನ",
        icon: "🌿",
        type: "garden",
        humidity: 55,
        soilMoisture: 1000,
        waterQuality: null,
        ph: 7.0,
        lastUpdated: new Date(),
    },
    {
        id: "pond-1",
        name: "Pond 1",
        nameKn: "ಕೊಳ 1",
        icon: "💧",
        type: "pond",
        humidity: 82,
        soilMoisture: null,
        waterQuality: 42,
        lastUpdated: new Date(),
    },
    {
        id: "pond-2",
        name: "Pond 2",
        nameKn: "ಕೊಳ 2",
        icon: "🌊",
        type: "pond",
        humidity: 85,
        soilMoisture: null,
        waterQuality: 52,
        lastUpdated: new Date(),
    },
];

const SOIL_TREND = [
    { day: "Mon", "Garden": 18 },
    { day: "Tue", "Garden": 15 },
    { day: "Wed", "Garden": 13 },
    { day: "Thu", "Garden": 10 },
    { day: "Fri", "Garden": 11 },
    { day: "Sat", "Garden": 12 },
    { day: "Sun", "Garden": 12 },
];

const PH_TREND = [
    { day: "Mon", "Garden": 7.0 },
    { day: "Tue", "Garden": 7.1 },
    { day: "Wed", "Garden": 6.9 },
    { day: "Thu", "Garden": 6.8 },
    { day: "Fri", "Garden": 7.2 },
    { day: "Sat", "Garden": 7.0 },
    { day: "Sun", "Garden": 7.1 },
];



// ─── Helpers ──────────────────────────────────────────────────────────────────
function getZoneStatus(zone) {
    if (zone.type === "pond") {
        if (zone.waterQuality > 70) return { labelKey: "status.critical", color: "red" };
        if (zone.waterQuality > 50) return { labelKey: "status.warning", color: "yellow" };
        return { labelKey: "status.good", color: "green" };
    }
    if (zone.ph !== undefined && (zone.ph < 6.5 || zone.ph > 8.5)) return { labelKey: "status.critical", color: "red" };
    if (zone.soilMoisture < 1200) return { labelKey: "status.waterNeeded", color: "red" };
    if (zone.soilMoisture < 1800) return { labelKey: "status.lowMoisture", color: "yellow" };
    return { labelKey: "status.good", color: "green" };
}

function generateAlerts(zones) {
    const alerts = [];
    zones.forEach((z) => {
        if (z.ph !== undefined && (z.ph < 6.5 || z.ph > 8.5))
            alerts.push({ id: `${z.id}-ph`, severity: "critical", message: `Abnormal soil pH detected: ${z.ph.toFixed(2)}`, zone: z.name, zoneKn: z.nameKn });
        if (z.type === "garden" && z.soilMoisture < 1200)
            alerts.push({ id: `${z.id}-soil`, severity: "critical", message: `${z.name} soil moisture critically low (${z.soilMoisture.toFixed(0)})`, zone: z.name, zoneKn: z.nameKn });
        else if (z.type === "garden" && z.soilMoisture < 1800)
            alerts.push({ id: `${z.id}-soil-warn`, severity: "warning", message: `${z.name} soil moisture below optimal (${z.soilMoisture.toFixed(0)})`, zone: z.name, zoneKn: z.nameKn });
        if (z.type === "pond" && z.waterQuality > 50)
            alerts.push({ id: `${z.id}-turbidity`, severity: z.waterQuality > 70 ? "critical" : "warning", message: `Pond turbidity high — water quality index: ${z.waterQuality}`, zone: z.name, zoneKn: z.nameKn });

    });
    return alerts;
}

function randomDelta(val, range) {
    return Math.max(0, val + (Math.random() - 0.5) * range * 2);
}

// ─── Sub-Components ────────────────────────────────────────────────────────────

const StatusBadge = ({ color, labelKey }) => {
    const { t } = useTranslation();
    const map = {
        green: "bg-emerald-900/60 text-emerald-300 border-emerald-500/40",
        yellow: "bg-amber-900/60 text-amber-300 border-amber-500/40",
        red: "bg-red-900/60 text-red-300 border-red-500/40",
    };
    const dot = { green: "bg-emerald-400", yellow: "bg-amber-400", red: "bg-red-400" };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-center rounded-full border text-xs font-mono font-semibold tracking-wider ${map[color]}`}>
            <span className={`w-1.5 h-1.5 rounded-full min-w-[6px] ${dot[color]} animate-pulse inline-block`} />
            {t(labelKey).toUpperCase()}
        </span>
    );
};

const MetricRow = ({ icon, labelKey, value, unit, sub }) => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-slate-700/40 last:border-0">
            <span className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                <span className="text-base">{icon}</span> {t(labelKey)}
            </span>
            <span className="font-mono font-bold text-slate-100 text-base">
                {value !== null && value !== undefined ? (
                    <>{value}<span className="text-slate-400 text-xs ml-0.5">{unit}</span></>
                ) : (
                    <span className="text-slate-600 text-xs">N/A</span>
                )}
                {sub && <span className="text-xs text-slate-500 ml-1">{sub}</span>}
            </span>
        </div>
    )
};

const ZoneCard = ({ zone, selected, onClick }) => {
    const { t, lang } = useTranslation();
    const status = getZoneStatus(zone);
    const borderMap = { green: "border-emerald-500/30", yellow: "border-amber-500/40", red: "border-red-500/50" };
    const glowMap = { green: "", yellow: "shadow-amber-900/20", red: "shadow-red-900/30" };
    const isSelected = selected?.id === zone.id;

    return (
        <div
            onClick={() => onClick(zone)}
            className={`relative cursor-pointer rounded-xl border transition-all duration-300 p-4
        ${borderMap[status.color]} ${glowMap[status.color]}
        ${isSelected
                    ? "bg-slate-700/60 ring-1 ring-emerald-400/40 shadow-lg shadow-emerald-900/20"
                    : "bg-slate-800/50 hover:bg-slate-700/40 hover:shadow-md"
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <span className="text-2xl">{zone.icon}</span>
                    <h3 className="font-mono font-bold text-slate-100 mt-1 text-sm tracking-wide">{lang === 'en' ? zone.name : zone.nameKn}</h3>
                    <p className="text-xs text-slate-500 font-mono">{zone.type === "pond" ? t("zone.water") : t("zone.veg")}</p>
                </div>
                <div className="text-right">
                    <StatusBadge color={status.color} labelKey={status.labelKey} />
                </div>
            </div>
            <div className="space-y-1">

                <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">💨 {t("metric.humidity")}</span>
                    <span className="text-slate-300">{zone.humidity.toFixed(0)}%</span>
                </div>
                {zone.type === "garden" && (
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">🌱 {t("metric.moisture")}</span>
                        <span className={`font-bold ${zone.soilMoisture < 1200 ? "text-red-400" : zone.soilMoisture < 1800 ? "text-amber-400" : "text-emerald-400"}`}>
                            {zone.soilMoisture.toFixed(0)}
                        </span>
                    </div>
                )}
                {zone.ph !== undefined && (
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">🧪 {t("metric.ph")}</span>
                        <span className={`font-bold ${(zone.ph < 6.5 || zone.ph > 8.5) ? "text-red-400" : "text-emerald-400"}`}>
                            {zone.ph.toFixed(2)}
                        </span>
                    </div>
                )}
                {zone.type === "pond" && (
                    <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">🔬 {t("metric.quality")}</span>
                        <span className={`font-bold ${zone.waterQuality > 70 ? "text-red-400" : zone.waterQuality > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                            {zone.waterQuality.toFixed(0)} NTU
                        </span>
                    </div>
                )}
            </div>
            {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
        </div>
    );
};

const DetailPanel = ({ zone, onClose }) => {
    const { t, lang } = useTranslation();
    const status = getZoneStatus(zone);
    return (
        <div className="bg-slate-800/80 border border-slate-600/50 rounded-xl p-5 backdrop-blur-sm shadow-xl">
            <div className="flex flex-row items-start sm:items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{zone.icon}</span>
                    <div>
                        <h2 className="font-mono font-bold text-slate-100 text-lg tracking-wide">{lang === 'en' ? zone.name : zone.nameKn}</h2>
                        <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{t("common.lastSync")}</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <StatusBadge color={status.color} labelKey={status.labelKey} />
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-2xl leading-none font-mono">×</button>
                </div>
            </div>
            <div className="space-y-0">

                <MetricRow icon="💨" labelKey="metric.humidity" value={zone.humidity.toFixed(1)} unit="%" />
                {zone.soilMoisture !== null && (
                    <MetricRow icon="🌱" labelKey="metric.soilMoisture" value={zone.soilMoisture.toFixed(0)} unit="" />
                )}
                {zone.ph !== undefined && (
                    <MetricRow icon="🧪" labelKey="metric.ph" value={zone.ph.toFixed(2)} unit="" />
                )}
                {zone.waterQuality !== null && (
                    <MetricRow icon="🔬" labelKey="metric.turbidity" value={zone.waterQuality.toFixed(1)} unit=" NTU" />
                )}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700/30">
                <p className="text-xs font-mono text-slate-500 break-words">
                    ⏱ {t("common.lastSync")} {zone.lastUpdated.toLocaleTimeString()} — {t("common.autoRefresh")}
                </p>
            </div>
        </div>
    );
};

const AlertItem = ({ alert }) => {
    const { lang } = useTranslation();
    const map = {
        critical: { bg: "bg-red-950/50 border-red-500/40", text: "text-red-300", icon: "🚨", tag: "CRITICAL" },
        warning: { bg: "bg-amber-950/40 border-amber-500/30", text: "text-amber-300", icon: "⚠️", tag: "WARN" },
    };
    const s = map[alert.severity];
    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${s.bg} mb-2 shadow-sm`}>
            <span className="text-base mt-0.5">{s.icon}</span>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-0.5">
                    <span className={`text-[10px] font-mono font-bold tracking-widest ${s.text}`}>{s.tag}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900/50 px-2 rounded-sm truncate">{lang === 'en' ? alert.zone : alert.zoneKn}</span>
                </div>
                <p className={`text-sm font-mono mt-1 ${s.text} break-words`}>{alert.message}</p>
            </div>
        </div>
    );
};

const CHART_COLORS = { "Garden A": "#34d399", "Garden B": "#60a5fa", "Pond": "#a78bfa" };

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-900 border border-slate-600/60 rounded-lg p-3 text-xs font-mono shadow-xl z-50">
            <p className="text-slate-400 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value?.toFixed(1)}{p.unit || ""}</p>
            ))}
        </div>
    );
};

const Sidebar = ({ active, setActive, alertCount, mobileOpen, setMobileOpen, userRole, onLogout }) => {
    const { t } = useTranslation();
    const NAV_ITEMS = [
        { id: "dashboard", labelKey: "sidebar.nav.dashboard", icon: "⬡" },
        { id: "map", labelKey: "sidebar.nav.map", icon: "◈" },
        ...(userRole === 'management' ? [{ id: "reports", labelKey: "sidebar.nav.reports", icon: "📄" }] : []),
        { id: "alerts", labelKey: "sidebar.nav.alerts", icon: "◉" },
    ];

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
            )}
            <aside className={`
      fixed md:static z-30 top-0 left-0 h-full w-64 bg-slate-900/95 border-r border-slate-700/50
      flex flex-col backdrop-blur-md transition-transform duration-300
      ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
                <div className="p-5 border-b border-slate-700/40">
                    <div className="flex items-center gap-3">
                        <span className="text-emerald-400 text-2xl">⬡</span>
                        <div className="flex-[1] min-w-0">
                            <p className="text-slate-100 font-mono font-bold text-sm tracking-wide break-words">{t("sidebar.sys")}</p>
                            <p className="text-slate-500 font-mono text-[10px] tracking-widest break-words">{t("sidebar.subtitle")}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-700/40 bg-slate-800/30">
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest mb-2 truncate">{t("sidebar.identity")}</p>
                    <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs md:text-[13px] font-mono font-bold tracking-wide uppercase truncate ${userRole === 'gardener' ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {userRole === 'gardener' ? t("auth.gardener") : t("auth.management")}
                        </p>
                        <button onClick={onLogout} className="text-[10px] bg-slate-800 hover:bg-red-900/40 hover:text-red-400 text-slate-400 px-2 py-1 rounded transition-colors font-mono tracking-wider flex-shrink-0">{t("sidebar.exit")}</button>
                    </div>
                </div>

                <div className="p-3 border-b border-slate-700/40 flex justify-center">
                    <LanguageToggle />
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActive(item.id); setMobileOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all font-mono text-sm
              ${active === item.id
                                    ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                }`}
                        >
                            <span className="text-lg w-5 text-center flex-shrink-0">{item.icon}</span>
                            <span className="tracking-wide flex-1 min-w-0 break-words line-clamp-2 leading-relaxed">{t(item.labelKey)}</span>
                            {item.id === "alerts" && alertCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex-shrink-0 flex items-center justify-center">
                                    {alertCount}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-700/40">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <span className="text-[10px] md:text-xs font-mono text-slate-500 tracking-wider break-words line-clamp-2">{t("sidebar.online")}</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

// ─── Views ─────────────────────────────────────────────────────────────────────
const DashboardView = ({ zones, selectedZone, setSelectedZone }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-mono font-bold text-slate-100 text-base tracking-widest mb-1">{t("dash.title")}</h2>
                <p className="text-slate-500 text-xs font-mono break-words">{t("dash.subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => (
                    <ZoneCard key={zone.id} zone={zone} selected={selectedZone} onClick={setSelectedZone} />
                ))}
            </div>
            {selectedZone && (
                <DetailPanel
                    zone={zones.find((z) => z.id === selectedZone.id) || selectedZone}
                    onClose={() => setSelectedZone(null)}
                />
            )}
            <div className="grid grid-cols-1 gap-5">
                <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 md:p-5 w-full min-w-0">
                    <h3 className="font-mono font-bold text-slate-100 text-sm tracking-wide mb-1 break-words line-clamp-2">{t("dash.soilTitle")}</h3>
                    <p className="text-slate-500 text-xs font-mono mb-4 break-words line-clamp-2">{t("dash.soilSub")}</p>
                    <div className="h-[220px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SOIL_TREND}>
                                <defs>
                                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }} />
                                <Area type="monotone" dataKey="Garden" stroke="#34d399" fill="url(#gA)" strokeWidth={2} dot={{ r: 3, fill: "#34d399" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 md:p-5 w-full min-w-0">
                    <h3 className="font-mono font-bold text-slate-100 text-sm tracking-wide mb-1 break-words line-clamp-2">{t("dash.phTitle")}</h3>
                    <p className="text-slate-500 text-xs font-mono mb-4 break-words line-clamp-2">{t("dash.phSub")}</p>
                    <div className="h-[220px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={PH_TREND}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} domain={[6.0, 8.0]} width={30} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }} />
                                <Line type="monotone" dataKey="Garden" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3, fill: "#60a5fa" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapView = ({ zones, selectedZone, setSelectedZone }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-mono font-bold text-slate-100 text-base tracking-widest mb-1">{t("map.title")}</h2>
                <p className="text-slate-500 text-xs font-mono break-words">{t("common.clickZone")}</p>
            </div>
            {/* Stylised campus map */}
            <div className="relative bg-slate-900/80 border border-slate-700/40 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: "linear-gradient(#34d399 1px, transparent 1px), linear-gradient(90deg, #34d399 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col gap-4">
                    {/* Garden */}
                    <button
                        onClick={() => setSelectedZone(zones.find(z => z.id === "garden-a"))}
                        className={`rounded-xl border-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-4 p-4
            ${selectedZone?.id === "garden-a" ? "border-emerald-400/70 bg-emerald-900/30" : "border-emerald-700/30 bg-emerald-950/20 hover:border-emerald-500/50 hover:bg-emerald-900/20"}
          `}
                    >
                        <span className="text-4xl">🌿</span>
                        <div className="text-center">
                            <span className="font-mono text-xs md:text-sm text-emerald-300 font-bold tracking-widest block mb-2 break-words">{t("map.garden")}</span>
                            <StatusBadge color={getZoneStatus(zones.find(z => z.id === "garden-a")).color} labelKey={getZoneStatus(zones.find(z => z.id === "garden-a")).labelKey} />
                        </div>
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        {/* Pond 1 */}
                        <button
                            onClick={() => setSelectedZone(zones.find(z => z.id === "pond-1"))}
                            className={`flex-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 p-4
              ${selectedZone?.id === "pond-1" ? "border-blue-400/70 bg-blue-900/30" : "border-blue-700/30 bg-blue-950/20 hover:border-blue-500/50 hover:bg-blue-900/20"}
            `}
                        >
                            <span className="text-4xl">💧</span>
                            <span className="font-mono text-xs md:text-sm text-blue-300 font-bold tracking-widest text-center mt-2 break-words max-w-full">{t("map.pond_1")}</span>
                            <StatusBadge color={getZoneStatus(zones.find(z => z.id === "pond-1")).color} labelKey={getZoneStatus(zones.find(z => z.id === "pond-1")).labelKey} />
                        </button>
                        {/* Pond 2 */}
                        <button
                            onClick={() => setSelectedZone(zones.find(z => z.id === "pond-2"))}
                            className={`flex-1 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 p-4
              ${selectedZone?.id === "pond-2" ? "border-violet-400/70 bg-violet-900/30" : "border-violet-700/30 bg-violet-950/20 hover:border-violet-500/50 hover:bg-violet-900/20"}
            `}
                        >
                            <span className="text-4xl">🌊</span>
                            <span className="font-mono text-xs md:text-sm text-violet-300 font-bold tracking-widest text-center mt-2 break-words max-w-full">{t("map.pond_2")}</span>
                            <StatusBadge color={getZoneStatus(zones.find(z => z.id === "pond-2")).color} labelKey={getZoneStatus(zones.find(z => z.id === "pond-2")).labelKey} />
                        </button>
                    </div>
                </div>
            </div>
            {selectedZone && (
                <DetailPanel
                    zone={zones.find((z) => z.id === selectedZone.id) || selectedZone}
                    onClose={() => setSelectedZone(null)}
                />
            )}
            {!selectedZone && (
                <p className="text-center text-slate-600 text-xs font-mono py-4 break-words px-4">{t("common.selectZone")}</p>
            )}
        </div>
    );
};

const AlertsView = ({ alerts }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-mono font-bold text-slate-100 text-base tracking-widest mb-1">{t("alerts.title")}</h2>
                <p className="text-slate-500 text-xs font-mono break-words">{alerts.length} {alerts.length === 1 ? t("alerts.sub1") : t("alerts.sub2")} — {t("alerts.auto")}</p>
            </div>
            {alerts.length === 0 ? (
                <div className="text-center py-16 text-slate-600 px-4">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="font-mono text-sm tracking-wide break-words">{t("alerts.nominal")}</p>
                    <p className="text-xs mt-1 break-words">{t("alerts.none")}</p>
                </div>
            ) : (
                <div>{alerts.map((a) => <AlertItem key={a.id} alert={a} />)}</div>
            )}
            <div className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4">
                <h3 className="font-mono text-xs text-slate-400 tracking-widest mb-3 break-words">{t("alerts.summary")}</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-red-950/40 border border-red-800/30 flex flex-col justify-center">
                        <p className="text-2xl font-mono font-bold text-red-400">{alerts.filter(a => a.severity === "critical").length}</p>
                        <p className="text-[10px] font-mono text-red-500 tracking-widest mt-1 uppercase break-words px-1">{t("header.critical")}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-950/40 border border-amber-800/30 flex flex-col justify-center">
                        <p className="text-2xl font-mono font-bold text-amber-400">{alerts.filter(a => a.severity === "warning").length}</p>
                        <p className="text-[10px] font-mono text-amber-500 tracking-widest mt-1 uppercase break-words px-1">{t("alerts.warnings")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportsView = () => {
    const { t } = useTranslation();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generated, setGenerated] = useState(false);
    const [mockLogs, setMockLogs] = useState([]);

    const handleGenerate = () => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const logs = [];
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                let curr = new Date(start);
                let count = 0;
                while (curr <= end && count < 7) {
                    ["08:00", "14:00"].forEach(time => {
                        logs.push({
                            date: curr.toISOString().split('T')[0],
                            time,
                            soil: Math.floor(Math.random() * (1600 - 900) + 900),
                            ph: (Math.random() * (7.5 - 6.0) + 6.0).toFixed(1)
                        });
                    });
                    curr.setDate(curr.getDate() + 1);
                    count++;
                }
            }
            setMockLogs(logs);
            setGenerated(true);
        }
    };

    const avgSoil = mockLogs.length ? Math.floor(mockLogs.reduce((a, b) => a + b.soil, 0) / mockLogs.length) : "N/A";
    const avgPh = mockLogs.length ? (mockLogs.reduce((a, b) => a + parseFloat(b.ph), 0) / mockLogs.length).toFixed(1) : "N/A";

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-mono font-bold text-slate-100 text-base tracking-widest mb-1">{t("reports.title")}</h2>
                <p className="text-slate-500 text-xs font-mono break-words">{t("reports.subtitle")}</p>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/40 rounded-xl p-5 md:p-6 shadow-xl print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-2">{t("reports.startDate")}</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-2">{t("reports.endDate")}</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={!startDate || !endDate}
                    className="w-full md:w-auto px-6 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 rounded-lg font-mono text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("reports.generate")}
                </button>
            </div>

            {generated && (
                <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-5 md:p-6 print:bg-white print:text-black print:border-none">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-mono font-bold text-slate-100 text-lg print:text-black">{t("reports.weekly")}</h3>
                        <button
                            onClick={handleDownload}
                            className="print:hidden flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/50 rounded-lg font-mono text-xs tracking-wide transition-all"
                        >
                            <span>📥</span> {t("reports.download")}
                        </button>
                    </div>

                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Period:</span>
                            <span className="text-slate-200 print:text-black">{startDate} to {endDate}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Avg Humidity:</span>
                            <span className="text-slate-200 print:text-black">62%</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Avg Soil Moisture:</span>
                            <span className="text-slate-200 print:text-black">{avgSoil}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Avg pH Level:</span>
                            <span className="text-slate-200 print:text-black">{avgPh}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Critical Alerts Logged:</span>
                            <span className="text-amber-400 print:text-amber-700">3</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50 print:border-gray-300">
                            <span className="text-slate-400 print:text-gray-600">Water Quality Index:</span>
                            <span className="text-slate-200 print:text-black">Nominal</span>
                        </div>
                    </div>

                    <div className="mt-8 mb-4">
                        <h4 className="font-mono font-bold text-slate-100 text-sm print:text-black mb-3 pb-2 border-b border-slate-700/50 print:border-gray-300">Detailed Log</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 print:border-gray-400 text-slate-400 print:text-gray-600">
                                        <th className="py-2 pl-2">Date</th>
                                        <th className="py-2">Time</th>
                                        <th className="py-2">Soil Moisture</th>
                                        <th className="py-2">pH Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockLogs.length > 0 ? mockLogs.map((log, i) => (
                                        <tr key={i} className="border-b border-slate-700/20 print:border-gray-200 text-slate-300 print:text-black">
                                            <td className="py-2 pl-2">{log.date}</td>
                                            <td className="py-2">{log.time}</td>
                                            <td className="py-2">{log.soil}</td>
                                            <td className="py-2">{log.ph}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center text-slate-500">No data available for the selected period.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-500 font-mono print:text-gray-500">
                        Generated by Enviro Campus Sys v2.1
                    </div>
                </div>
            )}
        </div>
    );
};

const LoginView = ({ onLogin }) => {
    const { t } = useTranslation();
    const [role, setRole] = useState("gardener");
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (passcode === "1234") {
            onLogin(role);
        } else {
            setError(t("auth.error"));
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            <div className="absolute top-4 right-4 z-50">
                <LanguageToggle />
            </div>

            <div className="text-center mb-10 mt-8 relative px-4 w-full">
                <div className="absolute inset-0 bg-emerald-500/10 blur-[50px] rounded-full" />
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 relative">
                    <span className="text-emerald-400 text-4xl animate-pulse">⬡</span>
                    <h1 className="font-bold text-slate-100 text-2xl md:text-3xl tracking-widest text-center">{t("auth.title")}</h1>
                </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/50 p-6 md:p-8 rounded-xl w-full max-w-md backdrop-blur-md shadow-2xl shadow-emerald-900/10 relative z-10 mx-4">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs text-slate-400 mb-3 tracking-wider">{t("auth.select")}</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("gardener")}
                                className={`flex-1 py-4 px-3 rounded-lg border text-sm font-bold tracking-wider transition-all break-words
                  ${role === "gardener" ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.15)]" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"}`}
                            >
                                {t("auth.gardener")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("management")}
                                className={`flex-1 py-4 px-3 rounded-lg border text-sm font-bold tracking-wider transition-all break-words
                  ${role === "management" ? "bg-blue-900/40 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.15)]" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"}`}
                            >
                                {t("auth.management")}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-3 tracking-wider">{t("auth.access")}</label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => { setPasscode(e.target.value); setError(""); }}
                            placeholder={t("auth.placeholder")}
                            className="w-full bg-slate-950/80 border border-slate-700/50 rounded-lg px-4 py-4 text-emerald-200 text-lg md:tracking-[0.5em] text-center focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700 placeholder:tracking-normal placeholder:text-sm"
                        />
                        {error && <p className="text-red-400 text-xs mt-3 tracking-wide text-center break-words">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold tracking-widest text-sm py-4 rounded-lg transition-colors mt-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] break-words"
                    >
                        {t("auth.button")}
                    </button>
                </form>
            </div>

            <p className="text-slate-600 text-[10px] mt-10 tracking-[0.2em] font-semibold opacity-50 px-4 text-center break-words">{t("auth.footer")}</p>
        </div>
    );
};

const SmartCampusApp = () => {
    const { t } = useTranslation();
    const [userRole, setUserRole] = useState(null); // 'gardener' or 'management'
    const [activePage, setActivePage] = useState("dashboard");
    const [zones, setZones] = useState(INITIAL_ZONES);
    const [selectedZone, setSelectedZone] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tick, setTick] = useState(0);

    // Simulate real-time updates without API dependencies
    useEffect(() => {
        const id = setInterval(() => {
            setZones((prev) =>
                prev.map((z) => {
                    return {
                        ...z,
                        humidity: +Math.min(100, randomDelta(z.humidity, 1.5)).toFixed(1),
                        soilMoisture: z.soilMoisture !== null ? +Math.max(0, Math.min(4095, randomDelta(z.soilMoisture, 50))).toFixed(0) : null,
                        waterQuality: z.waterQuality !== null ? +Math.min(100, randomDelta(z.waterQuality, 2)).toFixed(1) : null,
                        lastUpdated: new Date(),
                    };
                })
            );
            setTick((t) => t + 1);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    const alerts = generateAlerts(zones);

    if (!userRole) {
        return <LoginView onLogin={setUserRole} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            <Sidebar
                active={activePage}
                setActive={setActivePage}
                alertCount={alerts.filter(a => a.severity === "critical").length}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                userRole={userRole}
                onLogout={() => setUserRole(null)}
            />

            <div className="flex-1 flex flex-col min-w-0 md:ml-0">
                {/* Navbar */}
                <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur border-b border-slate-700/40 px-4 md:px-6 h-14 flex items-center justify-between">
                    <div className="flex flex-row items-center gap-2 sm:gap-3">
                        <button
                            className="md:hidden text-slate-400 hover:text-slate-200 text-xl"
                            onClick={() => setMobileOpen(true)}
                        >
                            ☰
                        </button>
                        <div className="min-w-0">
                            <h1 className="font-mono font-bold text-slate-100 text-xs sm:text-sm md:tracking-widest truncate">{t("header.title")}</h1>
                            <p className="text-[10px] text-slate-500 font-mono tracking-wider hidden sm:block truncate">{t("header.subtitle")}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        {alerts.filter(a => a.severity === "critical").length > 0 && (
                            <button
                                onClick={() => setActivePage("alerts")}
                                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-500/40 text-red-300 text-xs font-mono animate-pulse whitespace-nowrap"
                            >
                                🚨 <span className="hidden sm:inline">{alerts.filter(a => a.severity === "critical").length} {t("header.critical")}</span>
                            </button>
                        )}
                        <LanguageToggle />
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] font-mono text-slate-500 ml-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                            <span className="hidden sm:inline">{t("header.live")}</span>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
                    {activePage === "dashboard" && (
                        <DashboardView zones={zones} selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
                    )}
                    {activePage === "map" && (
                        <MapView zones={zones} selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
                    )}
                    {activePage === "reports" && userRole === "management" && <ReportsView />}
                    {activePage === "alerts" && <AlertsView alerts={alerts} />}
                </main>
            </div>
        </div>
    );
};

// ─── App Wrapping with Context ───────────────────────────────────────────────
export default function App() {
    const [lang, setLang] = useState("en");
    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            <SmartCampusApp />
        </LanguageContext.Provider>
    );
}