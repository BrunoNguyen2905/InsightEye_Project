import { combineReducers } from "redux";

import { ICameraLayout } from "../types/Layout";
import icon1 from "src/assets/grid-icons/grid-icon-1.png";
import icon4 from "src/assets/grid-icons/grid-icon-4.png";
import icon6 from "src/assets/grid-icons/grid-icon-6.png";
import icon7 from "src/assets/grid-icons/grid-icon-7.png";
import icon9 from "src/assets/grid-icons/grid-icon-9.png";
import icon10 from "src/assets/grid-icons/grid-icon-10.png";
import icon12 from "src/assets/grid-icons/grid-icon-12.png";
import icon13 from "src/assets/grid-icons/grid-icon-13.png";
import icon15 from "src/assets/grid-icons/grid-icon-15.png";
import icon16 from "src/assets/grid-icons/grid-icon-16.png";
import icon20 from "src/assets/grid-icons/grid-icon-20.png";
import icon26 from "src/assets/grid-icons/grid-icon-26.png";
import { IShowDialog } from "../actions/LayoutDialog";
import { SHOW_CAMERA_LAYOUT } from "../../../constants";
const listLayouts = [
  {
    quantity: 1,
    srcImg: icon1,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "12x12"
      }
    ]
  },
  {
    quantity: 4,
    srcImg: icon4,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "6x6"
      },
      {
        x: 0,
        y: 6,
        s: "6x6"
      },
      {
        x: 6,
        y: 6,
        s: "6x6"
      }
    ]
  },
  {
    quantity: 6,
    srcImg: icon6,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "8x8"
      },
      {
        x: 8,
        y: 0,
        s: "4x4"
      },
      {
        x: 8,
        y: 4,
        s: "4x4"
      },
      {
        x: 0,
        y: 8,
        s: "4x4"
      },
      {
        x: 4,
        y: 8,
        s: "4x4"
      },
      {
        x: 8,
        y: 8,
        s: "4x4"
      }
    ]
  },
  {
    quantity: 7,
    srcImg: icon7,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "3x3"
      },
      {
        x: 9,
        y: 0,
        s: "3x3"
      },
      {
        x: 6,
        y: 3,
        s: "3x3"
      },
      {
        x: 9,
        y: 3,
        s: "3x3"
      },
      {
        x: 0,
        y: 6,
        s: "6x6"
      },
      {
        x: 6,
        y: 6,
        s: "6x6"
      }
    ]
  },
  {
    quantity: 9,
    srcImg: icon9,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "4x4"
      },
      {
        x: 4,
        y: 0,
        s: "4x4"
      },
      {
        x: 8,
        y: 0,
        s: "4x4"
      },
      {
        x: 0,
        y: 4,
        s: "4x4"
      },
      {
        x: 4,
        y: 4,
        s: "4x4"
      },
      {
        x: 8,
        y: 4,
        s: "4x4"
      },
      {
        x: 0,
        y: 8,
        s: "4x4"
      },
      {
        x: 4,
        y: 8,
        s: "4x4"
      },
      {
        x: 8,
        y: 8,
        s: "4x4"
      }
    ]
  },
  {
    quantity: 10,
    srcImg: icon10,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "3x3"
      },
      {
        x: 9,
        y: 0,
        s: "3x3"
      },
      {
        x: 6,
        y: 3,
        s: "3x3"
      },
      {
        x: 9,
        y: 3,
        s: "3x3"
      },
      {
        x: 0,
        y: 6,
        s: "6x6"
      },
      {
        x: 6,
        y: 6,
        s: "3x3"
      },
      {
        x: 9,
        y: 6,
        s: "3x3"
      },
      {
        x: 6,
        y: 9,
        s: "3x3"
      },
      {
        x: 9,
        y: 9,
        s: "3x3"
      }
    ]
  },
  {
    quantity: 12,
    srcImg: icon12,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "6x6"
      },
      {
        x: 0,
        y: 6,
        s: "6x6"
      },
      {
        x: 6,
        y: 6,
        s: "2x2"
      },
      {
        x: 8,
        y: 6,
        s: "2x2"
      },
      {
        x: 10,
        y: 6,
        s: "2x2"
      },
      {
        x: 6,
        y: 8,
        s: "2x2"
      },
      {
        x: 8,
        y: 8,
        s: "2x2"
      },
      {
        x: 10,
        y: 8,
        s: "2x2"
      },
      {
        x: 6,
        y: 10,
        s: "2x2"
      },
      {
        x: 8,
        y: 10,
        s: "2x2"
      },
      {
        x: 10,
        y: 10,
        s: "2x2"
      }
    ]
  },
  {
    quantity: 13,
    srcImg: icon13,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "3x3"
      },
      {
        x: 9,
        y: 0,
        s: "3x3"
      },
      {
        x: 6,
        y: 3,
        s: "3x3"
      },
      {
        x: 9,
        y: 3,
        s: "3x3"
      },
      {
        x: 0,
        y: 6,
        s: "3x3"
      },
      {
        x: 3,
        y: 6,
        s: "3x3"
      },
      {
        x: 6,
        y: 6,
        s: "3x3"
      },
      {
        x: 9,
        y: 6,
        s: "3x3"
      },
      {
        x: 0,
        y: 9,
        s: "3x3"
      },
      {
        x: 3,
        y: 9,
        s: "3x3"
      },
      {
        x: 6,
        y: 9,
        s: "3x3"
      },
      {
        x: 9,
        y: 9,
        s: "3x3"
      }
    ]
  },
  {
    quantity: 15,
    srcImg: icon15,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "6x6"
      },
      {
        x: 0,
        y: 6,
        s: "3x3"
      },
      {
        x: 3,
        y: 6,
        s: "3x3"
      },
      {
        x: 0,
        y: 9,
        s: "3x3"
      },
      {
        x: 3,
        y: 9,
        s: "3x3"
      },
      {
        x: 6,
        y: 6,
        s: "2x2"
      },
      {
        x: 8,
        y: 6,
        s: "2x2"
      },
      {
        x: 10,
        y: 6,
        s: "2x2"
      },
      {
        x: 6,
        y: 8,
        s: "2x2"
      },
      {
        x: 8,
        y: 8,
        s: "2x2"
      },
      {
        x: 10,
        y: 8,
        s: "2x2"
      },
      {
        x: 6,
        y: 10,
        s: "2x2"
      },
      {
        x: 8,
        y: 10,
        s: "2x2"
      },
      {
        x: 10,
        y: 10,
        s: "2x2"
      }
    ]
  },
  {
    quantity: 16,
    srcImg: icon16,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "3x3"
      },
      {
        x: 3,
        y: 0,
        s: "3x3"
      },
      {
        x: 6,
        y: 0,
        s: "3x3"
      },
      {
        x: 9,
        y: 0,
        s: "3x3"
      },
      {
        x: 0,
        y: 3,
        s: "3x3"
      },
      {
        x: 3,
        y: 3,
        s: "3x3"
      },
      {
        x: 6,
        y: 3,
        s: "3x3"
      },
      {
        x: 9,
        y: 3,
        s: "3x3"
      },
      {
        x: 0,
        y: 6,
        s: "3x3"
      },
      {
        x: 3,
        y: 6,
        s: "3x3"
      },
      {
        x: 6,
        y: 6,
        s: "3x3"
      },
      {
        x: 9,
        y: 6,
        s: "3x3"
      },
      {
        x: 0,
        y: 9,
        s: "3x3"
      },
      {
        x: 3,
        y: 9,
        s: "3x3"
      },
      {
        x: 6,
        y: 9,
        s: "3x3"
      },
      {
        x: 9,
        y: 9,
        s: "3x3"
      }
    ]
  },
  {
    quantity: 20,
    srcImg: icon20,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "6x6"
      },
      {
        x: 0,
        y: 6,
        s: "6x6"
      },
      {
        x: 6,
        y: 0,
        s: "2x2"
      },
      {
        x: 8,
        y: 0,
        s: "2x2"
      },
      {
        x: 10,
        y: 0,
        s: "2x2"
      },
      {
        x: 6,
        y: 2,
        s: "2x2"
      },
      {
        x: 8,
        y: 2,
        s: "2x2"
      },
      {
        x: 10,
        y: 2,
        s: "2x2"
      },
      {
        x: 6,
        y: 4,
        s: "2x2"
      },
      {
        x: 8,
        y: 4,
        s: "2x2"
      },
      {
        x: 10,
        y: 4,
        s: "2x2"
      },
      {
        x: 6,
        y: 6,
        s: "2x2"
      },
      {
        x: 8,
        y: 6,
        s: "2x2"
      },
      {
        x: 10,
        y: 6,
        s: "2x2"
      },
      {
        x: 6,
        y: 8,
        s: "2x2"
      },
      {
        x: 8,
        y: 8,
        s: "2x2"
      },
      {
        x: 10,
        y: 8,
        s: "2x2"
      },
      {
        x: 6,
        y: 10,
        s: "2x2"
      },
      {
        x: 8,
        y: 10,
        s: "2x2"
      },
      {
        x: 10,
        y: 10,
        s: "2x2"
      }
    ]
  },
  {
    quantity: 26,
    srcImg: icon26,
    tileData: [
      {
        x: 0,
        y: 0,
        s: "3x3"
      },
      {
        x: 3,
        y: 0,
        s: "3x3"
      },
      {
        x: 0,
        y: 3,
        s: "3x3"
      },
      {
        x: 3,
        y: 3,
        s: "3x3"
      },
      {
        x: 6,
        y: 6,
        s: "3x3"
      },
      {
        x: 9,
        y: 6,
        s: "3x3"
      },
      {
        x: 6,
        y: 9,
        s: "3x3"
      },
      {
        x: 9,
        y: 9,
        s: "3x3"
      },
      {
        x: 6,
        y: 0,
        s: "2x2"
      },
      {
        x: 8,
        y: 0,
        s: "2x2"
      },
      {
        x: 10,
        y: 0,
        s: "2x2"
      },
      {
        x: 6,
        y: 2,
        s: "2x2"
      },
      {
        x: 8,
        y: 2,
        s: "2x2"
      },
      {
        x: 10,
        y: 2,
        s: "2x2"
      },
      {
        x: 6,
        y: 4,
        s: "2x2"
      },
      {
        x: 8,
        y: 4,
        s: "2x2"
      },
      {
        x: 10,
        y: 4,
        s: "2x2"
      },
      {
        x: 0,
        y: 6,
        s: "2x2"
      },
      {
        x: 2,
        y: 6,
        s: "2x2"
      },
      {
        x: 4,
        y: 6,
        s: "2x2"
      },
      {
        x: 0,
        y: 8,
        s: "2x2"
      },
      {
        x: 2,
        y: 8,
        s: "2x2"
      },
      {
        x: 4,
        y: 8,
        s: "2x2"
      },
      {
        x: 0,
        y: 10,
        s: "2x2"
      },
      {
        x: 2,
        y: 10,
        s: "2x2"
      },
      {
        x: 4,
        y: 10,
        s: "2x2"
      }
    ]
  }
];

function listLayout(state: ICameraLayout[] = listLayouts): ICameraLayout[] {
  return state;
}

function showDialog(state: boolean = false, action: IShowDialog): boolean {
  switch (action.type) {
    case SHOW_CAMERA_LAYOUT:
      return action.payload;
  }
  return state;
}

export const layoutDialog = combineReducers({
  listLayout,
  showDialog
});
