import { Task } from "./types";

//set backend url depending on node environment
const backendURL = process.env.NODE_ENV === "development" ? "localhost" : "simple-todo-lb-269025311.us-west-2.elb.amazonaws.com"

export const fetchAllTasks = async(): Promise<Task[]> => {
  return fetch(`http://${backendURL}:8080/api/tasks`, {
    method: "GET",
    headers: {"Content-Type": "application/json"}
  }).then(response => {
    if (response.ok) return response.json()
    return response.json().then(error => {
      throw new Error((error as Error).message)
    })
  }).then(result => result)
  .catch(err => console.log(err.message))
}

export const addNewTask = async(content: string): Promise<Task> => {
  return fetch(`http://${backendURL}:8080/api/tasks`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      content
    })
  }).then(response => {
    if (response.ok) return response.json()
    return response.json().then(error => {
      throw new Error((error as Error).message)
    })
  }).then(result => result).catch(error => console.log(error.message))
}

export const deleteATask = async(id: number): Promise<string | void> => {
  return fetch(`http://${backendURL}:8080/api/tasks/${id}`, {
    method: "DELETE",
    headers: {"Content-Type": "application/json"},
  }).then(response => {
    if (response.ok) return response.text()
    return response.json().then(error => {
      throw new Error((error as Error).message)
    })
  }).then(result => result).catch(error => console.log(error.message))
}

export const updateATask = async(task: Task): Promise<Task> => {
  return fetch(`http://${backendURL}:8080/api/tasks`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(task)
  }).then(response => {
    if (response.ok) return response.json()
    return response.json().then(error => {
      throw new Error((error as Error).message)
    })
  }).then(result => result).catch(error => console.log(error.message))
}

