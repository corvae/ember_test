// NOTE: about ember
/*
    Templates - 
        describe UI
        can contain plain HTMl
        can contain expressions: {{title}} (value comes from a component or controller)
        can contain helpers: {{#if isAdmin}}30 people have viewed your blog today.{{/if}}
        can contain components: a template listing blog posts rendering a component for each post

    Components - 
        primary way UIs are organized
        contains a template and a js file that describes the components behavior

    Controllers - 
        will be replacing Components

    Models - 
        represent persistent state
        persists information to a server (or to localStorage)

    Routes - 
        load a controller and a template
        load models to provide data to the controller that can be displayed by the template

    The Router - 
        maps a URL to a route


    !!! The URL drives the state of the application. 
        The URL determines which route to load, 
            which determines what model, controller, and template to load.
*/




/***   Classes   ***/
//    Defining a new class:
        Person = Ember.Object.extend({
          say(thing) {
            alert(thing);
          }
        });
        
//    Overriding parent class methods:
        Person = Ember.Object.extend({
          say(thing) {
            var name = this.get('name');
            alert(`${name} says: ${thing}`);
          }
        });
        Soldier = Person.extend({
          say(thing) {
            // this will call the method in the parent class (Person#say), appending
            // the string ', sir!' to the variable `thing` passed in
            this._super(`${thing}, sir!`);
          }
        });
        var yehuda = Soldier.create({
          name: 'Yehuda Katz'
        });
        yehuda.say('Yes'); // alerts "Yehuda Katz says: Yes, sir!"

//    Passing arguments to _super() before or after overriding
        normalizeResponse(store, primaryModelClass, payload, id, requestType)  {
          // Customize my JSON payload for Ember-Data
          return this._super(...arguments); //... is a spread operator
        }

//    Creating instances
        var person = Person.create();
        person.say('Hello'); // alerts " says: Hello"

//    Initialize properties when creating an instance
        Person = Ember.Object.extend({
          helloWorld() {
            alert(`Hi, my name is ${this.get('name')}`);
          }
        });
        //naming convention is UpperCamelCase for classes, lowercase for instances
        var tom = Person.create({
          name: 'Tom Dale' //only set simple properties when calling create
        });
        tom.helloWorld(); // alerts "Hi, my name is Tom Dale"
        
//    Initilizing instances
        Person = Ember.Object.extend({
          init() { //invoked automaticaly
            var name = this.get('name');
            alert(`${name}, reporting for duty!`);
          }
        });
        Person.create({
          name: 'Stefan Penner'
        });
        // alerts "Stefan Penner, reporting for duty!"

//    Object properties
        var person = Person.create();
        var name = person.get('name');
        person.set('name', 'Tobias Fünke');
        // if get and set aren't used, computed properties won't recalculate, observers won't fire, and templates won't update


//    Reopening classes and instances
        //override property of Person instance
        Person.reopen({ 
          isPerson: true //define new property
        });
        Person.create().get('isPerson') // true
        Person.reopen({
          // override existing `say` method to add an ! at the end
          say(thing) {
            this._super(thing + '!');
          }
        });

        // add static property to class
        Person.reopenClass({
          isPerson: false
        });
        Person.isPerson; // false - because it is static property created by `reopenClass`


//    Computed properties (declare functions as properties)
        Person = Ember.Object.extend({
          firstName: null,
          lastName: null,
          fullName: Ember.computed('firstName', 'lastName', function() {
            return `${this.get('firstName')} ${this.get('lastName')}`;
          })
        });
        var ironMan = Person.create({
          firstName: 'Tony',
          lastName:  'Stark'
        });
        ironMan.get('fullName'); // "Tony Stark"

//    Set computed Properties
        Person = Ember.Object.extend({
          firstName: null,
          lastName: null,
          
          // define get and set for computed properties, not just return value
          fullName: Ember.computed('firstName', 'lastName', {
            get(key) {
              return `${this.get('firstName')} ${this.get('lastName')}`;
            },
            set(key, value) {
              var [firstName, lastName] = value.split(/\s+/);
              this.set('firstName', firstName);
              this.set('lastName',  lastName);
              return value;
            }
          })
        });
        var captainAmerica = Person.create();
        captainAmerica.set('fullName', 'William Burnside');
        captainAmerica.get('firstName'); // William
        captainAmerica.get('lastName'); // Burnside

