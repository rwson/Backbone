$(function(){

  /**
   * 基本数据模型:title/order/done
   */
  var Todo = Backbone.Model.extend({

    //  Todo模型下的默认值
    defaults: function() {
      return {
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false
      };
    },

    /**
     * 更改Todo项的完成状态
     */
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  /**
   * Collection:Todo项的集合,存储在localStorage中
   * 按指定顺序存放Todos对象
   * 获取完成/未完成的任务个数
   * 生成下一个Todo项的序号
   */
  var TodoList = Backbone.Collection.extend({

    //  Todo的集合
    model: Todo,

    //  存储到名为todos-backbone中
    localStorage: new Backbone.LocalStorage("todos-backbone"),

    /**
     * 获取所有已经完成任务的数组
     * @returns {*}
     */
    done: function() {
      return this.where({done: true});
    },

    /**
     * 获取未完成的任务数组
     * @returns {*}
     */
    remaining: function() {
      return this.where({done: false});
    },

    /**
     * 生成下一个order的编号,通过数据库中的记录加1
     * @returns {*}
     */
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
      //  last获取collection中最后一个元素
    },

    /**
     * 指定collection的排序方式
     */
    comparator: 'order'

  });

  //  创建一个全局Todo的Collection对象
  var Todos = new TodoList;

  /**
   * TodoView:控制任务列表
   */
  var TodoView = Backbone.View.extend({

    //  把template模板中获取到的html代码放到该标签
    tagName:  "li",

    //  获取模板
    template: _.template($('#item-template').html()),

    //  给指定的DOM绑定事件
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    /**
     * 初始化方法
     * 对model的change事件进行监听
     * 设置对model的destory进行监听,保证页面数据和model数据保持一致
     */
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      //  remove是view上的方法，用来清除DOM
    },

    /**
     * 渲染todos中的数据到item-template中,然后返回当前调用对象
     * @returns {TodoView}
     */
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    /**
     * 控制任务完成状态
     */
    toggleDone: function() {
      this.model.toggle();
    },

    /**
     * 修改任务项的样式
     */
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    /**
     * 退出任务的编辑状态,并且修改model
     */
    close: function() {
      var value = this.input.val();
      if (!value) {
        //  如果没有输入,直接把该Todo从页面清除
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },

    /**
     * 按下回车,关闭编辑模式
     * @param e 事件
     */
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    /**
     * 移除对应的条目,已经对应的数据对象
     */
    clear: function() {
      this.model.destroy();
    }

  });

  /**
   * 显示所有任务列表
   * 整体的列表状态(完成多少,未完成多少)
   * 新任务的添加
   */
  var AppView = Backbone.View.extend({

    //  绑定也面上的DOM节点
    el: $("#todoapp"),

    //  在底部显示的统计模板
    statsTemplate: _.template($('#stats-template').html()),

    //  绑定一些事件
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },

    /**
     * 初始化过程中,绑定事件到Todos上
     * 当任务列表改变触发对应的事件
     * 从localStorage中fetch数据到Todos列表
     * 监听相关事件
     */
    initialize: function() {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
    },

    /**
     * 更改当前任务列表的状态
     */
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }
      this.allCheckbox.checked = !remaining;
      //  根据剩余多少未完成确定标记全部完成的checkbox的显示
    },

    /**
     * 添加一个todo项到列表中
     * @param todo  todo项
     */
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    /**
     * 在页面加载时渲染所有Todo项
     */
    addAll: function() {
      Todos.each(this.addOne, this);
    },

    /**
     * 在编辑输入框上按下回车,如果填写了标题,就创建一个任务,并且把输入框内容置空,否则什么都不干
     * @param e
     */
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
    },

    /**
     * 清除所有已经完成的任务
     * @returns {boolean}
     */
    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      //  undersore中的invoke方法,对过滤出来的todo调用destory
      return false;
    },

    /**
     * 批量处理todo项的完成状态
     */
    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }

  });

  var App = new AppView;
  //  启动程序

});
