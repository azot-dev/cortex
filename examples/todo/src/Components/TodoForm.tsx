import { useState } from 'react';
import { useService } from '../cortex/utils/hooks';

export const TodoForm = () => {
  const [value, setValue] = useState('');
  const { add } = useService('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) {
      add(value);
      setValue('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder="What is the task today?" />
      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
};
