import Mixin from '@ember/object/mixin';

export default Mixin.create({
  closeDeleteDialog:function(model,option){
    this.set("showDelete"+model+"Dialog",false);
    if(option=="ok"){
      this.get('current'+model).destroyRecord();
    }
    else {
      this.set('current'+model,null);
    }
  },
  closeEditDialog:function(model,modelgerman,option){
    if(option=="ok"){
      this.get('current'+model).save().then(()=>{
        this.get('paperToaster').show(modelgerman+" erfolgreich gespeichert",{duration:4000});
      }).catch((errorMessage)=>{
        this.get('paperToaster').show(modelgerman+" konnte nicht gespeichert werden! Grund: "+errorMessage,{duration:4000});
      });
    }
    else{
      this.get('current'+model).rollback();
    }
    this.set('showEdit'+model+'Dialog',false);
  }
});
