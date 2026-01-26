import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PNMUser } from '../../../types/userTypes';
import PNMVoteButton from '../../chapter/components/pnm-vote-button';

interface PNMListProps {
    pnms: PNMUser[];
    onPNMInfoOpen: () => void;
    setSelectedPNM: (pnm: string) => void;
    setFilteredPNMs: (pnmList: PNMUser[]) => void;
    isTableView: boolean;
    textMessage: string;
}

type Column = keyof PNMUser | keyof PNMUser['pnm'];

const PNMList: React.FC<PNMListProps> = ({ pnms, onPNMInfoOpen, setSelectedPNM, setFilteredPNMs, isTableView, textMessage }) => {
    const [filter, setFilter] = useState<string | null>(null);
    const previousFilteredPnms = useRef<PNMUser[]>([]);
    const [sortedColumn, setSortedColumn] = useState<Column | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    
    const handleSort = (column: Column) => {
        const order = sortedColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortedColumn(column);
        setSortOrder(order);
    }
    
    const sortedUsers = [...pnms].sort((a, b) => {
        if (!sortedColumn) return 0;
    
        // Helper function to get the value of the column, supporting nested properties
        const getColumnValue = (user: PNMUser, column: Column): any => {
            if (column in user.pnm) {
                return user.pnm[column as keyof PNMUser['pnm']];
            }
            return user[column as keyof PNMUser];
        };
    
        const valueA = getColumnValue(a, sortedColumn);
        const valueB = getColumnValue(b, sortedColumn);
    
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const sortedPnms = useMemo(() => {
        return [...pnms].sort((a, b) =>
            a.pnm.firstName.localeCompare(b.pnm.firstName)
        );
    }, [pnms]);

    const filteredPnms = useMemo(() => {
        if (!filter) return sortedPnms;
        return sortedPnms.filter((pnm) => {
            const vote = pnm.finalVote || 'pending';
            return vote === filter;
        });
    }, [sortedPnms, filter]);

    const formatPhoneNumber = (phoneNumber: string) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        
        if (cleaned.length !== 10) {
            return phoneNumber;
        }

        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneNumber;
    }

    const openSMSApp = (phoneNumber: string) => {
        const encodedMessage = encodeURIComponent(textMessage);
        window.location.href = `sms:${phoneNumber}?body=${encodedMessage}`;
    };

    useEffect(() => {
        if (JSON.stringify(filteredPnms) !== JSON.stringify(previousFilteredPnms.current)) {
            previousFilteredPnms.current = filteredPnms;
            setFilteredPNMs(filteredPnms);
        }
    }, [filteredPnms, setFilteredPNMs]);

    if (isTableView) return (
        <div className="flex flex-col">
            <div className='lg:hidden flex flex-col'>
                <div className="flex justify-evenly text-sm lg:text-md bg-[#E4EFF3] sticky top-28 pb-4 z-10">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === null ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter(null)}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${
                            filter === 'pending' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('pending')}
                    >
                        Undecided
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'yes' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('yes')}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'maybe' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('maybe')}
                    >
                        Maybe
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'no' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('no')}
                    >
                        No
                    </button>
                </div>
                <div className="px-4 lg:px-14 lg:py-4 h-[calc(100vh-240px)] bg-[#E4EFF3] overflow-y-auto">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPnms.map((pnm) => (
                            <div
                                key={pnm.pnm._id}
                                className="bg-white shadow-lg mb-2 drop-shadow-lg rounded-lg flex flex-col justify-center items-center"
                            >
                                <button
                                    type="button"
                                    className="p-4 flex flex-col w-full justify-center items-center gap-2 hover:brightness-75"
                                    onClick={() => {
                                        setSelectedPNM(pnm.pnm._id);
                                        onPNMInfoOpen();
                                    }}
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden">
                                        <img
                                            src={pnm.pnm.profilePicture}
                                            alt="Profile Picture"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="font-bold">
                                        {pnm.pnm.firstName} {pnm.pnm.lastName}
                                    </p>
                                </button>
                                <div className="flex gap-1 p-4">
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="yes"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.userVote}
                                    />
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="maybe"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.userVote}
                                    />
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="no"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.userVote}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-4 lg:px-14 lg:py-4 h-[calc(100vh-240px)] bg-[#E4EFF3] overflow-y-auto">
                <table className='w-full min-w-max bg-white rounded-t-lg'>
                    <thead>
                        <tr className='bg-[#7CAFC0]'>
                            <th className='rounded-tl-lg w-20 border border-[#DEEFF3]'></th>
                            <th
                                className='border border-[#DEEFF3] p-2 text-left text-xs sm:text-sm lg:text-base cursor-pointer hover:bg-[#93cfe3] text-white'
                                onClick={() => handleSort('lastName')}
                            >
                                Last Name
                            </th>
                            <th
                                className='border border-[#DEEFF3] p-2 text-left text-xs sm:text-sm lg:text-base cursor-pointer hover:bg-[#93cfe3] text-white'
                                onClick={() => handleSort('firstName')}
                            >
                                First Name
                            </th>
                            <th
                                className='border border-[#DEEFF3] p-2 text-left text-xs sm:text-sm lg:text-base cursor-pointer hover:bg-[#93cfe3] text-white'
                                onClick={() => handleSort('phoneNumber')}
                            >
                                Phone
                            </th>
                            <th
                                className='rounded-tr-lg border border-[#DEEFF3] p-2 text-left text-xs sm:text-sm lg:text-base cursor-pointer hover:bg-[#93cfe3] text-white'
                                onClick={() => handleSort('finalVote')}
                            >
                                Vote
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedUsers.map((pnm) => (
                            <tr key={pnm.pnm._id} className='bg-white'>
                                <td className='border border-[#DEEFF3]'>
                                    <div className='flex p-1 justify-center'>
                                        <img
                                            src={pnm.pnm.profilePicture}
                                            alt='Profile Picture'
                                            className='w-10 h-10 rounded-full object-cover'
                                        />
                                    </div>
                                </td>
                                <td className='p-2 border border-[#DEEFF3]'>{pnm.pnm.lastName}</td>
                                <td className='p-2 border border-[#DEEFF3]'>{pnm.pnm.firstName}</td>
                                <td
                                    className='p-2 border border-[#DEEFF3] cursor-pointer hover:underline hover:text-turquoise-blue'
                                    onClick={() => openSMSApp(pnm.pnm.phoneNumber)}
                                >
                                    {formatPhoneNumber(pnm.pnm.phoneNumber)}
                                </td>
                                {pnm.finalVote === 'pending' ?
                                    <td className='p-2 border border-[#DEEFF3]'></td>
                                :
                                    <td className='p-2 border border-[#DEEFF3]'>{pnm.finalVote.charAt(0).toUpperCase() + pnm.finalVote.slice(1)}</td>
                                }
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col">
            <div>
                <div className="flex justify-evenly text-sm lg:text-md bg-[#E4EFF3] sticky top-28 pb-4 z-10">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === null ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter(null)}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded ${
                            filter === 'pending' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('pending')}
                    >
                        Undecided
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'yes' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('yes')}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'maybe' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('maybe')}
                    >
                        Maybe
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded text-white ${
                            filter === 'no' ? 'bg-gray-300 text-black' : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                        }`}
                        onClick={() => setFilter('no')}
                    >
                        No
                    </button>
                </div>
                <div className="px-4 lg:px-14 lg:py-4 h-[calc(100vh-240px)] bg-[#E4EFF3] overflow-y-auto">
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredPnms.map((pnm) => (
                            <div
                                key={pnm.pnm._id}
                                className="bg-white shadow-lg mb-2 drop-shadow-lg rounded-lg flex flex-col justify-center items-center"
                            >
                                <button
                                    type="button"
                                    className="p-4 flex flex-col w-full justify-center items-center gap-2 hover:brightness-75"
                                    onClick={() => {
                                        setSelectedPNM(pnm.pnm._id);
                                        onPNMInfoOpen();
                                    }}
                                >
                                    <div className="w-24 h-24 rounded-full overflow-hidden">
                                        <img
                                            src={pnm.pnm.profilePicture}
                                            alt="Profile Picture"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="font-bold">
                                        {pnm.pnm.firstName} {pnm.pnm.lastName}
                                    </p>
                                </button>
                                <div className="flex gap-1 p-4">
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="yes"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.finalVote}
                                    />
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="maybe"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.finalVote}
                                    />
                                    <PNMVoteButton
                                        pnmId={pnm.pnm._id}
                                        vote="no"
                                        semesterName="Spring 2026"
                                        currentVote={pnm.finalVote}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default PNMList;
