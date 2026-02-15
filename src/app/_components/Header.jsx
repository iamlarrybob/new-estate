
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { HiMenu, HiX } from "react-icons/hi";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Header = () => {
  const path = usePathname();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-20 w-full bg-blue-50 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-3 py-3 md:px-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-500 via-gray-400 to-blue-500 p-2">
            <Image
              src="/logo1.png"
              alt="logo"
              width={40}
              height={32}
              className="rounded-lg"
            />
            <p className="text-sm font-semibold text-white sm:text-base md:text-2xl">
              Real <span className="text-emerald-200">Estate</span>
            </p>
          </div>
        </Link>

        {/* Search */}
        <form className="flex flex-1 max-w-[140px] sm:max-w-xs md:max-w-md items-center rounded-lg bg-slate-100 px-2 py-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-xs sm:text-sm p-1 focus:outline-none"
          />
          <GoSearch className="text-slate-600 shrink-0" />
        </form>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className={`text-sm font-semibold hover:text-blue-500 ${
                path === "/" ? "text-blue-500" : ""
              }`}
            >
              Home
            </Link>
          </li>

          <li className="text-sm font-semibold hover:text-blue-500">
            For Sale
          </li>

          <li className="text-sm font-semibold hover:text-blue-500">
            For Rent
          </li>

          <li>
            <Link
              href="/about"
              className={`text-sm font-semibold hover:text-blue-500 ${
                path === "/about" ? "text-blue-500" : ""
              }`}
            >
              About
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/add-new-listing">
            <Button>+ Post Your Ad</Button>
          </Link>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <Link href="/sign-in">
              <Button variant="outline">Log in</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden shrink-0"
          onClick={() => setOpen(!open)}
        >
          {open ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-blue-50 px-4 pb-4">
          <ul className="flex flex-col gap-4 py-4 text-sm">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`font-semibold ${
                  path === "/" ? "text-blue-500" : ""
                }`}
              >
                Home
              </Link>
            </li>

            <li className="font-semibold">For Sale</li>
            <li className="font-semibold">For Rent</li>

            <li>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className={`font-semibold ${
                  path === "/about" ? "text-blue-500" : ""
                }`}
              >
                About
              </Link>
            </li>
          </ul>

          <div className="flex flex-col gap-2">
            <Link href="/add-new-listing" onClick={() => setOpen(false)}>
              <Button className="w-full">+ Post Your Ad</Button>
            </Link>

            {isSignedIn ? (
              <UserButton />
            ) : (
              <Link href="/sign-in" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;



// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { GoSearch } from "react-icons/go";
// import { HiMenu, HiX } from "react-icons/hi";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// const Header = () => {
//   const path = usePathname();
//   const { isSignedIn } = useUser();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="fixed top-0 z-20 w-full bg-blue-50 shadow-sm">
//       <div className="flex items-center justify-between gap-2 px-3 py-3 md:px-10">

//         {/* Logo */}
//         <div className="flex items-center gap-2 shrink-0">
//           <div className="flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-500 via-gray-400 to-blue-500 p-2">
//             <Image
//               src="/logo1.png"
//               alt="logo"
//               width={45}
//               height={35}
//               className="rounded-lg"
//             />
//             <p className="text-base font-semibold text-white md:text-2xl">
//               Real <span className="text-emerald-200">Estate</span>
//             </p>
//           </div>
//         </div>

//         {/* Search - ALWAYS visible */}
//         <form className="flex flex-1 max-w-[180px] sm:max-w-xs md:max-w-md items-center rounded-lg bg-slate-100 px-2 py-1">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full bg-transparent text-sm p-1 focus:outline-none"
//           />
//           <GoSearch className="text-slate-600 shrink-0" />
//         </form>

//         {/* Desktop Nav */}
//         <ul className="hidden md:flex items-center gap-10">
//           <li className={`cursor-pointer text-sm font-semibold hover:text-blue-500 ${
//               path === "/" && "text-blue-500"
//             }`}>
//             Home
//           </li>
//           <li
//             className={`cursor-pointer text-sm font-semibold hover:text-blue-500 ${
//               path === "/" && "text-blue-500"
//             }`}
//           >
//             For Sale
//           </li>
//           <li className="cursor-pointer text-sm font-semibold hover:text-blue-500">
//             For Rent
//           </li>
//           <li className="cursor-pointer text-sm font-semibold hover:text-blue-500">
//             About
//           </li>
//         </ul>

//         {/* Desktop Buttons */}
//         <div className="hidden md:flex items-center gap-2">
//           <Link href="/add-new-listing">
//             <Button>+ Post Your Ad</Button>
//           </Link>

//           {isSignedIn ? (
//             <UserButton />
//           ) : (
//             <Link href="/sign-in">
//               <Button variant="outline">Log in</Button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden shrink-0"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <HiX size={26} /> : <HiMenu size={26} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden border-t bg-blue-50 px-4 pb-4">
//           <ul className="flex flex-col gap-4 py-4">
//             <li className="font-semibold">For Sale</li>
//             <li className="font-semibold">For Rent</li>
//             <li className="font-semibold">Agent Finder</li>
//           </ul>

//           <div className="flex flex-col gap-2">
//             <Link href="/add-new-listing">
//               <Button className="w-full">+ Post Your Ad</Button>
//             </Link>

//             {isSignedIn ? (
//               <UserButton />
//             ) : (
//               <Link href="/sign-in">
//                 <Button variant="outline" className="w-full">
//                   Log in
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;





// 'use client'


// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { GoSearch } from "react-icons/go";
// import { HiMenu, HiX } from "react-icons/hi";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";

// const Header = () => {
//   const path = usePathname();
//   const { isSignedIn } = useUser();
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="fixed top-0 z-20 w-full bg-blue-50 shadow-sm">
//       <div className="flex items-center justify-between px-4 py-3 md:px-10">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1 rounded-md bg-gradient-to-r from-purple-500 via-gray-400 to-blue-500 p-2">
//             <Image
//               src="/logo1.png"
//               alt="logo"
//               width={50}
//               height={35}
//               className="rounded-lg"
//             />
//             <p className="text-lg font-semibold text-white md:text-2xl">
//               Real <span className="text-emerald-200">Estate</span>
//             </p>
//           </div>
//         </div>

//         {/* Desktop Nav */}
//         <ul className="hidden md:flex items-center gap-10">
//           <li
//             className={`cursor-pointer text-sm font-semibold hover:text-blue-500 ${
//               path === "/" && "text-blue-500"
//             }`}
//           >
//             For Sale
//           </li>
//           <li className="cursor-pointer text-sm font-semibold hover:text-blue-500">
//             For Rent
//           </li>
//           <li className="cursor-pointer text-sm font-semibold hover:text-blue-500">
//             Agent Finder
//           </li>
//         </ul>

//         {/* Search (hidden on very small screens) */}
//         <form className="hidden sm:flex items-center rounded-lg bg-slate-100 p-2">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-24 bg-transparent p-1 focus:outline-none sm:w-48"
//           />
//           <GoSearch className="text-slate-600" />
//         </form>

//         {/* Right buttons */}
//         <div className="hidden md:flex items-center gap-2">
//           <Link href="/add-new-listing">
//             <Button>+ Post Your Ad</Button>
//           </Link>

//           {isSignedIn ? (
//             <UserButton />
//           ) : (
//             <Link href="/sign-in">
//               <Button variant="outline">Log in</Button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setOpen(!open)}
//         >
//           {open ? <HiX size={26} /> : <HiMenu size={26} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {open && (
//         <div className="md:hidden bg-blue-50 border-t px-4 pb-4">
//           <ul className="flex flex-col gap-4 py-4">
//             <li className="font-semibold">For Sale</li>
//             <li className="font-semibold">For Rent</li>
//             <li className="font-semibold">Agent Finder</li>
//           </ul>

//           <form className="flex items-center rounded-lg bg-slate-100 p-2 mb-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               className="flex-1 bg-transparent p-1 focus:outline-none"
//             />
//             <GoSearch className="text-slate-600" />
//           </form>

//           <div className="flex flex-col gap-2">
//             <Link href="/add-new-listing">
//               <Button className="w-full">+ Post Your Ad</Button>
//             </Link>

//             {isSignedIn ? (
//               <UserButton />
//             ) : (
//               <Link href="/sign-in">
//                 <Button variant="outline" className="w-full">
//                   Log in
//                 </Button>
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;



// import { Button } from '@/components/ui/button';
// import { UserButton, useUser } from '@clerk/nextjs';
// import Image from 'next/image';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import React, { useEffect } from 'react'
// import { GoSearch } from "react-icons/go";




// const Header = () => {

//     const path = usePathname();
//     const { user, isSignedIn } = useUser();

//     useEffect(() => {
//         console.log(path)


//     }, [])
//     return (
//         <div className='py-4 px-10  flex justify-between items-center shadow-sm fixed top-0 z-10 w-full bg-blue-50'>
//             <div className='flex gap-14 items-center'>
//                 <div className='flex gap-1 justify-center rounded-l-md rounded-t-md bg-linear-to-r from-purple-500 via-gray-400 to-blue-500 items-center border p-3'>
//                     <Image className='rounded-lg' alt='logo' src={'/logo1.png'} height={40} width={60} />
//                     <p className='text-2xl font-semibold'>Real <span className='text-emerald-100 text-3xl'>Estate</span></p>
//                 </div>

//                 <ul className='hidden md:flex items-center gap-10'>
//                     <li className={`'hover:text-blue-500 cursor-pointer font-semibold text-sm' ${path == '/' && 'text-blue-500'}`}>For Sale</li>
//                     <li className='hover:text-blue-500 cursor-pointer font-semibold text-sm'>For Rent</li>
//                     <li className='hover:text-blue-500 cursor-pointer font-semibold text-sm'>Agent Finder</li>
//                 </ul>

//             </div>

//             <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
//             <input type='text'
//             placeholder='search . . .'
//             className='bg-transparent border border-b-blue-200 focus:outline-none w-24 p-1 sm:w-64'>
            
//             </input>

//             <button>
//                 <GoSearch className='text-slate-600'></GoSearch>
//             </button>
//             </form>

//             <div className='flex  items-center justify-center gap-2'>
//             <Link href={'/add-new-listing'}>
//                 <Button>
//                     + Post Your Ad
//                 </Button>
//             </Link>


//                 {isSignedIn ? <UserButton />
//                     :
//                     <Link href={'/sign-in'}>
//                     <Button  variant='outline'>
//                         Log in
//                     </Button>
//                     </Link>
//                 }
//             </div>
//         </div>
//     )
// }

// export default Header;






