/**
 * Created by Marcela on 1. 3. 2015.
 */

///<reference path="treeview.ts" />
///<reference path="../typing/jquery.d.ts" />

module AwesomeTreeView {

    /*
    * This class implements expanding and collapsing events
    * */
    export class ListEvent {
        element: JQuery;
        settings: ITreeView;

        constructor(element: JQuery, treeView: TreeView) {
            this.settings = treeView.settings;
            this.element = element;
            this.applyEvents();
        }

        applyEvents(): void {
            this.element.on('click', 'li', (e) => this.toggleList(e));

            if(this.settings.hoverClass && this.settings.hoverClass.length) {
                this.element.find("li").hover((e) => this.hoverWrapper(e));
            }
        }

        // expand/collapse li elements
        toggleList(e: JQueryEventObject): void {
            e.stopPropagation();
            var liElement = $(e.target).closest("li"),
                icon = liElement.find("> img"),
                arrow = liElement.find("> i.fa");

            if(icon && icon.length && liElement.attr("data-list-type") === "folder") {
                UIHelper.toggleIconFolder(icon);
            } else if (arrow && arrow.length) {
                UIHelper.toggleArrow(liElement);
            }

            if(this.settings.animation) {
                liElement.find("> ul > li").slideToggle();
            } else {
                liElement.find("> ul > li").toggle();
            }
        }

        hoverWrapper(e: JQueryEventObject): void {
            this.element
                .find("." + this.settings.hoverClass)
                .removeClass(this.settings.hoverClass);

            $(e.target).prev("div.li-wrapper").addClass(this.settings.hoverClass);

        }
    }
}