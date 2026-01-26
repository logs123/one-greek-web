import React, { useMemo } from 'react';
import { PNMUser, Votes } from '../../../types/userTypes';
import { IoIosClose, IoIosArrowBack, IoIosArrowForward, IoLogoLinkedin } from 'react-icons/io';
import { useTogglePNMFinalVoteMutation } from '../../chapter/api/chapterApi';
import useAuth from '../../../hooks/useAuth';
import { IoLogoInstagram } from "react-icons/io";
import countryList from "react-select-country-list";

interface PNMInfoModalProps {
    pnms: PNMUser[];
    selectedPNM: string | null;
    filteredPNMs: PNMUser[];
    isOpen: boolean;
    onClose: () => void;
    setSelectedPNM: (pnm: string) => void;
}

const PNMInfoModal: React.FC<PNMInfoModalProps> = ({
    pnms,
    selectedPNM,
    filteredPNMs,
    isOpen,
    onClose,
    setSelectedPNM,
}) => {
    const auth = useAuth();
    // const [activeTab, setActiveTab] = useState<'votes' | 'notes'>('votes');
    // const [noteContent, setNoteContent] = useState<string>('');
    //const [togglePNMVote, { isLoading: isVoteLoading }] = useTogglePNMVoteMutation();
    // const [togglePNMNote, { isLoading: isNoteLoading }] = useTogglePNMNoteMutation();
    const [togglePNMFinalVote, { isLoading: isFinalVoteLoading }] = useTogglePNMFinalVoteMutation();

    const pnmData = useMemo(
        () => pnms.find((pnm) => pnm.pnm._id === selectedPNM) || null,
        [pnms, selectedPNM]
    );

    // useEffect(() => {
    //     if (pnmData && pnmData.userNote) {
    //         setNoteContent(pnmData.userNote.content || '');
    //     }
    // }, [pnmData]);

    const getCountryName = (code: string) => {
        const countries = countryList().getData();
        const country = countries.find((c) => c.value === code.toUpperCase());
        return country ? country.label : "";
    };

    if (!isOpen || !pnmData) return null;

    const currentIndex = filteredPNMs.findIndex((pnm) => pnm.pnm._id === selectedPNM);

    const voteTypes: Array<keyof Votes> = ['yes', 'maybe', 'no'];
    
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setSelectedPNM(filteredPNMs[currentIndex - 1].pnm._id);
        }
    };

    const handleNext = () => {
        if (currentIndex < filteredPNMs.length - 1) {
            setSelectedPNM(filteredPNMs[currentIndex + 1].pnm._id);
        }
    };

    // const handleVote = async (vote: 'yes' | 'maybe' | 'no') => {
    //     try {
    //         await togglePNMVote({
    //             chapterId: auth?.chapter || '',
    //             pnmId: pnmData.pnm._id,
    //             userId: auth?.id || '',
    //             semesterName: 'Spring 2025',
    //             vote,
    //         });
    //     } catch (error) {
    //         console.error('Error submitting vote:', error);
    //     }
    // };
    
    const handleFinalVote = async (vote: 'yes' | 'maybe' | 'no') => {
        try {
            await togglePNMFinalVote({
                chapterId: auth?.chapter || '',
                pnmId: pnmData.pnm._id,
                semesterName: 'Spring 2026',
                vote,
            });
        } catch (error) {
            console.error('Error submitting final vote:', error);
        }
    }

    // const handleAddNote = async () => {
    //     if (!noteContent.trim()) return;

    //     try {
    //         await togglePNMNote({
    //             chapterId: auth?.chapter || '',
    //             pnmId: pnmData.pnm._id,
    //             userId: auth?.id || '',
    //             semesterName: 'Spring 2025',
    //             note: noteContent,
    //         });
    //         setNoteContent('');
    //     } catch (error) {
    //         console.error('Error submitting note:', error);
    //     }
    // };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`bg-white rounded-2xl shadow-lg min-w-[400px] flex flex-col items-center p-4`}>
                {/* Close Button */}
                <div className="flex justify-end w-full">
                    <button type="button" className="text-gray-500" onClick={onClose}>
                        <IoIosClose size={32} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex justify-between gap-4 w-full px-10 relative">
                    {currentIndex > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="absolute left-0 top-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <IoIosArrowBack size={24} />
                        </button>
                    )}

                    <div className={`flex flex-col w-full items-center`}>
                        <div className="w-28 h-28 sm:w-48 sm:h-48 rounded-full overflow-hidden">
                            <img
                                src={pnmData.pnm.profilePicture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold mt-4">
                            {pnmData.pnm.firstName} {pnmData.pnm.lastName}
                        </h2>
                        <div className='flex'>
                            {pnmData.pnm.socialMediaHandles && pnmData.pnm.socialMediaHandles?.Instagram &&
                                <a
                                    href={`https://www.instagram.com/${pnmData.pnm.socialMediaHandles.Instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit our Instagram"
                                >
                                    <IoLogoInstagram size={30} style={{ color: "#E1306C" }} />
                                </a>
                            }
                            {pnmData.pnm.socialMediaHandles && pnmData.pnm.socialMediaHandles?.LinkedIn &&
                                <a
                                    href={`https://www.linkedin.com/in/${pnmData.pnm.socialMediaHandles.LinkedIn}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit my LinkedIn"
                                    >
                                    <IoLogoLinkedin size={30} style={{ color: "#0077b5" }} />
                                </a>
                            }
                        </div>
                        <p>{pnmData.pnm.pnmInfo.state ? `${pnmData.pnm.pnmInfo.city}, ${pnmData.pnm.pnmInfo.state}` : `${pnmData.pnm.pnmInfo.city}, ${getCountryName(pnmData.pnm.pnmInfo.country)}`}</p>
                        <p>Major: {pnmData.pnm.pnmInfo.major}</p>
                        <p>GPA: {pnmData.pnm.pnmInfo.gpa}</p>
                        <p>Grade: {pnmData.pnm.pnmInfo.gradeLevel}</p>
                        {pnmData.pnm.pnmInfo.secondMajor &&
                            <p>Second Major: {pnmData.pnm.pnmInfo.secondMajor}</p>
                        }
                        {pnmData.pnm.pnmInfo.minor &&
                            <p>Minor: {pnmData.pnm.pnmInfo.minor}</p>
                        }
                        <div className="flex flex-col w-full border-t mt-4 pt-4">
                            <div className="flex justify-evenly mb-4">
                                {voteTypes.map((vote) => (
                                    <button
                                        key={vote}
                                        onClick={() => handleFinalVote(vote)}
                                        className={`px-4 py-2 rounded ${
                                            isFinalVoteLoading || pnmData.finalVote === vote
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : vote === 'yes'
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : vote === 'maybe'
                                                ? 'bg-[#FFD301] hover:bg-[#FFC107] text-white'
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                        
                                        disabled={isFinalVoteLoading || pnmData.finalVote === vote}
                                    >
                                        {vote.charAt(0).toUpperCase() + vote.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {/* <div className="flex justify-evenly mb-4">
                                {voteTypes.map((vote) => (
                                    <button
                                        key={vote}
                                        onClick={() => handleVote(vote)}
                                        className={`px-4 py-2 rounded ${
                                            isVoteLoading || pnmData.userVote === vote
                                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                                : vote === 'yes'
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : vote === 'maybe'
                                                ? 'bg-[#FFD301] hover:bg-[#FFC107] text-white'
                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                        }`}
                                        
                                        disabled={isVoteLoading || pnmData.userVote === vote}
                                    >
                                        {vote.charAt(0).toUpperCase() + vote.slice(1)}
                                    </button>
                                ))}
                            </div> */}
                            {/* <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Add a note..."
                                className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isNoteLoading}
                            />
                            <button
                                onClick={handleAddNote}
                                className={`mt-2 px-4 py-2 rounded ${
                                    isNoteLoading
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-pacific-blue hover:bg-turquoise-blue text-white'
                                }`}
                                disabled={isNoteLoading}
                            >
                                Submit Note
                            </button> */}
                        </div>
                    </div>

                    {/* {auth?.roles.includes('Admin') && (
                        <div className="hidden lg:flex flex-col lg:w-1/2 bg-gray-100 p-4 rounded-lg">
                            <div className="flex justify-center space-x-6 mb-4">
                                <button
                                    className={`text-lg ${
                                        activeTab === 'votes'
                                            ? 'font-bold underline'
                                            : 'hover:underline text-gray-600'
                                    }`}
                                    onClick={() => setActiveTab('votes')}
                                >
                                    Votes
                                </button>
                                <button
                                    className={`text-lg ${
                                        activeTab === 'notes'
                                            ? 'font-bold underline'
                                            : 'hover:underline text-gray-600'
                                    }`}
                                    onClick={() => setActiveTab('notes')}
                                >
                                    Notes
                                </button>
                            </div>

                            <div className="overflow-y-auto border border-gray-300 rounded-md p-4 bg-white h-[400px]">
                                {activeTab === 'votes' && (
                                    <div>
                                        {voteTypes.map((voteType) => (
                                            <div key={voteType} className="mb-6">
                                                <div className='flex justify-between border-b border-gray-300 mb-2 pb-1'>
                                                    <h4 className="font-semibold text-lg capitalize text-pacific-blue ">
                                                        {voteType.charAt(0).toUpperCase() + voteType.slice(1)}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Total: {pnmData.votes[voteType].length}
                                                    </p>
                                                </div>
                                                {pnmData.votes[voteType].length > 0 ? (
                                                    pnmData.votes[voteType].map((voter) => (
                                                        <div key={voter._id} className="flex items-center gap-4 mb-2">
                                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                                <img
                                                                    src={voter.profilePicture}
                                                                    alt={`${voter.firstName} ${voter.lastName}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <p>
                                                                {voter.firstName} {voter.lastName}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No votes yet</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'notes' && (
                                    <div>
                                        {pnmData.notes.length > 0 ? (
                                            pnmData.notes.map((note) => (
                                                <div key={note._id} className="mb-4 border-b pb-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden">
                                                            <img
                                                                src={note.addedBy.profilePicture}
                                                                alt={`${note.addedBy.firstName} ${note.addedBy.lastName}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <p className="font-bold">
                                                            {note.addedBy.firstName} {note.addedBy.lastName}
                                                        </p>
                                                    </div>
                                                    <p>{note.content}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(note.createdAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true})}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No notes yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )} */}

                    {currentIndex < filteredPNMs.length - 1 && (
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <IoIosArrowForward size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PNMInfoModal;
