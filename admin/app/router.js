import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('/',function(){
  this.route('index');
});
  this.route('management', function() {
    this.route('general', function() {
      this.route('faculties');
      this.route('coursetypes');
    });
    this.route('lecturers');
    this.route('courses');
  });
  this.route('import');
  this.route('review', function() {
    this.route('approved');
    this.route('disapproved');
  });
});

export default Router;
