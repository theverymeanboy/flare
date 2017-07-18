'use strict';

var _niceRoute = require('nice-route53');

var _niceRoute2 = _interopRequireDefault(_niceRoute);

var _yargs = require('yargs');

var _publicIp = require('public-ip');

var _publicIp2 = _interopRequireDefault(_publicIp);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!_yargs.argv.accessKeyId) {
	console.log('Missing --accessKeyId parameter.');
	process.exit();
}

if (!_yargs.argv.secretAccessKey) {
	console.log('Missing --secretAccessKey parameter.');
	process.exit();
}

if (!_yargs.argv.list) {
	console.log('Missing --list parameter.');
	process.exit();
}

if (!_yargs.argv.interval || isNaN(parseInt(_yargs.argv.interval))) {
	console.log('Missing --interval parameter.');
	process.exit();
}

var api = new _niceRoute2.default({
	accessKeyId: _yargs.argv.accessKeyId,
	secretAccessKey: _yargs.argv.secretAccessKey
});

var run = function run() {
	console.log((0, _moment2.default)().format() + ' | Running flare....');
	var zones = [];

	_publicIp2.default.v4().then(function (ip) {
		(_yargs.argv.list ? _yargs.argv.list.split(',') : []).forEach(function (t) {
			var parts = t.split('.');
			var zone = parts[parts.length - 2] + '.' + parts[parts.length - 1];

			var savedZone = zones.find(function (t) {
				return t.name === zone;
			});
			if (!savedZone) {
				savedZone = {
					name: zone,
					records: []
				};
				zones.push(savedZone);
			}
			savedZone.records.push(t.startsWith('.') ? t.substring(1) : t);
		});

		zones.forEach(function (t) {
			api.zoneInfo(t.name, function (err, zoneInfo) {
				if (err) {
					console.log('Error: ' + err.msg);
					return process.exit();
				}

				api.records(zoneInfo.zoneId, function (err, records) {
					if (err) {
						console.log('Error: ' + err.msg);
						return process.exit();
					}

					var aRecords = records.filter(function (t) {
						return t.type === 'A';
					});
					var uRecords = aRecords.filter(function (r) {
						return t.records.indexOf(r.name) >= 0;
					});

					uRecords.forEach(function (u) {
						var recordIP = u.values.length > 0 ? u.values[0] : '';
						if (recordIP === ip) return;

						console.log('Updating record ' + u.name + ' from ' + recordIP + ' to ' + ip);
						api.setRecord({
							zoneId: zoneInfo.zoneId,
							name: u.name,
							type: 'A',
							ttl: u.ttl,
							values: [ip]
						}, function (err) {
							if (err) return console.log('Could not update record ' + u.name + ': ' + err);
							console.log('Record ' + u.name + ' updated from ' + recordIP + ' to ' + ip);
						});
					});
					console.log((0, _moment2.default)().format() + ' | Finished running flare.');
				});
			});
		});
	});
};
run();
setInterval(run, parseInt(_yargs.argv.interval * 1000 * 60));
