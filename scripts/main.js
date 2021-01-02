// Mainly based on:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739 (GPL3)
// and https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
const margine = 500;
const cellWidth = 15;
const cellHeight = 15;

var hash_to_str_map = [];
var gridWidth = screen.width - margine;
var gridHeigh = 0;

var g_gridData = null;

function initGridData() {
    gridWidth = screen.width - margine;
    g_gridData = new Array();
    let xpos = 1; 
    let ypos = 1;

    const numOfCells = hash_to_str_map.length;
    gridHeigh = numOfCells * cellWidth * cellHeight / gridWidth;
    const numOfRows = Math.floor(gridHeigh / cellHeight);
    const numOfColls = Math.floor(gridWidth / cellWidth);
   
    for (let i = 0, row = 0; row < numOfRows; row++) {
        g_gridData.push( new Array() );
        for (let column = 0; column < numOfColls; column++, ++i) {
            let _style = 'fill: #' + (hash_to_str_map[i].h).toString(16);
            g_gridData[row].push({
                style: _style,
                x: xpos,
                y: ypos,
                width: cellWidth,
                height: cellHeight,
                title: "   " + hash_to_str_map[i].s
            })
            xpos += cellWidth;
        }
        xpos = 1;
        ypos += cellHeight; 
    }
}

function removeLoader() {
    let message = document.getElementById("message_to_user");
    message.innerHTML = '';
}

function drawLoader() {
    let message = document.getElementById("message_to_user");
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
        .attr('width', (gridWidth + 3 /*making sure the rightmost border is visible */) + 'px')
        .attr('height', (gridHeigh + 3 /*making sure the rightmost border is visible */) + 'px');

    var row = grid.selectAll('.row')
        .data(g_gridData)
        .enter().append('g')
        .attr('class', 'row');

    row.selectAll('.square')
        .data(function(d) { return d; })
        .enter()
        .append('rect')
        .attr('class', 'square')
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('content', function(d) { return d.content; })
        .attr('style', function(d) { return d.style; })
        .attr('width', function(d) { return d.width; })
        .attr('height', function(d) { return d.height; })
        .attr('title', function(d) { return d.title; })
        .style('stroke', '#222')
        .on('mouseover', function(d){
            tooltip.text(d.title);
            return tooltip.style('visibility', 'visible');
        })
        .on('mousemove', function(){
            return tooltip
                .style('top', (d3.event.pageY-10)+'px')
                .style('left',(d3.event.pageX+10)+'px');
        })
        .on('mouseout', function(){
            return tooltip.style('visibility', 'hidden');
        });
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
            let new_item = {'h': str2color(line), 's': line};
            hash_to_str_map.push(new_item);
        }
        initGridData();
        setTitle(file.name);
        draw();
        removeLoader();
    };
    reader.readAsText(file);
}