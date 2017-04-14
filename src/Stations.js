import {dispatch} from 'd3';
let Awesomplete = require('awesomplete');

function StationsList(data){
	let dis = dispatch('stationTrig', 'end');
	let stationList = []
	data.forEach(el => { stationList.push(el.name) });

	function exports(){

		//selection will probably be empty

		let startInput = document.getElementById('start-station-input');
		let stAwesomplete = new Awesomplete(startInput);
		stAwesomplete.list = stationList;

		let endInput = document.getElementById('end-station-input');
		let edAwesomplete = new Awesomplete(endInput);
		edAwesomplete.list = stationList;

		startInput.addEventListener("awesomplete-selectcomplete", function(e){
			let startStation = startInput.value;
			dis.call('stationTrig', null, {startStation: startStation, endStation: endInput.value});
		}, false);

		endInput.addEventListener("awesomplete-selectcomplete", function(e){
			let endStation = endInput.value;
			dis.call('stationTrig', null, {startStation: startInput.value, endStation: endStation});
		}, false);

	}

	exports.on = function(event, callback){
		dis.on(event, callback);
		return this; //this = exports
	}

	return exports;
}

export default StationsList;