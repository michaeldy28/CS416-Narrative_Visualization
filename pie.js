function main() {
    var svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2;

    var g = svg.append("g")
            .attr('transform','translate(' + (width / 2 + 100) + ',' + height / 2 + ')');

    var color = d3.scaleOrdinal(["#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00", "#CCFF00", "#99FF00", "#66FF00", "#33FF00",
                                 "#00FF00", "#00FF33", "#00FF66", "#00FF99", "#00FFCC", "#00FFFF", "#00CCFF", "#0099FF", "#0066FF", "#0033FF",
                                 "#0000FF", "#3300FF"]);

    var pie = d3.pie().value(function(d) {
        return d.count; // Use the "count" property for pie slices
    });

    var path = d3.arc().outerRadius(radius - 40).innerRadius(105);
    var label = d3.arc().outerRadius(radius).innerRadius(radius - 250);

    d3.dsv(',', 'HallOfFame.csv').then(function(data) {

        var filteredData = data.filter(function (d) {
            return +d.Inducted >= 0; // Filter data for overall >= 89
        });
        
        // Create nationalityCounts as an object instead of an array
        var ASGCounts = {};
        filteredData.forEach(function(player) {
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

        // Convert the object to an array
        var ASGCountsArray = Object.values(ASGCounts);

        var arc = g.selectAll('.arc')
                    .data(pie(ASGCountsArray))
                    .enter().append('g')
                    .attr('class', 'arc');

        arc.append('path')
            .attr('d', path)
            .attr('fill', function(d) { return color(d.data.ASG); })
            .on('mouseover', function(event, d) {
                // Show the tooltip on mouseover
                var tooltip = svg.append('g')
                                 .attr('class', 'tooltip')
                                 .style('pointer-events', 'none');

                var tooltipBox = tooltip.append('rect')
                                       .attr('class', 'tooltip-box')
                                       .attr('width', 250) // Set the width of the tooltip box
                                       .attr('height', 200) // Set the height of the tooltip box
                                       .attr('x', 20) // Adjust the x position of the box
                                       .attr('y', height - 40); // Adjust the y position of the box

                var tooltipText = tooltip.append('text')
                                        .attr('class', 'tooltip-text')
                                        .attr('x', 30) // Adjust the x position of the text
                                        .attr('y', height / 2) // Adjust the y position of the text
                                        .text(d.data.ASG + " All Star Games Played: " + d.data.count);


                tooltipText.append('tspan')
                .attr('x', 30) // Adjust the x position of the additional text
                .attr('dy', 20) // Adjust the y position of the additional text
                .text(" ");

                tooltipText.append('tspan')
                .attr('x', 30) // Adjust the x position of the additional text
                .attr('dy', 20) // Adjust the y position of the additional text
                .text("Players:");

                // Display the array of players for the specific nationality
                var ASGPlayers = d.data.players;
                for (var i = 0; i < ASGPlayers.length; i++) {
                    tooltipText.append('tspan')
                               .attr('x', 30) // Adjust the x position of the additional text
                               .attr('dy', 20) // Adjust the y position of the additional text
                               .text(ASGPlayers[i]);
                }
            })
            .on('mouseout', function(event, d) {
                // Hide the tooltip on mouseout
                svg.select('.tooltip').remove();
            });

        arc.append('text')
            .attr('transform', function(d) { return 'translate(' + label.centroid(d) + ')'; })
            .text(function(d) { return d.data.ASG; })
            .style('font-size', '10px');

        // Add a shorter line connecting the unrelated annotation to the pie chart
        var line = svg.append("line")
            .attr("x1", 140) // x position of the start of the line (at the unrelated annotation)
            .attr("y1", 60) // y position of the start of the line (at the unrelated annotation)
            .attr("x2", 350) // x position of the end of the line (at the shorter end point)
            .attr("y2", 300) // y position of the end of the line (at the shorter end point)
            .style("stroke", "black")
            .style("stroke-width", 1);
        
        // Add an unrelated annotation
        svg.append("text")
            .attr("x", 5) // Adjust the x position of the unrelated text
            .attr("y", 30) // Adjust the y position of the unrelated text
            .text("Hover over each arc of the pie chart to see")
            .style("font-size", "17px")
            .style("fill", "black")
            .append("tspan") // Add a <tspan> element for the next line
            .attr("x", 5) // Adjust the x position of the second line
            .attr("dy", "1.2em") // Adjust the vertical offset to create space between lines
            .text("the names of the players that represent that nationality.");

    });
};
