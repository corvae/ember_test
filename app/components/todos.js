
export default Ember.Component.extend({
  todos: [
    Ember.Object.create({ isDone: true }),
    Ember.Object.create({ isDone: false }),
    Ember.Object.create({ isDone: true })
  ],

//todos.@each.isDone instructs Ember to update bindings and fire observers on certain events
//calculates how many items in 'todos' remain incomplete based on their 'isDone' property
  remaining: Ember.computed('todos.@each.isDone', function() {
    var todos = this.get('todos');
    return todos.filterBy('isDone', false).get('length');
  }),
    
  selectedTodo: null,
  //todos.[] is used if what you need is only dependent on if the array was changed, not the properties
  indexOfSelectedTodo: Ember.computed('selectedTodo', 'todos.[]', function() {
    return this.get('todos').indexOf(this.get('selectedTodo'));
  })
});

/*
in another file(app.js?):

    import TodosComponent from 'app/components/todos';

    let todosComponent = TodosComponent.create();
    todosComponent.get('remaining'); //returns 1

    let todos = todosComponent.get('todos');
    let todo = todos.objectAt(1);
    todo.set('isDone', true);

    todosComponent.get('remaining'); //returns 0

    todo = Ember.Object.create({ isDone: false });
    todos.pushObject(todo);

    todosComponent.get('remaining'); //returns 1
    
*/
