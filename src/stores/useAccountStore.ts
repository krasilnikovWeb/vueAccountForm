import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountStore = defineStore("account", () => {
  const label = ref<string[]>(
    JSON.parse(localStorage.getItem("label") || "[]")
  );
  const accountType = ref<string>(
    localStorage.getItem("accountType") || "LDAP"
  );
  const login = ref<string>(localStorage.getItem("login") || "");
  const password = ref<string | null>(localStorage.getItem("password") || null);

  function setLabel(newLabel: string) {
    const labelsArray = newLabel.split(";").map((item) => item.trim());
    label.value = labelsArray;
    localStorage.setItem("label", JSON.stringify(labelsArray));
  }

  function setAccountType(newType: string) {
    accountType.value = newType;
    localStorage.setItem("accountType", newType);
    if (newType === "LDAP") {
      password.value = null;
      localStorage.setItem("password", "");
    }
  }

  function setLogin(newLogin: string) {
    login.value = newLogin;
    localStorage.setItem("login", newLogin);
  }

  function setPassword(newPassword: string) {
    if (accountType.value === "Локальная") {
      password.value = newPassword;
      localStorage.setItem("password", newPassword);
    }
  }

  return {
    label,
    accountType,
    login,
    password,
    setLabel,
    setAccountType,
    setLogin,
    setPassword,
  };
});
