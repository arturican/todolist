import { CreateItemForm } from '@/common/components/CreateItemForm/CreateItemForm.tsx';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { createTodolistTC } from '@/features/todolists/model/todolists-slice.ts';
import { Todolists } from '@/features/todolists/ui/Todolists/Todolists.tsx';
import styles from './Main.module.css';

export const Main = () => {
  const dispatch = useAppDispatch();
  const createTodolist = (title: string) => {
    dispatch(createTodolistTC(title));
  };

  return (
    <section className={`pageContainer ${styles.main}`}>
      <div className={styles.createRow}>
        <CreateItemForm onCreateItem={createTodolist} />
      </div>
      <Todolists />
    </section>
  );
};
