<template>
  <div class="p-4">
    <button
      @click="addAccount"
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
      Добавить учетную запись
    </button>
    <div
      v-for="(account, index) in accounts"
      :key="index"
      class="account-row flex items-center space-x-4 mb-4"
    >
      <div class="account-field flex-1">
        <label class="block text-sm font-medium text-gray-700">Метка:</label>
        <input
          v-model="account.label"
          @input="updateLabel(index)"
          maxlength="50"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="account-field flex-1">
        <label class="block text-sm font-medium text-gray-700"
          >Тип записи:</label
        >
        <select
          v-model="account.accountType"
          @change="updateAccountType(index)"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>
      <div class="account-field flex-1">
        <label class="block text-sm font-medium text-gray-700">Логин:</label>
        <input
          v-model="account.login"
          @input="updateLogin(index)"
          maxlength="100"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div
        class="account-field flex-1"
        v-if="account.accountType === 'Локальная'"
      >
        <label class="block text-sm font-medium text-gray-700">Пароль:</label>
        <input
          type="password"
          v-model="account.password"
          @input="updatePassword(index)"
          maxlength="100"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        @click="removeAccount(index)"
        class="bg-red-500 text-white px-4 py-2 rounded self-end"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
  setup() {
    const accounts = ref([
      { label: "", accountType: "LDAP", login: "", password: "" },
    ]);

    const loadAccounts = () => {
      const savedAccounts = localStorage.getItem("accounts");
      if (savedAccounts) {
        accounts.value = JSON.parse(savedAccounts);
      }
    };

    const saveAccounts = () => {
      localStorage.setItem("accounts", JSON.stringify(accounts.value));
    };

    const addAccount = () => {
      accounts.value.push({
        label: "",
        accountType: "LDAP",
        login: "",
        password: "",
      });
      saveAccounts();
    };

    const removeAccount = (index: number) => {
      accounts.value.splice(index, 1);
      saveAccounts();
    };

    const updateLabel = (index: number) => (event: Event) => {
      const target = event.target as HTMLInputElement;
      accounts.value[index].label = target.value;
      saveAccounts();
    };

    const updateAccountType = (index: number) => (event: Event) => {
      const target = event.target as HTMLSelectElement;
      accounts.value[index].accountType = target.value;
      if (target.value === "LDAP") {
        accounts.value[index].password = "";
      }
      saveAccounts();
    };

    const updateLogin = (index: number) => (event: Event) => {
      const target = event.target as HTMLInputElement;
      accounts.value[index].login = target.value;
      saveAccounts();
    };

    const updatePassword = (index: number) => (event: Event) => {
      const target = event.target as HTMLInputElement;
      accounts.value[index].password = target.value;
      saveAccounts();
    };

    onMounted(() => {
      loadAccounts();
    });

    watch(accounts, saveAccounts, { deep: true });

    return {
      accounts,
      addAccount,
      removeAccount,
      updateLabel,
      updateAccountType,
      updateLogin,
      updatePassword,
    };
  },
});
</script>
