import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import config from "../config/config";

export default function usePosition() {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [trail, setTrail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch initial positions
        async function fetchInitialPositions() {
            try {
                const { data, error } = await supabase
                    .from(config.supabase_source_table)
                    .select("latitude, longitude")
                    .order("created_at", { ascending: false })
                    .limit(1024);

                if (error) throw error;

                const positions = data.map((pos) => [pos.latitude, pos.longitude]).reverse();
                setTrail(positions);
                setCurrentPosition(positions[positions.length - 1]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInitialPositions();

        // Subscribe to realtime updates
        const subscription = supabase
            .channel(config.supabase_source_table)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: config.supabase_source_table,
                },
                (payload) => {
                    const newPosition = [payload.new.latitude, payload.new.longitude];
                    setCurrentPosition(newPosition);
                    setTrail((prev) => [...prev, newPosition]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return { currentPosition, trail, loading, error }
}
