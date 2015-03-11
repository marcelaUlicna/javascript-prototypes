/**
 * Created by Marcela on 1. 3. 2015.
 */

///<reference path="treeview.ts" />
///<reference path="treeview.events.ts" />
///<reference path="treeview.helpers.ts" />
///<reference path="../typing/jquery.d.ts" />

module AwesomeTreeView {

    export class ListRender {
        element: JQuery;

        constructor(element: JQuery) {
            this.element = element;
            this.render();
        }

        render(): void {
            this.element.each((id, it) => this.renderDesign(it));
        }

        renderDesign(item: Element): void {
            throw "Not implemented in base class";
        }
    }

    /*
    * This class is responsible for modifying unordered DOM list
    * according to settings, adding expanding and collapsing identificators
    * and registering event handlers
    * */
    export class List extends ListRender {
        element: JQuery;
        treeView: TreeView;
        treeViewEvents: ListEvent;

        constructor(treeView: TreeView) {
            super(treeView.element);
            this.element = treeView.element;
            this.treeView = treeView;

            // add event handlers
            this.treeViewEvents = new ListEvent(this.element, treeView);

            this.applySettings();
            this.addWrapper();
        }

        applySettings(): void {
            // implement settings
            var settings = this.treeView.settings;
            var icon = settings.icon
                            ? new Icon(this.element, this.treeView.settings )
                            : new Arrow(this.element, this.treeView.settings.expandAll);

            var expand = settings.expandAll
                            ? UIHelper.expandAll(this.element)
                            : UIHelper.collapseAll(this.element);
        }

        // render each li element, set icon or arrow indicator for expanding and collapsing
        renderDesign(item: Element): void {
            $(item).find("li").each((index, item) => {
                var $item = $(item),
                    parentLevel: number = Number($item.parent().parent().attr("data-level")) || 0,
                    level = ++parentLevel;

                $item.attr("data-level", level);

                var childrenLi = $item.find("> ul > li");
                if(childrenLi.length) {
                    childrenLi.each((id, it) => {
                        this.renderDesign(it);
                    });
                }
            });
        }

        addWrapper(): void {
            this.element.find("li").each((index, item) => {
                var parent = $(item).closest("[data-level=1]").parent();

                $(item)
                    .before($("<div />")
                        .addClass("li-wrapper")
                        .css({"max-width": parent.outerWidth() + "px"}));
            });
        }
    }

    export class Arrow extends ListRender {
        element: JQuery;

        constructor(element: JQuery, expandAll: boolean) {
            super(element);
            this.element = element;

             if(expandAll) {
                this.element.find("i.fa")
                    .toggleClass("fa-angle-down")
                    .toggleClass("fa-angle-right");
             }
        }

        renderDesign(item: Element): void {
            $(item).find("li").each((index, item) => {
                var $item = $(item),
                    childrenLi = $item.find("> ul > li");

                if(childrenLi.length) {
                    $item.attr("data-list-type", "folder");
                    $item.find(".fa").remove();
                    $item.prepend($("<i class='fa fa-angle-right'></i>"));

                    childrenLi.each((id, it) => {
                        this.renderDesign(it);
                    });
                }
            });
        }
    }

    export class Icon extends ListRender {
        element: JQuery;
        settings: ITreeView;

        constructor(element: JQuery, settings: ITreeView) {
            super(element);
            this.element = element;
            this.settings = settings;
            this.applySettings();
        }

        applySettings(): void {
            if(this.settings.expandAll) this.openIcon();
            if(this.settings.fileIcons) this.fileIcons();
        }

        renderDesign(item: Element): void {
            $(item).find("li").each((index, item) => {
                var $item = $(item),
                    childrenLi = $item.find("> ul > li");

                this.renderIcon($item, childrenLi.length);

                if(childrenLi.length) {
                    childrenLi.each((id, it) => {
                        this.renderDesign(it);
                    });
                }
            });
        }

        // render icon
        renderIcon(item: JQuery, children: number): void {
            item.find("img").remove();

            var $icon, baseIcon = "<img src='/../icon/{{icon}}.png'/>";
            if(children) {
                $icon = $(baseIcon.replace("{{icon}}", "directory"));
            } else {
                $icon = $(baseIcon.replace("{{icon}}", "file")).css({ "cursor": "default" });
            }

            item.prepend($icon);
            item
                .attr("data-list-type", children ? "folder" : "file")
                .find("img")
                .addClass("state-close");
        }

        openIcon(): void {
            this.element
                .find("li[data-list-type=folder] > img")
                .each((index, item) => UIHelper.toggleIconFolder($(item)));
        }

        fileIcons(): void {
            var iconDict = this.settings.customIcons;
            this.element
                .find("li[data-list-type=file]")
                .each((index, item) => {
                    var fileName = $(item).text(),
                        fileParts = fileName.split('.'),
                        extension = fileParts[fileParts.length - 1],
                        iconName = iconDict[extension.toLocaleLowerCase()];

                    if(iconName && iconName.length) {
                        $(item).children().attr("src", iconName);
                    }
                });
        }
    }
}
