## Atomic Design Pattern

"Atomic design is not a linear process, but rather a mental model to help us think of our user interfaces as both a cohesive whole and a collection of parts at the same time."

Examples:

https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology

https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97

### Atoms

Foundational building blocks that we find in the user interface. Atoms can be form labels, inputs, buttons and others than cannot be broken down any further without ceasing to be functional.

### Molecules

Simple groups of UI elements (or combination of atoms) that work as a unit. For example, a form label, search input, and button can join together to create a search form molecule.
This can be seen as simple components.

### Organisms

Relatively complex UI components composed of groups of molecules and/or atoms and other organisms.
The organisms form distinc sections of an interface, for example the header of a site.