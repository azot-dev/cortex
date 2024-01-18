import { Core } from '../../_core';
import { TodoService } from './todo.service';

describe('todo service', () => {
  let core: InstanceType<typeof Core>;
  let service: InstanceType<typeof TodoService>;

  beforeEach(() => {
    core = new Core();
    service = core.getService('todo');
  });

  describe('add', () => {
    it('adds a todo to the todoList', () => {
      service.add('eat');

      expect(service.get().length).toBe(1);
      expect(service.get()[0].title).toBe('eat');
    });
  });

  describe('remove', () => {
    it('removes a todo to the todoList', () => {
      service.add('eat');
      service.add('go to ski');
      const idToRemove = service.get().find((todo) => todo.title === 'eat')!.id;

      service.remove(idToRemove);
      expect(service.get().length).toBe(1);
      expect(service.get()[0].title).toBe('go to ski');
    });
  });

  describe('modify', () => {
    it('modifies a todo', () => {
      service.add('eat');
      const idToModify = service.get().find((todo) => todo.title === 'eat')!.id;

      service.modify(idToModify, 'drink');
      expect(service.get()[0].title).toBe('drink');
    });

    it('is no longer in editing mode', () => {
      service.add('eat');
      const idToModify = service.get().find((todo) => todo.title === 'eat')!.id;

      service.modify(idToModify, 'drink');
      expect(service.get()[0].isEditing).toBeFalsy();
    });
  });

  describe('toggle done', () => {
    it('toggles done for a todo', () => {
      service.add('eat');
      const idToModify = service.get().find((todo) => todo.title === 'eat')!.id;

      service.toggleDone(idToModify);
      expect(service.get()[0].isDone).toBeTruthy();

      // called twice to be sure it is toggled
      service.toggleDone(idToModify);
      expect(service.get()[0].isDone).toBeFalsy();
    });
  });

  describe('edit', () => {
    it('makes the todo editable', () => {
      service.add('eat');
      const idToModify = service.get().find((todo) => todo.title === 'eat')!.id;

      service.edit(idToModify);
      expect(service.get()[0].isEditing).toBeTruthy();
    });
  });
});
