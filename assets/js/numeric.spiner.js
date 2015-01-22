/**
 * Created by Marcela on 19. 1. 2015.
 */
(function($){

    "use strict";

    var Spiner = function (el, options) {
        this.$options = options;
        this.$element = el;
        this.value = el.attr('value') || 0;
        this.startDown = false;

        this.$element.addClass('form-control spiner');
    };

    var interval;

    Spiner.prototype.constructor = Spiner;

    Spiner.prototype.init = function () {
        var that = this;

        this.$numeric = $(template());
        this.$element.after(this.$numeric);
        this.$element.find('input').val(this.value);

        this.$numeric.on('mousedown', 'button', function(){
            var element = $(this);
            that.startDown = true;
            that.changeValue(element);

            interval = setInterval(function() {
                that.changeValue(element);
            }, 400);
        });

        this.$numeric.on('mouseup', 'button', function(){
            that.startDown = false;
            clearInterval(interval);
        });

        this.$element.on('mousewheel', function(e){
            e.preventDefault();
            if(that.$options.scrollable && $(this).is(':focus')) {
                that.scroll(e);
            }
        });

        this.$element.on('change', function(){
            that.updateValue();
        });
    };

    Spiner.prototype.changeValue =  function(element){
        if(!this.startDown) return;

        var actualValue = Number(this.value),
            step = this.$options.step,
            precision = this.$options.precision,
            direction = element.attr('data-direction');

        if(direction === "up") {
            actualValue += step;
        } else {
            actualValue -= step;
        }
        this.value = actualValue.toFixed(precision);
        this.setValue();
    };

    Spiner.prototype.scroll = function(e) {
        var actualValue = Number(this.value),
            step = this.$options.step,
            precision = this.$options.precision;

        if(e.deltaY === 1) {
            actualValue += step;
        } else {
            actualValue -= step;
        }
        this.value = actualValue.toFixed(precision);
        this.setValue();
    };

    Spiner.prototype.setValue = function() {
        this.$element.val(this.value);
    };

    Spiner.prototype.updateValue = function(){
        var inputValue = this.$element.val();
        this.value = inputValue;
    };

    $.fn.spiner = function () {
        var option = arguments[0],
            args = arguments,
            data = this.data('jquery.spiner');

        var options = $.extend({}, $.fn.spiner.defaults, $(this).data(), typeof option === 'object' && option);

        if (!data) $(this).data('jquery.spiner', (data = new Spiner(this, options)));

        if (typeof option === 'string') {
            return data[option](args[1]);
        } else {
            return data.init();
        }
    };

    $.fn.spiner.defaults = {
        scrollable: false,
        step: 1,
        precision: 0
    };

    $.fn.spiner.Constructor = Spiner;

    var template = function () {
        return [
                '<div class="input-group-btn-vertical">',
                    '<button class="btn btn-default" data-direction="up"><i class="fa fa-caret-up"></i></button>',
                    '<button class="btn btn-default" data-direction="down"><i class="fa fa-caret-down"></i></button>',
                '</div>',
        ].join('\n');
    };
})(jQuery);
