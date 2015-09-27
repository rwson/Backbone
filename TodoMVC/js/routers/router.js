/**
 * router
 * build by Mrson @9/27/15
 * mail:rw_Song@sina.com
 * 路由控制
 */

var WorkSpace = Backbone.Router.extend({

    "routes":{
        "*filter":"setFilter"
    },

    "setFilter":function(param){
        window.app.Todos.trigger("filter");
    }

});

app.TodoRouter = new WorkSpace();
Backbone.history.start();
