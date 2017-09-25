import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-single-course-dialog', 'Integration | Component | edit single course dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-single-course-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-single-course-dialog}}
      template block text
    {{/edit-single-course-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
