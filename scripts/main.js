// Mainly based on:
// https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739 (GPL3)
// and https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
const cellWidth = 15
const cellHeight = 15

const gGridWidth = d3.select('.container').node().getBoundingClientRect().width;
var gGridHeigh = 0;
var gGridData = null;
var gIdxToLineMap = [];

var gNumOfColls = Math.floor(gGridWidth / cellWidth);
var gNumOfRows = 0;

var gStartTime = performance.now();
var gFileReadingDoneTime = -1;
var gGridGenerationDoneTime = -1;

var xyToLineNum = (x, y) => x + (gNumOfColls * y);

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
    setTimeout(()=> {
    let tooltip = d3.select('body')
        .append('span')
        .attr('class', 'tooltip')
        .style('visibility', 'visible');

    let grid = d3.select('#grid')
        .append('svg')
        .attrs({'width' : gGridWidth +'px',
                'height' : (gGridHeigh + 10) + 'px'});

    let row = grid.selectAll('.row')
        .enter()
        .append('g')
        .attr('class', 'row');

    function internalDraw(d) {
        row.select('.square')
            .data(d)
            .enter()
            .append('rect')
            .attrs({
                'class': 'square',
                'x' : (d) => (d.x) * cellHeight,
                'y' : (d) => (d.y) * cellWidth,
                'style' : (d) => 'fill:' + d.fill
            })
            .on('mouseover', (d) => tooltip.text('   ' + gIdxToLineMap[xyToLineNum(d.x, d.y)])
                       .style('opacity', 0.8))
            .on('mousemove', () => tooltip.styles({'top' : (d3.event.pageY-10)+'px','left' : (d3.event.pageX+10)+'px'}))
            .on('mouseout', () => tooltip.style('opacity', 0));
    }
    let render = renderQueue(internalDraw);
    render(gGridData);
    delete gGridData;
    gGridGenerationDoneTime = performance.now();
    console.log('Grid generated in ' + (gGridGenerationDoneTime - gFileReadingDoneTime) + ' milliseconds.');
    }, 0);
}

function processInputFile(content) {
    gGridData = new Array();
    gGridData.push( new Array() );
    // We need both numOfCells & lineNum because we do not add empty lines to the canvas
    let numOfCells = 0;
    let lineNum = 0;
    let xpos = 0; 
    let ypos = 0;
    let colNum = 0;
    let rowNum = 0;
    content = content.split('\n');
    while (lineNum < content.length) {
        line = content[lineNum].trim();
        if ('' === line){
            ++lineNum;
            continue;
        }
        colNum = numOfCells % gNumOfColls;
        rowNum = Math.floor(numOfCells / gNumOfColls);
        if (0 === colNum && numOfCells !== 0) {
            gGridData.push( new Array() );
            xpos = 0;
            ypos += 1;
        }
        gGridData[rowNum].push({
            'fill': '#' + str2color(line).toString(16),
            'x': xpos,
            'y': ypos,
        });
        gIdxToLineMap.push((lineNum+1) + ': ' + line);
        xpos += 1;
        ++numOfCells;
        ++lineNum;
    }
    gNumOfRows = rowNum + 1;
    gGridHeigh = Math.ceil(gNumOfRows * cellHeight);
}


function start(file) {
    const reader = new FileReader();
    updateStatus('Loading...');
    reader.onload = function(e) {
        let content = e.target.result;
        processInputFile(content);
        // updateStatus('File read...');
        gFileReadingDoneTime = performance.now();
        console.log('File read in ' + (gFileReadingDoneTime - gStartTime) + ' milliseconds.');
        setTitle(file.name);
        delete content;
        d3.select('#grid').style('visibility', 'visible');
        draw();
        updateStatus('');
    };
    reader.readAsText(file);
}