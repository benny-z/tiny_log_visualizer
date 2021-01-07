// Mainly based on:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739 (GPL3)
// and https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
const cellWidth = 15;
const cellHeight = 15;

var hash_to_str_map = [];
var gridWidth = d3.select('.container').node().getBoundingClientRect().width;
var gridHeigh = 0;

var g_gridData = null;

function initGridData() {
    g_gridData = new Array();
    let xpos = 1; 
    let ypos = 1;

    const numOfCells = hash_to_str_map.length;
    gridHeigh = Math.ceil(numOfCells * cellWidth * cellHeight / gridWidth);
    const numOfRows = Math.floor(gridHeigh / cellHeight) || 1;
    const numOfColls = Math.min(numOfCells, Math.floor(gridWidth / cellWidth));
   
    for (let i = 0, row = 0; row < numOfRows; row++) {
        g_gridData.push( new Array() );
        for (let column = 0; column < numOfColls; column++, ++i) {
            g_gridData[row].push({
                fill: '#' + hash_to_str_map[i].h,
                x: xpos,
                y: ypos,
                title: '   ' + hash_to_str_map[i].s
            })
            xpos += cellWidth;
        }
        xpos = 1;
        ypos += cellHeight; 
    }
}

function removeLoader() {
    let message = document.getElementById('message_to_user');
    message.innerHTML = '';
}

function drawLoader() {
    let message = document.getElementById('message_to_user');
    message.innerHTML = 'Loading...';
}

function setTitle(filename){
    d3.select('#file_name')
        .append('h1')
        .style('visibility', 'visible')
        .text('Visualizing ' + filename);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function draw() {
    var tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .attr('class', 'tooltip')

    var grid = d3.select('#grid')
        .append('svg')
        .attrs({'width' : gridWidth +'px',
                'height' : (gridHeigh + 10) + 'px'});

    var row = grid.selectAll('.row')
        .data(g_gridData)
        .enter().append('g')
        .attr('class', 'row');

    function internalDraw(d) {
        row.select('.square')
            .data(d)
            .enter()
            .append('rect')
            .attrs({
                'class': 'square cell',
                'x' : (d) => d.x,
                'y' : (d) => d.y,
                'title' : (d) => d.title
            })
            .style('fill', (d) => d.fill)
            .on('mouseover', (d) => tooltip.text(d.title).style('visibility', 'visible'))
            .on('mousemove', () => tooltip.styles({'top' : (d3.event.pageY-10)+'px','left' : (d3.event.pageX+10)+'px'}))
            .on('mouseout', () => tooltip.style('visibility', 'hidden'));
    }
    var render = renderQueue(internalDraw);
    render(g_gridData);
}

function start(file) {
    const reader = new FileReader();
    drawLoader();
    reader.onload = function(e) {
        let contents = e.target.result;
        for (const line of contents.split('\n')){
            if (line === ''){
                continue;
            }
            let new_item = {'h': str2color(line).toString(16), 's': line};
            hash_to_str_map.push(new_item);
        }
        initGridData();
        setTitle(file.name);
        d3.select('#grid').style('visibility', 'visible');
        draw();
        removeLoader();
    };
    reader.readAsText(file);
}
