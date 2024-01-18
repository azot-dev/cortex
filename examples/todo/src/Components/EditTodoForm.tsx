import React, { FC, useState } from 'react';
import { Todo } from '../cortex/services/todo/todo.service';
import { useService } from '../cortex/utils/hooks';

export const EditTodoForm: FC<{ todo: Todo }> = ({ todo }) => {
  const [value, setValue] = useState(todo.title);
  const { modify } = useService('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    modify(todo.id, value);
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder="Update task" />
      <button type="submit" className="todo-btn">
        Modify Task
      </button>
    </form>
  );
};
