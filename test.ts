function ClassMethodDecorator(
  serviceName: string,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const now = new Date();

    console.log(`[${now.toISOString()}] - ${serviceName}/${methodName} called`);

    return originalMethod.apply(this, args);
  };

  return descriptor;
}

function decorateAllMethods<T extends { new (...args: any[]): {} }>(
  serviceName: string,
  classConstructor: T
) {
  Object.getOwnPropertyNames(classConstructor.prototype).forEach(
    (methodName) => {
      if (methodName === 'constructor') return;

      const descriptor = Object.getOwnPropertyDescriptor(
        classConstructor.prototype,
        methodName
      );
      if (descriptor && typeof descriptor.value === 'function') {
        Object.defineProperty(
          classConstructor.prototype,
          methodName,
          ClassMethodDecorator(serviceName, methodName, descriptor)
        );
      }
    }
  );
}

// Exemple de classe
class C {
  hello() {
    console.log('hello');
  }

  greetings() {
    console.log('greetings');
  }
}

// Décorer toutes les méthodes de la classe C
decorateAllMethods('caca', C);

const c = new C();
c.greetings();
c.hello();
