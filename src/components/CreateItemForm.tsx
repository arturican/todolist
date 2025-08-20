import { type ChangeEvent, type KeyboardEvent, useState } from 'react';
import { Button } from './Button.tsx';
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
      <input
        className={error ? 'error' : ''}
        value={title}
        onChange={changeTitleHandler}
        onKeyDown={createOnEnterHandler}
      />
      <Button title={'+'} onClick={createHandler} />
      <div className={'error-message'}>{error}</div>
    </div>
  );
};
