import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';

type Props = {
  onCreateItem: (titleItem: string) => void;
};

export const CreateItemForm = ({ onCreateItem }: Props) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const createHandler = () => {
    const trimmedTitle = title.trim();
    if (title.trim() !== '') {
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
    <div>
      <TextField
        label={'Enter a title'}
        variant={'outlined'}
        className={error ? 'error' : ''}
        value={title}
        size={'small'}
        error={!!error}
        helperText={error}
        onChange={changeTitleHandler}
        onKeyDown={createOnEnterHandler}
      />
      <IconButton onClick={createHandler} color={'primary'}>
        <AddBoxIcon />
      </IconButton>
    </div>
  );
};
