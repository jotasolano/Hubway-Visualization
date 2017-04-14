import * as d3 from 'd3';

function Dispatch(){
	let dis = d3.dispatch('getCount', 'updateTime', 'updateScales')

	function exports(){
		const morningBtn = d3.select('#btn-morning');
		morningBtn.on('click', () => { dis.call('updateTime', null, {start: 0, end: 12}); });

		// dis.on('updateTime')
	}

	exports.on = function(event, callback){
		dis.on(event, callback);
		return this;
	}
	return exports;
}

export default Dispatch;