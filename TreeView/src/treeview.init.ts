/**
 * Created by Marcela on 6. 3. 2015.
 */
///<reference path="../typing/jquery.d.ts" />
///<reference path="treeview.ts" />

(function($){
    $.fn.treeview = function(){
        var option = arguments[0],
            args = arguments;

        return this.each(function(){
            var $this = $(this),
                data = $this.data("jquery.treeview"),
                options = $.extend({}, $.fn.treeview.defaults, $this.data(), typeof option === 'object' && option);

            if(!data) {
                $this.data("jquery.treeview", (data = new AwesomeTreeView.TreeView($this, options)));
            }

            if (typeof option === 'string') {
                data[option](args[1]);
            } else {
                data.init();
            }
        });
    };

    $.fn.treeview.defaults = {

    };
})(jQuery);