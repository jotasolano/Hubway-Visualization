import * as d3 from 'd3';

function Scales(){
	let W, H, M = {t:20,r:20,b:20,l:20};
	const baseRadius = 50;
	let _timeRange = d3.range(1, 13, 1);
	let pieRange = d3.range(0, 12, 1);
	let angle;
	let dis = d3.dispatch('mouseOver');
	let _hourCount = undefined;

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
			.merge(svg)

		let plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')');
		
		let circG = plotEnter.append("g").attr("id", "numbersUpdate")
		circG.append('circle').attr('class', 'disc')
		circG.append("text").text("").attr('text-anchor', 'middle');

		plotEnter.append('g').attr('class', 'hover-sections')
		plotEnter.append('g').attr('class', 'axis');
		plotEnter.append('g').attr('class', 'sm-axis');
		plotEnter.append('g').attr('class', 'time-labels');


		circG.attr('transform','translate('+ (W / 2) + "," + (H / 2) + ') rotate('+0+')')
		selection.selectAll('.disc').data([0])
		    .attr('cx', 0)
		    .attr('cy', 0)
		    .attr('r', baseRadius)
		    .style('fill', '#f2f2f2')
		    .style('opacity', 0.8);

		svgEnter.select('.axis').selectAll("g").data(d3.range(0, 360, 30))
			.enter()
			.append('g')
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ')')
			.append('line')
			.attr('x1', 0)
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

		let numbers = svgEnter.select('.time-labels').selectAll('g')
			.data(_timeRange);

		numbers = numbers.enter()
			.append('g') //enter + update
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ') rotate('+-90+')')
			.merge(numbers) //Update
			
		let texts = numbers.selectAll("text")
			.data(d=>[d]);
		texts.enter()
			.append('text')
			.merge(texts)
			.attr('x', radius)
			.text(function(d, i) { return d; })
			.attr('fill', 'white')
			.attr("transform", function(d) { return "rotate(" + 30*d + ")"; });

		numbers.exit().remove() //exit

		// console.log(numbers);


		svgEnter.select('.hover-sections').selectAll('g').data(pieRange)
			.enter()
			.append('path')
			.attr('d', function(d) { return arcGenerator(d); })
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

		}

		exports.startTime = function(_){
			if(!arguments.length) return _timeRange;
			_timeRange = _;
			return this;
		}

		exports.hourCount = function(_){
			if(!arguments.length) return _hourCount;
			_hourCount = _;
			return this;
		}
		
	return exports;
}

export default Scales;
