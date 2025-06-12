import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// This would go in a separate file like components/TodosList.tsx
export default async function TodosList() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Todo List</h2>
      <ul className="space-y-2">
        {todos?.map((todo, index) => (
          <li key={todo.id || index} className="p-2 border rounded">
            {typeof todo === 'string' ? todo : JSON.stringify(todo)}
          </li>
        ))}
      </ul>
    </div>
  )
}
