import { type ChangeEvent, type CSSProperties, useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { CreateItemForm, EditableSpan } from '@/common/components';
import type { Todolist } from '@/features/todolists/api/todolistsApi.types.ts';
import { todolistsApi } from '@/features/todolists/api/todolistsApi.ts';
import { tasksApi } from '@/features/todolists/api/tasksApi.ts';
import type { DomainTask, UpdateTaskModel } from '@/features/todolists/api/tasksApi.types.ts';
import { TaskStatus } from '@/common/enums/enums.ts';

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([]);

  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({});
  console.log(tasks);
  useEffect(() => {
    todolistsApi.getTodolists().then(res => {
      const todolists = res.data;
      setTodolists(todolists);
      todolists.forEach(todolist => {
        tasksApi
          .getTasks(todolist.id)
          .then(res => setTasks(prev => ({ ...prev, [todolist.id]: res.data.items })));
      });
    });
  }, []);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const createTodolist = (title: string) => {
    todolistsApi.createTodolist({ title }).then(res => {
      const newTodolist = res.data.data.item;
      setTodolists([newTodolist, ...todolists]);
      setTasks({ ...tasks, [newTodolist.id]: [] });
    });
  };

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist({ id }).then(res => {
      if (res.data.resultCode === 0) {
        setTodolists(prev => prev.filter(tl => tl.id !== id));
      } else {
        console.error('Ошибка при удалении:', res.data.messages);
      }
    });
  };

  const changeTodolistTitle = (id: string, title: string) => {
    todolistsApi
      .changeTodolistTitle({ id, title })
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

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({ todolistId, title }).then(res => {
      if (res.data.resultCode === 0) {
        const newTask = res.data.data.item;
        console.log(newTask);
        setTasks(prev => ({
          ...prev,
          [todolistId]: [newTask, ...(prev[todolistId] || [])],
        }));
      }
    });
  };

  const deleteTask = (todolistId: string, taskId: string) => {};

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const todolistId = task.todoListId;
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.target.checked ? TaskStatus.Completed : TaskStatus.New,
    };
    tasksApi.updateTask({ todolistId, taskId: task.id, model }).then(() => {
      setTasks(prevTasks => ({
        ...prevTasks,
        [todolistId]: prevTasks[todolistId].map(t => (t.id === task.id ? { ...t, ...model } : t)),
      }));
    });
  };

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
          {tasks[todolist.id]?.map(task => (
            <div key={task.id}>
              <Checkbox
                checked={task.status === TaskStatus.Completed}
                onChange={e => changeTaskStatus(e, task)}
              />
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
