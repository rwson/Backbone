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
        "dbclick label":"edit",
        "keypress .edit":"updateOnEnter",
        "blur .edit":"close"
    },

    "initialize":function(){
        this.listenTo(this.model,"change",this.render);
    },

    "render":function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$(".edit");
        return this;
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
