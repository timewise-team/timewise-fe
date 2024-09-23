// "use client";
// import * as React from "react";
// import {
//   ScheduleComponent,
//   Day,
//   Week,
//   WorkWeek,
//   Month,
//   Agenda,
//   EventRenderedArgs,
//   Inject,
//   Resize,
//   DragAndDrop,
// } from "@syncfusion/ej2-react-schedule";
// import { extend } from "@syncfusion/ej2-base";

// const applyCategoryColor = (args: EventRenderedArgs, currentView: string) => {
//   let eventColor: string = args.data.CategoryColor as string;
//   if (!args.element || !eventColor) {
//     return;
//   }
//   if (currentView === "Agenda") {
//     (args.element.firstChild as HTMLElement).style.borderLeftColor = eventColor;
//   } else {
//     args.element.style.backgroundColor = eventColor;
//   }
// };

// const dataSource = [
//   {
//     Id: 1,
//     Subject: "Explosion of Betelgeuse Star",
//     StartTime: new Date(2021, 1, 15, 9, 30),
//     EndTime: new Date(2021, 1, 15, 11, 0),
//     CategoryColor: "#1aaa55",
//   },
//   {
//     Id: 2,
//     Subject: "Thule Air Crash Report",
//     StartTime: new Date(2021, 1, 15, 12, 0),
//     EndTime: new Date(2021, 1, 15, 14, 0),
//     CategoryColor: "#357cd2",
//   },
//   {
//     Id: 3,
//     Subject: "Blue Moon Eclipse",
//     StartTime: new Date(2021, 1, 15, 9, 30),
//     EndTime: new Date(2021, 1, 15, 11, 0),
//     CategoryColor: "#7fa900",
//   },
//   {
//     Id: 4,
//     Subject: "Meteor Showers in 2021",
//     StartTime: new Date(2021, 1, 15, 13, 0),
//     EndTime: new Date(2021, 1, 15, 14, 30),
//     CategoryColor: "#ea7a57",
//   },
//   {
//     Id: 5,
//     Subject: "Milky Way as Melting pot",
//     StartTime: new Date(2021, 1, 15, 15, 0),
//     EndTime: new Date(2021, 1, 15, 17, 0),
//     CategoryColor: "#00bdae",
//   },
// ];

// const KeyboardInteraction = () => {
//   let scheduleObj = React.useRef<ScheduleComponent>(null);
//   const data: Record<string, any>[] = extend(
//     [],
//     (dataSource as Record<string, any>).zooEventsData,
//     true
//   ) as Record<string, any>[];

//   const onEventRendered = (args: EventRenderedArgs): void => {
//     applyCategoryColor(args, scheduleObj.current?.currentView as string);
//   };

//   return (
//     <div className="schedule-control-section">
//       <div className="col-lg-12 control-section">
//         <div className="control-wrapper">
//           <ScheduleComponent
//             id="schedule"
//             width="100%"
//             height="650px"
//             selectedDate={new Date(2021, 1, 15)}
//             ref={scheduleObj}
//             eventSettings={{ dataSource: data }}
//             eventRendered={onEventRendered}
//           >
//             <Inject
//               services={[
//                 Day,
//                 Week,
//                 WorkWeek,
//                 Month,
//                 Agenda,
//                 Resize,
//                 DragAndDrop,
//               ]}
//             />
//           </ScheduleComponent>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default KeyboardInteraction;
import React from "react";

const ViewCalender = () => {
  return <div>ViewCalender</div>;
};

export default ViewCalender;
