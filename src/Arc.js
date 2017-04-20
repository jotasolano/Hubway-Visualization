import * as d3 from 'd3';

function Arc(){
	let W, H, M ={t:20,r:20,b:20,l:20};
	let dis = d3.dispatch('draw');
	let scaleX, scaleY, maxSum;
	let _startTime = 0;
	let _endTime = 12;
	const baseRadius = 60;
	const pixRatio = window.devicePixelRatio;
	let canvas = document.querySelector("canvas"),
	context = canvas.getContext("2d");


	function exports(selection){
		W = W || canvas.parentNode.clientWidth - M.l - M.r;
		H = H || canvas.parentNode.clientHeight - M.t - M.b;
		canvas.width = W + M.l + M.r;
		canvas.height = H + M.t + M.b;

		let radius = Math.min(canvas.width, canvas.height) / 2 - 30;
		// canvas.style.width = "6000px";
		// canvas.style.height = "6000px";
		// context.scale(2,2)

		let c = 2*Math.PI*radius;
		let arr = selection.datum()?selection.datum():[];

		let nestedHours = d3.nest()
			.key(function(d) { return +d.hour; })
			.rollup(function(trips) { return trips.length; })
			.entries(arr)

		nestedHours.sort(function(a, b){return +a.key - +b.key})


		console.log(nestedHours);

		maxSum = d3.max(nestedHours, function(d) { return d.value; })


		// ** ------- LAYOUT ------- **
		let scaleAngle = d3.scaleTime()
				.domain([_startTime, _endTime])
				.range([0, 2 * Math.PI]);

		let scaleLine = d3.scaleLinear()
				.domain([1, 12])
				.range([0, 2 * Math.PI]);

		let scaleRadius = d3.scaleLinear()
				.domain([0, maxSum])
				.range([150, 400]);

		let arcGenerator = d3.arc()
			.innerRadius(function(d) { return baseRadius + d.lvl; })
			.outerRadius(function(d) { return baseRadius + d.lvl + 0.5; })
			.startAngle(function(d) { return scaleAngle(d.startTime); })
			.endAngle(function(d) { return scaleAngle(d.endTime); })
			.context(context);

		let lineGenerator = d3.radialLine()
			.angle(function(d) { return scaleAngle(+d.key); })
			.radius(function(d) { return scaleRadius(d.value); })
			.curve(d3.curveNatural)
			.context(context);

		// ** ------- CANVAS LINES ------- **
		context.translate(canvas.width/2, canvas.height/2);

		var gr = context.createRadialGradient(50,50,25,100,100,100);

	    // Add the color stops.
	    gr.addColorStop(0,'rgb(255,0,0)');
	    gr.addColorStop(.5,'rgb(0,255,0)');
	    gr.addColorStop(1,'rgb(255,0,0)');


		for (var i = 0; i < arr.length; i++) {
			if (arr[i].userType == 'Subscriber') {
				context.beginPath();
				arcGenerator(arr[i]);
				context.strokeStyle = "rgba(212, 1, 243, 1)";
			  	context.stroke();
			  	context.closePath();
			} else {
				context.beginPath();
				arcGenerator(arr[i]);
				context.strokeStyle = "rgba(0, 187, 251, 1)";
			  	context.stroke();
			  	context.closePath();
			}
		}

		context.beginPath();
		lineGenerator(nestedHours);
		context.strokeStyle = '#00aa99';
		context.lineWidth = 2;
		context.stroke();
		context.closePath();
	};

	exports.on = function(event, callback){
		dis.on(event, callback);
		return this;
	}

	exports.startTime = function(_){
		if(!arguments.length) return _startTime;
		_startTime = _;
		return this;
	}

	exports.endTime = function(_){
		if(!arguments.length) return _endTime;
		_endTime = _;
		return this;
	}


	return exports;
}

export default Arc;
