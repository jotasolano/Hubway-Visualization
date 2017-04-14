import {queue, csv, dispatch} from 'd3';

function DataLoader(){
	let q = queue();
	let dis = dispatch('loaded', 'error');

	function parseTrips(d){
		return {
			bike_nr:d.bikeid,
			duration:+d.tripduration,
			startStn:d['start station name'],
			startStnId:d['start station id'],
			startTime:parseTime(d.starttime),
			endStn:d['end station name'],
			endStnId:d['end station id'],
			endTime:parseTime(d.stoptime),
			userType:d.usertype,
			userGender:d.gender?d.gender:undefined,
			userBirthdate:+d['birth year']?+d['birth year']:undefined
		};
	}

	function parseStations(d){
		return {
			name:d.Station,
			id:d['Station ID'],
			lngLat:[+d.Longitude,+d.Latitude],
			city:d.Municipality
		};
	}

	function parseTime(timeStr){ //2016-01-01 00:08:07
		var time = timeStr.split(' ')[1].split(':'),
			hour = +time[0],
			min = +time[1],
			sec = +time[2];
		return (hour + min/60 + sec/3600);
	}

	function exports(){
		q
			.defer(csv, '../data/201601-hubway-tripdata.csv',parseTrips)
			.defer(csv, '../data/201602-hubway-tripdata.csv',parseTrips)
			.defer(csv, '../data/2016_0429_Hubway_Stations.csv',parseStations)
			.await((err, trip1, trip2, stations)=>{
				if (err){
					dis.call('error', null, Error(err));
					return; //break
				}
				dis.call('loaded', null, {trip1: trip1, trip2: trip2, stations: stations});
			});
	}

	exports.on = function(event, callback){
		dis.on(event, callback);
		// dis.on.apply(dis, arguments);
		return this; //this = exports
	}

	return exports;
}

export default DataLoader;