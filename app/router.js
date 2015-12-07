import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    // templates to render when a url is visited
    this.route('about', { path: '/about' }); // or if path is the same, this.route('about');
    
    this.route('favorites', { path: '/favs' });
    
    //nested routes, a callback is passed
    this.route('posts', function() {
        this.route('new');
    });
    
    //template that displays data from a model, in routes/favorite-posts.js
    this.route('favorite-posts');
    
    //route with a dynamic segment, in routes/photo.js
    this.route('photo', { path: '/photos/:photo_id' });
    
    this.route('page-not-found', { path: '/*wildcard' });
});

export default Router;
