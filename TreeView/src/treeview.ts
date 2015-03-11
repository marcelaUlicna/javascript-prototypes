/**
 * Created by Marcela on 1. 3. 2015.
 */

///<reference path="treeview.list.ts" />
///<reference path="../typing/jquery.d.ts" />

module AwesomeTreeView {

    /*
    * Interface for user options (defaults in jQuery plugin)
    * */
    export interface ITreeView {
        icon: boolean;
        expandAll: boolean;
        //checkboxes: boolean;
        uniqueOnOpen: boolean;
        animation: boolean;
        //branches: boolean;
        fileIcons: boolean;
        customIcons: IIconDictionary;
        hoverClass: string;
        expandClass: string;
        selectClass: string;
    }

    /*
    * This class is responsible for initializing plugin,
    * setting defaults and custom options
    * and rendering plugin component
    * */
    export class TreeView {
        element: JQuery;
        settings: ITreeView;

        constructor(element: JQuery, options: ITreeView){
            this.element = element;
            this.element.addClass("awesome-tree-view");

            // merge custom settings with plugin defaults
            this.settings = $.extend(true, this.defaultTree(), options);
        }

        // call List class to render tree view
        init(): void {
            var list = new List(this);
        }

        // implement interface and set defaults
        defaultTree(): ITreeView {
            return {
                icon: true,
                expandAll: false,
                uniqueOnOpen: false,
                animation: true,
                fileIcons: false,
                customIcons: IconType.defaultIcons(),
                hoverClass: "",
                expandClass: "",
                selectClass: ""
            }
        }
    }
}
