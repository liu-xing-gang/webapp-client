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

            /**
             * 6红和1蓝球随机数
             */

        }

        /**
         * 改变数量
         */
        function changeAmount(n, f) {
            f == true ? n++ : n--
            n = n <= 1 ? 1 : n
            console.log(n)
            return n;
        }

        return {
            init: function () {
                // 初始化
                resize()
            },
            upload: function (c, d, e) {
                upload(c, d, e)
            },
            imgPreview: function(){
                initImgPreview()
            },
            changeNum: function(o, key, f){
                o[key] = changeAmount(o[key], f)
            },
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


CcpClient.Drawing = function () {
    this.init.apply(this, arguments)
}

CcpClient.Drawing.prototype = {
    // 初始化
    init: function (id, data) {
        this.id = id
        this.data = data
        this.points = []
        this.winPoints = []
        this.drawPoints = []
        this.losePoints = []
        this.baseX = 0
        this.baseY = 0


        this.autosize()
        if(this.id != null)
            this.c = document.getElementById(this.id)

        this.c.width=560*this.autosize()
        this.c.height=120*this.autosize()

        for (var i = 0; i < this.c.width; i += this.c.width/10) {
            for (var j = 0; j < this.c.height; j += this.c.height/3) {
                var obj = {}
                obj.x = i + 6*this.autosize()
                obj.y = j + 6*this.autosize()
                this.points.push(obj)
            }
        }
        
        // x轴长度基准单位，y轴基准长度单位
        this.baseX = this.c.width/10
        this.baseY = this.c.height/3
        this.ctx = this.c.getContext('2d')
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#e5e2d3';
        this.ctx.beginPath()
        this.drawImg('../../images/icon-circle-default.png', this.points, this.ctx)
        this.drawImg('../../images/icon-circle-win.png', this.winPoints, this.ctx)
        this.drawImg('../../images/icon-circle-draw.png', this.drawPoints, this.ctx)
        this.drawImg('../../images/icon-circle-lose.png', this.losePoints, this.ctx)
        var linePoints = this.appendPoints(this.data, 'time')
        this.lineTo(linePoints, this.ctx)
    },
    // 自适应宽高
    autosize: function () {
        var deviceWidth = document.documentElement.clientWidth
        if (deviceWidth >= 750) deviceWidth = 750
        return deviceWidth / 7.5 / 100 
    },
    // 生成有序的坐标
    appendPoints: function(arr, str){
        if(arr.length > 10) return

        // 转换成时间戳进行比较
        arr.forEach(function(item){
            item.time = new Date(item.time).getTime()
        })

        var _points = []
        // 通过排序得到x轴坐标位置
        this.sort(arr, 'time')
        for (var i = 0; i <arr.length; i ++) {
            var obj = {}
            obj.x = (6*this.autosize())+this.baseX*i
            // 根据“胜，平，负”得到y的坐标
            if(arr[i].endType === 1){
                obj.y = 6*this.autosize()
                this.winPoints.push(obj)
            } else if(arr[i].endType === 0){
                obj.y = (6*this.autosize())+this.baseY
                this.drawPoints.push(obj)
            } else {
                obj.y = (6*this.autosize())+this.baseY*2
                this.losePoints.push(obj)
            }
            _points.push(obj)
        }
        return _points
    },
    // 绘制圆点
    drawImg: function (src, points, ctx){
        var img = new Image()
        img.src = src
        try{
            img.addEventListener('load' , function(){
                for (var i = 0; i < points.length; i++) {
                    var point = points[i]
                    ctx.moveTo(point.x, point.y)
                    ctx.drawImage(img, point.x, point.y);
                }
            }, false)
        }
        catch(e){
        }
    },
    // 需要根据x坐标进行一次排序，然后串联起来
    sort: function (arr, key){
        for (var i = 1; i < arr.length; i++) {
            var temp = arr[i];
            var j = i - 1;
            while (j >= 0 && arr[j][key] > temp[key]) {
                arr[j + 1] = arr[j];
                arr[j] = temp;
                j--
            }
            arr[j + 1] = temp
        }
        return arr
    },
    // 以x轴大小递增画连线
    lineTo: function (sortLinePoints, ctx){
        // var linePoints =  winPoints.concat(drawPoints).concat(losePoints)
        // var sortLinePoints = sort(linePoints, 'x')
        // console.log(sortLinePoints)
        for(var i = 0; i < sortLinePoints.length; i ++){
            var linePoint = sortLinePoints[i]
            if(i === 0)
                ctx.moveTo(linePoint.x, linePoint.y)
            ctx.lineTo(linePoint.x+3, linePoint.y+3)
        }
        ctx.stroke();
    }
}

/**
* 倒计时
*/
CcpClient.CountDown = function () {
   this.init.apply(this, arguments)
}
CcpClient.CountDown.prototype = {
   init: function (seconds) {
       this.timer = null
       this.seconds = seconds

       this.display(this.formatSeconds(this.seconds))
       this.start()

   },
   start: function () {
       var that = this
       this.timer = setInterval(function () {
           if (that.seconds <= 0) {
               clearInterval(that.timer)
               this.display(that.formatSeconds(0))
               return
           }
           that.seconds--

               that.display(that.formatSeconds(that.seconds))
       }, 1000)
   },
   formatSeconds: function (value) {
       var secondTime = parseInt(value); // 秒
       var minuteTime = 0; // 分
       var hourTime = 0; // 小时
       if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
           //获取分钟，除以60取整数，得到整数分钟
           minuteTime = parseInt(secondTime / 60);
           //获取秒数，秒数取佘，得到整数秒数
           secondTime = parseInt(secondTime % 60);
           //如果分钟大于60，将分钟转换成小时
           if (minuteTime > 60) {
               //获取小时，获取分钟除以60，得到整数小时
               hourTime = parseInt(minuteTime / 60);
               //获取小时后取佘的分，获取分钟除以60取佘的分
               minuteTime = parseInt(minuteTime % 60);
           }

           // 最大是60
           if (minuteTime === 60) {
               hourTime = 1
               minuteTime = 0
           }
       }
       var result = "" + parseInt(secondTime) + "秒";

       if (minuteTime > 0) {
           result = "" + parseInt(minuteTime) + "分" + result;
       }
       if (hourTime > 0) {
           result = "" + parseInt(hourTime) + "小时" + result;
       }
       var obj = {}
       obj.h = parseInt(hourTime)
       obj.m = parseInt(minuteTime)
       obj.s = parseInt(secondTime)
       return obj;
   },
   display: function (obj) {
       var arrSpan = document.querySelectorAll('.countdown')
       arrSpan[0].innerText = obj.h < 10 ? '0' + obj.h : '' + obj.h
       arrSpan[1].innerText = obj.m < 10 ? '0' + obj.m : '' + obj.m
       arrSpan[2].innerText = obj.s < 10 ? '0' + obj.s : '' + obj.s
   }
}

   



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