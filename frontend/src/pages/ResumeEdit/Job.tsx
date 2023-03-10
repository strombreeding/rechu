import { DatePicker } from 'antd';
import React, { useState } from 'react';
import { FormStore, WorkFormData } from 'models/resumeEdit-model';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API from 'utils/api';

type WorkFormState = {
    setIsWorkFormToggle: React.Dispatch<React.SetStateAction<boolean>>;
    setAddJobElement: React.Dispatch<React.SetStateAction<FormStore[]>>;
    addJobElement: FormStore[];
    onCareerCreated: (state: any) => void;
};

const Job = ({
    setIsWorkFormToggle,
    setAddJobElement,
    addJobElement,
    onCareerCreated,
}: WorkFormState) => {
    const [isStilWork, setIsStilWork] = useState<boolean>(true);

    const [workFormDataState, setWorkFormDataState] = useState<WorkFormData>({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        reward: '',
        notDevlop: false,
        workNow: false,
    });

    const params = useParams();
    const resumeIds = params.id;

    const workFormHandler = (
        e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>,
    ) => {
        const target = e.target;
        const checked = isStilWork ? false : true;

        setWorkFormDataState({
            ...workFormDataState,
            workNow: checked,
            [target.name]: target.value,
        });
    };

    const workStartTimeHandler = (date: any, dateString: string) => {
        setWorkFormDataState({
            ...workFormDataState,
            startDate: dateString,
        });
    };

    const workEndTimeHandler = (date: any, dateString: string) => {
        setWorkFormDataState({
            ...workFormDataState,
            endDate: dateString,
        });
    };

    // const deleteWorkForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     const deleteFilter = addJobElement.filter((tem: FormStore) => tem.list !== idx);
    //     setAddJobElement(deleteFilter);
    //     if (deleteFilter.length === 0) setIsWorkFormToggle(e => !e);
    // };

    const validationForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (workFormDataState.startDate === '') {
            alert('??????????????? ??????????????????.');
            return;
        }

        try {
            const res = await axios.post(
                `${API.BASE_URL}/my-portfolio/resumes/${resumeIds}/new-career`,
                {
                    company: workFormDataState.company,
                    position: workFormDataState.position,
                    startDate: workFormDataState.startDate,
                    endDate: workFormDataState.endDate,
                    reward: workFormDataState.reward,
                    notDevlop: workFormDataState.notDevlop,
                    workNow: workFormDataState.workNow,
                },
            );

            const insertId = res.data.data[0].insertId;
            const result = await axios.get(`${API.BASE_URL}/my-portfolio/careers/${insertId}`);

            if (res.status === 200) {
                onCareerCreated(result.data.data);
                setIsWorkFormToggle(false);
            }
        } catch (err: unknown) {
            console.log(err);
        }
    };

    return (
        <form onSubmit={validationForm}>
            <div className="formWrap">
                <ul>
                    <li>
                        <dl>
                            <dt>?????????</dt>
                            <dd>
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="?????? ??????"
                                    value={workFormDataState.company}
                                    onChange={workFormHandler}
                                    required
                                />
                            </dd>
                        </dl>
                        <dl>
                            <dt>??????</dt>
                            <dd>
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="???????????????"
                                    value={workFormDataState.position}
                                    onChange={workFormHandler}
                                    required
                                />
                            </dd>
                        </dl>
                        <dl className="noneDevelop">
                            <dt>
                                <input
                                    type="checkbox"
                                    name="notDevlop"
                                    onChange={e =>
                                        setWorkFormDataState({
                                            ...workFormDataState,
                                            notDevlop: e.target.checked,
                                        })
                                    }
                                />
                            </dt>
                            <dd>
                                <label>????????? ??????</label>
                            </dd>
                        </dl>
                    </li>
                </ul>

                <ul>
                    <li>
                        <dl>
                            <dt>
                                <label>??????</label>
                                <small>?????? ??? </small>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={isStilWork ? true : false}
                                        onClick={(): void => setIsStilWork(!isStilWork)}
                                        onChange={workFormHandler}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </dt>

                            <dd>
                                <DatePicker
                                    placeholder="YYYY-MM"
                                    picker="month"
                                    name="startDate"
                                    onChange={workStartTimeHandler}
                                />
                            </dd>
                        </dl>
                        {!isStilWork && (
                            <dl>
                                <dt>??????</dt>
                                <dd>
                                    <DatePicker
                                        placeholder="YYYY-MM"
                                        picker="month"
                                        name="endDate"
                                        onChange={workEndTimeHandler}
                                    />
                                </dd>
                            </dl>
                        )}
                    </li>
                </ul>

                <ul>
                    <li>
                        <label>?????? ??????</label>
                    </li>
                    <li>
                        <textarea
                            maxLength={500}
                            placeholder={`???????????? ????????? ?????? ????????? ?????? ??????????????????. \n????????? ?????? ???????????? ????????? ??? ????????? ??? ????????????.`}
                            name="reward"
                            onChange={workFormHandler}
                        ></textarea>
                    </li>
                </ul>
            </div>

            <div className="formBtn">
                <button type="button" onClick={() => setIsWorkFormToggle(e => !e)}>
                    ??????
                </button>
                <button type="submit">??????</button>
            </div>
        </form>
    );
};

export default Job;
