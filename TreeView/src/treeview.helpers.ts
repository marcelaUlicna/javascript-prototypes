/**
 * Created by Marcela on 6. 3. 2015.
 */

///<reference path="../typing/jquery.d.ts" />

module AwesomeTreeView {
    export class UIHelper {

        // collpase all
        static collapseAll(element: JQuery): void {
            element.find("li[data-level!=1]").css({ "display": "none" });
            UIHelper.collapseAllIcon(element);
        }

        // expand all
        static expandAll(element: JQuery): void {
            element.find("li[data-level!=1]").css({ "display": "list-item" });
        }

        // set collapse icon/arrow
        static collapseAllIcon(element: JQuery): void {
            var listElements = element.find("li[data-level=1][data-list-type=folder]"),
                imageElements = listElements.find("> img"),
                arrowElements = listElements.find("> i.fa");

            if(imageElements && imageElements.length) {
                imageElements.each((index, item) => {
                    $(item)
                        .removeClass("state-open")
                        .addClass("state-close")
                        .attr("src", "/../icon/directory.png");
                });
            } else if (arrowElements && arrowElements.length) {
                arrowElements.each((index, item) => {
                    $(item)
                        .removeClass("fa-angle-down")
                        .addClass("fa-angle-right");
                });
            }
        }

        static openTreeBranch(element: JQuery): void {
            element.parents("li").each((index, item) => {
                var it = $(item);
                if(it.children("img")) {
                    it.children("img")
                        .removeClass("state-close")
                        .addClass("state-open")
                        .attr("src", "/../icon/folder_open.png");
                    it.css({ "display": "list-item" });
                } else if(it.children("i.fa")) {
                    it.children("i.fa")
                        .removeClass("fa-angle-right")
                        .addClass("fa-angle-down");
                    it.css({ "display": "list-item" });
                }
            });
        }

        // set appropriate icon
        static toggleIconFolder(img: JQuery): void {
            img.toggleClass("state-open");
            img.toggleClass("state-close");

            if(img.hasClass("state-open")) {
                img.attr("src", "/../icon/folder_open.png");
            } else {
                img.attr("src", "/../icon/directory.png");
            }
        }

        // set appropriate arrow
        static toggleArrow(element: JQuery): void {
            var arrow = element.find("> i.fa");
            arrow.toggleClass("fa-angle-right");
            arrow.toggleClass("fa-angle-down");
        }
    }

    export interface IIconDictionary {
        [key: string]: string;
    }

    // TODO: change path to "icon/" to production
    export class IconType {
        static defaultIcons(): IIconDictionary {
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
        }
    }
}