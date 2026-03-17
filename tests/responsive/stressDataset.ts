export type StressDatasetId = 'single-list' | 'ten-lists' | 'many-lists';

type ApiTodolist = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

type ApiTask = {
  id: string;
  todoListId: string;
  title: string;
  description: string | null;
  status: number;
  priority: number;
  startDate: string | null;
  deadline: string | null;
  order: number;
  addedDate: string;
};

export type StressFixture = {
  datasetId: StressDatasetId;
  todolists: ApiTodolist[];
  tasksByTodolist: Record<string, ApiTask[]>;
  heavyTodolistId: string;
};

const toLocalIso = (dayOffset: number, minuteOffset: number) => {
  const day = (dayOffset % 28) + 1;
  const hour = Math.floor((minuteOffset / 60) % 24);
  const minute = minuteOffset % 60;
  const dd = String(day).padStart(2, '0');
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `2026-01-${dd}T${hh}:${mm}:00`;
};

const buildTaskTitle = (listIndex: number, taskIndex: number) => {
  const id = taskIndex + 1;
  switch (taskIndex % 3) {
    case 0:
      return `Task ${id}`;
    case 1:
      return `Task ${id}: verify board state, update labels and keep cards organized`;
    default:
      return `Task ${id}: coordinate cross-team details, prepare final notes, and ensure that all acceptance criteria are clear before closing this item in the shared todolist`;
  }
};

const buildDatasetConfig = (datasetId: StressDatasetId): number[] => {
  if (datasetId === 'single-list') {
    return [300];
  }
  if (datasetId === 'ten-lists') {
    return Array.from({ length: 10 }, () => 80);
  }
  return Array.from({ length: 30 }, () => 30);
};

const buildListTitle = (datasetId: StressDatasetId, index: number) => {
  if (datasetId === 'single-list') {
    return 'Stress dataset: one list with 300 tasks';
  }
  if (datasetId === 'ten-lists') {
    return `Stress dataset: team list ${index + 1}`;
  }
  return `Stress dataset: compact board ${index + 1}`;
};

export const createStressFixture = (
  datasetId: StressDatasetId,
): StressFixture => {
  const taskCounts = buildDatasetConfig(datasetId);
  const todolists: ApiTodolist[] = [];
  const tasksByTodolist: Record<string, ApiTask[]> = {};

  for (let listIndex = 0; listIndex < taskCounts.length; listIndex += 1) {
    const todolistId = `${datasetId}-list-${listIndex + 1}`;
    const taskCount = taskCounts[listIndex];

    todolists.push({
      id: todolistId,
      title: buildListTitle(datasetId, listIndex),
      addedDate: toLocalIso(listIndex, listIndex * 9),
      order: listIndex,
    });

    const tasks: ApiTask[] = Array.from(
      { length: taskCount },
      (_, taskIndex) => ({
        id: `${todolistId}-task-${taskIndex + 1}`,
        todoListId: todolistId,
        title: buildTaskTitle(listIndex, taskIndex),
        description:
          taskIndex % 5 === 0
            ? `Stress description ${taskIndex + 1}: generated automatically for layout checks.`
            : null,
        status: taskIndex % 4,
        priority: taskIndex % 5,
        startDate: null,
        deadline: null,
        order: taskIndex,
        addedDate: toLocalIso(listIndex + 1, taskIndex * 7),
      }),
    );

    tasksByTodolist[todolistId] = tasks;
  }

  const heavyTodolistId = todolists[0]?.id ?? '';

  return {
    datasetId,
    todolists,
    tasksByTodolist,
    heavyTodolistId,
  };
};
