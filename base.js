/**
 * Created by a2014 on 14-8-25.
 */
joe.define('base',['popup'], function (require, output) {
    var popup=require('popup');


    output.getAge = function () {
        alert('age');
    }
})

