import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import styles from './CreateItemForm.module.css';

type Props = {
  onCreateItem: (titleItem: string) => void;
  disabled?: boolean;
};

export const CreateItemForm = ({ onCreateItem, disabled }: Props) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const createHandler = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle !== '') {
      onCreateItem(trimmedTitle);
      setTitle('');
    } else {
      setError('Title is required');
    }
  };

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
    setError(null);
  };

  const createOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      createHandler();
    }
  };

  return (
    <div className={styles.row}>
      <TextField
        placeholder="Enter a title"
        variant="outlined"
        className={styles.input}
        value={title}
        error={!!error}
        helperText={error}
        disabled={disabled}
        slotProps={{ htmlInput: { 'aria-label': 'Enter a title' } }}
        onChange={changeTitleHandler}
        onKeyDown={createOnEnterHandler}
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
