// ** ------- DEPENDENCIES ------- **
import * as d3 from 'd3';
let crossfilter = require('crossfilter'); //CommonJS
let Awesomplete = require('awesomplete');
let $ = require('jquery');

import 'awesomplete/awesomplete.css';
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/js/dropdown.js'
import './styles.css'

import DataLoader from './data';
import Dispatch from './Dispatcher';
import Arc from './Arc';
import Scales from './Scales';
import StationsList from './Stations';
import Mouse from './Mouse';

let graphics = Arc();
let scales = Scales();
let dispatch = Dispatch()
	.on('updateTime', times => {
		let startTime = times.start;
		let endTime = times.end;
		console.log(startTime, endTime);
	});

dispatch();
// let mouse = Mouse();


// ** ------- DataLoader() ------- **
let cf;
let data = DataLoader()
	.on('error', err => { console.log(err); })

	.on('loaded', data => { //anything below only happens after data has been loaded
		let alltrips = data.trip1.concat(data.trip2);
		let stationData = data.stations;
		let stationInputs = StationsList(stationData)
			.on('stationTrig', inputVal => {
			console.log(inputVal);

			let filtered = alltrips.filter(d => {
				if (inputVal.startStation == ''){
					return d.endStn === inputVal.endStation;
				} else if (inputVal.endStation == ''){
					return d.startStn === inputVal.startStation;
				} else {
				return d.startStn === inputVal.startStation && d.endStn === inputVal.endStation;
				}
			});
			filtered.forEach((d, i) => {d.lvl = i} );
			d3.select('#canvas').datum(filtered).call(graphics);
		});

		stationInputs();

	// Filter data by any pair of stations -- CROSSFILTER NOT WORKING SEE BELOW --
	let filtered = alltrips.filter(d => {
		return d.startStn === 'University Park' && d.endStn === 'MIT at Mass Ave / Amherst St' ;
	});

	// setting the time of each trip to "today" + specified hour:min:sec from data
	filtered.forEach((d, i) => {d.lvl = i} );

	console.log(filtered);


	d3.select('#canvas').datum(filtered).call(graphics);
	d3.select('#scales').datum([0]).call(scales);

	});

// ** ------- DATA QUERY ------- **
data();
