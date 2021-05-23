// import * as React from "react";
// import FloatingVideo from "../../containers/video/FloatingVideo";
// import IFloatingVideo from "../../types/FloatingVideo";

// export interface IProps {
//   listFloatingVideo: IFloatingVideo[];
// }

// class FloatingVideoManagement extends React.Component<IProps, any> {
//   public render() {
//     const { listFloatingVideo } = this.props;
//     return (
//       <div>
//         {listFloatingVideo.map(element => {
//           return (
//             <div key={element.index}>
//               {element.index && (
//                 <FloatingVideo
//                   uuid={element.index}
//                   src={element.src}
//                   name={element.name}
//                 />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     );
//   }
// }

// export default FloatingVideoManagement;
