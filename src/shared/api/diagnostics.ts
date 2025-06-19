import axios from "axios";

export async function diagnoseApiConnection() {
  const baseUrl = "http://localhost:8080";
  const results: string[] = [];

  console.log("🔍 Начинаем диагностику API подключения...");

  // 1. Проверяем доступность основного сервера
  try {
    console.log("1️⃣ Проверяем основной сервер...");
    const response = await fetch(`${baseUrl}`, { method: "GET" });
    results.push(
      `✅ Сервер на ${baseUrl} отвечает (статус: ${response.status})`,
    );
  } catch (error) {
    results.push(`❌ Сервер на ${baseUrl} недоступен: ${error}`);
    return results;
  }

  // 2. Проверяем различные возможные пути API
  const possiblePaths = [
    "/auth/api/v1",
    "/api/v1",
    "/api",
    "/auth",
    "/auth/api/v1/register",
    "/api/v1/register",
    "/api/register",
    "/register",
  ];

  console.log("2️⃣ Проверяем возможные пути API...");
  for (const path of possiblePaths) {
    try {
      const url = `${baseUrl}${path}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      results.push(`✅ Путь ${path} доступен (статус: ${response.status})`);

      // Если это успешный ответ, пробуем получить содержимое
      if (response.ok) {
        try {
          const text = await response.text();
          if (text) {
            results.push(`📄 Ответ: ${text.substring(0, 200)}...`);
          }
        } catch (e) {
          results.push(`📄 Ответ получен, но не текстовый`);
        }
      }
    } catch (error) {
      results.push(`❌ Путь ${path} недоступен`);
    }
  }

  // 3. Пробуем POST запрос на возможные эндпоинты регистрации
  const registerPaths = [
    "/auth/api/v1/register",
    "/api/v1/register",
    "/api/register",
    "/register",
  ];

  console.log("3️⃣ Тестируем эндпоинты регистрации...");
  for (const path of registerPaths) {
    try {
      const url = `${baseUrl}${path}`;
      const response = await axios.post(
        url,
        {
          email: "test@test.com",
          password: "test12345678",
          firstName: "Test",
          lastName: "User",
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 5000,
        },
      );

      results.push(`✅ POST ${path} работает! (статус: ${response.status})`);
    } catch (error: any) {
      if (error.response) {
        results.push(
          `⚠️ POST ${path} ответил (статус: ${error.response.status})`,
        );
        if (error.response.status !== 404) {
          results.push(`📝 Это может быть правильный эндпоинт!`);
        }
      } else {
        results.push(`❌ POST ${path} недоступен`);
      }
    }
  }

  return results;
}

export async function testSpecificEndpoint(endpoint: string) {
  try {
    console.log(`🎯 Тестируем конкретный эндпоинт: ${endpoint}`);

    const response = await axios.post(
      endpoint,
      {
        email: "test@example.com",
        password: "testpassword123",
        firstName: "Test",
        lastName: "User",
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      },
    );

    console.log("✅ Эндпоинт работает:", response.data);
    return { success: true, data: response.data, status: response.status };
  } catch (error: any) {
    console.error("❌ Ошибка эндпоинта:", error);
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
}
