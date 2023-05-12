<template>
  <div class="board">
    <div class="card">
      <div class="card-header">
        <h2>Список дел</h2>
      </div>
      <div class="card-body">
        <ul
          class="task-list"
          @dragover="dragOver"
          @drop="drop('newTasks', $event)"
        >
          <li
            v-for="(task, idx) in newTasks"
            :key="idx"
            class="task-item"
            :draggable="true"
            @dragstart="dragStart('newTasks', idx, $event)"
            @dragenter="dragEnter"
          >
            {{ isEdit && currentItemIdx === idx ? '' : task.text }}
            <input
              v-if="isEdit && currentItemIdx === idx"
              v-model="task.text"
            />
            <button class="pen-button" @click="isShowInput(idx, task.text)">
              {{
                isEdit && currentItemIdx === idx ? 'Сохранить' : 'Редактировать'
              }}
            </button>
          </li>
        </ul>
      </div>
      <div class="card-footer">
        <input
          v-model="taskText"
          class="card-footer__input"
          placeholder="Введите значение"
        />
        <button
          class="card-footer__button"
          @click="handleClickAddItem('newTasks')"
        >
          Добавить
        </button>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>В процессе</h2>
      </div>
      <div class="card-body">
        <ul
          class="task-list"
          @dragover="dragOver"
          @drop="drop('inProgressTasks', $event)"
        >
          <li
            v-for="(task, idx) in inProgressTasks"
            :key="idx"
            class="task-item"
            :draggable="true"
            @dragstart="dragStart('inProgressTasks', idx, $event)"
            @dragenter="dragEnter"
          >
            {{ task.text }}
          </li>
          <li v-if="inProgressTasks.length === 0">drop here</li>
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h2>Готово</h2>
      </div>
      <div class="card-body">
        <ul
          class="task-list"
          @dragover="dragOver"
          @drop="drop('completeTasks', $event)"
        >
          <li
            v-for="(task, idx) in completeTasks"
            :key="idx"
            class="task-item"
            :draggable="true"
            @dragstart="dragStart('completeTasks', idx, $event)"
            @dragenter="dragEnter"
          >
            {{ task.text }}
          </li>
          <li v-if="completeTasks.length === 0">drop here</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useTodoListStore } from '../stores/useTodoListStore'
import { generateRandomId } from '../helpers/generateRandomId'

const store = useTodoListStore()
const newTasks = store.newTasks
const inProgressTasks = store.inProgressTasks
const completeTasks = store.completeTasks
const taskText = ref('')
const isEdit = ref(false)

const currentItemIdx = ref(null)

const dragStart = (cardName, index, event) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({ cardName, index }))
}

const drop = (cardName, event) => {
  const { cardName: sourceCardName, index: sourceIndex } = JSON.parse(
    event.dataTransfer.getData('text/plain')
  )
  const targetIndex = Array.from(event.target.parentNode.children).indexOf(
    event.target
  )
  if (cardName === sourceCardName) {
    store.moveItemInCurrentCard({ cardName, sourceIndex, targetIndex })
  } else {
    store.moveItemBetweenCards({
      sourceCardName,
      sourceIndex,
      targetCardName: cardName,
      targetIndex,
    })
  }
}

const dragEnter = (event) => {
  event.preventDefault()
}

const dragOver = (event) => {
  event.preventDefault()
}

const handleClickAddItem = (cardName) => {
  if (!taskText.value) {
    return
  }
  const newTask = {
    id: generateRandomId(),
    text: taskText.value,
  }

  store.addNewTask(newTask, cardName)

  taskText.value = ''
}

const isShowInput = (idx, newValue) => {
  isEdit.value = true

  if (currentItemIdx.value === idx) {
    store.updateTask(idx, newValue)
    isEdit.value = false
    currentItemIdx.value = null
  } else {
    currentItemIdx.value = idx
  }
}
</script>

<style>
body {
  background-color: #d442f5;
}
.board {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 20px;
}

.card {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f2f4;
  border-radius: 8px;
  margin: 8px;
  padding: 8px;
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.task-item {
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px;
  padding: 10px;
  background-color: white;
}

.task-item:hover {
  cursor: pointer;
}
.card-footer {
  display: flex;
  flex-direction: column;
}
.card-footer__input {
  height: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.card-footer__button {
  background-color: palevioletred;
  margin-top: 10px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pen-button {
  float: right;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 16px;
}
</style>
