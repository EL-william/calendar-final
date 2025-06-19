import { authApi } from "./authApi";

// Функция для тестирования подключения к API
export async function testApiConnection() {
  try {
    console.log("🔍 Тестируем подключение к API...");
    console.log("URL:", "http://localhost:8080/auth/api/v1");

    // Пробуем отправить тестовый запрос регистрации
    const testData = {
      email: "test@example.com",
      password: "testpassword123",
      firstName: "Test",
      lastName: "User",
    };

    console.log("📤 Отправляем тестовый запрос регистрации:", testData);

    const result = await authApi.register(testData);
    console.log("✅ API отвечает! Ответ:", result);
    return true;
  } catch (error: any) {
    console.error("❌ Ошибка API:", error);
    console.error("Статус:", error.response?.status);
    console.error("Данные ошибки:", error.response?.data);
    console.error("URL запроса:", error.config?.url);
    return false;
  }
}

// Функция для проверки доступности сервера
export async function checkServerHealth() {
  try {
    const response = await fetch("http://localhost:8080/auth/api/v1/health", {
      method: "GET",
    });
    console.log("🏥 Проверка health endpoint:", response.status);
    return response.ok;
  } catch (error) {
    console.error("❌ Сервер недоступен:", error);
    return false;
  }
}
