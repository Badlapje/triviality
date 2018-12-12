# Table of Contents

* [Triviality](#triviality)
* [Installation](#installation)
* [Thanks](#thanks)
* [Reads](#reads)


# Triviality

Dependency Injection is all about code reusability. 
It’s a design pattern aiming to make high-level code reusable, 
by separating the object creation / configuration from usage. **Triviality** highly aims to keep away from your application code. 
**No magic** injection with tokens, annotations whatsoever. It will use your application code 
as **strictly typed interface** to assure everything is connected properly. 


```typescript
import { Container, ContainerFactory, Module } from 'triviality';
import { LoggerInterface } from './docs/Example/LoggerInterface';
import { HalloService } from './docs/Example/HalloService';

class LogModule implements Module {
  public logger(): LoggerInterface {
    return console;
  }
}

class HalloWorldModule implements Module {

  constructor(private container: Container<LogModule>) {
  }

  public halloService() {
    return new HalloService(this.container.logger());
  }

}

ContainerFactory
  .add(LogModule)
  .add(HalloWorldModule)
  .build()
  .then((container) => {
    container.halloService().hallo('World');
  });

```
        

# Installation

To install the stable version:

```
yarn add triviality
```

This assumes you are using [yarn](https://yarnpkg.com) as your package manager.

or 

```
npm install triviality
```

# Thanks

Special thanks to:

* Eric Pinxteren
* Wessel van der Linden

# Reads

Triviality is inspired by [disco](https://github.com/bitExpert/disco) without the annotations.

