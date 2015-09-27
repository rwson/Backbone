/**
 * app-view
 * build by Mrson @9/27/15
 * mail:rw_Song@sina.com
 * 应用程序视图
 */

var app = app || {};

app.AppView = Backbone.View.extend({

    "el":"#todoapp",

    "statsTemplate": _.template($("#stats-template").html()),

    "events":{
        "keypress #new-todo":"createOnEnter",
        "click #clear-completed":"clearCompleted",
        "click #toggle-all":"toggleAppCompleted"
    },

    "initialize":function(){
        this.allCheckBox = this.$("#toggle-all")[0];
        this.$input = this.$("#new-todo");
        this.$footer = this.$("#footer");
        this.$main = this.$("#main");

        this.listenTo(app.Todos,"add",this.addOne);
        this.listenTo(app.Todos,"reset",this.addAll);


        this.listenTo(app.Todos,"change:completed",this.filterOne);
        this.listenTo(app.Todos,"filter",this.filterAll);
        this.listenTo(app.Todos,"all",this.render);

        app.Todos.fetch();
    },

    "render":function(){
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if(app.Todos.length){
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                "completed":completed,
                "remaining":remaining
            }));

            this.$("#filters li a").removeClass("selected").filter("[href=\#\/"+ app.TodoFilter || "" +"]").addClass("selected");
        }else{
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckBox.checked = !remaining;
    },

    /**
     * 创建一个新的todo实例并进行渲染,将渲染结果附加到todo列表
     * @param todo
     */
    "addOne":function(todo){
        var view = new app.TodoView({
            "model":todo
        });
    },

    /**
     * 对当前所有todo项进行迭代,触发每个todo项的addOne方法
     */
    "addAll":function(){
        this.$("#todo-list").html("");
        app.Todos.each(this.addOne,this);
    },

    "filterOne":function(todo){
        todo.trigger("visible");
    },


    "filterAll":function(){
        app.Todos.each(this.filterOne,this);
    },

    "newAttributes":function(){
        return {
            "title":this.$input.val().trim(),
            "order":app.Todos.nextOrder(),
            "completed":false
        };
    },

    /**
     * 根据用户按键和输入判断是否新建todo项
     * @param ev
     */
    "createOnEnter":function(ev){
        if(ev.which !== ENTER_KEY || !this.$input.val().trim()){
            return;
        }
        app.Todos.create(this.newAttributes());
        this.$input.val("");
    },

    /**
     * 用户选择clear-completed事件,清除todo列表里面所有已完成的项
     * @returns {boolean}
     */
    "clearCompleted":function(){
        _.invoke(app.Todos.completed(),"destroy");
        return false;
    },

    /**
     * 选择toggle-all复选框,将所有todo项都标记为已完成
     */
    "toggleAppCompleted":function(){
        var completed = this.allCheckBox.checked;
        app.Todos.each(function(todo){
            todo.save({
                "completed":completed
            });
        });
    }
});
