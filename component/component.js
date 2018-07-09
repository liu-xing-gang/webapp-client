/**
 * ========================================
 * 组件名称: screen-layer
 * ========================================
 * 功能说明: 订单查询组件
 * ========================================
 * 作者    : Liu Xinggang
 * ======================================== 
 */
Vue.component('screen-layer', {
    props: {
        // a: Boolean
        data: Array,
        show: Boolean,
    },
    // template: '<div>{{a}} {{b}}</div>',
    template: '#test',
    data: function () {
        return {
            // b: 'b'
            // show: this.show
        }
    },
    
})

/**
 * ========================================
 * 组件名称: layer-substance
 * ========================================
 * 功能说明: 竞彩足球弹层
 * ========================================
 * 作者    : Liu Xinggang
 * ======================================== 
 */
Vue.component('layer-substance', {
    props: {
        showlayer: false,
        match: Object,
        chosen: Array,
        chosenlist: Array,
    },
    data: function() {
        return {
            showlayer: this.showlayer,
            chosen: this.chosen,
            chosenlist: this.chosenlist,
        }
    },
    template: '#test',
    methods: {
        closeLayer: function() {
            this.showlayer = false
            this.$emit('closelayer', this.showlayer)
        },
        pitched: function (item, flag, o) {

            // 根据场次id获得已选几场
            function unique(key, arr){
                var i,j
                for(i=0; i<arr.length; i++){
                    for(j = arr.length - 1; j >= i+1; j --)
                    {
                        if(arr[i][key] === arr[j][key])
                            arr.splice(i, 1)
                    }
                }
            }

            this.chosen.push(o)
            unique('competitionNumber', this.chosen)
            console.log(this.chosenlist)

            //使已选择弹出层，保持始终居中对其，而整理数据格式
            this.chosenlist.push(item)
            
            item[flag] = !item[flag]
            item[flag] === true ? o.chosenNum ++ : o.chosenNum --  
            o.chosenNum = o.chosenNum <= 0 ? 0 : o.chosenNum
            // 是否选择
            o.chosenNum >0 ? o.isChosen = true : o.isChosen = false
            // 切换显示底部提示
            if(o.chosenNum === 0){
                this.chosen.splice(0, this.chosen.length)
                this.chosenlist.splice(0, this.chosenlist.length)
            }
        }
    }
})