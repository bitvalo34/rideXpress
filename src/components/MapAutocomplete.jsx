import React, { useEffect, useRef, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

/* ---------- Helpers ---------- */
const RECENT_KEY = "recentPlaces";
const getRecents = () => JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
const addRecent = (desc) => {
  const recents = getRecents()
    .filter((d) => d !== desc)
    .slice(0, 4);
  localStorage.setItem(RECENT_KEY, JSON.stringify([desc, ...recents]));
};

/**
 * Campo con Autocomplete + recents
 * @param value     string
 * @param onSelect  (description, lat, lng) => void
 */
function MapAutocomplete({ value, onSelect, placeholder }) {
  const {
    ready,
    value: input,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  /* sincr. valor externo */
  const skip = useRef(false);
  useEffect(() => {
    if (!skip.current) setValue(value, false);
    skip.current = false;
  }, [value, setValue]);

  /* controlar foco para recents */
  const [showRecents, setShowRecents] = useState(false);
  const handleFocus = () => setShowRecents(input.trim() === "");

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();
    addRecent(description); // guarda en localStorage
    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);
    onSelect(description, lat, lng);
    setShowRecents(false);
  };

  /* lista a mostrar: recents si no hay texto, sugerencias si hay */
  const listItems =
    input.trim() === "" && showRecents
      ? getRecents().map((d) => ({ description: d, place_id: d }))
      : status === "OK"
      ? data
      : [];

  return (
    <div className="position-relative">
      <input
        className="form-control"
        value={input}
        placeholder={placeholder}
        onFocus={handleFocus}
        onChange={(e) => {
          skip.current = true;
          setValue(e.target.value);
          setShowRecents(e.target.value.trim() === "");
        }}
      />

      {/* spinner mientras ready == false */}
      {!ready && (
        <div className="spinner-border spinner-border-sm position-absolute end-0 top-50 translate-middle-y me-2" />
      )}

      {listItems.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-sm z-3">
          {listItems.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelect(description)}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MapAutocomplete;
