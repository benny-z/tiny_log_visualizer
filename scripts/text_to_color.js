function calcHash32(input_str){
    var hash = 0, i, chr;
    for (i = 0; i < input_str.length; i++) {
        chr   = input_str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash >> 16);
}

function str2color(input_str){
    return calcHash32(input_str);
}