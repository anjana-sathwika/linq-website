import React, { useState } from "react";
import { LocationInput, type Location } from "./location-input";

export function LocationDemo() {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [drop, setDrop] = useState<Location | null>(null);

  const handleFindRide = () => {
    if (pickup && drop) {
      console.log("Finding ride:", {
        pickup: {
          name: pickup.name,
          lat: pickup.lat,
          lng: pickup.lng
        },
        drop: {
          name: drop.name,
          lat: drop.lat,
          lng: drop.lng
        }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Location Autocomplete Demo</h1>
        <p className="text-muted-foreground">
          Try typing locations like "Bandra", "BKC", "Andheri", etc.
        </p>
      </div>

      <div className="space-y-4">
        <LocationInput
          value={pickup}
          onChange={setPickup}
          label="Pickup Location"
          placeholder="Enter pickup location..."
        />

        <LocationInput
          value={drop}
          onChange={setDrop}
          label="Drop Location"
          placeholder="Where are you going?"
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handleFindRide}
          disabled={!pickup || !drop}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Find Ride
        </button>

        {(pickup || drop) && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Selected Locations:</h3>
            {pickup && (
              <div className="mb-2">
                <strong>Pickup:</strong> {pickup.name} ({pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)})
              </div>
            )}
            {drop && (
              <div>
                <strong>Drop:</strong> {drop.name} ({drop.lat.toFixed(4)}, {drop.lng.toFixed(4)})
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
