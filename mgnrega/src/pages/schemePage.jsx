import { useEffect, useState } from "react";
import { fetchSchemes } from "../api/schemesAPI";
import SchemeList from "../components/schemeList";

export default function SchemesPage({ selectedState, selectedDistrict }) {
  const [schemes, setSchemes] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchSchemes();
      setSchemes(data);
      setFiltered(data);
    })();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const filteredList = schemes.filter(
        (s) =>
          (!s.state || s.state === selectedState) &&
          (!selectedDistrict || s.district === selectedDistrict)
      );
      setFiltered(filteredList);
    } else {
      setFiltered(schemes);
    }
  }, [selectedState, selectedDistrict, schemes]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Schemes</h2>
      <SchemeList schemes={filtered} onSelect={(id) => console.log("Scheme:", id)} />
    </div>
  );
}
