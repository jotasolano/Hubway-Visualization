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
let control = d3.map()

control.set('startStation', '');
control.set('endStation', '');
control.set('firstHour', 0);
control.set('lastHour', 12);


//FIXIT THIS CONDITIONAL DOES NOT WORK (SEE CONSOLE LOG)
function redraw(array){

	// let filtered = array;
	console.log(control.get('startStation'));

	array.filter(function(d){
		if(control.get('firstHour') == 0){
			if (control.get('startStation') == ''){
				return d.endStn === control.get('endStation') && d.startTime < 13;
			} else if (control.get('endStation') == ''){
				return d.startStn === control.get('startStation') && d.startTime < 13;
			} else {
			return d.startStn === control.get('startStation') && d.endStn === control.get('endStation') && d.startTime < 13;
			}
		}


	})
	console.log('control', array);
	return array;

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
			let stat = control.get('startStation')
		})

		let stationInputs = StationsList(stationData)
			.on('stationTrig', inputVal => {
				control.set('startStation', inputVal.startStation);
				control.set('endStation', inputVal.endStation);
				control.set('firstHour', 0);
				
				// FIXIT: THIS LINE DOES NOT FILTER PROPERLY (SEE FUNCTION)
				let filtered = redraw(alltrips);

				// FIXIT: THIS BLOCK DOES FILTER PROPPERLY
				// let filtered = alltrips.filter(d => {
				// 	if (inputVal.startStation == ''){
				// 		return d.startTime < 13 && d.endStn === inputVal.endStation;
				// 	} else if (inputVal.endStation == ''){
				// 		return d.startTime < 13 && d.startStn === inputVal.startStation;
				// 	} else {
				// 	return d.startTime < 13 && d.startStn === inputVal.startStation && d.endStn === inputVal.endStation;
				// 	}
				// })



				filtered.forEach((d, i) => {d.lvl = i} );
				d3.select('#canvas').datum(filtered).call(graphics);
			});

		stationInputs();

	// Initual drawing
	let filtered = alltrips.filter(d => {
		return d.startStn === 'University Park' && d.endStn === 'MIT at Mass Ave / Amherst St' ;
	});
	filtered.forEach((d, i) => {d.lvl = i} );
	d3.select('#canvas').datum(filtered).call(graphics);
	d3.select('#scales').datum([0]).call(scales);

	});

// ** ------- DATA QUERY ------- **
data();
