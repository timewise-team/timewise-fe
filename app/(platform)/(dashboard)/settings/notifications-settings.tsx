/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function NotificationSettings() {
    const [settings, setSettings] = useState<{
        notificationOnTag: boolean;
        notificationOnComment: boolean;
        notificationOnDueDate: boolean;
        notificationOnScheduleChange: boolean;
        notificationOnEmail: boolean;
    }>({
        notificationOnTag: false,
        notificationOnComment: false,
        notificationOnDueDate: false,
        notificationOnScheduleChange: false,
        notificationOnEmail: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    // Fetch initial settings
    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/notification-setting`+session?.user?.id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch settings");
                }

                const data = await response.json();
                setSettings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/notification-settings", {
                method: "POST", // Or PUT depending on your API
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                throw new Error("Failed to save settings");
            }

            console.log("Settings saved successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSettings({
            notificationOnTag: false,
            notificationOnComment: false,
            notificationOnDueDate: false,
            notificationOnScheduleChange: false,
            notificationOnEmail: false,
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Notification Settings</h1>
            <p className="text-gray-600 mb-6">Manage your preferences for notifications.</p>

            <div className="space-y-4">
                {Object.keys(settings).map((key) => (
                    <div key={key} className="flex justify-between items-center">
                        <label className="text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                        <input
                            type="checkbox"
                            checked={settings[key as keyof typeof settings]} // Explicitly cast key
                            onChange={() => handleToggle(key as keyof typeof settings)} // Explicitly cast key
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Reset Defaults
                </button>
            </div>
        </div>
    );
}
