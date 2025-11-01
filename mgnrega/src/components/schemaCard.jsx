export default function SchemeCard({ scheme, onSelect }) {
  return (
    <div
      className="p-4 border rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
      onClick={() => onSelect(scheme.id)}
    >
      <h3 className="font-semibold text-lg">{scheme.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
        {scheme.short_description}
      </p>
      <div className="mt-2 text-xs text-gray-500">
        <span>State: {scheme.state || "All India"}</span>
      </div>
    </div>
  );
}
