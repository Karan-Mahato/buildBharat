import SchemeCard from "./schemaCard";

export default function SchemeList({ schemes, onSelect }) {
  if (!schemes?.length)
    return <p className="text-gray-500 text-center py-4">No schemes found</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {schemes.map((scheme) => (
        <SchemeCard key={scheme.id} scheme={scheme} onSelect={onSelect} />
      ))}
    </div>
  );
}