//    Observers
        Person = Ember.Object.extend({
          firstName: null,
          lastName: null,
          fullName: Ember.computed('firstName', 'lastName', function() {
            return `${this.get('firstName')} ${this.get('lastName')}`;
          }),
          fullNameChanged: Ember.observer('fullName', function() {
            // deal with the change
            console.log(`fullName changed to: ${this.get('fullName')}`);
          })
        });
        var person = Person.create({
          firstName: 'Yehuda',
          lastName: 'Katz'
        });
    // observer won't fire until `fullName` is consumed first
        person.get('fullName'); // "Yehuda Katz"
        person.set('firstName', 'Brohuda'); // fullName changed to: Brohuda Katz

    //use run.once() to ensure that any processing you need to do only happens once, and happens in the next run loop once all bindings are syncronized
        Person.reopen({
          partOfNameChanged: Ember.observer('firstName', 'lastName', function() {
              Ember.run.once(this, 'processFullName');
          }),
          processFullName: Ember.observer('fullName', function() {
            // This will only fire once if you set two properties at the same time, and
            // will also happen in the next run loop once all properties are synchronized
            console.log(this.get('fullName'));
          })
        });
        person.set('firstName', 'John');
        person.set('lastName', 'Smith');

    //if an observer should fire as part of init, use Ember.on()
        Person = Ember.Object.extend({
          init() {
            this.set('salutation', 'Mr/Ms');
          },
          salutationDidChange: Ember.on('init', Ember.observer('salutation', function() {
            // some side effect of salutation changing
          }))
        });

    //adding observers to an object outside of a class definition
        person.addObserver('fullName', function() {
          // deal with the change
        });

//    Bindings
    //use computed.alias() to create two-way bindings
        wife = Ember.Object.create({
          householdIncome: 80000
        });
        Husband = Ember.Object.extend({
          householdIncome: Ember.computed.alias('wife.householdIncome')
        });
        husband = Husband.create({
          wife: wife
        });
        husband.get('householdIncome'); // 80000
        // Someone gets raise.
        wife.set('householdIncome', 90000);
        husband.get('householdIncome'); // 90000

    //use computed.oneWay() for a binding that only propagates changes in one direction
        user = Ember.Object.create({
          fullName: 'Kara Gates'
        });
        UserComponent = Ember.Component.extend({
          userName: Ember.computed.oneWay('user.fullName')
        });
        userComponent = UserComponent.create({
          user: user
        });
        // Changing the name of the user object changes
        // the value on the view.
        user.set('fullName', 'Krang Gates');
        // userComponent.userName will become "Krang Gates"
        // ...but changes to the view don't make it back to
        // the object.
        userComponent.set('userName', 'Truckasaurus Gates');
        user.get('fullName'); // "Krang Gates"

//    Enumerables
    //forEach()
        var food = ['Poi', 'Ono', 'Adobo Chicken'];
        food.forEach(function(item, index) {
          console.log(`Menu Item ${index+1}: ${item}`);
        });

    //firstObject and lastObject properties
        var animals = ['rooster', 'pig'];
        animals.get('lastObject');
        //=> "pig"
        animals.pushObject('peacock');
        animals.get('lastObject');
        //=> "peacock"

    //map() for array of values
        var words = ['goodbye', 'cruel', 'world'];
        var emphaticWords = words.map(function(item) {
          return item + '!';
        });
        // ["goodbye!", "cruel!", "world!"]

    //mapBy() for array of Objects
        var hawaii = Ember.Object.create({
          capital: 'Honolulu'
        });
        var california = Ember.Object.create({
          capital: 'Sacramento'
        });
        var states = [hawaii, california];
        states.mapBy('capital');
        //=> ["Honolulu", "Sacramento"]

    //filter() returns an array based on some criteria, find() returns the first matched value
        var arr = [1,2,3,4,5];
        arr.filter(function(item, index, self) {
          return item < 4;
        })
        // returns [1,2,3]

    //use filterBy() when working with array of objects, findBy() returns the first matched object
        Todo = Ember.Object.extend({
          title: null,
          isDone: false
        });
        todos = [
          Todo.create({ title: 'Write code', isDone: true }),
          Todo.create({ title: 'Go to sleep' })
        ];
        todos.filterBy('isDone', true);
        // returns an Array containing only items with `isDone == true`

    //every() tests every item against some condition
        Person = Ember.Object.extend({
          name: null,
          isHappy: false
        });
        var people = [
          Person.create({ name: 'Yehuda', isHappy: true }),
          Person.create({ name: 'Majd', isHappy: false })
        ];
        people.every(function(person, index, self) {
          return person.get('isHappy');
        });
        // returns false

    //any() tells if at least one item matches some condition
        people.any(function(person, index, self) {
          return person.get('isHappy');
        });
        // returns true

    //could also use isEvery() or isAny()
        people.isEvery('isHappy', true) // false
        people.isAny('isHappy', true)  // true

/****   Routing   **/
    // in router.js, the routes are mapped to display templates, load data, and set up the application state
    
