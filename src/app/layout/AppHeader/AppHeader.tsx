import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Typography } from "@/shared/Typography/Typography";
import { getCurrentUser, logoutUser } from "@/shared/auth/authStorage";
import styles from "./AppHeader.module.scss";

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
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
        <Button variant="text" size="medium" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </header>
  );
};
