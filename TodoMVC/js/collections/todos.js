/**
 * todo
 * build by Mrson @9/27/15
 * mail:rw_Song@sina.com
 * Todo集合
 */

var app = app || {};

var TodoList = Backbone.Collection.extend({

    /**
     * 指定模型
     */
    "model":app.Todo,

    "localStorage":new Backbone.LocalStorage("todos-backbone"),

    /**
     * 返回已完成的todo项
     * @returns {*|Array.<T>|{PSEUDO, CHILD, ID, TAG, CLASS, ATTR, POS}}
     */
    "completed":function(){
        return this.filter(function(todo){
            return todo.get("completed")
        });
    },

    /**
     * 返回未完成的todo项
     * @returns {*}
     */
    "remaining":function(){
        return this.without.apply(this,this.completed());
    },

    /**
     * 序列生成器
     * @returns {*}
     */
    "nextOrder":function(){
        if(!this.length){
            return 1;
        }
        return this.last().get("order") + 1;
    },

    /**
     * 通过todo项的插入顺序对集合进行排序
     * @param todo
     * @returns {*}
     */
    "comparator":function(todo){
        return todo.get("order");
    }
});

app.Todos = new TodoList();