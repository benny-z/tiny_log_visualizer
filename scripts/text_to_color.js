// source: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/22429679
function hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash  = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash >>> 0; // making sure it's a 32 bit number
}

function str2color(input_str){
  return hash(input_str) & 0xffffff;
}
