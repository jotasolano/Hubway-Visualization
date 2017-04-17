/************************************
// ** ------- DEPENDENCIES ------- **
************************************/

import * as d3 from 'd3';
let crossfilter = require('crossfilter'); //CommonJS
let Awesomplete = require('awesomplete');
let $ = require('jquery');

import 'awesomplete/awesomplete.css';
import 'bootstrap/dist/css/bootstrap.css'
import './styles.css'

import DataLoader from './data';
import Arc from './Arc';
import Scales from './Scales';
import StationsList from './Stations';
import Mouse from './Mouse';


/************************************
// ** ------- INIT --------------- **
************************************/

let dis = d3.dispatch('timeUpdate', 'hourUpdate');
let graphics = Arc();

let scales = Scales()
	.on('mouseOver', times => {
		let startTime = times.start;
		let endTime = times.end;

		dis.call('hourUpdate', null, {start: startTime, end: endTime });
		console.log(startTime, endTime);
	});

d3.select('#btn-morning').on('click', function(d) {
	dis.call('timeUpdate', null, {hourStart: 0, hourEnd: 12});
})


/************************************
// ** ------- CONTROLLER --------- **
************************************/
let controller = d3.map()

controller.set('startStation', '');
controller.set('endStation', '');
controller.set('firstHour', 0);
controller.set('lastHour', 12);

console.log(controller);


// function redraw(pars){
// 	// if stateOfTheApp's time_range is set then filter data by the time range, if not filterdata = data
// 	// filter filtreed data based on start/end stations


// 	const array = pars.array;
// 	const startStation = pars.startStation;
// 	const endStation = pars.endStation;
// 	const firstHour = pars.firstHour;
// 	const lastHour = pars.lastHour;


// 	let filtered = array.filter(d => {
// 		if (startStation == ''){
// 			return d.endStn === endStation;
// 		} else if (endStation == ''){
// 			return d.startStn === startStation;
// 		} else {
// 		return d.startStn === startStation && d.endStn === endStation;
// 		}
// 	})

// 	filtered = array.filter(d => {return d.startTime >= firstHour && d.endTime <= lastHour})

// 	console.log('redraw:hours', filtered.length);


// 	console.log('redraw:stations', filtered.length);
// }


function redraw(){
	console.log(controller$startStation);
}


/************************************
// ** ------- DATA LOADER -------- **
************************************/

let data = DataLoader()
	.on('error', err => { console.log(err); })

	.on('loaded', data => { //anything below only happens after data has been loaded
		let alltrips = data.trip1.concat(data.trip2);
		let stationData = data.stations;

		dis.on('timeUpdate', data => { 
			let stat = controller.get('startStation')

			// redraw({array: alltrips, firstHour: 0, lastHour: 12}); 
		})

		let stationInputs = StationsList(stationData)
			.on('stationTrig', inputVal => {
				// redraw({array: alltrips, startStation: inputVal.startStation, endStation: inputVal.endStation});
				controller.get('startStation');

				redraw();

				let filtered = alltrips.filter(d => {
					if (inputVal.startStation == ''){
						return d.endStn === inputVal.endStation;
					} else if (inputVal.endStation == ''){
						return d.startStn === inputVal.startStation;
					} else {
					return d.startStn === inputVal.startStation && d.endStn === inputVal.endStation;
					}
				})

			filtered.forEach((d, i) => {d.lvl = i} );

			

			// redraw()
			d3.select('#canvas').datum(filtered).call(graphics);

			console.log('normal', filtered.length)
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
