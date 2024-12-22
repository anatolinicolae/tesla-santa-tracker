import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useSettings() {
    const [power, setPower] = useState(null)
    const [speed, setSpeed] = useState(null)
    const [state, setState] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Initial fetch
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('key, value')
                    .in('key', ['power', 'speed', 'state'])

                if (error) throw error

                data.forEach(setting => {
                    if (setting.key === 'power') setPower(setting.value)
                    if (setting.key === 'speed') setSpeed(setting.value)
                    if (setting.key === 'state') setState(setting.value)
                })
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()

        // Realtime subscription
        const subscription = supabase
            .channel('settings_changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'settings' },
                (payload) => {
                    if (payload.new.key === 'power') setPower(payload.new.value)
                    if (payload.new.key === 'speed') setSpeed(payload.new.value)
                    if (payload.new.key === 'state') setState(payload.new.value)
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return { power, speed, state, loading, error }
}
