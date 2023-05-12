<template>
  <div class="card">
    <div class="card-header">
      <h2>{{ cardNames[cardName] }}</h2>
    </div>
    <div class="card-body">
      <ul class="task-list" @dragover="dragOver" @drop="drop(cardName, $event)">
        <li
          v-for="(task, idx) in items"
          :key="idx"
          class="task-item"
          :draggable="true"
          @dragstart="dragStart(cardName, idx, $event)"
          @dragenter="dragEnter"
        >
          {{ isEdit && currentItemIdx === idx ? '' : task.text }}
          <input v-if="isEdit && currentItemIdx === idx" v-model="task.text" />
          <button
            v-if="cardName === 'newTasks'"
            class="pen-button"
            @click="isShowInput(idx, task.text)"
          >
            {{
              isEdit && currentItemIdx === idx ? 'Сохранить' : 'Редактировать'
            }}
          </button>
        </li>
        <li v-if="items.length === 0">Задач нет</li>
      </ul>
    </div>
    <div v-if="cardName === 'newTasks'" class="card-footer">
      <input
        v-model="taskText"
        class="card-footer__input"
        placeholder="Введите значение"
        @keyup.enter="handleAddTasks"
      />
      <button class="card-footer__button" @click="handleAddTasks">
        Добавить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { generateRandomId } from '../../helpers/generateRandomId'
import { useTodoListStore } from '../../stores/useTodoListStore'

const props = defineProps({
  cardName: {
    type: String,
    required: true,
  },
  itemsName: {
    type: String,
    required: true,
  },
})

const cardNames = {
  newTasks: 'Список задач',
  inProgressTasks: 'В процессе',
  completeTasks: 'Завершенные задачи',
}

const store = useTodoListStore()
const items = store[props.itemsName]

const taskText = ref('')
const isEdit = ref(false)

const emit = defineEmits(['drag-event', 'drop-event', 'handle-add-tasks'])

const currentItemIdx = ref(null)

const dragStart = (cardName, index, event) => {
  emit('drag-event', { cardName, index, event })
}

const drop = (cardName, event) => {
  emit('drop-event', { cardName, event })
}

const dragEnter = (event) => {
  event.preventDefault()
}

const dragOver = (event) => {
  event.preventDefault()
}

const handleAddTasks = () => {
  if (!taskText.value) {
    return
  }
  const newTask = {
    id: generateRandomId(),
    text: taskText.value,
  }

  emit('handle-add-tasks', newTask)

  taskText.value = ''
}

const isShowInput = (idx, newValue) => {
  isEdit.value = true

  if (currentItemIdx.value === idx) {
    if (!newValue) {
      return
    }
    store.updateTask(idx, newValue)
    isEdit.value = false
    currentItemIdx.value = null
  } else {
    currentItemIdx.value = idx
  }
}
</script>

<style scoped>
.card {
  position: relative;
  width: 100%;
  height: 100%;
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
