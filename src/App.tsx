import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

function App() {

  const inputRef = useRef<HTMLInputElement>(null)
  const firstRender = useRef(true)

  const [input, setInput] = useState('')
  const [tasks, setTasks] = useState<string[]>([])
  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })
  const [completed, setCompleted] = useState<string[]>([])

  useEffect(()=>{
    const savedTasks = localStorage.getItem("@tasks")

    if(savedTasks){
      setTasks(JSON.parse(savedTasks))
    }
  },[])

  useEffect(()=>{
    if(firstRender.current){
      firstRender.current = false
      return
    }
    localStorage.setItem("@tasks", JSON.stringify(tasks))
  },[tasks])

  const handleRegister = useCallback(()=>{
      if (!input) {
        alert("Digite uma tarefa")
        return
      }

      if (editTask.enabled) {
          handleSaveEdit()
          return
      }

    //Adicionar nova tarefa ao array de tarefas
    setTasks(prev => [...prev, input])

    //Limpar o campo do input
    setInput("")
  },[input, tasks])

  function handleDelete(item: string) {

    //Filtrar o array de tarefas e retorna sem o item desejado
    setTasks( prev => prev.filter(task => task !== item))

    //Mesma lógica para marcar como concluído
    setCompleted(prev => prev.filter(task => task !== item))
  }

  function handleEdit(item: string) {

    inputRef.current?.focus()

    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })
  }

  function handleSaveEdit() {
    //Encontrar o index da tarefa que está sendo editada no array de tarefas 
    const findIndexTask = tasks.findIndex(task => task === editTask.task)

    //Cria um novo array de tarefas
    const allTasks = [...tasks]

    //Altera o valor da posição editada pelo novo valor digitado
    allTasks[findIndexTask] = input

    //Atribui ao array de tarefas original o array com o valor editado
    setTasks(allTasks)


    if (completed.includes(editTask.task)) {
      setCompleted(prev =>
        prev.map(task => task === editTask.task ? input : task)
      )
    }

    //Desabilita a edição
    setEditTask({
      enabled: false,
      task: ''
    })

    setInput("")
  }

  function handleConcluir(item: string) {
    setCompleted(prev =>
      prev.includes(item)
      //Se a tarefa já estiver concluída, desmarca
        ? prev.filter(task => task !== item)

      //Se estiver concluída, marca
        : [...prev, item]
    )
  }

  return (
    <main>
      <h1>Lista de Tarefas</h1>

      <div className="task-input">
        <input
          type="text"
          placeholder="Digite uma tarefa"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />
        <button onClick={handleRegister}>
          {editTask.enabled ? "Atualizar tarefa" : "Adicionar tarefa"}
        </button>
      </div>

      {tasks.map((item) => (
        <section className="task-render" key={item}>
          <span className={completed.includes(item) ? 'done' : ''}>
            {item}
          </span>

          <button onClick={() => handleEdit(item)}>Editar</button>
          <button onClick={() => handleConcluir(item)}>Concluir</button>
          <button onClick={() => handleDelete(item)}>Excluir</button>
        </section>
      ))}
    </main>
  )
}

export default App
