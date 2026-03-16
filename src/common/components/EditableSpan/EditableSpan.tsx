import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import type { RequestStatus } from '@/common/types/types.ts';

type Props = {
  value: string;
  onChange: (title: string) => void;
  entityStatus?: RequestStatus;
};

export const EditableSpan = ({ value, onChange, entityStatus }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState(value);
  const disabled = entityStatus === 'loading';

  useEffect(() => {
    setTitle(value);
  }, [value]);

  const turnOnEditMode = () => {
    if (disabled) return;
    setIsEditMode(true);
  };

  const saveTitle = () => {
    const trimmedTitle = title.trim();
    setIsEditMode(false);

    if (trimmedTitle === '') {
      setTitle(value);
      return;
    }

    if (trimmedTitle !== value) {
      onChange(trimmedTitle);
    }
  };

  const cancelEditing = () => {
    setIsEditMode(false);
    setTitle(value);
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      saveTitle();
    }

    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handlePreviewKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      turnOnEditMode();
    }
  };

  return isEditMode ? (
    <TextField
      variant="outlined"
      value={title}
      size="small"
      onChange={changeTitle}
      onBlur={saveTitle}
      onKeyDown={handleInputKeyDown}
      autoFocus
    />
  ) : (
    <span
      onDoubleClick={turnOnEditMode}
      onKeyDown={handlePreviewKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Edit title: ${value}`}
    >
      {value}
    </span>
  );
};
