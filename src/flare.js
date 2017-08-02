import Route53 from 'nice-route53';
import {argv} from 'yargs';
import IP from 'public-ip';
import Moment from 'moment';
import process from 'process';

if (!argv.accessKeyId) {
    console.log('Missing --accessKeyId parameter.');
    process.exit();
}

if (!argv.secretAccessKey) {
    console.log('Missing --secretAccessKey parameter.');
    process.exit();
}

if (!argv.list) {
    console.log('Missing --list parameter.');
    process.exit();
}

if (!argv.interval || isNaN(parseInt(argv.interval))) {
    console.log('Missing --interval parameter.');
    process.exit();
}

const api = new Route53({
    accessKeyId: argv.accessKeyId,
    secretAccessKey: argv.secretAccessKey
});

let OLD_IP = '';

const run = () => {
    console.log(`${Moment().format()} | Running flare....`);
    const zones = [];

    IP.v4().then(ip => {
        if (ip === OLD_IP) return console.log('IP the same.  Exiting...');
        OLD_IP = ip;

        (argv.list ? argv.list.split(',') : []).forEach(t => {
            const parts = t.split('.');
            const zone = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;

            let savedZone = zones.find(t => t.name === zone);
            if (!savedZone) {
                savedZone = {
                    name: zone,
                    records: []
                };
                zones.push(savedZone);
            }
            savedZone.records.push(t.startsWith('.') ? t.substring(1) : t);
        });

        zones.forEach(t => {
            api.zoneInfo(t.name, (err, zoneInfo) => {
                if (err) {
                    console.log(`Error: ${err.msg}`);
                    return process.exit();
                }

                api.records(zoneInfo.zoneId, (err, records) => {
                    if (err) {
                        console.log(`Error: ${err.msg}`);
                        return process.exit();
                    }

                    const aRecords = records.filter(t => t.type === 'A');
                    const uRecords = aRecords.filter(r => t.records.indexOf(r.name) >= 0);

                    uRecords.forEach(u => {
                        const recordIP = u.values.length > 0 ? u.values[0] : '';
                        if (recordIP === ip) return;

                        console.log(`Updating record ${u.name} from ${recordIP} to ${ip}`);
                        api.setRecord({
                            zoneId: zoneInfo.zoneId,
                            name: u.name,
                            type: 'A',
                            ttl: u.ttl,
                            values: [ip]
                        }, (err) => {
                            if (err) return console.log(`Could not update record ${u.name}: ${err}`);
                            console.log(`Record ${u.name} updated from ${recordIP} to ${ip}`);
                        })
                    });
                    console.log(`${Moment().format()} | Finished running flare.`)
                });
            });
        });
    });
};
run();
setInterval(run, parseInt(argv.interval * 1000 * 60));
process.on('SIGINT', () => process.exit());