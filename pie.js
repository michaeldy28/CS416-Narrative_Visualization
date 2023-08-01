function main() {
    var svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2;

    var tooltipGroup = svg.append("g")
        .attr('transform', 'translate(' + (width / 2 + 100) + ',' + height / 2 + ')');

    var color = d3.scaleOrdinal(["#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00", "#CCFF00", "#99FF00", "#66FF00", "#33FF00",
        "#00FF00", "#00FF33", "#00FF66", "#00FF99", "#00FFCC", "#00FFFF", "#00CCFF", "#0099FF", "#0066FF", "#0033FF",
        "#0000FF", "#3300FF"]);

    var pie = d3.pie().value(function (d) {
        return d.count;
    });

    var path = d3.arc().outerRadius(radius - 40).innerRadius(305);
    var label = d3.arc().outerRadius(radius).innerRadius(radius - 250);

    var currentTooltip = null; 

    d3.dsv(',', 'HallOfFame.csv').then(function (data) {

        var filteredData = data.filter(function (d) {
            return +d.Inducted >= 0; 
        });

        var ASGCounts = {};
        filteredData.forEach(function (player) {
            var ASG = player.ASG;
            if (!ASGCounts.hasOwnProperty(ASG)) {
                ASGCounts[ASG] = {
                    ASG: ASG,
                    count: 1,
                    players: [player.Name]
                };
            } else {
                ASGCounts[ASG].count++;
                ASGCounts[ASG].players.push(player.Name);
            }
        });


        var ASGCountsArray = Object.values(ASGCounts);

        var line = svg.append("line")
            .attr("x1", (width/2) +150) 
            .attr("y1", (height/2) - 20)
            .attr("x2", (width/2) + 350) 
            .attr("y2", (height/2) - 170) 
            .style("stroke", "black")
            .style("stroke-width", 1);
        

        svg.append("text")
            .attr("x", width/2) 
            .attr("y", height/2)
            .text("Click parts of the chart to see who are in them.")
            .style("font-size", "20px")
            .style("fill", "black")
            .append("tspan")
            .attr("x", (width/2) + 10) 
            .attr("dy", "1.2em") 
            .text("Did you find out why this part is so large?");

        var arc = tooltipGroup.selectAll('.arc') 
            .data(pie(ASGCountsArray))
            .enter().append('g')
            .attr('class', 'arc');

        arc.append('path')
            .attr('d', path)
            .attr('fill', function (d) {
                return color(d.data.ASG);
            })
            .on('click', function (event, d) {

                if (currentTooltip) {
                    currentTooltip.remove();
                }

                var tooltip = svg.append('g')
                    .attr('class', 'tooltip')
                    .style('pointer-events', 'none');

                var tooltipBox = tooltip.append('rect')
                    .attr('class', 'tooltip-box')
                    .attr('width', 250)
                    .attr('height', 200) 
                    .attr('x', 20)
                    .attr('y', 100); 

                var tooltipText = tooltip.append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', 30) 
                    .attr('y', 120)
                    .text(" Players Who Have Played " + d.data.ASG + " All Star Games: " + d.data.count);

                tooltipText.append('tspan')
                    .attr('x', 30) 
                    .attr('dy', 20)
                    .text(" ");

            
                var ASGPlayers = d.data.players;
                for (var i = 0; i < ASGPlayers.length; i++) {
                    tooltipText.append('tspan')
                        .attr('x', 30) 
                        .attr('dy', 20) 
                        .text(ASGPlayers[i]);
                }

               
                currentTooltip = tooltip;
            });

        arc.append('text')
            .attr('transform', function (d) {
                return 'translate(' + label.centroid(d) + ')';
            })
            .text(function (d) {
                return d.data.ASG;
            })
            .style('font-size', '10px');


    });
};
