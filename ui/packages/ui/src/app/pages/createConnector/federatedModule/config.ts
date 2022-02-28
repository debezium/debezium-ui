import { DebeziumConfigurator } from './DebeziumConfigurator';

const config = {
  steps: ['Connection', 'Filter definition', 'Data options', 'Runtime options'],
  Configurator: DebeziumConfigurator,
};

export default config;
