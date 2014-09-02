/**
 * Created by a2014 on 14-9-2.
 */
(function () {

    function each(o, cb) {
        var type = Object.prototype.toString.call(o);
        if (type == '[object Object]') {
            for (var obj in o) {
                cb(o[obj], obj);
            }

        } else if (type == '[object Array]' || type == '[object NodeList]') {
            for (var i = 0; i < o.length; i++) {
                var obj = o[i];
                cb(o[i], i);
            }
        }
    }

    var joe = {
        define: function (name, depends, out) {
            var argL = arguments.length;
            if (!this.exist(name) && argL > 1) {
                var mName, dependsArr, outFunc;
                if (argL == 3) {
                    mName = name;
                    dependsArr = depends;
                    outFunc = out;
                } else if (argL == 2) {
                    mName = name;
                    outFunc = depends;
                }
                var me = this;
                var outO = {}

                if (dependsArr) {
                    var tem = [];
                    each(dependsArr, function (depend) {
                        me.addScript(depend, function (name) {
                            tem.push(name);

                            if (tem.length == dependsArr.length) {
                                //depends is all loaded
                                outFunc(me.require, outO);
                                me.cache.push({
                                    name: mName,
                                    depend: dependsArr,
                                    out: outO
                                })
                            }
                        })
                    })
                } else {
                    outFunc(me.requir, outO);
                    me.cache.push({
                        name: mName,
                        depend: dependsArr,
                        out: outO
                    })
                }
            }
        },
        require: function (name) {
            var result = {};
            each(joe.cache, function (item) {
                if (item.name == name) {
                    result = item.out;
                    return;
                }
            })
            return result;
        },
        addScript: function (name, fn) {
            /*
             1.  IE 6/7/8触发onreadystatechange
             2.  IE 9 先触发onreadystatechange 后触发onload
             3.  FF/Safari/Chrome/Opera 触发onload*/
            var s = document.createElement('script');
            document.head.appendChild(s);
            s.src = name + '.js';
            s.onreadystatechange = s.onload = function () {
                fn && fn(name);
            }
        },
//        exist: function (name) {
//            var result = false;
//            each(document.head.querySelectorAll('script'), function (item, index) {
//                if(item.getAttribute('data-type')=='enter'){
//                    return;
//                }
//                var n = item.src.split('/');
//                if (n[n.length - 1].split('.')[0] == name) {
//                    result = true;
//                    return;
//                }
//            })
//
//            return result;
//        },
        exist: function (name) {
            var result = false;
            each(this.cache, function (item, index) {
                if (item.name == name) {
                    result = true;
                    return;
                }
            })
            return result;
        },
        cache: []
    }


    window['joe'] = joe;
}())