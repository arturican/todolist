import { type ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';

type Props = {
  value: string;
  onChange: (title: string) => void;
};
export const EditableSpan = ({ value, onChange }: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState(value);
  const turnOnEditMode = () => {
    setIsEditMode(true);
  };
  const turnOffEditMode = () => {
    setIsEditMode(false);
    onChange(title);
  };
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  return (
    <>
      {isEditMode ? (
        <TextField
          variant={'outlined'}
          value={title}
          size={'small'}
          onChange={changeTitle}
          onBlur={turnOffEditMode}
          autoFocus
        />
      ) : (
        <span onDoubleClick={turnOnEditMode}>{value}</span>
      )}
    </>
  );
};
