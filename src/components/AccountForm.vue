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
          @blur="validateLabel(index)"
          maxlength="50"
          :class="{ 'border-red-500': !account.validLabel }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="account-field flex-1">
        <label class="block text-sm font-medium text-gray-700"
          >Тип записи:</label
        >
        <select
          v-model="account.accountType"
          @change="validateAccountType(index)"
          :class="{ 'border-red-500': !account.validAccountType }"
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
          @blur="validateLogin(index)"
          maxlength="100"
          required
          :class="{ 'border-red-500': !account.validLogin }"
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
          @blur="validatePassword(index)"
          maxlength="100"
          required
          :class="{ 'border-red-500': !account.validPassword }"
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
      {
        label: "",
        accountType: "LDAP",
        login: "",
        password: "",
        validLabel: true,
        validAccountType: true,
        validLogin: true,
        validPassword: true,
      },
    ]);

    const loadAccounts = () => {
      const savedAccounts = localStorage.getItem("accounts");
      if (savedAccounts) {
        accounts.value = JSON.parse(savedAccounts);
      }
    };

    const saveAccounts = () => {
      const validAccounts = accounts.value.filter(
        (account) =>
          account.validLabel &&
          account.validAccountType &&
          account.validLogin &&
          account.validPassword
      );
      localStorage.setItem("accounts", JSON.stringify(validAccounts));
    };

    const addAccount = () => {
      accounts.value.push({
        label: "",
        accountType: "LDAP",
        login: "",
        password: "",
        validLabel: true,
        validAccountType: true,
        validLogin: true,
        validPassword: true,
      });
      saveAccounts();
    };

    const removeAccount = (index: number) => {
      accounts.value.splice(index, 1);
      saveAccounts();
    };

    const validateLabel = (index: number) => {
      accounts.value[index].validLabel =
        accounts.value[index].label.length > 0 &&
        accounts.value[index].label.length <= 50;
      saveAccounts();
    };

    const validateAccountType = (index: number) => {
      accounts.value[index].validAccountType = ["LDAP", "Локальная"].includes(
        accounts.value[index].accountType
      );
      saveAccounts();
    };

    const validateLogin = (index: number) => {
      accounts.value[index].validLogin =
        accounts.value[index].login.length > 0 &&
        accounts.value[index].login.length <= 100;
      saveAccounts();
    };

    const validatePassword = (index: number) => {
      if (accounts.value[index].accountType === "Локальная") {
        accounts.value[index].validPassword =
          accounts.value[index].password.length > 0 &&
          accounts.value[index].password.length <= 100;
      } else {
        accounts.value[index].validPassword = true;
      }
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
      validateLabel,
      validateAccountType,
      validateLogin,
      validatePassword,
    };
  },
});
</script>

<style scoped>
.border-red-500 {
  border-color: #f56565;
}
</style>
