import { type DependencyInjectionContainer } from './dependencyInjectionContainer.ts';

export interface DependencyInjectionModule {
  declareBindings(container: DependencyInjectionContainer): void;
}
