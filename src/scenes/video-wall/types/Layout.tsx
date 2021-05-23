export interface ICameraLayout {
  quantity: number;
  srcImg: string;
  tileData: ITile[];
}

interface ITile {
  x: number;
  y: number;
  s: string;
}

export interface ICustomTile {
  x: number;
  y: number;
  h: number;
  w: number;
  id: number;
}
