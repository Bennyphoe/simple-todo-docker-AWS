package com.example.simpletodo.service;

import com.example.simpletodo.entity.Task;
import com.example.simpletodo.exception.APIException;
import com.example.simpletodo.repository.TaskRepository;
import jakarta.persistence.EntityManager;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskService {

    private TaskRepository taskRepository;
    private EntityManager entityManager;

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(int id) {
        return taskRepository.findById(id).orElseThrow(() -> new APIException(HttpStatus.BAD_REQUEST, "Task not found!"));
    }

    public Task updateTask(Task task) {
        Task taskToUpdate = getTaskById(task.getId());
        taskToUpdate.setContent(task.getContent());
        taskRepository.save(taskToUpdate);
        return taskToUpdate;
    }

    public String deleteTaskById(int id) {
        taskRepository.deleteById(id);
        return "task of id " + id + " is successfully deleted!";
    }

    public Task createTask(Task task) {
        Task newTask = new Task();
        newTask.setContent(task.getContent());
        return taskRepository.save(newTask);
    }
}
