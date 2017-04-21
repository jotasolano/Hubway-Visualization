import * as d3 from 'd3';

function totalTrips(){
	let W, H, M = {t:20,r:20,b:20,l:20};
	function exports(selection){

		W = W || selection.node().clientWidth - M.l - M.r;
		H = H || selection.node().clientHeight - M.t - M.b;

		console.log('this');

		let arr = selection.datum()?selection.datum():[];

		let svg = selection.selectAll('svg')
			.data([0])

		let svgEnter = svg.enter()
			.append('svg') //ENTER
			.attr('width', W + M.l + M.r)
			.attr('height', H + M.t + M.b)
			.merge(svg)

		let plotEnter = svgEnter.append('g').attr('class','plot time-series')
			.attr('transform','translate('+M.l+','+M.t+')');

		plotEnter.append('g').attr('class', 'label');
		
		svgEnter.select('.label').selectAll("g").data(arr)
			.enter()
			.append('text')
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ') rotate('+0+')')
			.merge(plotEnter) //Update
			.attr('x', 45)
			.attr('y', 60)
			.attr("dy", ".35em")
			.text(function(d, i) { console.log(d.length); return d.length; })
			.attr('fill', 'white')

		plotEnter.exit().remove() //exit
		}
	
	return exports;
}

export default totalTrips;
