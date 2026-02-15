'use client'
import { Button } from '@/components/ui/button';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'



const Header = () => {

    const path = usePathname();
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        console.log(path)


    }, [])
    return (
        <div className='py-4 px-10  flex justify-between items-center shadow-sm fixed top-0 z-10 w-full bg-blue-50'>
            <div className='flex gap-14 items-center'>
                <div className='flex gap-1 justify-center rounded-l-md rounded-t-md bg-linear-to-r from-purple-500 via-gray-400 to-blue-500 items-center border p-3'>
                    <Image className='rounded-lg' alt='logo' src={'/logo1.png'} height={40} width={60} />
                    <p className='text-2xl font-semibold'>Real <span className='text-emerald-100 text-3xl'>Estate</span></p>
                </div>

                <ul className='hidden md:flex items-center gap-10'>
                    <li className={`'hover:text-blue-500 cursor-pointer font-semibold text-sm' ${path == '/' && 'text-blue-500'}`}>For Sale</li>
                    <li className='hover:text-blue-500 cursor-pointer font-semibold text-sm'>For Rent</li>
                    <li className='hover:text-blue-500 cursor-pointer font-semibold text-sm'>Agent Finder</li>
                </ul>
            </div>

            <div className='flex  items-center justify-center gap-2'>
            <Link href={'/add-new-listing'}>
                <Button>
                    + Post Your Ad
                </Button>
            </Link>


                {isSignedIn ? <UserButton />
                    :
                    <Link href={'/sign-in'}>
                    <Button  variant='outline'>
                        Log in
                    </Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Header;


