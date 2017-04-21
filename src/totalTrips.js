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
		
		plotEnter.append('text').attr('class', 'counter-label');


		let numbers = svgEnter.select('.counter-label').selectAll('text')
			.data([arr.length]);

		numbers = numbers.enter()
			.append('text') //enter + update
			.attr('transform', 'translate(' + (W/2) + ',' + (H/2) + ') rotate('+0+')')
			.merge(numbers) //Update
			.attr('x', 45)
			.text(function(d, i) { console.log(d); return d; })
			.attr('fill', 'white')

		numbers.exit().remove() //exit
		}
	
	return exports;
}

export default totalTrips;
