/**
 * Created by a2014 on 14-8-25.
 */
joe.define('index', ['base', 'popup'], function (require, output) {
    var base = require('base');
    var popup = require('popup');


    popup.show();

    output.getName = function () {
        return 'asd';
    }


})
