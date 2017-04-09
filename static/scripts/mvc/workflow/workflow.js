define(["mvc/form/form-view","mvc/ui/ui-misc","mvc/ui/ui-select"],function(a,b,c){var d=Backbone.View.extend({initialize:function(){this.setElement("<div/>"),this.render()},render:function(){var a=this,d=Galaxy.root+"workflow";$.ajax({url:d,type:"GET"}).done(function(d){a.$el.empty().append(a._templateHeader()),d=JSON.parse(d),a.btnNewWorkflow=new b.Button({title:"New Workflow",tooltip:"Create a workflow",icon:"fa-plus",onclick:function(){a.create_workflow()}}),a.btnImportWorkflow=new b.Button({title:"Import Workflow",tooltip:"Import a workflow",icon:"fa-code-fork",onclick:function(){a.import_workflow()}}),a.selectWorkflows=new c.View({css:"workflow-list",container:a.$(".user-workflows"),data:d.workflows,value:1,onchange:function(){}}),a.$el.append(a.btnNewWorkflow.$el),a.$el.append(a.btnImportWorkflow.$el),a.$el.append(a.selectWorkflows.$el)}).fail(function(){a.$el.empty().append(new b.Message({message:"Failed to load resource "+a.url+".",status:"danger",persistent:!0}).$el)})},create_workflow:function(){},import_workflow:function(){},_templateHeader:function(){return'<div class="user-workflows"><div class="page-container"><h2>Your workflows</h2></div></div>'}});return{View:d}});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow.js.map