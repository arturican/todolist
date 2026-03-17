import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';
import styles from './CreateItemForm.module.css';

type Props = {
  onCreateItem: (titleItem: string) => void;
  disabled?: boolean;
};

export const CreateItemForm = ({ onCreateItem, disabled }: Props) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const createHandler = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle !== '') {
      onCreateItem(trimmedTitle);
      setTitle('');
      setError(null);
      return;
    }

    setError('Title is required');
    inputRef.current?.focus();
  };

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
    if (error) {
      setError(null);
    }
  };

  const createOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createHandler();
    }
  };

  return (
    <div className={styles.row}>
      <TextField
        label="Enter a title"
        variant="outlined"
        className={styles.input}
        value={title}
        error={!!error}
        helperText={error}
        disabled={disabled}
        onChange={changeTitleHandler}
        onKeyDown={createOnEnterHandler}
        inputRef={inputRef}
        inputProps={{ 'aria-label': 'Title for the new item' }}
      />
      <Button
        className={styles.button}
        onClick={createHandler}
        variant="contained"
        color="primary"
        disabled={disabled}
        startIcon={<AddIcon />}
      >
        Add
      </Button>
    </div>
  );
};
