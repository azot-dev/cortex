import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Todo as TodoType } from '../cortex/services/todo/todo.service';
import { useService } from '../cortex/utils/hooks';

export const Todo: FC<{ todo: TodoType }> = ({ todo }) => {
  const { remove, toggleDone, edit } = useService('todo');

  return (
    <div className="Todo">
      <p className={`${todo.isDone ? 'completed' : ''}`} onClick={() => toggleDone(todo.id)}>
        {todo.title}
      </p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => edit(todo.id)} />
        <FontAwesomeIcon icon={faTrash} onClick={() => remove(todo.id)} />
      </div>
    </div>
  );
};
