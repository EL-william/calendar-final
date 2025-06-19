import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/Typography/Typography";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";
import styles from "./AppHeader.module.scss";

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Typography variant="h3" className={styles.brandText}>
          Calendorny
        </Typography>
      </div>

      <div className={styles.actions}>
        {user && (
          <Typography variant="caption" className={styles.userInfo}>
            {user.firstName} {user.lastName}
          </Typography>
        )}
        <Button
          variant="text"
          size="medium"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? "Выход..." : "Выйти"}
        </Button>
      </div>
    </header>
  );
};
