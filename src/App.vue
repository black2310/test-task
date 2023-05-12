<template>
  <div class="board">
    <template
      v-for="(card, idx) of ['newTasks', 'inProgressTasks', 'completeTasks']"
      :key="idx"
    >
      <app-card
        :card-name="card"
        :items-name="card"
        @dropEvent="drop"
        @dragEvent="dragStart"
        @handleAddTasks="addTask"
      />
    </template>
  </div>
</template>
<script setup>
import { useTodoListStore } from '../stores/useTodoListStore'
import AppCard from '@/components/AppCard'

const store = useTodoListStore()

const dragStart = ({ cardName, index, event }) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({ cardName, index }))
}

const drop = ({ cardName, event }) => {
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
const addTask = (newTask) => {
  store.addNewTask(newTask)
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
</style>
