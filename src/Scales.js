import * as d3 from 'd3';

function Scales(){
	let W, H, M = {t:20,r:20,b:20,l:20};
	const baseRadius = 60;
	let timeRange = d3.range(1, 13, 1);
	let pieRange = d3.range(0, 12, 1);
	let angle;
	let dis = d3.dispatch('mouseOver');

	function exports(selection){

		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;
		const radius = Math.min(W, H) / 2 - 150; //how far out do the axes go

		let scaleAngle = d3.scaleLinear()
				.domain([0, 360])
				.range([0, 2 * Math.PI]);

		let scaleTime = d3.scaleLinear()
			.domain([0, 2*Math.PI])
			.range([0, 12]);

		let arcGenerator = d3.arc()
			.innerRadius(function(d){ return baseRadius; })
			.outerRadius(function(d){ return radius; })
			.startAngle(function(d){ return scaleAngle(d*30); })
			.endAngle(function(d){ return scaleAngle(d*30+30); });

		let svg = selection.selectAll('svg')
			.data([0])

		let svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W + M.l + M.r)
			.attr('height', H + M.t + M.b)
			

		let plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')');

		let time = d3.timeFormat('%H')
		
		plotEnter.append('circle').attr('class', 'disc');
		plotEnter.append('g').attr('class', 'hover-sections')
		plotEnter.append('g').attr('class', 'axis');
		plotEnter.append('g').attr('class', 'sm-axis');
		plotEnter.append('g').attr('class', 'time-labels');

		selection.selectAll('.disc').data([0])
			.attr('transform','translate('+ (W / 2) + "," + (H / 2) + ') rotate('+0+')')
		    .attr('cx', 0)
		    .attr('cy', 0)
		    .attr('r', baseRadius)
		    .style('fill', 'white')
		    .style('opacity', 0.4);

		svgEnter.select('.axis').selectAll("g").data(d3.range(0, 360, 30))
			.enter()
			.append('g')
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ')')
			.append('line')
			.attr('x1', baseRadius)
			.attr('x2', radius)
    		// .style('stroke-width', 0.5)
			.attr("transform", function(d) { return "rotate(" + -d + ")"; });

		svgEnter.select('.sm-axis').selectAll("g").data(d3.range(0, 360, 30))
			.enter()
			.append('g')
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ')')
			.append('line')
			.attr('x1', radius-20)
			.attr('x2', radius)
			.attr("transform", function(d) { return "rotate(" + -d + ")"; });

		svgEnter.select('.time-labels').selectAll('g').data(timeRange)
			.enter()
			.append('g')
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ') rotate('+-90+')')
			.append('text')
			.attr('x', radius)
			.text(function(d, i) {return d; })
			.attr('fill', 'white')
			.attr("transform", function(d) { return "rotate(" + 30*d + ")"; });

		svgEnter.select('.hover-sections').selectAll('g').data(pieRange)
			.enter()
			.append('path')
			.attr('d', function(d) { return arcGenerator(d); })
			.style('fill', '#2B879E')
			.style('fill-opacity', 0.1)
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ') rotate('+0+')')
			.on('mouseover', function(d) {
				let coords = d3.mouse(this);				
				let p = { x: coords[0], y: (coords[1]) }; 
				let angle = ((Math.atan2(p.y,p.x)<0?Math.PI*2+Math.atan2(p.y,p.x):Math.atan2(p.y,p.x)) + Math.PI/2)%(Math.PI*2);
				let timeDist = scaleTime(angle);

				dis.call('mouseOver', null, { start: Math.floor(timeDist), end: Math.ceil(timeDist) });
			});
		}

		exports.on = function(event, callback){
			dis.on(event, callback);
			return this;


	};
	return exports;
}

export default Scales;
