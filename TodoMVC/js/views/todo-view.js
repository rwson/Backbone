/**
 * todo-view
 * build by Mrson @9/27/15
 * mail:rw_Song@sina.com
 * 代办视图
 */

var app = app || {};

app.TodoView = Backbone.View.extend({

    "tagName":"li",

    "template": _.template($("#item-template").html()),

    "events":{
        "click .toggle":"toggleCompleted",
        "click .destroy":"clear",
        "dbclick label":"edit",
        "keypress .edit":"updateOnEnter",
        "blur .edit":"close"
    },

    "initialize":function(){
        this.listenTo(this.model,"change",this.render);
        this.listenTo(this.model,"destroy",this.render);
        this.listenTo(this.model,"visible",this.render);
    },

    "render":function(){
        this.$el.toggleClass("completed",this.model.get("completed"));
        this.toggleVisible();

        this.$input = this.$(".edit");
        return this;
    },

    "toggleVisible":function(){
        this.$el.toggleClass("hidden",this.isHidden());
    },

    "isHidden":function(){
        return this.model.get("completed") ? app.TodoFilter === "active" : app.TodoFilter === "completed";
    },

    /**
     * 复选框上的toggle-completed事件
     */
    "toggleCompleted":function(){
        this.model.toggle();
    },

    /**
     * 删除当前todo项
     */
    "clear":function(){
        this.model.destroy();
    },

    /**
     * 用户双击一个todo项进入编辑状态
     */
    "edit":function(){
        this.$el.addClass("editing");
        this.$input.focus();
    },

    /**
     * 退出编辑状态,如果输入有效,就更新todo项的信息
     */
    "close":function(){
        var value = this.$input.val().trim();
        if(value){
            this.model.save({
                "title":value
            });
        }else{
            this.clear();
        }
        this.$el.removeClass("editing");
        this.$input.blur();
    },

    /**
     * 判断用户是否按下回车,再执行close方法
     * @param ev
     */
    "updateOnEnter":function(ev){
        if(ev.which == ENTER_KEY){
            this.close();
        }
    }
});
