<template>
  <section class="test-example">
    <h2 class="test-example__title">v-for Örneği</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Ad</th>
          <th scope="col">Soyad</th>
          <th scope="col">E-mail</th>
          <th scope="col">Parola</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.email">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.ad }}</td>
          <td>{{ user.soyad }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.parola }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// v-for örneği için kullanıcı listesi
const users = ref([
  { ad: 'Mark', soyad: 'Otto', email: '@mdo', parola: '••••••' },
  { ad: 'Jacob', soyad: 'Thornton', email: '@fat', parola: '••••••' },
  { ad: 'John', soyad: 'Doe', email: '@social', parola: '••••••' },
])
</script>
