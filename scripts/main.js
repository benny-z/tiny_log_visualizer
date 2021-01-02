// Mainly based on:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739 (GPL3)
// and https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
const margine = 200;
const cellWidth = 20;
const cellHeight = 20;

var hash_to_str_map = [];
var gridWidth = screen.width - margine;
var gridHeigh = 0;

var g_gridData = null;

function initGridData() {
    gridWidth = screen.width - margine;
    g_gridData = new Array();
    var xpos = 1; 
    var ypos = 1;

    const numOfCells = hash_to_str_map.length;
    gridHeigh = numOfCells * cellWidth * cellHeight / gridWidth;
    const numOfRows = Math.floor(gridHeigh / cellHeight);
    const numOfColls = Math.floor(gridWidth / cellWidth);
   
    for (var i = 0, row = 0; row < numOfRows; row++) {
        g_gridData.push( new Array() );
        for (var column = 0; column < numOfColls; column++, ++i) {
            var _style = 'fill: #' + (hash_to_str_map[i].h).toString(16);
            g_gridData[row].push({
                style: _style,
                x: xpos,
                y: ypos,
                width: cellWidth,
                height: cellHeight,
                title: hash_to_str_map[i].s
            })
            xpos += cellWidth;
        }
        xpos = 1;
        ypos += cellHeight; 
    }
}

function removeLoader(spinner) {
    spinner.stop();
    var target = document.getElementById('loader_id');
    target.style.visibility = 'hidden';
}

function drawLoader() {
    var target = document.getElementById('loader_id');
    target.style.visibility = 'visible';
    return new Spinner(opts).spin(target);
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

var opts = {
  lines: 9, // The number of lines to draw
  length: 9, // The length of each line
  width: 5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: '#EE3124', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 40, // Afterglow percentage
  className: 'spinner', // The CSS class to assign to the spinner
};

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
    reader.onload = function(e) {
        var spinner = drawLoader();
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
        removeLoader(spinner);
    };
    reader.readAsText(file);
}