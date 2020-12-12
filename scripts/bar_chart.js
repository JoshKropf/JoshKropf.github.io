// BarChart SVG Structure
var barMargin = { top: 60, right: 20, bottom: 100, left: 60 },
    barWidth = 800 - barMargin.left - barMargin.right,
    barHeight = 500;

// Storing data for global use.
var battles = ['Sumter', 'Bull Run', 'Stone', 'Peninsula', 'Shiloh', 'Fredericksburg', 'Chancellorsville', 'Vicksburg', 'Gettysburg', 'Chickamauga', 'Atlanta', 'Appomattox'],
    side1killed = [],
    side1arrests = [],
    side1injured = [],
    side2killed = [],
    side2arrests = [],
    side2injured = [],
    atEvents = [],
    side1AtEvents = [],
    side2AtEvents = [];

// Initializes the chart svgs
function barInit() {
    // Initialize SVGs
    d3.select('.charts')
        .append('svg')
        .attr('id', 'lineEvents')
        .classed('linechart', true)
        .attr('width', barWidth)
        .attr('height', barHeight);

    d3.select('.charts')
        .append('svg')
        .attr('id', 'barTotals')
        .classed('barchart', true)
        .attr('width', barWidth)
        .attr('height', barHeight);

    // Populate the status variables
    for (const el in data[0]) {
        if (data[0][el].side1killed > 0) {
            let temp = true;
            if (side1killed.length > 0) {
                if (side1killed[side1killed.length - 1].side1killed == data[0][el].side1killed) {
                    if (side1killed[side1killed.length - 1].action == data[0][el].action && side1killed[side1killed.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side1killed.push(data[0][el]);
            } else side1killed.push(data[0][el]);
        }
        if (data[0][el].side1arrests > 0) {
            let temp = true;
            if (side1arrests.length > 0) {
                if (side1arrests[side1arrests.length - 1].side1arrests == data[0][el].side1arrests) {
                    if (side1arrests[side1arrests.length - 1].action == data[0][el].action && side1arrests[side1arrests.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side1arrests.push(data[0][el]);
            } else side1arrests.push(data[0][el]);
        }
        if (data[0][el].side1injured > 0) {
            let temp = true;
            if (side1injured.length > 0) {
                if (side1injured[side1injured.length - 1].side1injured == data[0][el].side1injured) {
                    if (side1injured[side1injured.length - 1].action == data[0][el].action && side1injured[side1injured.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side1injured.push(data[0][el]);
            } else side1injured.push(data[0][el]);
        }
        if (data[0][el].side2killed > 0) {
            let temp = true;
            if (side2killed.length > 0) {
                if (side2killed[side2killed.length - 1].side2killed == data[0][el].side2killed) {
                    if (side2killed[side2killed.length - 1].action == data[0][el].action && side2killed[side2killed.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side2killed.push(data[0][el]);
            } else side2killed.push(data[0][el]);
        }
        if (data[0][el].side2arrests > 0) {
            let temp = true;
            if (side2arrests.length > 0) {
                if (side2arrests[side2arrests.length - 1].side2arrests == data[0][el].side2arrests) {
                    if (side2arrests[side2arrests.length - 1].action == data[0][el].action && side2arrests[side2arrests.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side2arrests.push(data[0][el]);
            } else side2arrests.push(data[0][el]);
        }
        if (data[0][el].side2injured > 0) {
            let temp = true;
            if (side2injured.length > 0) {
                if (side2injured[side2injured.length - 1].side2injured == data[0][el].side2injured) {
                    if (side2injured[side2injured.length - 1].action == data[0][el].action && side2injured[side2injured.length - 1].event == data[0][el].event) {
                        temp = false;
                    }
                }
                if (temp) side2injured.push(data[0][el]);
            } else side2injured.push(data[0][el]);
        }
    }

    updateAtEvents();
    updateBarData();
}

// Updates the line chart with the At Events stats
function updateAtEvents() {
    for (const key in battles) {
        let max = 0;

        for (const idx in side1killed) {
            if (side1killed[idx].event.includes(battles[key])) {
                max = Math.max(max, side1killed[idx].side1killed);
            }
        }

        atEvents.push({ battle: battles[key], x: key, y: max, side: 1 });
        side1AtEvents.push({ x: key, y: max });
        max = 0;

        for (const idx in side2killed) {
            if (side2killed[idx].event.includes(battles[key])) {
                max = Math.max(max, side2killed[idx].side2killed);
            }
        }

        atEvents.push({ battle: battles[key], x: key, y: max, side: 2 });
        side2AtEvents.push({ x: key, y: max });
    }
}

// Updates the bar chart values from a selected event
function updateBarData(selectedEvent = undefined) {
    refresh();

    let results = getValue();
    if (results == undefined) return;

    // Build bar charts
    let svgEvent = d3.select('#lineEvents');
    let svgTotal = d3.select('#barTotals');

    setupAxis(svgEvent, 'Units Killed at Each Battle');
    setupAxis(svgTotal, 'Totals to Events vs Total in War');

    setupLegend([svgEvent, svgTotal]);

    // Populate data
    // Event Stats
    svgEvent.append('g')
        .attr('transform', `translate(${barMargin.left}, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-event-path1');
    svgEvent.append('g')
        .attr('transform', `translate(${barMargin.left}, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-event-path2');

    let circles = svgEvent.selectAll('circles')
        .data(atEvents);
    let paths1 = svgEvent.select('#g-event-path1')
        .selectAll('paths')
        .data(side1AtEvents);
    let paths2 = svgEvent.select('#g-event-path2')
        .selectAll('paths')
        .data(side2AtEvents);

    let lineGen = d3.line().x(d => d.x * (barWidth - barMargin.left) / battles.length).y(d => d.y / 17);

    paths1.enter()
        .append('path')
        .attr('d', lineGen(side1AtEvents))
        .style('stroke', 'grey')
        .style('stroke-width', 4)
        .style('fill', 'None');

    paths2.enter()
        .append('path')
        .attr('d', lineGen(side2AtEvents))
        .style('stroke', 'blue')
        .style('stroke-width', 4)
        .style('fill', 'None');

    circles.enter()
        .append('g')
        .attr('transform', `translate(${barMargin.left}, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-event-circle')
        .append('circle')
        .attr('cx', d => d.x * (barWidth - barMargin.left) / battles.length)
        .attr('cy', d => d.y / 17)
        .attr('r', 10)
        .attr('id', d => d.battle)
        .style('fill', d => d.side == 1 ? 'gray' : 'blue')
        .classed('highlighted', function (d) {
            // Click Line Chart Circle AND Keyboard Navigation
            for (const key in infoData) {
                if (infoData[key].eventName != undefined && infoData[key].eventName.includes(d.battle)) {
                    let cur = document.getElementById(infoData[key].eventName);
                    if (cur == keyEvents.selected) return true;
                }
            }

            // Click Key Events
            return selectedEvent != undefined ? selectedEvent.includes(d.battle) : false;
        })
        .on('mouseover', function (d) {
            d3.selectAll(`#${d.battle}`)
                .transition()
                .duration(1000)
                .delay(100)
                .attr('r', 20);
        })
        .on('mouseout', function (d) {
            d3.selectAll(`#${d.battle}`)
                .transition()
                .duration(1000)
                .delay(100)
                .attr('r', 10);
        })
        .on('click', function (d) {
            let e;
            for (const key in infoData) {
                let temp = document.getElementById(infoData[key].eventName);

                if (temp != null) temp.classList.remove('highlighted');

                if (infoData[key].eventName != undefined && infoData[key].eventName.includes(d.battle)) {
                    e = infoData[key].eventName;
                    infoDataIdx = key;
                }
            }

            let event = document.getElementById(e);
            event.classList.add('highlighted');
            keyEvents.selected = event;
            infoPanel.update(e);
            updateBarData();
            map.mapUpdate(e, infoData);
        });

    d3.selectAll('#g-event-circle')
        .select('circle')
        .select('title').remove();

    d3.selectAll('#g-event-circle')
        .select('circle')
        .append('title')
        .text(d => `${getBattle(d.battle)}\n${d.side == 1 ? 'Confederate' : 'Union'}: ${d.y} soldiers killed`);

    // Total stats
    let rectangles = svgTotal.selectAll('rect[id="total-rect"]')
        .data(results);

    exitAnimation(rectangles);
    rectangles.enter()
        .append('g')
        .attr('transform', `translate(0, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-total-rect')
        .append('rect')
        .attr('x', (d, i) => d.side == 1 ? (i + 1) * 100 : i * 100 + 80)
        .attr('y', 2)
        .attr('width', 75)
        .attr('height', 0)
        .attr('id', 'total-rect')
        .style('stroke', d => d.side == 1 ? 'gray' : 'blue')
        .style('fill', 'ghostwhite')
        .merge(rectangles)
        .transition()
        .duration(1000)
        .delay(100)
        .attr('height', d => d.total / 1000);

    d3.selectAll('#g-total-rect')
        .selectAll('rect')
        .select('title')
        .remove();

    d3.selectAll('#g-total-rect')
        .selectAll('rect')
        .append('title')
        .text(d => `War Total: ${d.total}`);

    rectangles = svgTotal.selectAll('rect[id="toEvent-rect"]')
        .data(results);

    exitAnimation(rectangles);
    rectangles.enter()
        .append('g')
        .attr('transform', `translate(0, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-toEvent-rect')
        .append('rect')
        .attr('x', (d, i) => d.side == 1 ? (i + 1) * 100 : i * 100 + 80)
        .attr('y', 2)
        .attr('width', 75)
        .attr('height', 0)
        .attr('id', 'toEvent-rect')
        .style('fill', d => d.side == 1 ? 'gray' : 'blue')
        .style('stroke', d => d.side == 1 ? 'gray' : 'blue')
        .on('mouseover', function () {
            d3.select(this).style('fill', d => d.side == 1 ? 'lightgray' : 'lightblue');
        })
        .on('mouseout', function () {
            d3.select(this).style('fill', d => d.side == 1 ? 'gray' : 'blue');
        })
        .merge(rectangles)
        .transition()
        .duration(1000)
        .delay(100)
        .attr('height', d => d.toEvent / 1000);

    d3.selectAll('#g-toEvent-rect')
        .selectAll('rect')
        .select('title')
        .remove();

    d3.selectAll('#g-toEvent-rect')
        .selectAll('rect')
        .append('title')
        .text(d => `Total up to Event: ${d.toEvent}`);

}

// Gets the full battle name from small tidbit
function getBattle(battle) {
    for (const key in infoData) {
        if (infoData[key].eventName != undefined && infoData[key].eventName.includes(battle)) {
            return infoData[key].eventName;
        }
    }

    return '';
}

// Builds the axis
function setupAxis(svg, title) {
    barTitle(svg, title);
    axis(svg);
    tics(svg, title);
}

// Creates the Legend for the Bar Chart
function setupLegend(svgs) {
    for (const key in svgs) {
        let g = svgs[key].append('g')
            .attr('transform', `translate(${barWidth - barMargin.right - 100}, ${barMargin.top})`)
            .attr('id', `legend`);

        g.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 10)
            .style('fill', 'gray');

        g.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .text('Confederacy');

        g.append('circle')
            .attr('cx', 0)
            .attr('cy', 20)
            .attr('r', 10)
            .style('fill', 'blue');

        g.append('text')
            .attr('x', 15)
            .attr('y', 25)
            .text('Union');
    }
}

// Updates the bar chart with the selected event
function getValue() {
    if (document.getElementsByClassName('highlighted').item(0) != null) {
        let selectedEvent = document.getElementsByClassName('highlighted').item(0).getAttribute('id');

        for (const key in battles) {
            if (selectedEvent.includes(battles[key])) {
                return findEvent(battles[key]);
            }
        }
        return findEvent(' ');
    }
}

// Searches the dataset for information regarding the selected event
function findEvent(location) {
    let results = [];
    let total = 0;
    let toEvent = 0;
    let gather = true;
    let max = 0;

    for (const key in side1killed) {
        total += side1killed[key].side1killed;
        if (gather) toEvent += side1killed[key].side1killed;
        if (side1killed[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side1killed[key].side1killed);
        }
    }

    if (location == 'Sumter') toEvent = max;

    let temp = { side: 1, attr: 'Killed', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    total = 0;
    toEvent = 0;
    gather = true;
    max = 0;

    for (const key in side2killed) {
        total += side2killed[key].side2killed;
        if (gather) toEvent += side2killed[key].side2killed;
        if (side2killed[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side2killed[key].side2killed);
        }
    }

    temp = { side: 2, attr: 'Killed', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    total = 0;
    toEvent = 0;
    gather = true;
    max = 0;

    for (const key in side1injured) {
        total += side1injured[key].side1injured;
        if (gather) toEvent += side1injured[key].side1injured;
        if (side1injured[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side1injured[key].side1injured);
        }
    }

    if (location == 'Sumter') toEvent = max;

    temp = { side: 1, attr: 'Injured', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    total = 0;
    toEvent = 0;
    gather = true;
    max = 0;

    for (const key in side2injured) {
        total += side2injured[key].side2injured;
        if (gather) toEvent += side2injured[key].side2injured;
        if (side2injured[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side2injured[key].side2injured);
        }
    }

    temp = { side: 2, attr: 'Injured', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    total = 0;
    toEvent = 0;
    gather = true;
    max = 0;

    for (const key in side1arrests) {
        total += side1arrests[key].side1arrests;
        if (gather) toEvent += side1arrests[key].side1arrests;
        if (side1arrests[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side1arrests[key].side1arrests);
        }
    }

    if (location == 'Stone') toEvent = 1021;
    if (location == 'Sumter') toEvent = max;

    temp = { side: 1, attr: 'Arrests', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    total = 0;
    toEvent = 0;
    gather = true;
    max = 0;

    for (const key in side2arrests) {
        total += side2arrests[key].side2arrests;
        if (gather) toEvent += side2arrests[key].side2arrests;
        if (side2arrests[key].event.includes(location)) {
            gather = false;
            max = Math.max(max, side2arrests[key].side2arrests);
        }
    }

    if (location == 'Stone') toEvent = 2583;

    temp = { side: 2, attr: 'Arrests', total: total, toEvent: toEvent, atEvent: max, };
    results.push(temp);

    return results;
}

// Generates a title for each bar chart
function barTitle(svg, title) {
    let x = (barWidth - barMargin.left) / 2 - 3 * title.length;
    svg.append('text')
        .attr('x', x)
        .attr('y', barMargin.top / 2)
        .classed('bar-title', true)
        .attr('font-size', 24)
        .attr('text-decoration', 'underline')
        .text(title);
}

// Generates the axis for each given svg
function axis(svg) {
    let axis = [
        { x: 0, y: 0, },
        { x: 0, y: barHeight - barMargin.top - barMargin.bottom, },
        { x: barWidth - barMargin.left - barMargin.right, y: barHeight - barMargin.top - barMargin.bottom, },
    ];

    let lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    svg.append('g')
        .attr('transform', `translate(${barMargin.left}, ${barMargin.top}) scale(1, 1)`)
        .attr('id', 'g-axis')
        .append('path')
        .attr('d', lineGenerator(axis))
        .classed('axis', true)
        .style('stroke', 'black')
        .style('stroke-width', 4)
        .style('fill', 'None');
}

// Generates the tic marcs and labels for the barcharts
function tics(svg, title) {
    let lineGenerator = d3.line().x(d => d.x).y(d => d.y);
    let g = svg.append('g')
        .attr('transform', `translate(${barMargin.left}, ${barHeight - barMargin.bottom}) scale(1, -1)`)
        .attr('id', 'g-bar-tic');

    // X Axis
    // Total Events Stats
    if (title.includes('War')) {
        // Axis Label
        label(svg, 30 - barHeight / 2 - 7, 47, 'axis-label', 'Soldiers (k)', true);

        let x = barWidth - barMargin.left - barMargin.right;
        let y = barHeight - barMargin.bottom + 20;
        let axisMod = 55;

        label(svg, x / 3 - axisMod, y, 'bar-tic-label', 'Killed');
        label(svg, x * 2 / 3 - axisMod - 14, y, 'bar-tic-label', 'Injured');
        label(svg, x - axisMod - 36, y, 'bar-tic-label', 'Captured');
    } else { // At Event Stats
        // Axis Label
        label(svg, 30 - barHeight / 2 - 7, 45, 'axis-label', 'Soldiers', true);

        for (const key in side1AtEvents) {
            let x = side1AtEvents[key].x * (barWidth - barMargin.left) / side1AtEvents.length + barMargin.left;
            let y = barHeight - barMargin.bottom + 20;

            svg.append('path')
                .attr('d', lineGenerator(getTicData(x, true)))
                .classed('tic-mark', true)
                .style('stroke', 'black')
                .style('stroke-width', 2)
                .style('fill', 'None');

            // TODO Fix Labels
            label(svg, x - 2 * battles[key].length, y, 'bar-tic-label', battles[key], false, 8);
        }
        label(svg, barWidth / 2 - 21, barHeight - barMargin.bottom + 50, 'axis-label', 'Battles');
    }

    // Y axis
    for (var i = 0; i < 6; i++) {
        var location = Math.floor((barHeight - barMargin.top - barMargin.bottom) * i / 4);
        if (location == Infinity) location = 0;
        var value = title.includes('Battle') ? (location * 17).toString() : location.toString();

        g.append('path')
            .attr('d', lineGenerator(getTicData(location)))
            .classed('tic-mark', true)
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style('fill', 'None');

        label(svg, barMargin.left - 10 - 8 * value.length, barHeight - barMargin.bottom - location + 3, 'tic-name', value, false, 14);
    }
}

// Returns the location of the tic marks for the line generator to use
function getTicData(location, xaxis = false) {
    if (xaxis) return [
        { x: location, y: barHeight - barMargin.bottom },
        { x: location, y: barHeight - barMargin.bottom + 10 }
    ];
    return [
        { x: -10, y: location },
        { x: 0, y: location }
    ];
}

// Used to display a label itself on the barchart
function label(svg, x, y, className, label, rotate = false, size = 17) {
    if (rotate)
        svg.append('text')
            .attr('x', x)
            .attr('y', y)
            .attr('transform', 'rotate(270 0,35)')
            .style('font-size', size)
            .classed(className, true)
            .text(label);
    else
        svg.append('text')
            .attr('x', x)
            .attr('y', y)
            .style('font-size', size)
            .classed(className, true)
            .text(label);
}

// Ensures the Axis information doesn't get piled on to each other
function refresh() {
    d3.selectAll('#g-axis').remove();
    d3.selectAll('.bar-title').remove();
    d3.selectAll('.bar-tic-label').remove();
    d3.selectAll('#legend').remove();
    d3.selectAll('#g-bar-tic').remove();
    d3.selectAll('.tic-name').remove();
    d3.selectAll('.axis-label').remove();
    d3.selectAll('#g-event-circle').remove();
    d3.selectAll('#g-event-path1').remove();
    d3.selectAll('#g-event-path2').remove();
}

// Controls the Exit Animation of a Rectangle in .exit()
function exitAnimation(rectangles) {
    rectangles.exit()
        .transition()
        .duration(1000)
        .delay(100)
        .attr('height', 0)
        .remove();
}