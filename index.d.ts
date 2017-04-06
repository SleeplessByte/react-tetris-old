/// <reference types="react" />

interface PreloadableComponentClass<P> extends React.ComponentClass<P> {
  preload(): void
}

declare module 'react-loadable' {
  interface LoadableOptions {
    loader(): Promise<number>
    LoadingComponent: React.ReactNode,

    delay?: number,
    webpackRequireWeakId?: () => number
  }
  export default function Loadable<P>(opts: LoadableOptions): PreloadableComponentClass<P>
}

declare var System: any

declare namespace Chai {
  interface Assertion {
    type(val: string): Assertion
    type<P>(val: React.ComponentClass<P>): Assertion
  }
}
