import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Mixin.create({
  limitOptions: A([10, 20, 30]),
  limit: 10,
  page: 1,
  pages: computed('meta.page-count', function() {
  let e = A();
  for (let i = 1; i <=this.get("meta.page-count"); i++) {
    e.pushObject(i);
  }
  return e;
}),
resultsLength:computed('meta.record-count', function() {
  return this.get("meta.record-count");
})
});
