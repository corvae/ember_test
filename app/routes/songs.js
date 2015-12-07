// multiple models can be returned through hash()
export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      //takes parameters that return promises, returns when all promises resolve
      songs: this.store.findAll('song'),
      albums: this.store.findAll('album')
    });
  }
});