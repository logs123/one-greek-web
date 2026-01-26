import React, { useEffect, useRef, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import countryList from 'react-select-country-list';
import { IoIosClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoAddCircleOutline } from "react-icons/io5";
import { SignupCredentials, SignupPayload } from '../../../types/authTypes';
import { Organization } from '../../../types/organizationTypes';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface SignupModalProps {
    signup: (payload: SignupPayload) => void;
    error?: SerializedError | FetchBaseQueryError;
    organizations: Organization[];
    isOpen: boolean;
    onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ signup, organizations, isOpen, onClose }) => {
    const [formData, setFormData] = useState<SignupCredentials>({
        firstName: '',
        lastName: '',
        studentId: '',
        phoneNumber: '',
        email: '',
        password: '',
        organization: '',
        roles: '',
        profilePicture: null,
        chapter: '',
        city: '',
        state: '',
        country: '',
        gradeLevel: '',
        major: '',
        secondMajor: '',
        minor: '',
        gpa: '',
        instagram: '',
        linkedin: '',
        hasAgreedToTerms: false,
    });
    const [step, setStep] = useState<number>(1);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isSecondFormValid, setIsSecondFormValid] = useState<boolean>(false);
    const [canCheck, setCanCheck] = useState(false);
    const termsRef = useRef(null);
    const [orgIndex, setOrgIndex] = useState<number>(0);

    const states = [
        { value: 'Alabama', label: 'Alabama' },
        { value: 'Alaska', label: 'Alaska' },
        { value: 'Arizona', label: 'Arizona' },
        { value: 'Arkansas', label: 'Arkansas' },
        { value: 'California', label: 'California' },
        { value: 'Colorado', label: 'Colorado' },
        { value: 'Connecticut', label: 'Connecticut' },
        { value: 'Delaware', label: 'Delaware' },
        { value: 'Florida', label: 'Florida' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Hawaii', label: 'Hawaii' },
        { value: 'Idaho', label: 'Idaho' },
        { value: 'Illinois', label: 'Illinois' },
        { value: 'Indiana', label: 'Indiana' },
        { value: 'Iowa', label: 'Iowa' },
        { value: 'Kansas', label: 'Kansas' },
        { value: 'Kentucky', label: 'Kentucky' },
        { value: 'Louisiana', label: 'Louisiana' },
        { value: 'Maine', label: 'Maine' },
        { value: 'Maryland', label: 'Maryland' },
        { value: 'Massachusetts', label: 'Massachusetts' },
        { value: 'Michigan', label: 'Michigan' },
        { value: 'Minnesota', label: 'Minnesota' },
        { value: 'Mississippi', label: 'Mississippi' },
        { value: 'Missouri', label: 'Missouri' },
        { value: 'Montana', label: 'Montana' },
        { value: 'Nebraska', label: 'Nebraska' },
        { value: 'Nevada', label: 'Nevada' },
        { value: 'New Hampshire', label: 'New Hampshire' },
        { value: 'New Jersey', label: 'New Jersey' },
        { value: 'New Mexico', label: 'New Mexico' },
        { value: 'New York', label: 'New York' },
        { value: 'North Carolina', label: 'North Carolina' },
        { value: 'North Dakota', label: 'North Dakota' },
        { value: 'Ohio', label: 'Ohio' },
        { value: 'Oklahoma', label: 'Oklahoma' },
        { value: 'Oregon', label: 'Oregon' },
        { value: 'Pennsylvania', label: 'Pennsylvania' },
        { value: 'Rhode Island', label: 'Rhode Island' },
        { value: 'South Carolina', label: 'South Carolina' },
        { value: 'South Dakota', label: 'South Dakota' },
        { value: 'Tennessee', label: 'Tennessee' },
        { value: 'Texas', label: 'Texas' },
        { value: 'Utah', label: 'Utah' },
        { value: 'Vermont', label: 'Vermont' },
        { value: 'Virginia', label: 'Virginia' },
        { value: 'Washington', label: 'Washington' },
        { value: 'West Virginia', label: 'West Virginia' },
        { value: 'Wisconsin', label: 'Wisconsin' },
        { value: 'Wyoming', label: 'Wyoming' },
    ];

    const options = countryList().getData();

    const sortedOrganizations = [...(organizations || [])]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(org => ({
            ...org,
            chapters: [...(org.chapters || [])].sort((a, b) => a.name.localeCompare(b.name)),
        }));

    useEffect(() => {
        const { firstName, lastName, studentId, phoneNumber, email, password, organization, roles, profilePicture, chapter } = formData;
        const basicFieldsFilled = Boolean(firstName && lastName && email && phoneNumber && roles && studentId && password && organization && (typeof profilePicture === 'string' || profilePicture instanceof File));
        const isFormComplete = roles.includes('Active') ? (basicFieldsFilled && !!chapter) : basicFieldsFilled;

        const secondBasicFields = Boolean(formData.city && formData.country && formData.gradeLevel && formData.gpa)
        const isSecondFormComplete = formData.country === 'US' ? (secondBasicFields && !!formData.state) : secondBasicFields;
        setIsFormValid(isFormComplete);
        setIsSecondFormValid(isSecondFormComplete);
    }, [formData]);

    const handleStateChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        setFormData({ ...formData, state: selectedOption ? selectedOption.value : '' });
    };

    const handleCountryChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        setFormData({ ...formData, country: selectedOption ? selectedOption.value : '' });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFormData({...formData, profilePicture: file || null});
        }
    }

    const handleTakePicture = () => {
        document.getElementById('imageInput')?.click();
    }

    const handleScroll = () => {
        if (termsRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setCanCheck(true);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload: SignupPayload = {
                email: formData.email.trim(),
                password: formData.password,
                roles: [formData.roles],
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                studentId: formData.studentId.trim(),
                profilePicture: formData.profilePicture,
                socialMediaHandles: {
                    Instagram: formData.instagram.trim(),
                    LinkedIn: formData.linkedin.trim()
                },
                organization: formData.organization,
                chapter: formData.chapter,
                pnmInfo: {
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    country: formData.country.trim(),
                    gradeLevel: formData.gradeLevel,
                    major: formData.major,
                    secondMajor: formData.secondMajor,
                    minor: formData.minor,
                    gpa: formData.gpa,
                    semester: 'Spring 2026',
                },
                hasAgreedToTerms: formData.hasAgreedToTerms
            }

            signup(payload);
            onClose();
        } catch (err: any) {
            console.error('Signup failed:', err);
        }
    }

    if (!isOpen) return null;

    return (
        <div className='flex justify-center items-center fixed inset-0 bg-black bg-opacity-50'>
            <div className='bg-white w-full max-w-md p-6 rounded-lg overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Sign Up</h2>
                    <button
                        className='text-gray-500 hover:text-gray-700'
                        onClick={() => {
                            onClose();
                            setStep(1);
                        }}
                    >
                        <IoIosClose size={32} />
                    </button>
                </div>
                {step === 1 && (
                    <form
                        className='flex flex-col items-center gap-4'
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            if (formData.roles.includes('Active')) {
                                setStep(4);
                            } else if (formData.roles.includes('PNM')) {
                                setStep(2);
                            }
                        }}
                    >
                        <div className='flex'>
                            <input
                                type='text'
                                id='firstName'
                                value={formData.firstName}
                                placeholder='First Name'
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-1/2 mr-2'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                            />
                            <input
                                type='text'
                                id='lastName'
                                value={formData.lastName}
                                placeholder='Last Name'
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-1/2 ml-2'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                        <div className='flex'>
                            <input
                                type='string'
                                id='studentId'
                                value={formData.studentId}
                                placeholder='ASUID Number'
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-1/2 mr-2'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value;

                                    if (/^\d*$/.test(value) && (value === '' || (Number(value) >= 0 && Number(value) <= 9999999999))) {
                                        setFormData({...formData, studentId: value});
                                    }
                                }}
                            />
                            <input
                                type='string'
                                id='phoneNumber'
                                value={formData.phoneNumber}
                                placeholder='Phone Number'
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-1/2 mr-l'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value = e.target.value;

                                    if (/^\d*$/.test(value)) {
                                        setFormData({...formData, phoneNumber: value});
                                    }
                                }}
                            />
                        </div>
                        <input
                            type='email'
                            id='email'
                            value={formData.email}
                            placeholder='Email'
                            required
                            className='border border-gray-300 text-gray-900 rounded-lg p-3 w-full'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})}
                        />
                        <div className='relative w-full flex'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                value={formData.password}
                                placeholder='Password'
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-full'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})}
                            />
                            <button
                                type='button'
                                className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 hover:text-gray-900'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </button>
                        </div>
                        <select
                            value={formData.roles}
                            required
                            className='border border-gray-300 text-gray-900 rounded-lg p-3 w-full'
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                if (e.target.value === 'PNM') {
                                    setFormData({...formData, chapter: '', roles: e.target.value});
                                } else {
                                    setFormData({
                                        ...formData,
                                        roles: e.target.value,
                                        city: '',
                                        state: '',
                                        country: '',
                                        gradeLevel: '',
                                        major: '',
                                        secondMajor: '',
                                        minor: '',
                                        gpa: '',
                                        instagram: '',
                                        linkedin: '',
                                    });
                                }
                            }}
                        >
                            <option
                                value=''
                                disabled
                            >
                                Select Status
                            </option>
                            <option value='PNM'>I am rushing</option>
                            <option value='Active'>I am an active</option>
                        </select>
                        <select
                            value={formData.organization}
                            required
                            className='border border-gray-300 text-gray-900 rounded-lg p-3 w-full'
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFormData({...formData, organization: e.target.value});
                                setOrgIndex(e.target.selectedIndex);
                            }}
                        >
                            <option
                                value=''
                                disabled
                            >
                                Select Organization
                            </option>
                            {sortedOrganizations?.map((org) => (
                                <option
                                    key={org._id}
                                    value={org._id}
                                >
                                    {org.name}
                                </option>
                            ))}
                        </select>
                        {formData.roles.includes('Active') && formData.organization && (
                            <select
                                value={formData.chapter}
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-full'
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, chapter: e.target.value})}
                            >
                                <option
                                    value=''
                                    disabled
                                >
                                    Select Chapter
                                </option>
                                {sortedOrganizations[orgIndex - 1].chapters?.map((chapter) => (
                                    <option
                                        key={chapter.chapterId}
                                        value={chapter.chapterId}
                                    >
                                        {chapter.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <button
                            type='button'
                            className='flex justify-center items-center flex-col hover:brightness-95'
                            onClick={handleTakePicture}
                        >
                            {formData.profilePicture ? (
                                <div className='flex relative'>
                                    <img
                                        src={URL.createObjectURL(formData.profilePicture)}
                                        alt='Profile Picture'
                                        className='h-32 w-32 object-cover rounded-full'
                                    />
                                    <IoAddCircleOutline size={36} className='bg-pacific-blue text-white rounded-full absolute right-0'/>
                                </div>
                            ) : (
                                <div className='flex relative'>
                                    <div className='flex justify-center items-center bg-gray-200 rounded-full h-32 w-32'>
                                        <span>Add Image</span>
                                    </div>
                                    <IoAddCircleOutline size={36} className='bg-pacific-blue text-white rounded-full absolute right-0'/>
                                </div>
                            )}
                        </button>
                        <input
                            type='file'
                            accept='image/*'
                            id='imageInput'
                            className='hidden'
                            onChange={handleImageChange}
                        />
                        <button
                            type='submit'
                            disabled={!isFormValid}
                            className={`bg-pacific-blue w-full hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next
                        </button>
                    </form>
                )}
                {step === 2 && (
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            setStep(3);
                        }}
                    >
                        <div className='flex'>
                            <input
                                type='text'
                                id='city'
                                placeholder='City'
                                value={formData.city}
                                required
                                className='border border-gray-300 text-gray-900 rounded-lg p-3 w-1/2 mr-2 h-12'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData({ ...formData, city: e.target.value })
                                }
                            />
                            <Select
                                id='state'
                                options={states}
                                value={states.find((option) => option.value === formData.state || null)}
                                onChange={handleStateChange}
                                placeholder='State'
                                isClearable
                                className='w-1/2'
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        height: '48px',
                                        minHeight: '48px',
                                        borderRadius: '0.5rem',
                                        borderColor: '#d1d5db',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: '#9ca3af',
                                        },
                                    }),
                                }}
                            />
                        </div>

                        <Select
                            id='country'
                            options={options}
                            value={options.find((option: { value: string; }) => option.value === formData.country)}
                            onChange={handleCountryChange}
                            placeholder='Select Country'
                            isClearable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    height: '48px',
                                    minHeight: '48px',
                                    borderRadius: '0.5rem',
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        borderColor: '#9ca3af',
                                    },
                                }),
                            }}
                        />
                        <select
                            value={formData.gradeLevel}
                            required
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, gradeLevel: e.target.value})}
                        >
                            <option
                                value=''
                                disabled
                            >
                                Select Grade Level
                            </option>
                            <option value='Freshman'>Freshman</option>
                            <option value='Sophomore'>Sophomore</option>
                            <option value='Junior'>Junior</option>
                            <option value='Senior'>Senior</option>
                        </select>
                        <input
                            type='text'
                            id='major'
                            placeholder='Major'
                            value={formData.major}
                            required
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, major: e.target.value})}
                        />
                        <input
                            type='text'
                            id='secondMajor'
                            placeholder='Second Major (Optional)'
                            value={formData.secondMajor}
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, secondMajor: e.target.value})}
                        />
                        <input
                            type='text'
                            id='minor'
                            placeholder='Minor (Optional)'
                            value={formData.minor}
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, minor: e.target.value})}
                        />
                        <input
                            type='number'
                            id='gpa'
                            placeholder='GPA'
                            value={formData.gpa}
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value;

                                if (/^\d*\.?\d{0,2}$/.test(value) && (value === '' || (Number(value) >= 0 && Number(value) <= 5))) {
                                    setFormData({...formData, gpa: value});
                                }
                            }}
                        />
                        <div className='flex w-full'>
                            <button
                                type='button'
                                className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded w-1/2 mr-2`}
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    setStep(1);
                                }}
                            >
                                Back
                            </button>
                            <button
                                type='submit'
                                disabled={!isSecondFormValid}
                                className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded w-1/2 ml-2 ${!isSecondFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                )}
                {step === 3 && (
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            setStep(4);
                        }}
                    >
                        <div className='text-lg'>Social Media Handles (Optional)</div>
                        <input
                            type='text'
                            name='instagram'
                            placeholder='Instagram Handle @'
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            value={formData.instagram}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, instagram: e.target.value})}
                        />
                        <input
                            type='text'
                            name='linkedin'
                            placeholder='LinkedIn Handle @'
                            className='border border-gray-300 text-gray-900 rounded-lg p-3'
                            value={formData.linkedin}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, linkedin: e.target.value})}
                        />
                        <div className='flex'>
                            <button
                                type='button'
                                className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded w-1/2 mr-2`}
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    setStep(2);
                                }}
                            >
                                Back
                            </button>
                            <button
                                type='submit'
                                className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded w-1/2 ml-2`}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                )}
                {step === 4 && (
                    <form
                        className='flex flex-col gap-4'
                        onSubmit={handleSubmit}
                    >
                        <div className='text-lg font-bold'>Terms of Service</div>
                        <div
                            ref={termsRef}
                            onScroll={handleScroll}
                            className='bg-gray-100 p-4 rounded-lg overflow-y-auto max-h-48 text-sm'
                        >
                            <p>
                                <strong>Grade, ASU Registration, Credit Hour, and Conduct Record Release</strong>
                                <br />
                                This document constitutes Consent to obtain and release my grades, ASU registration and credit hour information. 
                                It is understood that by signing below, I agree that ASU through the Fraternity & Sorority Life (FSL) staff may 
                                obtain my grades, ASU Registration, credit hour, and conduct information directly from the university and in turn 
                                release this information in accordance with this Consent. I further agree that ASU through FSL may discuss this 
                                information with the Authorized Recipients. This Consent applies to educational records that may otherwise be protected 
                                under the Family Educational Rights and Privacy Act of 1974, as amended, 20 U.S.C. 1232g. I specifically authorize and 
                                Consent to the release of this information to the President of my fraternity or sorority, council, and/or inter/national 
                                organization for the purpose of determining my membership status and overall chapter academic success. I acknowledge that 
                                this Consent is valid unless I revoke it in writing and present it to Fraternity & Sorority Life. Finally, by signing this 
                                document, I attest that I am enrolled in at least one credit hour at Arizona State University. I am also acknowledging 
                                my understanding that if at any time, I choose not to release grades or conduct record as stated above, I must submit 
                                my written request to the Office of Fraternity & Sorority Life.
                            </p>
                            <p>
                                <strong>Standard Photo Release</strong>
                                <br />
                                Additionally, by signing this form I also grant permission to FSL, on behalf of ASU, to use photographs taken of me 
                                during ASU events for use in university publications, websites or other electronic forms or media, and to offer the 
                                photographs for use or distribution to other university departments, without notifying me. I waive any right to inspect 
                                or approve the photographs, publications, or electronic matter that may be used in conjunction with them now or in the 
                                future, whether that use is known to me or unknown and I waive any rights to royalties or other compensation arising from 
                                or related to the use of the photographs. Also, I agree to release and hold harmless the Arizona Board of Regents, on behalf 
                                of Arizona State University, from and against any claims, damages or liability arising from or related to the use of these 
                                photographs, including but not limited to any re-use, distortion, blurring, alteration, optical illusion or use in composite 
                                form, either intentionally or otherwise, that may occur or be produced in production of the finished product.
                            </p>
                            <p>
                                <strong>Acknowledgment of University Policies</strong>
                                <br />
                                Further, by signing this form I acknowledge the ABOR Student Code of Conduct and any other policy pertaining to individual students, 
                                registered student organizations, my chapter, and my council. This includes, but is not limited to SSM 1301-01: Fraternities and 
                                Sororities-Relationship with the University.
                            </p>
                        </div>
                        <label className='flex items-center'>
                            <input
                                type='checkbox'
                                name='hasAgreedToTerms'
                                className='mr-2'
                                checked={formData.hasAgreedToTerms}
                                onChange={() => setFormData({ ...formData, hasAgreedToTerms: !formData.hasAgreedToTerms })}
                                disabled={!canCheck}
                                required
                            />
                            I agree to the terms and conditions
                        </label>
                        <button
                            type='submit'
                            disabled={!formData.hasAgreedToTerms}
                            className={`bg-pacific-blue hover:bg-turquoise-blue text-white font-bold py-2 px-4 rounded ${(!formData.hasAgreedToTerms) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Sign Up
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default SignupModal;