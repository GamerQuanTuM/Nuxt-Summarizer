<template>
  <div @click="handleClose"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div @click.stop class="bg-white rounded-lg shadow-xl h-96 w-full max-w-md mx-4">
      <!-- Tabs -->
      <div class="flex w-[80%] border-gray-200 mx-auto border mt-6 bg-gray-300 rounded-md">
        <button @click="activeTab = 'login'" :class="[
          'flex-1 text-center p-2 text-sm font-medium',
          activeTab === 'login'
            ? 'bg-white rounded-md m-1 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Sign In
        </button>

        <button @click="activeTab = 'register'" :class="[
          'flex-1 text-center p-2 text-sm font-medium',
          activeTab === 'register'
            ? 'bg-white rounded-md m-1 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]">
          Sign Up
        </button>
      </div>

      <div class="p-6">
        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="email">
              Email
            </label>
            <input class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="email" type="email"
              placeholder="Enter your email" v-model="loginForm.email">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="password">
              Password
            </label>
            <input class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="password"
              type="password" placeholder="Enter your password" v-model="loginForm.password">
          </div>
          <div class="pt-4">
            <button
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 mt-14"
              type="submit">
              Sign In
            </button>
          </div>
        </form>

        <!-- Register Form -->
        <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700" for="name">
              Full Name
            </label>
            <input class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="name" type="text"
              placeholder="Enter your full name" v-model="registerForm.name">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="register-email">
              Email
            </label>
            <input class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="register-email"
              type="email" placeholder="Enter your email" v-model="registerForm.email">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700" for="register-password">
              Password
            </label>
            <input class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" id="register-password"
              type="password" placeholder="Create a password" v-model="registerForm.password">
          </div>
          <div>
            <button :disabled="registerStatus === 'pending'"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400 disabled:cursor-pointer"
              type="submit">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
const activeTab = ref<'login' | 'register'>('login')

const events = defineEmits<{
  (e: 'close'): void;
}>();


const handleClose = () => {
  events("close")
}

const { $setUserDetails, $showModal,$toast } = useNuxtApp();

const router = useRouter()

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: ''
})

const registerStatus = ref<"error" | "idle" | "pending" | "success" | null>(null)
const loginStatus = ref<"error" | "idle" | "pending" | "success" | null>(null)


const handleLogin = async () => {
  const { data, status } = await useFetch(`/api/login`, {
    method: 'POST',
    body: {
      email: loginForm.email,
      password: loginForm.password,
    },
  })

  if (status.value === 'success' && data.value) {
    const user = data.value as User
    $setUserDetails(user);
    loginStatus.value = 'success'
    $toast.success("Logged in")
    $showModal.value = false
    router.push("/dashboard")
  } else {
    loginStatus.value = 'error'
    $toast.error("Something went wrong!!!")
  }
}

const handleRegister = async () => {
  const { data, status } = await useFetch(`/api/register`, {
    method: 'POST',
    body: {
      email: registerForm.email,
      password: registerForm.password,
      name: registerForm.name,
      userId: uuidv4()
    },
  })

  if (status.value === 'success' && data.value) {
    registerStatus.value = 'success'
    $toast.success("Account created")
    $showModal.value = false
  } else {
    registerStatus.value = 'error'
    $toast.error("Something went wrong!!!")
  }
}
</script>
