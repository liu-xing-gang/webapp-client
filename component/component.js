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
        arr: Array,
    },
    data: function() {
        return {
            showlayer: this.showlayer,
            chosen: this.chosen,
            chosenlist: this.chosenlist,
            arr: this.arr
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

            item[flag] = !item[flag]
            item[flag] === true ? o.chosenNum ++ : o.chosenNum --  
            o.chosenNum = o.chosenNum <= 0 ? 0 : o.chosenNum
            // 是否选择
            o.chosenNum >0 ? o.isChosen = true : o.isChosen = false
            // 切换显示底部提示
            if(o.chosenNum === 0){
                this.chosen.splice(0, this.chosen.length)
                localStorage.clear()
                return
            }

            // this.chosen.push(o)
            this.chosen.unshift(o)
            unique('competitionNumber', this.chosen)
            
            // 更新缓存
            this.arr.forEach(function(item){
                item.competitionList.forEach(function(o1){
                    if(o1.competitionNumber === o.competitionNumber){
                        console.log('chosenNum', o1.chosenNum, o.chosenNum)
                        Vue.set(o1, 'chosenNum', o.chosenNum)
                        o1.rateGroup.forEach(function(item1){
                            item1.rateList.forEach(function(r1){
                                o.rateGroup.forEach(function(item2){
                                    item2.rateList.forEach(function(r2){
                                        if(r1.rate === r2.rate)
                                            Vue.set(r1, 'selected', r2.selected)
                                    })
                                })
                            })
                        })
                    }
                }) 
            })

            this.$emit('update', JSON.stringify(this.chosen), JSON.stringify(this.arr))

        }
    },
    mounted: function () {
        // // 是否存在localStorage
        if(JSON.parse(localStorage.getItem('arrCompetitions'))){
            this.arrCompetitions = JSON.parse(localStorage.getItem('arrCompetitions'))
        }

        // 是否存在localStorage
        if(JSON.parse(localStorage.getItem('chosenCompetitions'))){
            this.chosenCompetitions = JSON.parse(localStorage.getItem('chosenCompetitions'))
        }
    }
})