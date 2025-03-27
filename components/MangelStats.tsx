import { Mangel } from '@/lib/supabase'

interface MangelStatsProps {
  maengel: Mangel[]
}

export default function MangelStats({ maengel }: MangelStatsProps) {
  const totalMaengel = maengel.length
  const offeneMaengel = maengel.filter(m => !m.is_done).length

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Gesamtanzahl</h3>
          <p className="text-3xl font-bold text-blue-600">{totalMaengel}</p>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Offene Mängel</h3>
          <p className="text-3xl font-bold text-red-600">{offeneMaengel}</p>
        </div>
      </div>
    </div>
  )
} 