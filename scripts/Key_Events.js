class Key_Events {
    //Initialize the SVG and set the dimensions and the data for later use.
    constructor(infoData, infoPanel) {
        this.infoData = infoData;
        this.infoPanel = infoPanel;
        this.svgWidth = 200;
        this.svgHeight = 1020;
        this.svg = d3.select("#Key-Events").append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

        this.numKeyEvents = this.infoData.length;
        this.eventNames = [];
        for (var i = 0; i < this.infoData.length; i++) {
            this.eventNames.push(this.infoData[i]['eventName']);
        }
        this.selected = null;
        this.tooltip_IsBattle;

        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });

        };
//Create the scale for event significance.
        var xScale = d3.scaleLinear()
            .domain([1, 5])
            .range([23, 70]);

        var xAxis = d3.axisTop()
            .scale(xScale)
            .tickFormat(d3.format("d"))
            .ticks(5);

        this.svg.append('g')
            .attr('class', 'axis')
            .call(xAxis)
            .attr("transform", "translate(0," + 140 + ") scale(1.5)");

//Set the titles and legend for the key events.
        this.svg.append('text')
            .attr('x', 5)
            .attr('y', 20)
            .attr('text-anchor', 'left')
            .style('font-size', '22px')
            .style('font-weight', 'bold')
            .text("Major Events");

        this.svg.append('circle')
            .attr('cx', 10)
            .attr('cy', 40)
            .attr('r', 8)
            .classed('battle', true);

        this.svg.append('circle')
            .attr('cx', 10)
            .attr('cy', 60)
            .attr('r', 8)
            .classed('non-battle', true);

        this.svg.append('text')
            .attr('x', 25)
            .attr('y', 45)
            .attr('text-anchor', 'left')
            .style('font-size', '18px')
            .text("Battle");

        this.svg.append('text')
            .attr('x', 25)
            .attr('y', 65)
            .attr('text-anchor', 'left')
            .style('font-size', '18px')
            .text("Non-Battle");

        this.svg.append('text')
            .attr('x', 35)
            .attr('y', 85)
            .attr('text-anchor', 'left')
            .style('font-size', '12px')
            .text("*Significance");

        this.svg.append('text')
            .attr('x', 35)
            .attr('y', 100)
            .attr('text-anchor', 'left')
            .style('font-size', '12px')
            .text("*Casualties (10,000's)");

        this.svg.append('circle')
            .attr('cx', 25)
            .attr('cy', 80)
            .attr('r', 5)
            .classed('non-battle', true);

        this.svg.append('circle')
            .attr('cx', 25)
            .attr('cy', 95)
            .attr('r', 5)
            .classed('battle', true);

    }

    update() {
        let circleStart = 150;
        let circleGap = (this.svgHeight - 20) / this.numKeyEvents - 6;
        let radius = 15;
        let circleLength = 50;

//Creates a line through all event bubbles.
        this.svg.selectAll('line')
            .data(this.eventNames)
            .enter()
            .append('line')
            .attr('x1', circleLength - 15)
            .attr('y1', (d, i) => circleStart)
            .attr('x2', circleLength - 15)
            .attr('y2', (d, i) => i < this.numKeyEvents - 1 ? circleStart : circleStart + (i - 1) * 43)
            .attr('stroke-width', 5)
            .attr('stroke', '#A0A0A0');

//Create the event bubbles.
        this.svg.selectAll('rect')
            .data(this.eventNames)
            .enter()
            .append('rect')
            .attr('x', circleLength - radius * 2)
            .attr('y', (d, i) => circleGap * i + 150)
            .attr('rx', radius)
            .attr('ry', radius)
            .attr('defaultWidth', (d, i) => radius * (parseInt(this.infoData[i]['significance'] + 1)))
            .attr('width', (d, i) => radius * (parseInt(this.infoData[i]['significance'] + 1)))
            .attr('height', radius * 2)
            .attr('id', d => d)
            .attr('stroke-width', 2)
            .attr('stroke', 'black')
            .attr('fill', '#311499')
            .attr('class', (d, i) => {      //change color depending on if the event is a battle.
                if (this.infoData[i]['isBattle'] == 0) {
                    this.tooltip_IsBattle = this.infoData[i]['isBattle'];
                    return 'non-battle';
                } else {
                    this.tooltip_IsBattle = this.infoData[i]['isBattle'];
                    return 'battle';
                }
            })      //show tooltip on mouseover as well as increase the size.
            .on('mouseover', function (d) {
                tooltip.mouseover(d);
                d3.select(this)
                    .attr('x', (d3.select(this).attr('x')) - 4)
                    .attr('y', (d3.select(this).attr('y')) - 4)
                    .transition()
                    .duration(200)
                    .attr('width', parseInt(d3.select(this).attr('defaultWidth')) + 8)
                    .attr('height', radius * 2 + 8)
                    .attr('stroke-width', 8);

                d3.select(this).moveToFront();


            })  
            .on("mousemove", function () {
                tooltip.mousemove();
            })
            .on('mouseout', function () {
                tooltip.mouseout();
                d3.select(this)
                    .attr('x', parseInt(d3.select(this).attr('x')) + 4)
                    .attr('y', parseInt(d3.select(this).attr('y')) + 4)
                    .transition()
                    .duration(500)
                    .attr('width', d3.select(this).attr('defaultWidth'))
                    .attr('height', radius * 2)
                    .attr('stroke-width', 2);
            })
            .on('click', d => {
                for (const key in infoData) {
                    let temp = document.getElementById(infoData[key].eventName);
                    

                    if (temp != null) temp.classList.remove('highlighted');
                }
 
                //Update other charts.
                //And information in the info panel.

                this.selected = d3.select(d3.event.target);
                this.selected.classed('highlighted', true);
                this.infoPanel.update(d);

                updateBarData(this.selected.attr('id'));
                // console.log(infoData)

                map = new Map ()
                // map.mapInit();
                map.mapUpdate((this.selected.attr('id')), infoData );

                for (const key in infoData) {
                    if (infoData[key].eventName == this.selected.attr('id')) {
                        infoDataIdx = key;
                    }
                }
            });
    }
}