class Info_Panel {
//Initialize the SVG and set its dimenstions.
    constructor(infoData) {
        this.infoData = infoData;
        this.svgWidth = 800;
        this.svgHeight = 1000;
        this.lowerInfoStart = 700;

        this.svg = d3.select("#info-panel").append('svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight);

        this.svg.append('text')
            .attr('x', this.svgWidth / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text("Please select an event on");

        this.svg.append('text')
            .attr('x', this.svgWidth / 2)
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text("the left to see more detail.");

        this.currentEvent = null;
    }

    update(eventName) {
        //clear current content and load new event content.        
        this.svg.html('');

        this.svg.append('text')
            .attr('x', this.svgWidth / 2)
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text(`Event Name: ${eventName}`);

        for (var i = 0; i < this.infoData.length; i++) {
            if (eventName == this.infoData[i]['eventName']) {
                this.currentEvent = this.infoData[i];
                break;
            }
        }

        this.svg.append('text')
            .attr('x', this.svgWidth / 2)
            .attr('y', 130)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .text(`Date: ${this.currentEvent.startDate} ${this.currentEvent.endDate != 0 ? "- " + this.currentEvent.endDate : ""}`);

        this.svg.append("foreignObject")
            .attr('x', 20)
            .attr('y', 170)
            .attr("width", this.svgWidth - 50)
            .attr("height", this.svgHeight - 450)
            //.attr('text-anchor', 'middle')
            .append("xhtml:body")
                .style("font-size", "24px")
                .html(`${this.currentEvent.description}`);

        if(this.currentEvent.imageName != "0") {
            this.svg.append('a')
            .attr('href', `./data/image/${this.currentEvent.imageName}`)
            .attr('data-lightbox', `${this.currentEvent.imageName}`)
            .attr('data-title', `${this.currentEvent.imageName}`)
            .append('svg:image')
                .attr('x', 100)
                .attr('y', 450)
                .attr('width', 500)
                .attr('height', 375)
                .attr("xlink:href", `./data/image/${this.currentEvent.imageName}`);

        }

        //Only display troop info if the event is a battle.
        if(parseInt(this.currentEvent.isBattle)) {
            this.svg.append('text')
                .attr('x', 0)
                .attr('y', this.lowerInfoStart+150)
                .attr('text-anchor', 'left')
                .style('font-size', '24px')
                .text(`${this.currentEvent.sideA_Name}`);

            this.svg.append('text')
                .attr('x', this.svgWidth - 20)
                .attr('y', this.lowerInfoStart+150)
                .attr('text-anchor', 'end')
                .style('font-size', '24px')
                .text(`${this.currentEvent.sideB_Name}`);

            this.svg.append('text')
                .attr('x', 0)
                .attr('y', this.lowerInfoStart+200)
                .attr('text-anchor', 'left')
                .style('font-size', '18px')
                .text(`Commanding Officer: ${this.currentEvent.sideA_CO}`);


            this.svg.append('text')
                .attr('x', this.svgWidth - 20)
                .attr('y', this.lowerInfoStart+200)
                .attr('text-anchor', 'end')
                .style('font-size', '18px')
                .text(`Commanding Officer: ${this.currentEvent.sideB_CO}`);

            this.svg.append('text')
                .attr('x', 0)
                .attr('y', this.lowerInfoStart+250)
                .attr('text-anchor', 'left')
                .style('font-size', '18px')
                .text(`Number of Troops: ${this.currentEvent.sideA_Troops}`);


            this.svg.append('text')
                .attr('x', this.svgWidth - 20)
                .attr('y', this.lowerInfoStart+250)
                .attr('text-anchor', 'end')
                .style('font-size', '18px')
                .text(`Number of Troops: ${this.currentEvent.sideB_Troops}`);
        }

    }
}    
