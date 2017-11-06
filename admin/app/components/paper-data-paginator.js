import Ember from 'ember';

const {
	Component,
	computed,
 } = Ember;

export default Component.extend({
	tagName: 'md-table-pagination',
	multiName: "Berichte",
	classNames: ['md-table-pagination'],
	startOffset: computed('page', 'limit', function() {
		return Math.max((this.get('page') - 1) * this.get('limit') + 1, 1); // 1-based index
	}),
	resultsLength:computed('meta.record-count','count', function() {
		if(this.get("count")){
			return this.get("count");
		} else return this.get("meta.record-count");
	}),
	pagesA:computed('meta.page-count','pages', function() {
		if(this.get("pages")){
			return this.get("pages");
		}
		let i=1;
		let result=[];
		for(;i<=this.get("meta.page-count");i++){
			result.push(i);
		}
		return result;
	}),
	endOffset: computed('startOffset', 'limit', function() {
		return this.get('startOffset') + this.get('limit');
	}),
	actions: {
		resetPage(){
			this.set('page',1);
		},
		increase(){
			if(this.get("page")<this.get("meta.page-count")){
				this.set("page",this.get("page")+1);
			}
		},
		decrease(){
			if(this.get("page")>1){
				this.set("page",this.get("page")-1);
			}
		}
	},
});
