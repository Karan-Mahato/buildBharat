import { useEffect, useState } from "react";
import { useAutoLocation } from "./hooks/useAutoLocation";
import { checkHealth } from "./api/healthAPI";
import { fetchAllStates, fetchDistrictsByState } from "./api/districtAPI";
import { useTranslation } from "react-i18next";
import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Help from "./pages/help";
import Share from "./pages/share";

export default function App() {
  const { state: autoState, district: autoDistrict } = useAutoLocation();
  const [status, setStatus] = useState("Loading...");
  const [statesData, setStatesData] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [detected, setDetected] = useState({ state: "", district: "" });
  const [currentPage, setCurrentPage] = useState("home");
  const [districtData, setDistrictData] = useState(null);
  const [language, setLanguage] = useState("en");
  const [activeCategory, setActiveCategory] = useState('employment');

  const { t, i18n } = useTranslation();

  const normalizeState = (detectedName) => {
    if (!detectedName) return "";
    const clean = detectedName
      .replace("IN-", "")
      .replace("_", " ")
      .trim()
      .toLowerCase();

    const map = {
      dl: "Delhi",
      delhi: "Delhi",
      jharkhand: "Jharkhand",
      in_dl: "Delhi",
      in_jh: "Jharkhand",
      mh: "Maharashtra",
      in_mh: "Maharashtra",
    };

    return map[clean] || capitalizeWords(clean);
  };

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (c) => c.toUpperCase()).trim();

  // Load state list from backend (multi-state). Lazy-load districts per-state when selected.
  useEffect(() => {
    (async () => {
      try {
        const states = await fetchAllStates();
        // initialize mapping with empty arrays; districts will be loaded on demand
        const map = {};
        states.forEach((s) => (map[s] = []));
        setStatesData(map);
      } catch (err) {
        console.warn("Failed to fetch states from backend - falling back to local file", err);
        // fallback to bundled JSON for offline / dev mode
        fetch("/data/states_districts.json")
          .then((res) => res.json())
          .then(setStatesData)
          .catch(() => console.error("Failed to load state-district data"));
      }
    })();
  }, []);

  // When user selects a state, fetch its districts if we don't already have them
  useEffect(() => {
    if (!selectedState) return;
    if (statesData[selectedState] && statesData[selectedState].length) return;

    (async () => {
      try {
        const districts = await fetchDistrictsByState(selectedState);
        setStatesData((prev) => ({ ...prev, [selectedState]: districts }));
      } catch (err) {
        console.error("Failed to fetch districts for state", selectedState, err);
      }
    })();
  }, [selectedState]);

  useEffect(() => {
    (async () => {
      const res = await checkHealth();
      setStatus(`${res.status} - ${res.message || "OK"}`);
    })();
  }, []);

  useEffect(() => {
    if (!Object.keys(statesData).length) return;

    let normalizedState = normalizeState(autoState);
    let normalizedDistrict = autoDistrict ? capitalizeWords(autoDistrict) : "";

    const detectionFailed =
      !autoState || !autoDistrict || !statesData[normalizedState];

    if (detectionFailed) {
      setDetected({ state: "", district: "" });
      return;
    }

    setDetected({
      state: normalizedState,
      district: normalizedDistrict,
    });
  }, [autoState, autoDistrict, statesData]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleNavigateToDashboard = () => {
    if (selectedState && selectedDistrict) {
      setCurrentPage("dashboard");
    }
  };

  const handleNavigateToHome = () => {
    setCurrentPage("home");
  };

  const handleNavigateToHelp = () => {
    setCurrentPage("help");
  };

  const handleNavigateToShare = () => {
    setCurrentPage("share");
  };

  return (
    <>
      {currentPage === "home" && (
        <Home
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          onNavigateToDashboard={handleNavigateToDashboard}
          onNavigateToHelp={handleNavigateToHelp}
          statesData={statesData}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {currentPage === "dashboard" && (
        <Dashboard
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          onNavigateToHome={handleNavigateToHome}
          onNavigateToHelp={handleNavigateToHelp}
          onNavigateToShare={handleNavigateToShare}
          language={language}
          setLanguage={setLanguage}
          onDistrictDataChange={setDistrictData}
        />
      )}

      {currentPage === "help" && (
        <Help
          onNavigateToHome={handleNavigateToHome}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {currentPage === "share" && (
        <Share
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          districtData={districtData}
          activeCategory={activeCategory}
          onNavigateToDashboard={() => {
            setCurrentPage("dashboard");
          }}
          language={language}
        />
      )}
    </>
  );
}
