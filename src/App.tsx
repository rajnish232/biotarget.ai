import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DiscoveryCanvas from "./pages/DiscoveryCanvas";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { fetchBioTargetData } from "./services/api";
import type { BioTargetData } from "./services/api";
import { analyzeTarget } from "./services/ai";
import type { TargetAnalysis } from "./services/ai";
import { API_BASE } from "./config";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; orgName: string } | null>(null);
  const [showAppConsole, setShowAppConsole] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [targetData, setTargetData] = useState<BioTargetData | null>(null);
  const [targetAnalysis, setTargetAnalysis] = useState<TargetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Saved targets count and sync state
  const [savedTargets, setSavedTargets] = useState<string[]>([]);
  // Recent searches log
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load default configs from settings if applicable
  useEffect(() => {
    const storedUser = localStorage.getItem("biotarget_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setCurrentUser(parsed);
      syncSavedTargets(parsed.email);
    }

    const storedRecent = localStorage.getItem("biotarget_recent_searches");
    if (storedRecent) {
      setRecentSearches(JSON.parse(storedRecent));
    }
  }, []);

  // Fetch saved targets from backend database files
  const syncSavedTargets = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/pipeline/${encodeURIComponent(email)}`);
      if (res.ok) {
        const list = await res.json();
        setSavedTargets(list.map((t: any) => t.geneSymbol));
      }
    } catch (e) {
      console.warn("Could not sync saved targets from database", e);
    }
  };

  const handleSearch = async (gene: string) => {
    const normalized = gene.trim().toUpperCase();
    if (!normalized) return;

    setIsLoading(true);
    setCurrentView("discovery");

    try {
      // 1. Fetch data from biological APIs
      const data = await fetchBioTargetData(normalized);
      setTargetData(data);

      // 2. Synthesize AI clinical insights
      const analysis = await analyzeTarget(data);
      setTargetAnalysis(analysis);

      // Add to recent searches log
      setRecentSearches((prev) => {
        const filtered = prev.filter((g) => g !== normalized);
        const updated = [normalized, ...filtered].slice(0, 5); // Max 5 recent items
        localStorage.setItem("biotarget_recent_searches", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Discovery canvas fetch failed", e);
      setTargetData(null);
      setTargetAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!targetData || !currentUser) return;
    const gene = targetData.geneSymbol;
    const isSaved = savedTargets.includes(gene);

    try {
      if (isSaved) {
        // Delete from database
        const res = await fetch(`${API_BASE}/api/pipeline/${encodeURIComponent(currentUser.email)}/${encodeURIComponent(gene)}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setSavedTargets(prev => prev.filter(g => g !== gene));
        }
      } else {
        // Save to database
        const res = await fetch(`${API_BASE}/api/pipeline`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentUser.email,
            targetData: {
              geneSymbol: targetData.geneSymbol,
              fullName: targetData.fullName,
              uniprotId: targetData.uniprotId
            }
          })
        });
        if (res.ok) {
          setSavedTargets(prev => [...prev, gene]);
        }
      }
    } catch (e) {
      console.error("Failed to toggle target save to database", e);
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("biotarget_recent_searches");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAppConsole(false);
    localStorage.removeItem("biotarget_user");
    setSavedTargets([]);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />
        );
      case "discovery":
        return (
          <DiscoveryCanvas
            data={targetData}
            analysis={targetAnalysis}
            isLoading={isLoading}
            onBack={() => {
              setCurrentView("dashboard");
              if (currentUser) syncSavedTargets(currentUser.email);
            }}
            onSave={handleSaveToggle}
            isSaved={targetData ? savedTargets.includes(targetData.geneSymbol) : false}
          />
        );
      case "billing":
        return <Billing />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onClearRecent={handleClearRecent}
          />
        );
    }
  };

  // 1. Gated auth screen
  if (!currentUser) {
    return (
      <AuthPage 
        onAuthSuccess={(user) => { 
          setCurrentUser(user); 
          localStorage.setItem("biotarget_user", JSON.stringify(user)); 
          syncSavedTargets(user.email);
        }} 
      />
    );
  }

  // 2. SaaS Marketing Screen
  if (!showAppConsole) {
    return <LandingPage onLaunch={() => setShowAppConsole(true)} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === "dashboard" && currentUser) syncSavedTargets(currentUser.email);
        }}
        savedTargetsCount={savedTargets.length}
        onExitConsole={() => setShowAppConsole(false)}
        onLogout={handleLogout}
        userEmail={currentUser.email}
        userOrg={currentUser.orgName}
      />

      {/* Main View Area */}
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}
