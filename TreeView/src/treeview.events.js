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
//# sourceMappingURL=treeview.events.js.map