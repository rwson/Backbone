/**
 * todo.js
 * build by Mrson @9/27/15
 * mail:rw_Song@sina.com
 * Todo模型
 */

var app = app || {};

app.Todo = Backbone.Model.extend({

    /**
     * 默认值
     */
    "defaults":{
        "title":"",
        "completed":false
    },

    /**
     * 设置并保存当前todo的completed属性
     */
    "toggle":function(){
        this.save({
            "completed":!this.get("completed")
        });
    }
});