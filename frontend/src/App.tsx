import { useEffect, useState } from 'react'
import './App.css'
import { Task } from './types'
import { addNewTask, deleteATask, fetchAllTasks, updateATask } from './utils'

function App() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [inputTask, setInputTask] = useState<string>("")
  const [taskToUpdate, setTaskToUpdate] = useState<Task>()

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)) 

  useEffect(() => {
    async function fetchTasks() {
      try {
        for (let i = 0; i < 5; i++) {
          const results = await fetchAllTasks()
          if (results) {
            setTasks(results)
            break
          }
          await delay(1000)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchTasks()
  }, [])

  const addTask = async() => {
    try {
      const newTask = await addNewTask(inputTask)
      setTasks(prev => [...prev, newTask])
      fetchAllTasks()
      setInputTask("")
    } catch(err) {
      console.log(err)
    }
  }

  const deleteTask = async(id: number) => {
    try {
      await deleteATask(id)
      setTasks(prev => prev.filter(task => task.id !== id))
      fetchAllTasks()
    } catch(err) {
      console.log(err)
    }
  }

  const updateTask = async() => {
    if (!taskToUpdate) return
    try {
      const result = await updateATask({id: taskToUpdate.id, content: inputTask})
      setTasks(prev => {
        return prev.map(task => {
          if (task.id === taskToUpdate.id) return result
          return task
        })
      })
      fetchAllTasks()
      setTaskToUpdate(undefined)
      setInputTask("")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='container-fluid min-vh-100 background d-flex flex-column'>
      <h1 className="text-center my-3">Simple To Do Application</h1>
      <div className='container-fluid w-50 flex-grow-1 h-100'>
        <div className='my-5'>
          <h4>{taskToUpdate ? "Update Task:" : "Add Task:"}</h4>
          <div className='row mx-auto'>
            <div className='col-10 ps-0'>
              <input type="text" className='form-control' value={inputTask} placeholder='Enter New Task...' onChange={eve => setInputTask(eve.target.value)}></input>
            </div>
            <button className='btn col-2 btn-primary' onClick={taskToUpdate ? updateTask : addTask}>{taskToUpdate ? "Update": "Add"}</button>
          </div>
        </div>
        <div className='container-fluid px-0 tasks-container'>
            {tasks.map(task => {
              return (
                <div className='task-container' key={task.id}>
                  {task.content}
                  <div className='action-group'>
                    <button className='btn px-1 py-1 me-1' onClick={() => {
                      setTaskToUpdate(task)
                      setInputTask(task.content)
                    }}>
                      <i className="bi bi-pencil-fill h5"></i>
                    </button>
                    <button className='btn px-1 py-1' onClick={() => deleteTask(task.id)}>
                      <i className="bi bi-x-circle-fill h5"></i>
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default App
