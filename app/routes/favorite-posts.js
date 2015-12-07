export default Ember.Route.extend({
  // use the model() hook in the posts route handler, to load a model for this route
  model() {
    return this.store.query('post', { favorite: true });
  }
});