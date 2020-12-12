

class Map {

    

    constructor() {
        this.projection = d3.geoAlbersUsa().scale(1000).translate([400, 350]);

    }


     mapInit() {
        map = d3.select('.map')
            .append('svg')
            .attr('id', 'map')
            .classed('item', true)
            .attr('width', 1000)
            .attr('height', 650);


        let usMap = new Map();
        d3.json("data/us-states.json")
            .then(function (us) {
                usMap.drawMap(us);
            });
        
        

        setupMapLegend()
        
    
        // loadMapData('all');
    }
    
    /**
     * Renders the actual map
     * @param the json data with the shape of all states
     */
    
    
     mapUpdate(event, eventlist){
    
        // console.log(eventlist)   
        
        for (var i =0; i < eventlist.length  ; i++){
            var e = eventlist[i]
            // console.log(e)
            if (event == e.eventName){
                confState = e.sucStates
                loc = e.eventLoc
                // console.log(loc)
        
            }
 
        
        }
        
        // console.log(confState)
        d3.selectAll(".states").remove()

        let usMap = new Map();
        d3.json("data/us-states.json")
            .then(function (us) {
                usMap.drawMap(us);
            });
        
        }





    drawMap(us) {


        let path = d3.geoPath()
            .projection(this.projection);


        d3.select("#map").selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("id", 
            function(d) {

                // Get data value
                var value = d.properties.name;
                console.log(loc)

                if (value == loc) {
                    
                    return 'Event'
                } 
            
                else if (confState.includes(value)) {
                    console.log
                //If value exists…
                return 'C';
                }
                else if (notInUS.includes(value)) {
                    return 'N'
                } 
                else  {
                //If value is undefined…
                return 'U'
                }})
            // .attr("id", ((d => d.id) < 10) ? 'Conf' : 'Union' )
            .attr("d", path)
            .attr('class', 'states')
        ;
    }
}


function setupMapLegend() {
   
    var color = ['blue','grey','red','white']

    var legend = d3.select(".map").append("svg")
      			.attr("class", "legend")
     			.attr("width", 400)
                .attr("height", 200)
   				.selectAll("g")
   				.data(color)
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 22 + ")"; });

  	legend.append("rect")
   		  .attr("width", 20)
             .attr("height", 20)
            //  .style(fill, (function(d) { return d; }));
   		  .style("fill", function(d) { return d; });

  	legend.append("text")
  		  .data(['Union','Confederate','Location of selected event','Not part of the US (either Union or Confederate)'])
      	  .attr("x", 24)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	}



