import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function useSettings() {
    const [heading, setHeading] = useState(0)
    const [power, setPower] = useState(0)
    const [speed, setSpeed] = useState(0)
    const [state, setState] = useState('offline')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Initial fetch
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from('settings')
                    .select('key, value')
                    .in('key', ['heading', 'power', 'speed', 'state'])

                if (error) throw error

                data.forEach(setting => {
                    if (setting.key === 'heading') setHeading(setting.value)
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
                    if (payload.new.key === 'heading') setHeading(payload.new.value)
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

    return { heading, power, speed, state, loading, error }
}
