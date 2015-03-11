/**
 * Created by Marcela on 1. 3. 2015.
 */
///<reference path="treeview.ts" />
///<reference path="../typing/jquery.d.ts" />
var AwesomeTreeView;
(function (AwesomeTreeView) {
    /*
    * This class implements expanding and collapsing events
    * */
    var ListEvent = (function () {
        function ListEvent(element, treeView) {
            this.settings = treeView.settings;
            this.element = element;
            this.applyEvents();
        }
        ListEvent.prototype.applyEvents = function () {
            var _this = this;
            this.element.on('click', 'li', function (e) { return _this.toggleList(e); });
            if (this.settings.hoverClass && this.settings.hoverClass.length) {
                this.element.find("li").hover(function (e) { return _this.hoverWrapper(e); });
            }
        };
        // expand/collapse li elements
        ListEvent.prototype.toggleList = function (e) {
            e.stopPropagation();
            var liElement = $(e.target).closest("li"), icon = liElement.find("> img"), arrow = liElement.find("> i.fa");
            if (icon && icon.length && liElement.attr("data-list-type") === "folder") {
                AwesomeTreeView.UIHelper.toggleIconFolder(icon);
            }
            else if (arrow && arrow.length) {
                AwesomeTreeView.UIHelper.toggleArrow(liElement);
            }
            if (this.settings.animation) {
                liElement.find("> ul > li").slideToggle();
            }
            else {
                liElement.find("> ul > li").toggle();
            }
        };
        ListEvent.prototype.hoverWrapper = function (e) {
            this.element.find("." + this.settings.hoverClass).removeClass(this.settings.hoverClass);
            $(e.target).prev("div.li-wrapper").addClass(this.settings.hoverClass);
        };
        return ListEvent;
    })();
    AwesomeTreeView.ListEvent = ListEvent;
})(AwesomeTreeView || (AwesomeTreeView = {}));
/**
 * Created by Marcela on 6. 3. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
var AwesomeTreeView;
(function (AwesomeTreeView) {
    var UIHelper = (function () {
        function UIHelper() {
        }
        // collpase all
        UIHelper.collapseAll = function (element) {
            element.find("li[data-level!=1]").css({ "display": "none" });
            UIHelper.collapseAllIcon(element);
        };
        // expand all
        UIHelper.expandAll = function (element) {
            element.find("li[data-level!=1]").css({ "display": "list-item" });
        };
        // set collapse icon/arrow
        UIHelper.collapseAllIcon = function (element) {
            var listElements = element.find("li[data-level=1][data-list-type=folder]"), imageElements = listElements.find("> img"), arrowElements = listElements.find("> i.fa");
            if (imageElements && imageElements.length) {
                imageElements.each(function (index, item) {
                    $(item).removeClass("state-open").addClass("state-close").attr("src", "/../icon/directory.png");
                });
            }
            else if (arrowElements && arrowElements.length) {
                arrowElements.each(function (index, item) {
                    $(item).removeClass("fa-angle-down").addClass("fa-angle-right");
                });
            }
        };
        UIHelper.openTreeBranch = function (element) {
            element.parents("li").each(function (index, item) {
                var it = $(item);
                if (it.children("img")) {
                    it.children("img").removeClass("state-close").addClass("state-open").attr("src", "/../icon/folder_open.png");
                    it.css({ "display": "list-item" });
                }
                else if (it.children("i.fa")) {
                    it.children("i.fa").removeClass("fa-angle-right").addClass("fa-angle-down");
                    it.css({ "display": "list-item" });
                }
            });
        };
        // set appropriate icon
        UIHelper.toggleIconFolder = function (img) {
            img.toggleClass("state-open");
            img.toggleClass("state-close");
            if (img.hasClass("state-open")) {
                img.attr("src", "/../icon/folder_open.png");
            }
            else {
                img.attr("src", "/../icon/directory.png");
            }
        };
        // set appropriate arrow
        UIHelper.toggleArrow = function (element) {
            var arrow = element.find("> i.fa");
            arrow.toggleClass("fa-angle-right");
            arrow.toggleClass("fa-angle-down");
        };
        return UIHelper;
    })();
    AwesomeTreeView.UIHelper = UIHelper;
    // TODO: change path to "icon/" to production
    var IconType = (function () {
        function IconType() {
        }
        IconType.defaultIcons = function () {
            return {
                "css": "../icon/css.png",
                "doc": "../icon/doc.png",
                "docx": "../icon/doc.png",
                "avi": "../icon/film.png",
                "mkv": "../icon/film.png",
                "mp4": "../icon/film.png",
                "html": "../icon/html.png",
                "java": "../icon/java.png",
                "mp3": "../icon/music.png",
                "wma": "../icon/music.png",
                "pdf": "../icon/pdf.png",
                "php": "../icon/php.png",
                "jpg": "../icon/picture.png",
                "jpeg": "../icon/picture.png",
                "bmp": "../icon/picture.png",
                "png": "../icon/picture.png",
                "ppt": "../icon/ppt.png",
                "psd": "../icon/psd.png",
                "txt": "../icon/txt.png",
                "xls": "../icon/xls.png",
                "xlsx": "../icon/xls.png",
                "zip": "../icon/zip.png",
                "js": "../icon/script.png",
                "ts": "../icon/script.png",
                "cs": "../icon/code.png",
                "exe": "../icon/application.png"
            };
        };
        return IconType;
    })();
    AwesomeTreeView.IconType = IconType;
})(AwesomeTreeView || (AwesomeTreeView = {}));
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
/**
 * Created by Marcela on 6. 3. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="treeview.ts" />
(function ($) {
    $.fn.treeview = function () {
        var option = arguments[0], args = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data("jquery.treeview"), options = $.extend({}, $.fn.treeview.defaults, $this.data(), typeof option === 'object' && option);
            if (!data) {
                $this.data("jquery.treeview", (data = new AwesomeTreeView.TreeView($this, options)));
            }
            if (typeof option === 'string') {
                data[option](args[1]);
            }
            else {
                data.init();
            }
        });
    };
    $.fn.treeview.defaults = {};
})(jQuery);
