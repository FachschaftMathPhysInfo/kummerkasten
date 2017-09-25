import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('inbox', function() {
    this.route('read');
    this.route('settings');
    this.route('courses');
  });
  this.route('login');
  this.route('/index');
});

export default Router;
