import { Bar } from './style';
import { useEffect, useRef, useState } from 'react';
import {
    Breadcrumb,
    Layout,
    Menu,
    theme,
    Avatar,
    Divider,
    Space,
    Progress,
    Tabs,
    Upload,
    Modal,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserInfo } from 'components/User/UserInfo';
import { Like } from 'components/User/Like';
import axios from 'axios';
const token = localStorage.getItem('accessToken');

//TODO:코드라인이 심각하게 많아지고 있다 컴포넌트의 필요성을 절실하게 느끼는 중..
const { Header, Content, Footer } = Layout;
const tierColors = {
    bronze: '#964b00',
    silver: '#c0c0c0',
    gold: '#ffbd1b',
    platinum: '#A0B2C6',
};

const onChange = (key: string) => {
    console.log(key);
};
type Mock = {
    id: string;
    email: string;
    password: string;
    phoneNumber: string;
    point: number;
    username: string;
    created: string;
    avatarUrl: string;
    gitHubUrl: string;
};
const Profile: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [imgUrl, setImgUrl] = useState('');
    const imgLoadRef: any = useRef();
    //TODO: imgUrl update 500 ERR 백엔드와 상의
    const imgFileSend = async (body: any) => {
        try {
            const res = await await axios.post('/file/url', body);
            if (res.status === 200) {
                await axios.patch(
                    '/users/individuals',
                    { avatarUrl: `https\\${res.data.imageUrl}` },
                    { headers: { authorization: `Bearer ${token}` } },
                );
            }
            setImgUrl(res.data.imageUrl);
        } catch (e) {
            console.log(e);
        }
    };
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = (e: any) => {
        const formData1: any = new FormData();
        // const blob = new Blob(, { type: 'image/png' });
        // console.log(blob);

        formData1.append('image', imgLoadRef.current.files[0]);
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
            imgFileSend(formData1);
            e.target.parentElement.parentElement.parentElement.children[1].children[0].value = '';
            console.log(imgLoadRef.current.files[0]);
        }, 2000);
    };

    const handleCancel = (e: any) => {
        // console.log(
        //     e.target.parentElement.parentElement.parentElement.children[1].children[0].value,
        // );
        e.target.parentElement.parentElement.parentElement.children[1].children[0].value = '';
        console.log('Clicked cancel button');
        setOpen(false);
    };
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [res, setRes] = useState<Mock>({
        id: '',
        email: '',
        password: '',
        phoneNumber: '',
        point: 0,
        username: '',
        created: '',
        avatarUrl: '',
        gitHubUrl: '',
    });
    async function getProfile() {
        try {
            const token = localStorage.getItem('accessToken');

            const mocks = await axios
                .get('/users/individuals', {
                    headers: { authorization: `Bearer ${token}` },
                })
                .then(res => res.data)
                .then(res => res.data);

            console.log(mocks);

            setRes(mocks);
            console.log(res.point);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    const arr = [20, 40, 100, 300];
    let upperLimit = arr[0];
    let lowerLimit = 0;
    let tier = 'Bronze';
    let tierColor = tierColors.bronze;

    arr.map((e: number, idx: number): void => {
        if (e <= res.point) {
            upperLimit = arr[idx + 1];
            if (upperLimit === 40) {
                tier = 'Silver';
                tierColor = tierColors.silver;
            } else if (upperLimit === 100) {
                tier = 'Gold';
                tierColor = tierColors.gold;
            } else if (upperLimit === 300) {
                tier = 'Platinum';
                tierColor = tierColors.platinum;
            }
            if (upperLimit === arr[0]) {
                lowerLimit = 0;
            } else {
                lowerLimit = upperLimit - arr[idx];
            }
        }
    });
    console.log(upperLimit, lowerLimit);

    let testWidth: number = ((res.point - lowerLimit) / (upperLimit - lowerLimit)) * 100;

    if (testWidth === 100) testWidth = 0;

    console.log(testWidth);

    return (
        <Layout className="layout">
            <Content style={{ padding: '0 50px', height: '768px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}></Breadcrumb>
                <div
                    className="site-layout-content"
                    style={{ background: colorBgContainer, height: '100%' }}
                >
                    <div>
                        <Space direction="vertical">
                            <div>
                                <Modal
                                    title="Title"
                                    open={open}
                                    onOk={handleOk}
                                    confirmLoading={confirmLoading}
                                    onCancel={handleCancel}
                                    maskClosable={false}
                                    keyboard={false}
                                    closable={false}
                                >
                                    <input type="file" ref={imgLoadRef}></input>
                                </Modal>
                                <Avatar
                                    size={120}
                                    icon={<UserOutlined />}
                                    src={`${imgUrl === '' ? res.avatarUrl : imgUrl}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={showModal}
                                />
                            </div>
                            <div style={{ height: '38px' }}>
                                <span style={{ fontSize: '35px' }}>{res.username}</span>
                            </div>
                            <div>
                                <div style={{ width: `${testWidth}%` }}></div>
                            </div>
                            <p style={{ color: `${tierColor}`, fontWeight: 'bold' }}>{tier}</p>
                        </Space>
                    </div>
                    <Progress
                        percent={testWidth}
                        status="active"
                        strokeColor={{ '0%': `${tierColor}`, '100%': `${tierColor}` }}
                    />
                    {/* //TODO: 추후 Tabs 이부분 컴포넌트화 해야함^^ */}
                    {tier === 'Platinum' ? (
                        <Tabs
                            defaultActiveKey="1"
                            onChange={onChange}
                            items={[
                                {
                                    label: `유저정보`,
                                    key: '1',
                                    children: <UserInfo user={res}></UserInfo>,
                                },
                                {
                                    label: `좋아요`,
                                    key: '2',
                                    children: ``,
                                },
                                {
                                    label: `첨삭`,
                                    key: '3',
                                    children: `Content of Tab Pane 3`,
                                },
                            ]}
                        />
                    ) : (
                        <Tabs
                            defaultActiveKey="1"
                            onChange={onChange}
                            items={[
                                {
                                    label: `유저정보`,
                                    key: '1',
                                    children: <UserInfo user={res}></UserInfo>,
                                },
                                {
                                    label: `좋아요`,
                                    key: '2',
                                    children: <Like></Like>,
                                },
                                {
                                    label: `첨삭(플레티넘)`,
                                    key: '3',
                                    children: `Content of Tab Pane 3`,
                                    disabled: true,
                                },
                            ]}
                        />
                    )}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
    );
};

export default Profile;
