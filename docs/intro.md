# Triviality !heading

Your application is full of useful objects: a "HttpClient"
object might help you send requests while another object might
help you save things to some storage. Almost everything that your
application "does" is actually done by one of these objects.

In Triviality, these useful objects are called services and
each service lives inside a very special object
called the service container. The approach how a service is constructed and configured
is the definition of the service or in short the service definition.
The container allows you to centralize the way objects are constructed.
It makes your life easier, promotes a strong architecture. It’s
a design pattern aiming to make high-level code reusable.

## Why Triviality as a ServiceContainer !heading

Triviality is inspired by the idea that non-trival issues should not
take your precious time and **infect** your application code. **Triviality** highly aims to keep away from your application code.
By separating the service definition from usage. **No magic** injection with tokens and/or annotations whatsoever. It will use your application code
as a **strictly typed interface** to assure everything is connected properly.

> Parkinson's law of triviality is C. Northcote Parkinson's 1957 argument
that members of an organization give disproportionate weight to trivial issues.
Parkinson provides the example of a fictional committee whose job was
to approve the plans for a nuclear power plant spending the majority
of its time on discussions about relatively minor but easy-to-grasp issues,
such as what materials to use for the staff bike shed, while neglecting the proposed
design of the plant itself, which is far more important and a
far more difficult and complex task.

### Typescript to the rescue !heading

Triviality uses the full power of Typescript to ensure the ServiceContainer
is connected properly before your application code even has executed.

> It's not required to use Typescript to use Triviality, but it's highly recommended.

## Features !heading

Triviality by its core is split into features. Each feature has his own services definitions
so it can serve it's unique and there separate logic.
A feature is defined as a class.

######typescript "example/features/LogFeature.ts"

As you can see a feature class has functions. The function name is the service name. The function is the service factory implementation. Before we can call the service from the container
we need to build it:   

######typescript "example/features/LogFeatureContainer.ts"

Now we can fetch the 'logger' service from the container and start using it. In the build step of the container, function results will be memorized and can be threaded as a 
singleton based on the service factory arguments. For example, create a service with a single service factory argument:

######typescript "example/singleton/LogFeature.ts"

The logger service function and the 'prefixedLogger' functions will always return the same instance for the same arguments. 

######typescript "example/singleton/LogFeatureContainer.ts"

######ts-node "example/singleton/LogFeatureContainer.ts"

___

The container service function types are inherited from the Feature.
This gives typescript the option to **strictly type check** if everything is connected properly. 
And you the benefits of **code completion** and the option to quickly traverse the service chain.
___

We can inject the Feature with a Container that has multiple Feature dependencies ```Container<...Feature>```.
Let's put the type checking to the test, we create a nice feature that dependence on the 'LogFeature'.

######typescript "example/featureDependency/HalloFeature.ts"

Build the container with missing 'LogFeature' dependency:

######typescript "example/featureDependency/HalloFeatureErrorContainer.ts.example"

If you forget a feature you see a nice error of typescript in your IDE.

    Error:(6, 8) TS2345: Argument of type 'typeof HalloFeature' is not assignable to parameter of type 'FeatureConstructor<HalloFeature, {}>'.
      Types of parameters 'container' and 'container' are incompatible.
        Property 'logger' is missing in type '{}' but required in type 'Readonly<Pick<LogFeature, "logger">>'.

Let's fix the container by adding the LogFeature:

######typescript "example/featureDependency/HalloFeatureContainer.ts"
######ts-node "example/featureDependency/HalloFeatureContainer.ts"

## Registers !heading

Registers are a collection of services so another feature can use the registered services without knowing about anything about the other feature.

Let's create a register for 'console commands'

######typescript "example/registries/ConsoleFeature.registerOnly.ts"

As a feature, the 'registries' return value is an object with functions. The object property name represents the registry name.
The implementation returns the services that need to be added to the registry. It's possible to add a registry to multiple feature. In the next examples, both feature return one command service inside the registry function.
 
######typescript "example/registries/Command/HalloConsoleFeature.ts"

######typescript "example/registries/Command/ByeConsoleFeature.ts"

Multiple feature can define the registry. The implementation needs to match between feature otherwise typescript will assist you with strict type checking.
During the container build phase, the registries will be combined. 

######typescript "example/registries/ConsoleFeature.ts"

Now we can combine the different command feature and build the container.

######typescript "example/registries/console.ts"

######ts-node "example/registries/console.ts"(hallo john)
######ts-node "example/registries/console.ts"(bye john)

You can also fetch all registries from the container

!["containerRegistries"](./example/registries/containerRegistries.png)

## Setup !heading

The build step returns a single promise, Each feature can have its own specific setup
task. The feature can check if everything is configured properly or connect to external service like a database.

######typescript "example/setup/DatabaseFeature.ts"

Add a catch function to gracefully handle errors

######typescript "example/setup/bootstrap.ts"

######ts-node "example/setup/bootstrap.ts"

## Service overrides & decorators !heading

If you use an external feature, maybe you want to override some services. For example, we start with the following greetings feature:

######typescript "example/overrides/GreetingsFeature.ts"

When we run 

######typescript "example/overrides/bootstrapGreetingsFeature.ts"

We get:

######ts-node "example/overrides/bootstrapGreetingsFeature.ts"

### Overriding a service !heading

If we want to use a different way to greet we need to override the 'greetingService'

######typescript "example/overrides/FormalGreetingsFeature.ts"
######typescript "example/overrides/bootstrapFormalGreetingsFeature.ts"

Now the original 'greetingService' service is overridden for the hole application. If we now run the example we get the following result: 

######ts-node "example/overrides/bootstrapFormalGreetingsFeature.ts"

### Decorating a service !heading

If we still we to use the original service from the container. We can fetch the original service from the 'serviceOverrides' container argument.
 
Let's be less formal by screaming the sentence: 

######typescript "example/overrides/services/ScreamGreetingsService.ts"
######typescript "example/overrides/ScreamGreetingsFeature.ts"
######typescript "example/overrides/bootstrapScreamGreetingsFeature.ts"

Now the original 'greetingService' service is overridden and we get:

######ts-node "example/overrides/bootstrapScreamGreetingsFeature.ts"
