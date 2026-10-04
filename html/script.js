class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.editingTaskId = null;

        this.taskInput = document.querySelector('.task-input');
        this.addBtn = document.querySelector('.add-btn');
        this.todoList = document.getElementById('todo-list');

        this.totalTasksEl = document.getElementById('total-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        this.remainingTasksEl = document.getElementById('remaining-tasks');

        this.init();
    }

    init() {
        this.loadTasks();

        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        this.updateStats();
        this.renderTasks();

        if (this.tasks.length === 0 && !localStorage.getItem('hasUsedAppBefore')) {
            this.addSampleTasks();
            localStorage.setItem('hasUsedAppBefore', 'true');
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('todoTasks');
            const savedCounter = localStorage.getItem('todoCounter');

            if (savedTasks) this.tasks = JSON.parse(savedTasks);
            if (savedCounter) this.taskIdCounter = parseInt(savedCounter);
        } catch (error) {
            console.log('localStorage unavailable.');
            this.tasks = [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
            localStorage.setItem('todoCounter', this.taskIdCounter.toString());
        } catch (error) {
            console.log('Could not save to localStorage.');
        }
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: this.taskIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.taskInput.value = '';
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    deleteTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);

        if (taskElement) {
            taskElement.style.animation = 'fadeOut 0.3s ease-out';
            taskElement.addEventListener('animationend', () => {
                this.tasks = this.tasks.filter(task => task.id !== id);
                this.saveTasks();
                this.renderTasks();
                this.updateStats();
            });
        } else {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    editTask(id) {
        if (this.editingTaskId === id) return;

        this.editingTaskId = id;
        this.renderTasks();

        const taskElement = document.querySelector(`[data-id="${id}"] .todo-text`);
        if (taskElement) {
            taskElement.focus();
            const range = document.createRange();
            range.selectNodeContents(taskElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    saveTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveTasks();
        }
        this.editingTaskId = null;
        this.renderTasks();
    }

    cancelEdit() {
        this.editingTaskId = null;
        this.renderTasks();
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.todoList.innerHTML = `<div class="empty-state"><p>No tasks yet. Add one above to get started!</p></div>`;
            return;
        }

        this.todoList.innerHTML = this.tasks.map(task => {
            const isEditing = this.editingTaskId === task.id;

            return `
                <div class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <div class="todo-checkbox ${task.completed ? 'checked' : ''}"
                         onclick="todoApp.toggleTask(${task.id})">✔</div>

                    <div class="todo-text ${isEditing ? 'editing' : ''}"
                         ${isEditing ? 'contenteditable="true"' : ''}
                         onclick="${!isEditing ? `todoApp.editTask(${task.id})` : ''}"
                         onblur="${isEditing ? `todoApp.saveTask(${task.id}, this.textContent)` : ''}"
                         onkeypress="${isEditing ? `if(event.key==='Enter'){event.preventDefault();this.blur();}` : ''}"
                         onkeydown="${isEditing ? `if(event.key==='Escape'){event.preventDefault();todoApp.cancelEdit();}` : ''}">
                        ${this.escapeHtml(task.text)}
                    </div>

                    <div class="todo-actions">
                        <button onclick="todoApp.editTask(${task.id})">✏️</button>
                        <button onclick="todoApp.deleteTask(${task.id})">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.remainingTasksEl.textContent = remaining;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addSampleTasks() {
        const samples = [
            "Welcome to your new To-Do app! 🎉",
            "Click on a task to edit it",
            "Use checkboxes to mark tasks done"
        ];
        setTimeout(() => {
            samples.forEach(text => {
                this.tasks.push({
                    id: this.taskIdCounter++,
                    text,
                    completed: false,
                    createdAt: new Date().toISOString()
                });
            });
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }, 500);
    }

    clearAllTasks() {
        if (this.tasks.length === 0) return;

        if (confirm('Delete ALL tasks?')) {
            this.tasks = [];
            localStorage.removeItem('todoTasks');
            localStorage.removeItem('todoCounter');
            localStorage.removeItem('hasUsedAppBefore');
            this.renderTasks();
            this.updateStats();
        }
    }

    clearCompletedTasks() {
        const completed = this.tasks.filter(t => t.completed);
        if (completed.length === 0) return;

        if (confirm(`Delete ${completed.length} completed tasks?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    resetApp() {
        if (confirm('This will clear all data and reset the app. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});
