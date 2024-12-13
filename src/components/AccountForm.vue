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
      <div class="account-field flex-none w-1/4">
        <label class="block text-sm font-medium text-gray-700">Метка:</label>
        <input
          v-model="account.label"
          @blur="validateAccount(index)"
          maxlength="50"
          :class="{ 'border-red-500': !account.validLabel }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="account-field flex-none w-1/4">
        <label class="block text-sm font-medium text-gray-700"
          >Тип записи:</label
        >
        <select
          v-model="account.accountType"
          @change="validateAccount(index)"
          :class="{ 'border-red-500': !account.validAccountType }"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="LDAP">LDAP</option>
          <option value="Локальная">Локальная</option>
        </select>
      </div>
      <div
        :class="{
          'flex-1': account.accountType === 'LDAP',
          'flex-none w-1/4': account.accountType !== 'LDAP',
        }"
      >
        <label class="block text-sm font-medium text-gray-700">Логин:</label>
        <input
          v-model="account.login"
          @blur="validateAccount(index)"
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
          @blur="validateAccount(index)"
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
import { defineComponent, ref, onMounted } from "vue";
import debounce from "lodash/debounce";

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

    const saveAccounts = debounce(() => {
      const validAccounts = accounts.value.filter(
        (account) =>
          account.validLabel &&
          account.validAccountType &&
          account.validLogin &&
          account.validPassword
      );
      localStorage.setItem("accounts", JSON.stringify(validAccounts));
    }, 300);

    const addAccount = () => {
      const newAccount = {
        label: "",
        accountType: "LDAP",
        login: "",
        password: "",
        validLabel: true,
        validAccountType: true,
        validLogin: true,
        validPassword: true,
      };
      accounts.value.push(newAccount);
      validateAccount(accounts.value.length - 1);
      saveAccounts();
    };

    const removeAccount = (index: number) => {
      accounts.value.splice(index, 1);
      saveAccounts();
    };

    const validateAccount = (index: number) => {
      const account = accounts.value[index];
      account.validLabel =
        account.label.length > 0 && account.label.length <= 50;
      account.validAccountType = ["LDAP", "Локальная"].includes(
        account.accountType
      );
      account.validLogin =
        account.login.length > 0 && account.login.length <= 100;
      account.validPassword =
        account.accountType === "Локальная"
          ? account.password.length > 0 && account.password.length <= 100
          : true;
      saveAccounts();
    };

    onMounted(() => {
      loadAccounts();
    });

    return {
      accounts,
      addAccount,
      removeAccount,
      validateAccount,
    };
  },
});
</script>

<style scoped>
.border-red-500 {
  border-color: #f56565;
}
</style>
