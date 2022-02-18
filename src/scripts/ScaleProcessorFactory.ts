import { Config } from "common/types/types";

import ScaleProcessorForRange from "./ScaleProcessorForRange";
import ScaleProcessorForSet from "./ScaleProcessorForSet";

function ScaleProcessorFactory(config: Partial<Config>): ScaleProcessorForRange | ScaleProcessorForSet {
  const type = config.type;
  switch (type) {
    case "range": {
      return new ScaleProcessorForRange(config);
    }
    case "set": {
      return new ScaleProcessorForSet(config);
    }
    default: {
      throw Error(`Invalid value of the 'type' property: ${type}`);
    }
  }
}

export default ScaleProcessorFactory;
