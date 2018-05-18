//var treeData = [
//    {
//        "name": "Ars Technica",
//        "url": "https://www.arstechnica.com",
//        "parent": "null",
//        "children": [
//            {
//                "name": "Affiliate Link Policy | Ars Technica",
//                "url": "http://www.arstechnica.com/affiliate-link-policy/",
//                "parent": "Ars Technica",
//                "children": [
//                    {
//                        "name": "Amendment to Conde Nast User Agreement & Privacy Policy | Ars Technica",
//                        "url": "http://www.arstechnica.com/amendment-to-conde-nast-user-agreement-privacy-policy/",
//                        "parent": "Affiliate Link Policy | Ars Technica"
//                    },
//                    {
//                        "name": "Reprints | Ars Technica",
//                        "url": "http://www.arstechnica.com/reprints/",
//                        "parent": "Affiliate Link Policy | Ars Technica"
//                    }
//                ]
//            },
//            {
//                "name": "Advertise with us | Ars Technica",
//                "url": "http://www.arstechnica.com/advertise-with-us/",
//                "parent": "Ars Technica"
//            }
//        ]
//    }
//];

function createD3_tree(treeData, childrenLen) {
    var calcHeight = 0;
    if (childrenLen > 5) {
        calcHeight = childrenLen * 20;
    }

    var svgWidth = 5000;    //was 960
    var svgHeight = 1000 + calcHeight;    //was 500
    
    // ************** Generate the tree diagram	 *****************
    //var margin = { top: 20, right: 120, bottom: 20, left: 120 },
    var margin = { top: 50, right: 170, bottom: 50, left: 170 },
        width = svgWidth - margin.right - margin.left,
        height = svgHeight - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

    var svg = d3.select("#tree").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", svgHeight + "px");

    // scroll page down to root node
    setTimeout(function () {
        var svgtop = $('svg').position().top;
        $('html, body').animate({
            scrollTop: parseInt(root.x) + svgtop
        }, 500);
    }, 1000);

    

    function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr({ "class": "node modalTrigger" })
            .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });
        //.on("click", click)

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; })
            .on("click", click);

        nodeEnter.append("text")
            .attr({ "class": "modalTrigger", "href": "#" })
            .attr("x", function (d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
            .text(function (d) { return d.name; })
            .style("fill-opacity", 1e-6)
            .on('click', modalClick);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function (d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }

        update(d);

        // scroll page to clicked node
        setTimeout(function () {
            //var svgtop = $('svg').position().top;
            $('html, body').animate({
                scrollTop: d.x
            }, 500);
        }, 500);
        
    }

    // Toggle modal dialog with node info
    function modalClick(d) {
        $("#modal-title").text(d.name);
        $("#modal-url").text(d.url).attr("href", d.url);
        $("#exampleModalCenter").modal({ show: true });
    }
}

