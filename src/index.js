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

/************************************
// ** ------- INIT --------------- **
************************************/

let dis = d3.dispatch('timeUpdate', 'hourUpdate', 'showCount', 'test');

let graphicsMor = Arc()
	.startTime(0)
	.endTime(12)
	.on('countTrips', d => {
		// scalesMor
		dis.call('showCount', null, d);
		console.log('this is the data', d)
	});

let graphicsEve = Arc()
	.startTime(0)
	.endTime(12);

let mor = d3.range(1, 13, 1);
let eve = d3.range(13, 25, 1);

let scalesMor = Scales()
	.on('mouseOver', times => {
		let startTime = times.start;
		let endTime = times.end;

		dis.call('hourUpdate', null, {start: startTime, end: endTime });
	})
	.startTime(mor)

let scalesEve = Scales()
	.on('mouseOver', times => {
		let startTime = times.start;
		let endTime = times.end;

		dis.call('hourUpdate', null, {start: startTime, end: endTime });
	})
	.startTime(eve);

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
	d3.select('#scales').datum(mor).call(scalesMor);
})

d3.select('#btn-evening').on('click', function(d) {
	control.set('firstHour', 13)
	dis.call('timeUpdate', null, {});
	d3.select('#scales').datum(eve).call(scalesEve);
})

function redraw(array){
	let filtered = [];
	let numTrips;

	if(control.get('firstHour') == 0){
		if (control.get('startStation') == ''){
			filtered = _.filter(array, function(d) { return d.endStn === control.get('endStation') && d.startTime < 12; })

		} else if (control.get('endStation') == ''){
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.startTime < 12; })

		} else {
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.endStn === control.get('endStation') && d.startTime < 12; })
		}

		filtered.forEach((d, i) => {d.lvl = i, d.hour = Math.floor(d.startTime)} );
		d3.select('#canvas').datum(filtered).call(graphicsMor);
		d3.select('#scales').datum(mor).call(scalesMor);

		dis.on('hourUpdate', d => {
			let startHour = d.start;
			let endHour = d.end;
			numTrips = _.filter(filtered, function(d) { return d.startTime >= startHour && d.startTime <= endHour; })
			let disc = d3.select("#numbersUpdate")
			disc.select("text").html("")
			disc.select("text").html(numTrips.length + ' trips')
		});


	} else {
		if (control.get('startStation') == ''){
			filtered = _.filter(array, function(d) { return d.endStn === control.get('endStation') && d.startTime > 12; })

		} else if (control.get('endStation') == ''){
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.startTime > 12; })

		} else {
			filtered = _.filter(array, function(d) { return d.startStn === control.get('startStation') && d.endStn === control.get('endStation') && d.startTime > 12; })
			
		}

		filtered.forEach((d, i) => {d.lvl = i, d.hour = Math.floor(d.startTime)} );
		d3.select('#canvas').datum(filtered).call(graphicsEve);
		d3.select('#scales').datum(eve).call(scalesEve);

		dis.on('hourUpdate', d => {
			let startHour = d.start;
			let endHour = d.end;
			numTrips = _.filter(filtered, function(d) { return d.startTime >= startHour && d.startTime <= endHour; })
			let disc = d3.select("#numbersUpdate")
			disc.select("text").html("")
			disc.select("text").html(numTrips.length + ' trips')
		});

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
		redraw(alltrips)

	// Initual drawing
	// let filtered = alltrips.filter(d => {
	// 	return d.startStn === 'University Park' && d.endStn === 'MIT at Mass Ave / Amherst St' ;
	// });
	// filtered.forEach((d, i) => {d.lvl = i} );
	// d3.select('#canvas').datum(filtered).call(graphicsMor);
	// d3.select('#scales').datum([0]).call(scalesMor);

	});

// ** ------- DATA QUERY ------- **
data();
