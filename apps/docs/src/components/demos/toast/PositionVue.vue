<script setup lang="ts">
import { ref } from 'vue';
import { Button, Toaster, toast } from '@chufix/vue';

type Pos =
  | 'top-right' | 'top-left' | 'top-center'
  | 'bottom-right' | 'bottom-left' | 'bottom-center';

const position = ref<Pos>('top-right');

function show(p: Pos) {
  position.value = p;
  toast(`这条 Toast 出现在 ${p}`);
}
</script>

<template>
  <div class="demo-row">
    <Button variant="outline" @click="show('top-left')">top-left</Button>
    <Button variant="outline" @click="show('top-center')">top-center</Button>
    <Button variant="outline" @click="show('top-right')">top-right</Button>
    <Button variant="outline" @click="show('bottom-left')">bottom-left</Button>
    <Button variant="outline" @click="show('bottom-center')">bottom-center</Button>
    <Button variant="outline" @click="show('bottom-right')">bottom-right</Button>
  </div>
  <Toaster :position="position" />
</template>
