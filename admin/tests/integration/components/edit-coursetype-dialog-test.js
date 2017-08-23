import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-coursetype-dialog', 'Integration | Component | edit coursetype dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-coursetype-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-coursetype-dialog}}
      template block text
    {{/edit-coursetype-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
