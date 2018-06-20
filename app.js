/**
 * 判断ISO,Andrio, 网页
 */
function isiOSApp() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["ios_app"];
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}

if (isiOSApp()) {
    window.webkit.messageHandlers.nav.postMessage('hide');
}

/**
 * writed by liuxinggang | 2018/05/28 ~
 * 定义命名空间
 */
var CcpClient = window.CcpClient = {}


/**
 * 惰性加载单体
 */
CcpClient.Common = (function () {
    var uniqueInstance

    function constructor() {
        /**
         * 私有属性
         */
        var urlPrefix = ''

        /**
         * 私有方法
         */
        function resize() {
            var deviceWidth = document.documentElement.clientWidth
            if (deviceWidth >= 750) deviceWidth = 750
            document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
        }

        /**
         * 文件上传
         * c -- input
         * d -- 预览图
         * e -- 文件名显示元素
         * 
         */
        function upload(c, d, e) {
            "use strict"
            // try {
            //     if (mui.os.android) {
            //         document.querySelector("input[type='file']").attr("capture","camera")
            //     } else {
            //         document.querySelector("input[type='file']").removeAttr("capture")
            //     }
            // } catch (e) {
            //     console.log(e.message)
            // }
            var $c = document.querySelector('#'+c),
                $d = document.querySelector('#'+d),
                // $e = document.querySelector(e),
                file = $c.files[0],
                reader = new FileReader()

            reader.readAsDataURL(file)
            reader.onload = function (e) {
                $d.setAttribute("src", e.target.result)
                // var str = $($e).val()
                // str += ' ' + file.name
                // $($e).val(str)
            }
        }

        /**
         * 图片预览
         * img.mui-action-preview
         */
        function initImgPreview(src) {
            var imgs = imgs || document.querySelectorAll("img.mui-action-preview");
            imgs = mui.slice.call(imgs);
            if (imgs && imgs.length > 0) {
                var slider = document.createElement("div");
                slider.setAttribute("id", "__mui-imageview__");
                slider.classList.add("mui-slider");
                slider.classList.add("mui-fullscreen");
                slider.style.display = "none";
                slider.addEventListener("tap", function () {
                    slider.style.display = "none";
                });
                slider.addEventListener("touchmove", function (event) {
                    event.preventDefault();
                })
                var slider_group = document.createElement("div");
                slider_group.setAttribute("id", "__mui-imageview__group");
                slider_group.classList.add("mui-slider-group");
                imgs.forEach(function (value, index, array) {
                    //给图片添加点击事件，触发预览显示；

                    value.addEventListener('tap', function (e) {
                        // 更新url路径
                        document.querySelector("#__mui-imageview__group .mui-slider-item img").src = e.target.src
                        console.log(document.querySelector("#__mui-imageview__group .mui-slider-item img").src)

                        slider.style.display = "block";
                        slider.style.background = 'rgba(0,0,0,.8)'
                        slider.style.zIndex = '20'
                        _slider.refresh();
                        _slider.gotoItem(index, 0);
                    })
                    var item = document.createElement("div");
                    item.classList.add("mui-slider-item");
                    var a = document.createElement("a");
                    var img = document.createElement("img");
                        
                    img.setAttribute("src", value.src);
                    a.appendChild(img)
                    item.appendChild(a);
                    slider_group.appendChild(item);
                });
                slider.appendChild(slider_group);
                document.body.appendChild(slider);
                var _slider = mui(slider).slider();

            }
        }

        return {
            upload: function (c, d, e) {
                upload(c, d, e)
            },
            imgPreview: function(){
                initImgPreview()
            },
            init: function () {
                // 初始化
                resize()
            }
        }
    }

    return {
        getInstance: function () {
            if (!uniqueInstance)
                uniqueInstance = constructor()
            return uniqueInstance
        }
    }

})()


// 调用
// CcpClient.Common.getInstance().pubMethod1()
CcpClient.Common.getInstance().init()
window.onorientationchange = window.onresize = function () {
    CcpClient.Common.getInstance().init()
}

// 启用a标签的href跳转
window.onload = function () {
    mui('#nav-bar').on('tap', 'a', function () {
        var href = this.getAttribute('href');
        //非plus环境，直接走href跳转
        if (!mui.os.plus) {
            location.href = href;
            return;
        }
    })

    mui('.mui-table-view').on('tap', 'a', function () {
        var href = this.getAttribute('href');
        //非plus环境，直接走href跳转
        if (!mui.os.plus) {
            location.href = href;
            return;
        }
    })
}