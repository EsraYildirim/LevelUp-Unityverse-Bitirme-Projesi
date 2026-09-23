<template>
  <section class="test-example">
    <h2 class="test-example__title">Slider Örneği</h2>
    <div class="test-slider" :style="{ backgroundColor: sliderColor }">
      {{ slider }}
    </div>
    <div class="test-slider__buttons mt-3">
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="setSlider('slider1.png', '#667eea')"
      >
        Slider 1
      </button>
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="setSlider('slider2.png', '#764ba2')"
      >
        Slider 2
      </button>
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="setSlider('slider3.jpg', '#28a745')"
      >
        Slider 3
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Slider örneği için reaktif veriler
const slider = ref('slider1.png')
const sliderColor = ref('#667eea')
function setSlider(name, color) {
  slider.value = name
  sliderColor.value = color
}
</script>

<style scoped>
.test-slider {
  color: #fff;
  font-weight: 700;
  padding: 2.5rem 1rem;
  transition: background-color 0.3s ease;
}

.test-slider__buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
</style>
