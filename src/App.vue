<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  KeyIcon,
  LanguageIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/vue/24/solid";

const { t, locale } = useI18n();

onMounted(() => {
  document.title = t("appTitle");
});

const openaiApiKey = ref(localStorage.getItem("openaiApiKey") || "");
const wordInput = ref("");
const wordDefinitions = ref([]);
const isLoading = ref(false);
const error = ref("");
const editingIndex = ref(-1);
const editedDefinition = ref({});

const languages = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
];

const userLanguage = ref(localStorage.getItem("userLanguage") || "ko");

const currentLanguage = computed(() => {
  const lang = languages.find((lang) => lang.code === userLanguage.value);
  return lang ? lang : languages[0];
});

const showApiKeyInfo = ref(true);

const handleApiKeyChange = (event) => {
  openaiApiKey.value = event.target.value;
  localStorage.setItem("openaiApiKey", openaiApiKey.value);
};

const handleLanguageChange = (event) => {
  userLanguage.value = event.target.value;
  localStorage.setItem("userLanguage", userLanguage.value);
  locale.value = userLanguage.value;
};

const getDefinition = async () => {
  if (!wordInput.value.trim()) return;

  isLoading.value = true;
  error.value = "";

  try {
    const systemPromptContent = t("systemPrompt", {
      language: currentLanguage.value.name,
    });
    console.log(systemPromptContent);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey.value}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        format: "json_object",
        messages: [
          {
            role: "system",
            content: systemPromptContent,
          },
          {
            role: "user",
            content: wordInput.value,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const parsedContent = JSON.parse(
      data.choices[0].message.content.replace(/\\"/g, '"')
    );
    wordDefinitions.value.unshift({ word: wordInput.value, ...parsedContent });
    wordInput.value = "";
  } catch (err) {
    error.value = t("apiError");
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const startEditing = (index) => {
  editingIndex.value = index;
  editedDefinition.value = { ...wordDefinitions.value[index] };
};

const saveEdit = () => {
  wordDefinitions.value[editingIndex.value] = { ...editedDefinition.value };
  editingIndex.value = -1;
};

const cancelEdit = () => {
  editingIndex.value = -1;
};

const deleteDefinition = (index) => {
  wordDefinitions.value.splice(index, 1);
};

const exportToAnki = () => {
  const ankiFormat = wordDefinitions.value
    .map((item) => {
      const front = item.word;
      const back = t("ankiBack", {
        definition: item.definition,
        partOfSpeech: item.partOfSpeech,
        example: item.example,
        language: currentLanguage.value.name,
      });
      return `${front}\t${back}`;
    })
    .join("\n");

  const blob = new Blob([ankiFormat], { type: "text/tab-separated-values" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "anki_words.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

onMounted(() => {
  locale.value = userLanguage.value;
});
</script>

<template>
  <div class="app">
    <h1 class="app__title">{{ t("appTitle") }}</h1>

    <div class="settings">
      <div class="settings__api-key">
        <div class="settings__api-key-header">
          <label for="api-key" class="settings__label">
            <KeyIcon class="icon" />
            {{ t("apiKeyLabel") }}
          </label>
          <button
            @click="showApiKeyInfo = !showApiKeyInfo"
            class="settings__info-button"
          >
            <PlusIcon v-if="!showApiKeyInfo" class="icon" />
            <MinusIcon v-else class="icon" />
          </button>
        </div>
        <input
          id="api-key"
          type="password"
          :value="openaiApiKey"
          @input="handleApiKeyChange"
          class="settings__input"
          required
        />
      </div>
      <div v-if="showApiKeyInfo" class="settings__api-key-info">
        <h4>{{ t("apiKeyInfoTitle") }}</h4>
        <ul>
          <li>{{ t("apiKeyInfoPoint1") }}</li>
          <li>{{ t("apiKeyInfoPoint2") }}</li>
          <li>{{ t("apiKeyInfoPoint3") }}</li>
          <li>{{ t("apiKeyInfoPoint4") }}</li>
        </ul>
      </div>
      <div class="settings__language">
        <label for="language" class="settings__label">
          <LanguageIcon class="icon" />
          {{ t("languageLabel") }}
        </label>
        <select
          id="language"
          v-model="userLanguage"
          @change="handleLanguageChange"
          class="settings__select"
        >
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="dictionary">
      <div class="dictionary__search">
        <div class="dictionary__search-input">
          <input
            type="text"
            v-model="wordInput"
            :placeholder="t('wordInputPlaceholder')"
            @keyup.enter="getDefinition"
            class="dictionary__input"
            required
          />
          <MagnifyingGlassIcon class="icon dictionary__search-icon" />
        </div>
        <button
          @click="getDefinition"
          :disabled="isLoading"
          class="dictionary__search-button"
        >
          <span v-if="isLoading">{{ t("loading") }}</span>
          <span v-else>{{ t("getDefinition") }}</span>
        </button>
      </div>
      <p v-if="error" class="dictionary__error">{{ error }}</p>

      <table v-if="wordDefinitions.length > 0" class="dictionary__table">
        <thead>
          <tr>
            <th>{{ t("word") }}</th>
            <th>{{ t("definition") }}</th>
            <th>{{ t("partOfSpeech") }}</th>
            <th>{{ t("example") }}</th>
            <th>{{ t("actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(definition, index) in wordDefinitions" :key="index">
            <template v-if="editingIndex === index">
              <td>
                <input
                  v-model="editedDefinition.word"
                  class="dictionary__edit-input"
                />
              </td>
              <td>
                <textarea
                  v-model="editedDefinition.definition"
                  class="dictionary__edit-textarea"
                ></textarea>
              </td>
              <td>
                <input
                  v-model="editedDefinition.partOfSpeech"
                  class="dictionary__edit-input"
                />
              </td>
              <td>
                <textarea
                  v-model="editedDefinition.example"
                  class="dictionary__edit-textarea"
                ></textarea>
              </td>
              <td>
                <button
                  @click="saveEdit"
                  class="dictionary__action-button"
                  title="Save"
                >
                  <CheckIcon class="icon" />
                </button>
                <button
                  @click="cancelEdit"
                  class="dictionary__action-button"
                  title="Cancel"
                >
                  <XMarkIcon class="icon" />
                </button>
              </td>
            </template>
            <template v-else>
              <td>{{ definition.word }}</td>
              <td>{{ definition.definition }}</td>
              <td>{{ definition.partOfSpeech }}</td>
              <td>{{ definition.example }}</td>
              <td>
                <button
                  @click="startEditing(index)"
                  class="dictionary__action-button"
                  title="Edit"
                >
                  <PencilIcon class="icon" />
                </button>
                <button
                  @click="deleteDefinition(index)"
                  class="dictionary__action-button"
                  title="Delete"
                >
                  <TrashIcon class="icon" />
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>

      <div v-if="wordDefinitions.length > 0" class="dictionary__export">
        <button @click="exportToAnki" class="dictionary__export-button">
          <ArrowDownTrayIcon class="icon" />
          {{ t("exportToAnki") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 10px;
}

.app__title {
  color: #000000;
  text-align: left;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

.settings {
  margin-bottom: 20px;
}

.settings__api-key,
.settings__language {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}

.settings__label {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.settings__input,
.settings__select {
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.settings__input:focus,
.settings__select:focus {
  outline: none;
  border-color: #000000;
}

.settings__api-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings__info-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.settings__api-key-info {
  margin: 12px 0;
  padding: 8px;
  background-color: #f7f7f7;
  border-radius: 4px;
  font-size: 12px;
}

.dictionary {
  margin-top: 20px;
}

.dictionary__search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.dictionary__search-input {
  flex-grow: 1;
  position: relative;
  display: flex;
}

.dictionary__search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #666;
}

.dictionary__input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.dictionary__input:focus {
  outline: none;
  border-color: #000000;
}

.dictionary__search-button,
.dictionary__export-button {
  padding: 8px 15px;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.dictionary__search-button:hover,
.dictionary__export-button:hover {
  background-color: #333333;
}

.dictionary__search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.dictionary__error {
  color: #ff4d4f;
  margin-bottom: 15px;
  font-size: 14px;
}

.dictionary__table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 14px;
  table-layout: fixed;
}

.dictionary__table th,
.dictionary__table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
  vertical-align: top;
  word-wrap: break-word;
  overflow: hidden;
}

.dictionary__table th {
  background-color: #f7f7f7;
  font-weight: 600;
}

.dictionary__table th:nth-child(1),
.dictionary__table td:nth-child(1) {
  width: 15%;
}

.dictionary__table th:nth-child(2),
.dictionary__table td:nth-child(2) {
  width: 30%;
}

.dictionary__table th:nth-child(3),
.dictionary__table td:nth-child(3) {
  width: 15%;
}

.dictionary__table th:nth-child(4),
.dictionary__table td:nth-child(4) {
  width: 30%;
}

.dictionary__table th:nth-child(5),
.dictionary__table td:nth-child(5) {
  width: 10%;
}

.dictionary__edit-input,
.dictionary__edit-textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.dictionary__edit-textarea {
  height: 60px;
  resize: vertical;
}
.dictionary__export {
  margin-top: 20px;
  text-align: right;
}
.dictionary__action-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin: 0 2px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.dictionary__action-button:hover {
  background-color: #f0f0f0;
}
.icon {
  width: 20px;
  height: 20px;
}
</style>
