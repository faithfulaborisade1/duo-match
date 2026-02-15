"use client";

import { useState, useEffect } from "react";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Toggle } from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";
import type { MatchPreferences } from "@/types/api";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"];
const GAME_STYLES = [
  { id: "competitive", label: "Competitive" },
  { id: "cooperative", label: "Cooperative" },
  { id: "casual", label: "Casual" },
  { id: "strategic", label: "Strategic" },
];

export function MatchPreferencesEditor() {
  const { data: preferences, isLoading, isError } = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const [localPrefs, setLocalPrefs] = useState<Partial<MatchPreferences>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences.mutate(localPrefs as any, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  const updateField = (field: string, value: any) => {
    setLocalPrefs((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return <Alert variant="error">Failed to load preferences. Please try again.</Alert>;
  }

  return (
    <div className="space-y-6">
      {updatePreferences.isSuccess && (
        <Alert variant="success">Preferences updated successfully!</Alert>
      )}

      {updatePreferences.isError && (
        <Alert variant="error">Failed to update preferences. Please try again.</Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Age Range</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {AGE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => updateField("ageRange", range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                  (localPrefs as any)?.ageRange === range
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-primary-400"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferred Game Styles</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {GAME_STYLES.map((style) => {
              const prefs = localPrefs as any;
              const gameStyles: string[] = Array.isArray(prefs?.gameStyles) ? prefs.gameStyles : [];
              const isSelected = gameStyles.includes(style.id);
              return (
                <div key={style.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">{style.label}</span>
                  <Toggle
                    checked={isSelected}
                    onChange={(checked) => {
                      const updated = checked
                        ? [...gameStyles, style.id]
                        : gameStyles.filter((s: string) => s !== style.id);
                      updateField("gameStyles", updated);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matching Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Smart matching</p>
                <p className="text-xs text-neutral-500">Use AI to find better matches</p>
              </div>
              <Toggle
                checked={(localPrefs as any)?.smartMatching ?? true}
                onChange={(checked) => updateField("smartMatching", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700">Show online only</p>
                <p className="text-xs text-neutral-500">Only match with currently active users</p>
              </div>
              <Toggle
                checked={(localPrefs as any)?.onlineOnly ?? false}
                onChange={(checked) => updateField("onlineOnly", checked)}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges || updatePreferences.isPending}
        >
          {updatePreferences.isPending ? "Saving..." : "Save preferences"}
        </Button>
      </div>
    </div>
  );
}
