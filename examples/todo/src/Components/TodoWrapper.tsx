import { Todo } from './Todo';
import { TodoForm } from './TodoForm';
import { EditTodoForm } from './EditTodoForm';
import { useAppSelector, useService } from '../cortex/utils/hooks';

export const TodoWrapper = () => {
  const { get } = useService('todo');
  const todos = useAppSelector(get);

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm />
      {todos.map((todo) => (todo.isEditing ? <EditTodoForm todo={todo} key={`${todo.id}-edit`} /> : <Todo key={`${todo.id}-display`} todo={todo} />))}
    </div>
  );
};
