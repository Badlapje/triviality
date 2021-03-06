import { triviality } from '../../src';
import { LogFeature } from '../singleton/LogFeature';
import { HalloFeature } from './HalloFeature';

triviality()
  .add(LogFeature)
  .add(HalloFeature)
  .build()
  .then((container) => {
    const service = container.halloService('John');
    service.speak();
  });
