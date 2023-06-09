import { defineStore } from 'pinia'

export const useTodoListStore = defineStore('todoList', {
  state: () => ({
    newTasks: JSON.parse(localStorage.getItem('newTasks')) || [],
    inProgressTasks: JSON.parse(localStorage.getItem('inProgressTasks')) || [],
    completeTasks: JSON.parse(localStorage.getItem('completeTasks')) || [],
  }),
  actions: {
    addNewTask(task) {
      this.newTasks.push(task)
      localStorage.setItem('newTasks', JSON.stringify(this.newTasks))
    },

    updateTask(idx, newValue) {
      const task = this.newTasks[idx]
      task.text = newValue
      localStorage.setItem('newTasks', JSON.stringify(this.newTasks))
    },

    moveItemInCurrentCard({ cardName, sourceIndex, targetIndex }) {
      const item = this[cardName].splice(sourceIndex, 1)[0]
      this[cardName].splice(targetIndex, 0, item)
      localStorage.setItem(cardName, JSON.stringify(this[cardName]))
    },

    moveItemBetweenCards({
      sourceCardName,
      sourceIndex,
      targetCardName,
      targetIndex,
    }) {
      const item = this[sourceCardName].splice(sourceIndex, 1)[0]
      this[targetCardName].splice(targetIndex, 0, item)
      localStorage.setItem(sourceCardName, JSON.stringify(this[sourceCardName]))
      localStorage.setItem(targetCardName, JSON.stringify(this[targetCardName]))
    },
  },
})
