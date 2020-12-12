class Tooltip {
//Initialize the tooltip to be hidden.
    constructor(data) {
      this.data = data;
      this.tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#355e7b")
        .attr('id', 'tooltip')
        .attr('color', 'floralwhite')
        .classed('tooltipDiv', true);
    };
  
  
    mouseover(name) {
      this.tooltip
          .html(`<h3> ${name} </h3>`)
          .classed('tooltip-title', true)
      ;
      this.tooltip.style("visibility", "visible");      
    }
  
    mousemove() {
      this.tooltip.style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
  
    }
  
    mouseout() {
      this.tooltip
            .style("visibility", "hidden")
    }
  
  };