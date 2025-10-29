import { type ChangeEvent, type CSSProperties, useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm';
import { EditableSpan } from '@/common/components/EditableSpan/EditableSpan';
import axios from 'axios';
import type { BaseResponse } from '@/common/types.ts';

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tasks, setTasks] = useState<any>({});
  const token = import.meta.env.VITE_API_TOKEN;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  useEffect(() => {
    axios
      .get<Todolist[]>(`${baseUrl}/todo-lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => setTodolists(res.data));
  }, []);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const createTodolist = (title: string) => {
    axios
      .post<BaseResponse<{ item: Todolist }>>(
        `${baseUrl}/todo-lists`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': apiKey,
          },
        },
      )
      .then(res => {
        const newTodolist = res.data.data.item;
        setTodolists([newTodolist, ...todolists]);
      });
  };

  const deleteTodolist = (id: string) => {
    axios
      .delete<BaseResponse<{}>>(`${baseUrl}/todo-lists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'API-KEY': apiKey,
        },
      })
      .then(res => {
        if (res.data.resultCode === 0) {
          setTodolists(prev => prev.filter(tl => tl.id !== id));
        } else {
          console.error('Ошибка при удалении:', res.data.messages);
        }
      });
  };

  const changeTodolistTitle = (id: string, title: string) => {
    axios
      .put<BaseResponse<{}>>(
        `${baseUrl}/todo-lists/${id}`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'API-KEY': apiKey,
          },
        },
      )
      .then(res => {
        if (res.data.resultCode === 0) {
          setTodolists(prev => prev.map(tl => (tl.id === id ? { ...tl, title } : tl)));
        } else {
          console.error('Ошибка при изменения тудулиста:', res.data.messages);
        }
      })
      .catch(e => {
        console.error('Ошибка при запросе изменения тудулиста:', e);
      });
  };

  const createTask = (todolistId: string, title: string) => {};

  const deleteTask = (todolistId: string, taskId: string) => {};

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: any) => {};

  const changeTaskTitle = (task: any, title: string) => {};
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return (
    <div style={{ margin: '20px' }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist: any) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan
              value={todolist.title}
              onChange={title => changeTodolistTitle(todolist.id, title)}
            />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={title => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task: any) => (
            <div key={task.id}>
              <Checkbox checked={task.isDone} onChange={e => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={title => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const container: CSSProperties = {
  border: '1px solid black',
  margin: '20px 0',
  padding: '10px',
  width: '300px',
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
};

export type Todolist = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
