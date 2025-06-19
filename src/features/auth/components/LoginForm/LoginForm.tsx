import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared/ui";
import { Typography } from "@/shared/Typography/Typography";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";
import { loginUser, clearError } from "../../../../app/store/authSlice";
import styles from "./LoginForm.module.scss";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error: serverError,
    isAuthenticated,
  } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/calendar");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Очищаем ошибку при размонтировании компонента
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Очистить ошибку при изменении поля
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }

      if (serverError) {
        dispatch(clearError());
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Введите корре��тный email";
    }

    if (!formData.password) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Переход на календарь произойдет авт��матически через useEffect
    } catch (error) {
      // Ошибка уже обработана в Redux
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <Typography variant="h1" className={styles.title}>
          Calendorny
        </Typography>
        <Typography variant="body" className={styles.description}>
          Ваш персональный календарь задач для эффективного планирования
        </Typography>
      </div>

      <div className={styles.fields}>
        <Typography variant="h2" className={styles.formTitle}>
          Вход в аккаунт
        </Typography>

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <Input
          type="email"
          label="Email"
          placeholder="Введите ваш email"
          value={formData.email}
          onChange={handleInputChange("email")}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleInputChange("password")}
          error={errors.password}
          autoComplete="current-password"
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={isLoading}
          className={styles.submitButton}
        >
          Войти
        </Button>

        <div className={styles.linkSection}>
          <Typography variant="caption">
            Нет аккаунта?{" "}
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </Typography>
        </div>
      </div>
    </form>
  );
};
