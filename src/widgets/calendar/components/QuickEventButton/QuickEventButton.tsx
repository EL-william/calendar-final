import React, { useState } from "react";
import { Button } from "../../../../shared/ui";
import { TextEventInput } from "../TextEventInput/TextEventInput";
import { CalendarEvent } from "../../../../entities/calendar";
import styles from "./QuickEventButton.module.scss";

interface QuickEventButtonProps {
  onEventCreate: (event: Omit<CalendarEvent, "id">) => void;
}

export const QuickEventButton: React.FC<QuickEventButtonProps> = ({
  onEventCreate,
}) => {
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleOpenInput = () => {
    setIsInputOpen(true);
  };

  const handleCloseInput = () => {
    setIsInputOpen(false);
  };

  const handleEventCreate = (event: Omit<CalendarEvent, "id">) => {
    onEventCreate(event);
    setIsInputOpen(false);
  };

  if (isInputOpen) {
    return (
      <div className={styles.overlay}>
        <TextEventInput
          onEventCreate={handleEventCreate}
          onClose={handleCloseInput}
        />
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="medium"
      onClick={handleOpenInput}
      className={styles.quickButton}
    >
      ✨ Создать событие
    </Button>
  );
};
