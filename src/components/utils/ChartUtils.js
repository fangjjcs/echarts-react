
export const getBrushedData = (areas, data) => {
    console.log("[BRUSHING]")
    let brushedRect = areas.coordRanges[0][0]; // [left,right]
    let selectedCategory = areas.coordRanges[0][1] // [0,0] or [0,1] ...

    let indexArr = [];
    const brushedData = data.filter( (o, i) => {
        if(o.value[1] >= brushedRect[0] && o.value[1] <= brushedRect[1] && 
            o.value[0]>=selectedCategory[0] && o.value[0]<=selectedCategory[1]){
            indexArr.push(i);
            return true
        }
    })

    return [indexArr, brushedData]
}

export const updateColor = (options, types, indexArr, reset) => {
    options.series[0].data.forEach((data, index) => {
        if(indexArr.includes(index) || reset){
            data.itemStyle.color = types.filter(t=>t.name===data.name)[0].color
        } else {
            data.itemStyle.color = '#ddd';
        }
    })
    return options
}

export const formatDate = (params) => {
    const date = new Date(params);
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay();
}