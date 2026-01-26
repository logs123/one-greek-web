import React, { useState } from 'react';
import ActiveLayout from '../../../components/layouts/active-layout';
import { useGetPNMListQuery } from '../../../features/user/api/userApi';
import PNMList from '../../../features/user/components/pnm-list';
import useAuth from '../../../hooks/useAuth';
import PNMInfoModal from '../../../features/user/components/pnm-info-modal';
import { PNMUser } from '../../../types/userTypes';
import { PiSquaresFourBold } from 'react-icons/pi';
import { FaTable } from 'react-icons/fa';
import { MdOutlineTextsms } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';

const RecruitmentRoute = () => {
    const auth = useAuth();
    const [isPNMInfoModalOpen, setIsPNMInfoModalOpen] = useState<boolean>(false);
    const [isTextModalOpen, setIsTextModalOpen] = useState<boolean>(false);
    const [selectedPNM, setSelectedPNM] = useState<string>('');
    const [filteredPNMs, setFilteredPNMs] = useState<PNMUser[]>([]);
    const [isTableView, setIsTableView] = useState<boolean>(false);
    const [textMessage, setTextMessage] = useState<string>('');

    const { data: pnms = [] } = useGetPNMListQuery(
        { userId: auth?.id || '', chapterId: auth?.chapter || '', semesterName: 'Spring 2026' },
        { skip: !auth }
    );

    return (
        <ActiveLayout>
            <div className='hidden lg:flex h-[184px] py-8 px-14'>
                <div className='flex w-full justify-between gap-8'>
                    <div className='flex-1 h-full bg-white rounded-2xl flex items-center shadow drop-shadow'>
                        <div className='ml-10 font-bold text-3xl'>Recruitment</div>
                    </div>
                    <div className='flex justify-center items-end'>
                        <div className='flex flex-col h-full justify-between'>
                            <button
                                type='button'
                                className='text-white rounded-lg px-3 py-2 bg-pacific-blue hover:bg-turquoise-blue flex items-center justify-between shadow drop-shadow hover:drop-shadow-xl'
                                onClick={() => setIsTextModalOpen(true)}
                            >
                                <MdOutlineTextsms size={24}/>
                                <p className=''>Set Message</p>
                            </button>
                            <button
                                type='button'
                                className='flex items-center justify-between bg-white rounded-xl px-2 shadow drop-shadow gap-1 py-2 hover:drop-shadow-xl '
                                onClick={() => setIsTableView(!isTableView)}
                            >
                                <div className={`flex justify-center items-center gap-1  rounded-l-lg ${isTableView ? '' : 'bg-pacific-blue text-white rounded-r-lg px-2 py-1'}`}>
                                    <p>Card</p>
                                    <PiSquaresFourBold />
                                </div>
                                <div className={`flex justify-center items-center gap-1 rounded-r-lg ${isTableView ? 'bg-pacific-blue text-white rounded-l-lg px-2 py-1' : ''}`}>
                                    <p>Table</p>
                                    <FaTable />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='lg:hidden flex pb-4 bg-[#E4EFF3]'>
                <div className='flex w-full justify-between px-4'>
                    <div className='flex-1 h-full bg-white rounded-lg p-1 flex justify-center items-center shadow drop-shadow'>
                        <div className='font-bold text-xl'>Recruitment</div>
                    </div>
                </div>
            </div>
            <PNMList
                pnms={pnms}
                onPNMInfoOpen={() => setIsPNMInfoModalOpen(true)}
                setSelectedPNM={setSelectedPNM}
                setFilteredPNMs={setFilteredPNMs}
                isTableView={isTableView}
                textMessage={textMessage}
            />
            <PNMInfoModal
                pnms={pnms}
                selectedPNM={selectedPNM}
                filteredPNMs={filteredPNMs}
                isOpen={isPNMInfoModalOpen}
                onClose={() => setIsPNMInfoModalOpen(false)}
                setSelectedPNM={setSelectedPNM}
            />
            {isTextModalOpen &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`bg-white rounded-2xl shadow-lg flex flex-col items-center p-4 w-96`}>
                        <div className="flex justify-between items-center mb-4 w-full">
                            <h2 className="text-xl font-bold">Set Message</h2>
                            <button
                                type="button"
                                className=""
                                onClick={() => setIsTextModalOpen(false)}
                            >
                                <IoIosClose size={32} />
                            </button>
                        </div>
                        <div className='flex flex-col gap-4 w-full h-64'>
                            <textarea
                                value={textMessage}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTextMessage(e.target.value)}
                                placeholder='Type your message here'
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pacific-blue"
                            />
                            <button
                                className="bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded"
                                onClick={() => setIsTextModalOpen(false)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            }
        </ActiveLayout>
    );
};

export default RecruitmentRoute;
