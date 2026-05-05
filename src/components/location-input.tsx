import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

export interface Location {
  name: string;
  lat: number;
  lng: number;
  display_name?: string;
}

interface LocationInputProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
}

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    [key: string]: string;
  };
  boundingbox: [string, string, string, string];
}

const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";
const DEBOUNCE_DELAY = 400;

// Cache for recent searches to reduce API calls
const searchCache = new Map<string, NominatimResult[]>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function LocationInput({
  value,
  onChange,
  placeholder = "Enter location...",
  disabled = false,
  className = "",
  label
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const abortControllerRef = useRef<AbortController | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Update input when value prop changes
  useEffect(() => {
    if (value?.name !== inputValue) {
      setInputValue(value?.name || "");
    }
  }, [value, inputValue]);

  // Clean up search cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window === "undefined") return;
      const now = Date.now();
      for (const [key] of searchCache) {
        if (now - parseInt(key.split('_')[1]) > CACHE_EXPIRY) {
          searchCache.delete(key);
        }
      }
    }, CACHE_EXPIRY);

    return () => clearInterval(interval);
  }, []);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Check cache first
    const cacheKey = `${query}_${typeof window !== "undefined" ? Date.now() : 0}`;
    const cached = Array.from(searchCache.entries())
      .find(([key]) => key.startsWith(query.split(' ')[0]))
      ?.[1];

    if (cached) {
      setSuggestions(cached);
      setShowSuggestions(true);
      return;
    }

    setIsLoading(true);
    setShowSuggestions(true);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'in', // Focus on India, remove for global
        'accept-language': 'en'
      });

      const response = await fetch(`${NOMINATIM_API}?${params}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'linq-ride-app/1.0' // Required by Nominatim policy
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const results: NominatimResult[] = await response.json();

      // Cache the results
      searchCache.set(cacheKey, results);

      setSuggestions(results);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Location search error:', error);
      }
      setSuggestions([]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(inputValue);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [inputValue, searchLocations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    // Clear location if input is cleared
    if (!value.trim()) {
      onChange(null);
    }
  };

  const handleSelectLocation = (result: NominatimResult) => {
    const location: Location = {
      name: result.display_name.split(',')[0], // Use first part as name
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name
    };

    setInputValue(location.name);
    onChange(location);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0 || inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const formatSuggestionText = (result: NominatimResult) => {
    const parts = result.display_name.split(',');
    return {
      main: parts[0],
      secondary: parts.slice(1).join(',').trim()
    };
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <ul
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((result, index) => {
              const { main, secondary } = formatSuggestionText(result);
              return (
                <li
                  key={result.place_id}
                  onClick={() => handleSelectLocation(result)}
                  className={`px-4 py-3 cursor-pointer transition-colors ${index === selectedIndex
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-foreground">
                        {main}
                      </div>
                      {secondary && (
                        <div className="text-xs text-muted-foreground truncate">
                          {secondary}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : inputValue.length >= 2 ? (
            <li className="px-4 py-3 text-muted-foreground text-sm">
              No locations found. Try a different search.
            </li>
          ) : null}
        </ul>
      )}
    </div>
  );
}
