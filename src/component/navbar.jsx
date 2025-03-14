// import React, { useState } from "react";
// import { Menu, Transition } from "@headlessui/react";
// import { Fragment } from "react";


// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="bg-black  p-4">
//       <div className="container mx-auto flex justify-between items-center">
       
//         <div className="w-12 h-12 flex items-center justify-center mb-2">
//           <img
//             src="/logo-rw.jpg"
//             alt="Logo RW"
//             className="w-full h-full object-contain rounded-full"
//           />
//         </div>

//         <Menu as="div" className="relative">
//           <div>
//             <Menu.Button className="flex items-center text-white">
//               <span className="mr-2">Profile</span>
//               <img
//                 className="h-8 w-8 rounded-full"
//                 src="https://via.placeholder.com/150"
//                 alt="Profile"
//               />
//             </Menu.Button>
//           </div>

//           <Transition
//             as={Fragment}
//             enter="transition ease-out duration-100"
//             enterFrom="transform opacity-0 scale-95"
//             enterTo="transform opacity-100 scale-100"
//             leave="transition ease-in duration-75"
//             leaveFrom="transform opacity-100 scale-100"
//             leaveTo="transform opacity-0 scale-95"
//           >
//             <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//               <div className="py-1">
//                 <Menu.Item>
//                   {({ active }) => (
//                     <a
//                       href="#"
//                       className={`${
//                         active ? "bg-gray-100" : ""
//                       } block px-4 py-2 text-sm text-gray-700`}
//                     >
//                       Profile
//                     </a>
//                   )}
//                 </Menu.Item>
//                 <Menu.Item>
//                   {({ active }) => (
//                     <a
//                       href="#"
//                       className={`${
//                         active ? "bg-gray-100" : ""
//                       } block px-4 py-2 text-sm text-gray-700`}
//                     >
//                       Logout
//                     </a>
//                   )}
//                 </Menu.Item>
//               </div>
//             </Menu.Items>
//           </Transition>
//         </Menu>
//       </div>
//     </nav>
//   );
// }
