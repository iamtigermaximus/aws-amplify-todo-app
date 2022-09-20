import { withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import './App.css'
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from './graphql/mutations'
import { listTodos } from './graphql/queries'

const initialFormState = { name: '', description: '' }

function App({ signOut }) {
  const [todos, setTodos] = useState([])
  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos })
    setTodos(apiData.data.listTodos.items)
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return
    await API.graphql({
      query: createTodoMutation,
      variables: { input: formData },
    })
    setTodos([...todos, formData])
    setFormData(initialFormState)
  }
  async function deleteTodo({ id }) {
    const newTodosArray = todos.filter((todo) => todo.id !== id)
    setTodos(newTodosArray)
    await API.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    })
  }
  return (
    <div className='App'>
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder='Note name'
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder='Note description'
        value={formData.description}
      />
      <button onClick={createTodo}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {todos.map((todo) => (
          <div key={todo.id || todo.name}>
            <h2>{todo.name}</h2>
            <p>{todo.description}</p>
            <button onClick={() => deleteTodo(todo)}>Delete todo</button>
          </div>
        ))}
      </div>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

export default withAuthenticator(App)
