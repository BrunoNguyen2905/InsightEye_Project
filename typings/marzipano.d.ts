declare module "marzipano" {
  namespace Marzipano {
    export interface IAsset {
      width(): number;
      height(): number;
      element(): HTMLElement;
      timestamp(): number;
      destroy(): void;
    }

    export class SingleAssetSource {
      constructor(asset: IAsset);
    }
    export interface IViewerOption {
      stageType: "webgl";
    }
    export class Scene {
      public switchTo(): void;
    }

    export class Controls {
      public registerMethod(
        name: string,
        method: ElementPressControlMethod,
        status: boolean
      ): void;
    }
    export class Viewer {
      constructor(pano: HTMLDivElement, opt: IViewerOption);

      public createScene(opt: {
        source: SingleAssetSource;
        geometry: EquirectGeometry;
        view: RectilinearView;
      }): Scene;
      public view(): RectilinearView;
      public lookTo(coor: any, opts: any): void;
      public controls(): Controls;
    }

    export class ElementPressControlMethod {
      constructor(
        pano: HTMLDivElement,
        position: string,
        velocity: number,
        friction: number
      );
    }
    export const dependencies: {
      eventEmitter: (asset: new (name: any) => IAsset) => void;
    };

    export class EquirectGeometry {
      constructor(arrs: Array<{ width: number }>);
    }
    export class RectilinearView {
      public static limit: {
        vfov(first: number, snd: number): number;
        traditional(first: number, snd: number): number;
      };

      constructor(opt: { fov: number }, limiter: number);
      public screenToCoordinates(screen: { x: number; y: number }): any;
      public fov(): number;
      public width(): number;
      public height(): number;
      setParameters(opt: { fov: number }): void;
      setFov(fov: number): void;
      offsetFov(offsetFov: number): void;
    }
  }

  export default Marzipano;
}
