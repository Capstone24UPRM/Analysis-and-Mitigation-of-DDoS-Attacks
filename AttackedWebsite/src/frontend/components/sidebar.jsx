import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BsBarChartFill } from "react-icons/bs";
import {RxDashboard, RxPerson} from 'react-icons/rx'
import {AiFillStar} from 'react-icons/ai'
import { GoArrowSwitch } from "react-icons/go";
import { FaMoneyBillWave  } from "react-icons/fa";

const Sidebar = ({children}) => {
    return (
        <div className="flex">
            <div className="ficed w-20 h-screen p-4 bg-white border-r-[1px] flex flex-col justify-between"
            >
                <div className="flex flex-col items-center">
                    <Link href='/'>
                        <div className="bg-blue-400 hover:bg-blue-500 p-3 rounded-lg inline-block">
                            <RxDashboard size={20} />
                        </div>
                    </Link>
                    <span className="border-b-[1px] border-gray-200 w-full p-2"></span>
                    <Link href='/people'>
                        <div className="bg-gray-100 hover:bg-gray-200 my-4 p-3 rounded-lg inline-block">
                            <RxPerson size={20} />
                        </div>
                    </Link>
                    <Link href='/transactions'>
                        <div className="bg-gray-100 hover:bg-gray-200 my-4 p-3 rounded-lg inline-block">
                            <FaMoneyBillWave size={20} />
                        </div>
                    </Link>
                    <Link href='/promotions'>
                        <div className="bg-gray-100 hover:bg-gray-200 my-4 p-3 rounded-lg inline-block">
                            <AiFillStar size={20} />
                        </div>
                    </Link>
                    <Link href='/transfers'>
                        <div className="bg-gray-100 hover:bg-gray-200 my-4 p-3 rounded-lg inline-block">
                            <GoArrowSwitch size={20} />
                        </div>
                    </Link>
                </div>
            </div>
            <main className="w-full">{children}</main>
        </div>
    )
}

export default Sidebar