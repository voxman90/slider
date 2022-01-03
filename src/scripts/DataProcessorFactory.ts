import DataProcessor from "./DataProcessor";
import DataProcessorForSet from "./DataProcessorForSet";
import { Configuration } from "./Types";

function DataProcessorFactory(config: Partial<Configuration>): DataProcessor {
  const type = config.type;
  switch (type) {
    case "range": {
      // return new DataProcessorForRange(config);
    }
    case "set": {
      return new DataProcessorForSet(config);
    }
    default: {
      throw Error(`Invalid value of the 'type' property: ${type}`);
    }
  }
}

export default DataProcessorFactory;
