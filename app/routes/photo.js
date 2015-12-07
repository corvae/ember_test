//route with dynamic segment
export default Ember.Route.extend({
  //in the model hook, i would have to turn the id into a model that can be rendered by the route's template
  model(params) {
    return this.store.findRecord('photo', params.photo_id);
  }
});