import { supabase } from '@/lib/supabase'
import MangelList from '@/components/MangelList'
import MangelStats from '@/components/MangelStats'
import CreateMangelForm from '@/components/CreateMangelForm'

export default async function Home() {
  const { data: maengel, error } = await supabase
    .from('maengel')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden der Mängel:', error)
    return <div>Fehler beim Laden der Mängel</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mängelübersicht</h1>
      <MangelStats maengel={maengel || []} />
      <div className="mt-8">
        <MangelList maengel={maengel || []} />
      </div>
    </main>
  )
} 