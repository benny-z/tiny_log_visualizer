// Mainly based on:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739 (GPL3)
// and https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
const cellWidth = 15
const cellHeight = 15

const gGridWidth = d3.select('.container').node().getBoundingClientRect().width;
var gGridHeigh = 0;
var gGridData = null;

function updateStatus(status_message) {
    d3.select('#status_message_id').text(status_message);
}

function setTitle(filename){
    d3.select('#file_name')
        .append('h1')
        .style('visibility', 'visible')
        .text('Visualizing ' + filename);
}

function draw() {
    let tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .attr('class', 'tooltip')

    let grid = d3.select('#grid')
        .append('svg')
        .attrs({'width' : gGridWidth +'px',
                'height' : (gGridHeigh + 10) + 'px'});

    let row = grid.selectAll('.row')
        .data(gGridData)
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
    render(gGridData);
}

function processInputFile(content) {
    gGridData = new Array();
    gGridData.push( new Array() );
    let numOfColls = Math.floor(gGridWidth / cellWidth);
    let numOfCells = 0;
    let xpos = 1; 
    let ypos = 1;
    let colNum = 0;
    let rowNum = 0;
    content = content.split('\n');
    for (; numOfCells < content.length; ++numOfCells) {
        line = content[numOfCells].trim();
        if ('' === line){
            continue;
        }
        colNum = numOfCells % numOfColls;
        rowNum = Math.floor(numOfCells / numOfColls);
        if (0 === colNum && numOfCells !== 0) {
            gGridData.push( new Array() );
            xpos = 1;
            ypos += cellHeight;
        }
        gGridData[rowNum].push({
            fill: '#' + str2color(line).toString(16),
            x: xpos,
            y: ypos,
            title: '   ' + line
        })
        xpos += cellWidth;
    }
    gGridHeigh = Math.ceil((rowNum + 1) * cellHeight);
}

function start(file) {
    const reader = new FileReader();
    
    var t0 = performance.now()
    updateStatus('Loading...');
    reader.onload = function(e) {
        let content = e.target.result;
        processInputFile(content);
        t1 = performance.now();
        console.log('File read in ' + (t1 - t0) + ' milliseconds.');
        setTitle(file.name);
        d3.select('#grid').style('visibility', 'visible');
        draw();
        t2 = performance.now();
        console.log('Grid drawn in ' + (t2 - t1) + ' milliseconds.');
        updateStatus('');
    };
    reader.readAsText(file);
}
