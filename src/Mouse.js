import * as d3 from 'd3';

function Mouse(){
	let point = d3.mouse(this);
	let p = { x: point[0], y: point[1] };

	function exports(){
		console.log(p, point);
	};

	return exports;
}

export default Mouse;