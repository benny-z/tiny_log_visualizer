![Product Name Screen Shot][product-screenshot]

Visualization tool for tiny (few MBs) log files. Would work on bigger files, but it will take some time to load.

### Examples
Following are some examples of visualizations,

* Library calls collected using `ltrace` from running the `tree` command
  ![ltrace of tree command][tree-ltrace-example]
* Trace of the assembly instructions invoked running the following toy example:
  ```c
  int main() {
    int x = 1000;
    for (int i = 0; i < x; ++i) {
      printf("%d", i);
    }
    return 0;
  }
  ```

  ![assembly trace of a simple loop][loop-example]

### Built With

* [D3.js](https://d3js.org/)

## Getting Started
Clone the project:
`git clone https://github.com/benny-z/tiny_logs_visualizer.git`
and run `index.html`

### Prerequisites
A fully functional modern web browser (tested on Chrome and Firefox)

### Installation
No installation required, just clone the project and run `index.html`

## Usage
Run `index.html`, drag and drop your log file into the drop zone. To get the value of the log entry, hover over the square corresponding to that line.

## License

Distributed under the GPL3 License. See `LICENSE` for more information.


## Contact

[@benny_zeltser](https://twitter.com/benny_zeltser)

## Acknowledgements
Most of the code is based on the following code snippets/tutorials:
* https://bl.ocks.org/cagrimmett/07f8c8daea00946b9e704e3efcbd5739
* https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
* https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
* http://bl.ocks.org/syntagmatic/3341641
* https://github.com/mrmierzejewski/hugo-theme-console


[product-screenshot]: examples/images/screenshot.png
[loop-example]: examples/images/loop.png
[tree-ltrace-example]: examples/images/tree_ltrace.png