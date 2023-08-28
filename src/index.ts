import { BrokerAsPromised, BrokerConfig, ConnectionConfig, withDefaultConfig } from 'rascal';

export class RascalTest {
    private _broker: BrokerAsPromised;

    get brocker(): BrokerAsPromised {
        return this._broker;
    }

    async init () {
        this._broker = await BrokerAsPromised.create(this.getBrockerConfig());
    }



    protected getBrockerConfig (): BrokerConfig {
        const url = new URL(`amqp://localhost:5672`);
        const connectionConfig: ConnectionConfig = {
            slashes: true,
            protocol: url.protocol,
            hostname: url.hostname,
            user: url.username,
            password: url.password,
            port: Number(url.port),
            vhost: url.pathname.replace(/^\//, ''),
            retry: {
                min: 1000,
                max: 60000,
                factor: 2,
                strategy: 'exponential',
            },
            options: {
                heartbeat: 10,
            },
        };
        const definitions: BrokerConfig = {
            vhosts: {
                'scripts': {
                    connection: connectionConfig,
                    queues: ['scripts.default'],
                },
            },
            subscriptions: {
                'scripts': {
                    prefetch: 10,
                    recovery: true,
                    queue: 'scripts.default',
                    vhost: 'scripts',
                }
            },
        };

        return definitions;
    }
}
