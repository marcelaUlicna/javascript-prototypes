/**
 * Created by Marcela on 6. 3. 2015.
 */

///<reference path="treeview.list.ts" />
///<reference path="../typing/jquery.d.ts" />

module AwesomeTreeView {

    /*export class Arrow extends ListRender {
        element: JQuery;

        constructor(element: JQuery) {
            super(element);
            this.element = element;
        }

        renderDesign(item: Element): void {
            $(item).find("li").each((index, item) => {
                var $item = $(item),
                    childrenLi = $item.find("> ul > li");

                if(childrenLi.length) {
                    $item.find(".fa").remove();
                    $item.prepend($("<i class='fa fa-angle-right'></i>"));

                    childrenLi.each((id, it) => {
                        this.renderDesign(it);
                    });
                }
            });
        }
    }*/
}