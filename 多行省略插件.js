// 省略多余内容，并在最后加上。。。
function ellip(obj){
    var str="";
    var len=obj.length;
    if(len > 20){
        str = obj.substring(0,20)+'...';
    }else{
        str = obj;
    }
    return str;
}