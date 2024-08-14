import { createI18n } from "vue-i18n";

const messages = {
  en: {
    appTitle: "Anki Flashcard Generator",
    apiKeyLabel: "OpenAI API Key:",
    languageLabel: "Definition Language:",
    wordInputPlaceholder: "Enter an English word",
    loading: "Loading...",
    getDefinition: "Get Definition",
    definition: "Definition",
    partOfSpeech: "Part of Speech",
    example: "Example",
    searchHistory: "Search History",
    clearHistory: "Clear History",
    exportToAnki: "Export to Anki",
    apiError:
      "Failed to get definition. Please check your API key and try again.",
    showInstructions: "Show Anki Import Instructions",
    hideInstructions: "Hide Anki Import Instructions",
    ankiImportTitle: "How to Import to Anki:",
    ankiImportStep1: "Open Anki program.",
    ankiImportStep2: "Select the deck you want to add the cards to.",
    ankiImportStep3: "Go to File > Import.",
    ankiImportStep4: 'Select the "anki_words.txt" file you exported.',
    ankiImportStep5:
      'In the import window, ensure "Fields separated by: Tab" is selected, choose your deck, set Note Type to "Basic", and map the first field to "Front" and the second to "Back".',
    ankiImportStep6: "Click Import.",
    showAppInstructions: "Show App Instructions",
    hideAppInstructions: "Hide App Instructions",
    appInstructionsTitle: "How to Use This App:",
    appInstructionsStep1: "Enter your OpenAI API key in the field above.",
    appInstructionsStep2: "Select your preferred language for definitions.",
    appInstructionsStep3:
      'Type an English word in the input field and click "Get Definition".',
    appInstructionsStep4:
      "View the definition, part of speech, and example sentence.",
    appInstructionsStep5:
      'Use the "Export to Anki" button to save your flashcards.',
    showApiKeyInfo: "Show API Key Info",
    hideApiKeyInfo: "Hide API Key Info",
    apiKeyInfoTitle: "Important API Key Information:",
    apiKeyInfoPoint1:
      "Your API key is sensitive information. Never share it with others.",
    apiKeyInfoPoint2:
      "This app stores your API key locally in your browser. It's not sent anywhere except to OpenAI.",
    apiKeyInfoPoint3:
      "You can get an API key from the OpenAI website. You may need to add a payment method.",
    apiKeyInfoPoint4:
      "Usage of the API may incur charges. Please check OpenAI's pricing details.",
    systemPrompt:
      "You are an Anki Flashcard generator. For the given word in English, provide the definition and part of speech in {language}. Always provide the example sentence in English, regardless of the target language. Return the response in the following JSON format: {'{'}'definition': '{language} definition', 'partOfSpeech': '{language} part of speech', 'example': 'English example sentence'{'}'}",
    ankiBack:
      "Definition: {definition}<br>Part of Speech: {partOfSpeech}<br>Example: {example}<br>Language: {language}",
    word: "Word",
    actions: "Actions",
  },
  ko: {
    appTitle: "Anki 플래시카드 생성기",
    apiKeyLabel: "OpenAI API 키:",
    languageLabel: "정의 언어:",
    wordInputPlaceholder: "영어 단어를 입력하세요",
    loading: "로딩 중...",
    getDefinition: "정의 가져오기",
    definition: "정의",
    partOfSpeech: "품사",
    example: "예문",
    searchHistory: "검색 기록",
    clearHistory: "기록 지우기",
    exportToAnki: "Anki로 내보내기",
    apiError:
      "정의를 가져오는데 실패했습니다. API 키를 확인하고 다시 시도해주세요.",
    showInstructions: "Anki 가져오기 지침 보기",
    hideInstructions: "Anki 가져오기 지침 숨기기",
    ankiImportTitle: "Anki로 가져오는 방법:",
    ankiImportStep1: "Anki 프로그램을 엽니다.",
    ankiImportStep2: "카드를 추가하고 싶은 덱을 선택합니다.",
    ankiImportStep3: "파일 > 가져오기를 선택합니다.",
    ankiImportStep4: '내보낸 "anki_words.txt" 파일을 선택합니다.',
    ankiImportStep5:
      '가져오기 창에서 "필드는 다음으로 구분: 탭"이 선택되었는지 확인하고, 덱을 선택하고, 노트 유형을 "기본"으로 설정한 다음, 첫 번째 필드를 "앞면"으로, 두 번째 필드를 "뒷면"으로 매핑합니다.',
    ankiImportStep6: "가져오기를 클릭합니다.",
    showAppInstructions: "앱 사용 지침 보기",
    hideAppInstructions: "앱 사용 지침 숨기기",
    appInstructionsTitle: "이 앱 사용 방법:",
    appInstructionsStep1: "OpenAI API 키를 위 필드에 입력하세요.",
    appInstructionsStep2: "정의를 받고 싶은 언어를 선택하세요.",
    appInstructionsStep3:
      '입력 필드에 영어 단어를 입력하고 "정의 가져오기"를 클릭하세요.',
    appInstructionsStep4: "정의, 품사, 예문을 확인하세요.",
    appInstructionsStep5:
      '"Anki로 내보내기" 버튼을 사용하여 플래시카드를 저장하세요.',
    showApiKeyInfo: "API 키 정보 보기",
    hideApiKeyInfo: "API 키 정보 숨기기",
    apiKeyInfoTitle: "중요한 API 키 정보:",
    apiKeyInfoPoint1:
      "API 키는 민감한 정보입니다. 절대 다른 사람과 공유하지 마세요.",
    apiKeyInfoPoint2:
      "이 앱은 API 키를 브라우저에 로컬로 저장합니다. OpenAI 외에는 어디에도 전송되지 않습니다.",
    apiKeyInfoPoint3:
      "OpenAI 웹사이트에서 API 키를 받을 수 있습니다. 결제 수단을 추가해야 할 수 있습니다.",
    apiKeyInfoPoint4:
      "API 사용에는 요금이 부과될 수 있습니다. OpenAI의 가격 정책을 확인해주세요.",
    systemPrompt:
      "당신은 Anki 플래시카드 생성기입니다. 주어진 영어 단어에 대해 {language}로 정의와 품사를 제공하세요. 예문은 항상 영어로 제공하세요. 다음 JSON 형식으로 응답을 반환하세요: {'{'}'definition': '{language}로 된 단어 정의', 'partOfSpeech': '{language}로 된 품사', 'example': '영어로 된 예문'{'}'}",
    ankiBack:
      "정의: {definition}<br>품사: {partOfSpeech}<br>예문: {example}<br>언어: {language}",
    word: "단어",
    actions: "동작",
  },
  // 다른 언어에 대한 번역도 여기에 추가할 수 있습니다.
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
