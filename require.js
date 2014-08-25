/**
 * Created by a2014 on 14-8-25.
 */
(function (window) {

    var each = function (o, fn) {
        var type = Object.prototype.toString.call(o);
        switch (type) {
            case '[object Object]':
                for (var i in o) {
                    fn.call(o[i], o[i], i);
                }
                break;
            case
            '[object Array]':
            case '[object NodeList]':
                for (var i = 0; i < o.length; i++) {
                    var obj = o[i];
                    fn && fn.call(o[i], o[i], i);
                }
                break;
            default :
                return;
                break;

        }
    }

    var require = function (name) {
        var module = joe.getModule(name);
        return module && module.output;
    }
    var addScript = function (name, fn) {
        /*
         1.  IE 6/7/8触发onreadystatechange
         2.  IE 9 先触发onreadystatechange 后触发onload
         3.  FF/Safari/Chrome/Opera 触发onload*/
        var s = document.createElement('script');
        document.head.appendChild(s);
        s.src = name + '.js';
        s.onreadystatechange = function () {
            console.log('statechange');
        }
        s.onload = function () {
            console.log('onload');
            fn && fn(name);
        }
    }

    function exist(name) {
        each(Array.prototype.slice(document.querySelectorAll('script')), function (script, index) {
            if (script.src.indexOf(name) != 1) {
                return true;
            }
        })
        return false;
    }

    var define = function (name, depend, fn) {
        var module = {output:{}};
        var moduleName, depends, main;
        var paramLen = arguments.length;
        if (paramLen < 1)return;

        if (paramLen == 2) {
            moduleName = name;
            main = depend;
        } else if (paramLen == 3) {
            moduleName = name;
            depends = depend;
            main = fn;
        }
        //set module name
        module.name = moduleName;
        module.main = main;
        joe.modules.push(module);
        //用于比对载入的script和 depends on的script
        var tem = [];
        if (depends) {
            each(depend, function (item, index) {
                if (!exist(item)) {
                    addScript(item, function (added) {
                        tem.push(item);
                        console.log(item + '.js is loaded');
                        if (tem.length == depend.length) {
                            main && main.call(null, joe.require, module.output);
                        }
                    })
                } else {
                    tem.push(item);
                }
            })
        }else{
            main && main.call(null, joe.require, module.output);
        }
    }
    var joe = {
        modules: [],
        require: require,
        define: define,
        getModule: function (name) {
            var result;
            each(joe.modules, function (item, index) {
                if (item.name == name) {
                    result = item;
                    return;
                }
            })
            return result;
        }
    }
    window['joe'] = joe;
}(window))