/**
 * Created by Marcela on 1. 3. 2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="treeview.ts" />
///<reference path="treeview.events.ts" />
///<reference path="treeview.helpers.ts" />
///<reference path="../typing/jquery.d.ts" />
var AwesomeTreeView;
(function (AwesomeTreeView) {
    var ListRender = (function () {
        function ListRender(element) {
            this.element = element;
            this.render();
        }
        ListRender.prototype.render = function () {
            var _this = this;
            this.element.each(function (id, it) { return _this.renderDesign(it); });
        };
        ListRender.prototype.renderDesign = function (item) {
            throw "Not implemented in base class";
        };
        return ListRender;
    })();
    AwesomeTreeView.ListRender = ListRender;
    /*
    * This class is responsible for modifying unordered DOM list
    * according to settings, adding expanding and collapsing identificators
    * and registering event handlers
    * */
    var List = (function (_super) {
        __extends(List, _super);
        function List(treeView) {
            _super.call(this, treeView.element);
            this.element = treeView.element;
            this.treeView = treeView;
            // add event handlers
            this.treeViewEvents = new AwesomeTreeView.ListEvent(this.element, treeView);
            this.applySettings();
            this.addWrapper();
        }
        List.prototype.applySettings = function () {
            // implement settings
            var settings = this.treeView.settings;
            var icon = settings.icon ? new Icon(this.element, this.treeView.settings) : new Arrow(this.element, this.treeView.settings.expandAll);
            var expand = settings.expandAll ? AwesomeTreeView.UIHelper.expandAll(this.element) : AwesomeTreeView.UIHelper.collapseAll(this.element);
        };
        // render each li element, set icon or arrow indicator for expanding and collapsing
        List.prototype.renderDesign = function (item) {
            var _this = this;
            $(item).find("li").each(function (index, item) {
                var $item = $(item), parentLevel = Number($item.parent().parent().attr("data-level")) || 0, level = ++parentLevel;
                $item.attr("data-level", level);
                var childrenLi = $item.find("> ul > li");
                if (childrenLi.length) {
                    childrenLi.each(function (id, it) {
                        _this.renderDesign(it);
                    });
                }
            });
        };
        List.prototype.addWrapper = function () {
            this.element.find("li").each(function (index, item) {
                var parent = $(item).closest("[data-level=1]").parent();
                $(item).before($("<div />").addClass("li-wrapper").css({ "max-width": parent.outerWidth() + "px" }));
            });
        };
        return List;
    })(ListRender);
    AwesomeTreeView.List = List;
    var Arrow = (function (_super) {
        __extends(Arrow, _super);
        function Arrow(element, expandAll) {
            _super.call(this, element);
            this.element = element;
            if (expandAll) {
                this.element.find("i.fa").toggleClass("fa-angle-down").toggleClass("fa-angle-right");
            }
        }
        Arrow.prototype.renderDesign = function (item) {
            var _this = this;
            $(item).find("li").each(function (index, item) {
                var $item = $(item), childrenLi = $item.find("> ul > li");
                if (childrenLi.length) {
                    $item.attr("data-list-type", "folder");
                    $item.find(".fa").remove();
                    $item.prepend($("<i class='fa fa-angle-right'></i>"));
                    childrenLi.each(function (id, it) {
                        _this.renderDesign(it);
                    });
                }
            });
        };
        return Arrow;
    })(ListRender);
    AwesomeTreeView.Arrow = Arrow;
    var Icon = (function (_super) {
        __extends(Icon, _super);
        function Icon(element, settings) {
            _super.call(this, element);
            this.element = element;
            this.settings = settings;
            this.applySettings();
        }
        Icon.prototype.applySettings = function () {
            if (this.settings.expandAll)
                this.openIcon();
            if (this.settings.fileIcons)
                this.fileIcons();
        };
        Icon.prototype.renderDesign = function (item) {
            var _this = this;
            $(item).find("li").each(function (index, item) {
                var $item = $(item), childrenLi = $item.find("> ul > li");
                _this.renderIcon($item, childrenLi.length);
                if (childrenLi.length) {
                    childrenLi.each(function (id, it) {
                        _this.renderDesign(it);
                    });
                }
            });
        };
        // render icon
        Icon.prototype.renderIcon = function (item, children) {
            item.find("img").remove();
            var $icon, baseIcon = "<img src='/../icon/{{icon}}.png'/>";
            if (children) {
                $icon = $(baseIcon.replace("{{icon}}", "directory"));
            }
            else {
                $icon = $(baseIcon.replace("{{icon}}", "file")).css({ "cursor": "default" });
            }
            item.prepend($icon);
            item.attr("data-list-type", children ? "folder" : "file").find("img").addClass("state-close");
        };
        Icon.prototype.openIcon = function () {
            this.element.find("li[data-list-type=folder] > img").each(function (index, item) { return AwesomeTreeView.UIHelper.toggleIconFolder($(item)); });
        };
        Icon.prototype.fileIcons = function () {
            var iconDict = this.settings.customIcons;
            this.element.find("li[data-list-type=file]").each(function (index, item) {
                var fileName = $(item).text(), fileParts = fileName.split('.'), extension = fileParts[fileParts.length - 1], iconName = iconDict[extension.toLocaleLowerCase()];
                if (iconName && iconName.length) {
                    $(item).children().attr("src", iconName);
                }
            });
        };
        return Icon;
    })(ListRender);
    AwesomeTreeView.Icon = Icon;
})(AwesomeTreeView || (AwesomeTreeView = {}));
//# sourceMappingURL=treeview.list.js.map