/**
 * Created by Marcela on 1. 3. 2015.
 */
///<reference path="treeview.list.ts" />
///<reference path="../typing/jquery.d.ts" />
var AwesomeTreeView;
(function (AwesomeTreeView) {
    /*
    * This class is responsible for initializing plugin,
    * setting defaults and custom options
    * and rendering plugin component
    * */
    var TreeView = (function () {
        function TreeView(element, options) {
            this.element = element;
            this.element.addClass("awesome-tree-view");
            // merge custom settings with plugin defaults
            this.settings = $.extend(true, this.defaultTree(), options);
        }
        // call List class to render tree view
        TreeView.prototype.init = function () {
            var list = new AwesomeTreeView.List(this);
        };
        // implement interface and set defaults
        TreeView.prototype.defaultTree = function () {
            return {
                icon: true,
                expandAll: false,
                uniqueOnOpen: false,
                animation: true,
                fileIcons: false,
                customIcons: AwesomeTreeView.IconType.defaultIcons(),
                hoverClass: "",
                expandClass: "",
                selectClass: ""
            };
        };
        return TreeView;
    })();
    AwesomeTreeView.TreeView = TreeView;
})(AwesomeTreeView || (AwesomeTreeView = {}));
//# sourceMappingURL=treeview.js.map