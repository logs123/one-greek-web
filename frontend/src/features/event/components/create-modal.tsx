import React, { useEffect, useState } from 'react';
import { EventPayload } from '../../../types/eventTypes';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { IoIosClose } from 'react-icons/io';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useAuth from '../../../hooks/useAuth';

interface CreateEventModalProps {
    createEvent: (payload: EventPayload) => void;
    isLoading: boolean;
    error?: SerializedError | FetchBaseQueryError;
    isOpen: boolean;
    onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ createEvent, isLoading, error, isOpen, onClose }) => {
    const auth = useAuth();
    const [formData, setFormData] = useState<EventPayload>({
        name: '',
        organization: `${auth?.organization}`,
        author: `${auth?.id}`,
        start: (() => {
            const now = new Date();
            now.setMinutes(0, 0, 0);
            now.setHours(now.getHours() + 1);
            return now;
        })(),
        end: (() => {
            const now = new Date();
            now.setMinutes(0, 0, 0);
            now.setHours(now.getHours() + 2);
            return now;
        })(),
        type: 'Recruitment',
        semester: 'Spring 2026',
        chapter: `${auth?.chapter}`,
        locationName: '',
        locationAddress: '',
        visibility: 'public',
    });
    const timeZone = 'America/Phoenix';
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    useEffect(() => {
        const { name, chapter, organization, author, start, end, type, visibility, semester } = formData;
        const isFormComplete = Boolean(name && chapter && organization && author && start && end && type && visibility && semester);
        setIsFormValid(isFormComplete);
    }, [formData]);

    useEffect(() => {
        if (formData.end <= formData.start) {
            const updatedEnd = new Date(formData.start);
            updatedEnd.setHours(updatedEnd.getHours() + 1);
            setFormData((prev) => ({
                ...prev,
                end: updatedEnd,
            }));
        }
    }, [formData.start]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const payload: EventPayload = {
                name: formData.name.trim(),
                organization: formData.organization,
                author: formData.author,
                start: formData.start,
                end: formData.end,
                type: formData.type,
                semester: formData.semester,
                chapter: formData.chapter,
                locationName: formData.locationName,
                locationAddress: formData.locationAddress,
                visibility: formData.visibility,
            }
            createEvent(payload);
        } catch (err: any) {
            console.error('Create event failed:', error);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-2xl shadow-lg max-w-md w-full'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Create New Event</h2>
                    <button
                        type='button'
                        className=''
                        onClick={onClose}
                    >
                        <IoIosClose size={32} />
                    </button>
                </div>
                <form
                    className='space-y-4'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Name</label>
                        <input
                            type='text'
                            id='name'
                            value={formData.name}
                            required
                            className='w-full px-3 py-2 border rounded-lg'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Location Name</label>
                        <input
                            type='text'
                            id='locationName'
                            value={formData.locationName}
                            className='w-full px-3 py-2 border rounded-lg'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, locationName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Location Address</label>
                        <input
                            type='text'
                            id='locationAddress'
                            value={formData.locationAddress}
                            className='w-full px-3 py-2 border rounded-lg'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, locationAddress: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Start Date & Time</label>
                        <input
                            type='datetime-local'
                            id='start'
                            value={formatInTimeZone(formData.start, timeZone, 'yyyy-MM-dd\'T\'HH:mm')}
                            onChange={(e) => {
                                const localTime = e.target.value;
                                const zonedDate = toZonedTime(new Date(localTime), timeZone);
                                setFormData((prev) => ({ ...prev, start: zonedDate }));
                            }}
                            className='w-full px-3 py-2 border rounded-lg'
                            required
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>End Date & Time</label>
                        <input
                            type='datetime-local'
                            id='end'
                            value={formatInTimeZone(formData.end, timeZone, 'yyyy-MM-dd\'T\'HH:mm')}
                            onChange={(e) => {
                                const localTime = e.target.value;
                                const zonedDate = toZonedTime(new Date(localTime), timeZone);
                                setFormData((prev) => ({ ...prev, end: zonedDate }));
                            }}
                            className='w-full px-3 py-2 border rounded-lg'
                            required
                        />
                    </div>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            id='visibility'
                            checked={formData.visibility === 'private'}
                            className='w-4 h-4 accent-pacific-blue'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, visibility: e.target.checked ? 'private' : 'public'})
                            }
                        />
                        <label htmlFor='visibility' className='text-sm font-medium text-gray-700'>
                            Private
                        </label>
                    </div>
                    <div className='flex justify-end space-x-4'>
                        <button
                            type='submit'
                            disabled={!isFormValid || isLoading}
                            className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;