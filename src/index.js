/************************************
// ** ------- DEPENDENCIES ------- **
************************************/

import * as d3 from 'd3';
let crossfilter = require('crossfilter'); //CommonJS
let Awesomplete = require('awesomplete');
let $ = require('jquery');
let _ = require('lodash');

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
// let graphics = Arc();

let graphicsMor = Arc()
	.startTime(0)
	.endTime(12);

let graphicsEve = Arc()
	.startTime(0)
	.endTime(12);

let scalesMor = Scales()
	.on('mouseOver', times => {
		let startTime = times.start;
		let endTime = times.end;

		dis.call('hourUpdate', null, {start: startTime, end: endTime });
		console.log(startTime, endTime);
	})
	.startTime(d3.range(1, 13, 1));

let scalesEve = Scales()
	.on('mouseOver', times => {
		let startTime = times.start;
		let endTime = times.end;

		dis.call('hourUpdate', null, {start: startTime, end: endTime });
		console.log(startTime, endTime);
	})
	.startTime(d3.range(13, 25, 1));

/************************************
// ** ------- CONTROLLER --------- **
************************************/
let control = d3.map()

control.set('startStation', '');
control.set('endStation', '');
control.set('firstHour', 0);
control.set('lastHour', 12);


d3.select('#btn-morning').on('click', function(d) {
	control.set('firstHour', 0)
	dis.call('timeUpdate', null, {});
	d3.select('#scales').datum([0]).call(scalesMor);
})

d3.select('#btn-evening').on('click', function(d) {
	control.set('firstHour', 13)
	dis.call('timeUpdate', null, {});
	d3.select('#scales').datum([0]).call(scalesEve);
})

function redraw(array){
	let filtered = [];

	if(control.get('firstHour') == 0){
		if (control.get('startStation') == ''){
			filtered = _.filter(array, function(d) { return d.endStn === control.get('endStation') && d.startTime < 12; })
			console.log('empty start', filtered);
			// return filtered;

		} else if (control.get('endStation') == ''){
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.startTime < 12; })
			console.log('empty end', filtered);
			// return filtered;

		} else {
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.endStn === control.get('endStation') && d.startTime < 12; })
			console.log('both', filtered);
			// return filtered;
		}

		filtered.forEach((d, i) => {d.lvl = i} );
		d3.select('#canvas').datum(filtered).call(graphicsMor);


	} else {
		if (control.get('startStation') == ''){
			filtered = _.filter(array, function(d) { return d.endStn === control.get('endStation') && d.startTime > 12; })
			console.log('empty start', filtered);
			// return filtered;

		} else if (control.get('endStation') == ''){
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.startTime > 12; })
			console.log('empty end', filtered);
			// return filtered;

		} else {
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.endStn === control.get('endStation') && d.startTime > 12; })
			console.log('both', filtered);
			// return filtered;
		}

		filtered.forEach((d, i) => {d.lvl = i} );
		d3.select('#canvas').datum(filtered).call(graphicsEve);
		d3.select('#scales').datum([0]).call(scalesEve);

	}
} // -> end of redraw
	

/************************************
// ** ------- DATA LOADER -------- **
************************************/

let data = DataLoader()
	.on('error', err => { console.log(err); })

	.on('loaded', data => { //anything below only happens after data has been loaded
		let alltrips = data.trip1.concat(data.trip2);
		let stationData = data.stations;

		dis.on('timeUpdate', data => { 
			// let filtered = redraw(alltrips);

			redraw(alltrips);

			// filtered.forEach((d, i) => {d.lvl = i} );
			// d3.select('#canvas').datum(filtered).call(graphics);
		})

		let stationInputs = StationsList(stationData)
			.on('stationTrig', inputVal => {
				control.set('startStation', inputVal.startStation);
				control.set('endStation', inputVal.endStation);
				// let filtered = redraw(alltrips);

				redraw(alltrips);
				// filtered.forEach((d, i) => {d.lvl = i} );
				// d3.select('#canvas').datum(filtered).call(graphics);
			});

		stationInputs();

	// Initual drawing
	let filtered = alltrips.filter(d => {
		return d.startStn === 'University Park' && d.endStn === 'MIT at Mass Ave / Amherst St' ;
	});
	filtered.forEach((d, i) => {d.lvl = i} );
	d3.select('#canvas').datum(filtered).call(graphicsMor);
	d3.select('#scales').datum([0]).call(scalesMor);

	});

// ** ------- DATA QUERY ------- **
data();
