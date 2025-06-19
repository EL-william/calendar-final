export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  timezone?: string;
}

export interface AuthData {
  user: User;
  isAuthenticated: boolean;
}

const AUTH_KEY = "calendorny_auth";
const USERS_KEY = "calendorny_users";

// Получить данные аутентификации
export const getAuthData = (): AuthData | null => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Сохранить данные аутентификации
export const setAuthData = (authData: AuthData): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
};

// Удалить данные аутентификации
export const clearAuthData = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Проверить аутентификацию
export const isAuthenticated = (): boolean => {
  const authData = getAuthData();
  return authData?.isAuthenticated || false;
};

// Получить текущего пользователя
export const getCurrentUser = (): User | null => {
  const authData = getAuthData();
  return authData?.user || null;
};

// Получить всех зарегистрированных пользователей
const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Сохранить пользователей
const setUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Регистрация пользователя
export const registerUser = (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    const users = getUsers();

    // Проверить, существует ли пользователь с таким email
    if (users.find((user) => user.email === userData.email)) {
      resolve({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
      return;
    }

    // Создать нового пользователя
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };

    // Сохранить пользователя (пароль не сохраняем в localStorage для безопасности)
    users.push(newUser);
    setUsers(users);

    resolve({ success: true });
  });
};

// Вход пользователя
export const loginUser = (credentials: {
  email: string;
  password: string;
}): Promise<{ success: boolean; message?: string; user?: User }> => {
  return new Promise((resolve) => {
    const users = getUsers();

    // Найти пользователя по email
    const user = users.find((u) => u.email === credentials.email);

    if (!user) {
      resolve({ success: false, message: "Пользователь не найден" });
      return;
    }

    // В реальном приложении здесь была бы проверка пароля
    // Для демо принимаем любой пароль длиной больше 5 символов
    if (credentials.password.length < 6) {
      resolve({ success: false, message: "Неверный пароль" });
      return;
    }

    // Сохранить данные аутентификации
    setAuthData({
      user,
      isAuthenticated: true,
    });

    resolve({ success: true, user });
  });
};

// Выход пользователя
export const logoutUser = (): void => {
  clearAuthData();
};
