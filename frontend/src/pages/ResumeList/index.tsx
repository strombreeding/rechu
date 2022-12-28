import { Alert, ContentElement } from './style';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Button, Layout, Modal, List } from 'antd';
import Header from 'components/Header';
const { Footer, Content } = Layout;
type Mock = { resumeName: string; address: string; updatedAt: string; resumeId: any };
let id: any;
let test: string = '';

const ResumeMain = () => {
    const [res, setRes] = useState<Mock[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [portfolioId, setPortfolioId] = useState('');
    const navigate = useNavigate();
    const showModal = (e: any) => {
        e.stopPropagation();
        // setPortfolioId(e.target.parentNode.value);
        test = e.currentTarget.value;
        setIsModalOpen(true);
        setPortfolioId(test);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        deletePortfolio(portfolioId);
    };
    console.log('hi');
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // /my-portfolio/resumes/:resumeId
    async function deletePortfolio(id: string) {
        console.log(portfolioId);

        try {
            const res = await axios.delete(`/my-portfolio/resumes/${id}`);

            if (res.status === 200) {
                getPortfolio();
            }
        } catch (e) {
            console.log(e);
        }
    }
    const gotoModify = (e: any) => {
        e.stopPropagation();
        navigate(`/resume/${e.currentTarget.value}/edit`);
    };
    const gotoPost = (e: any) => {
        window.open(`/resume/${e.currentTarget.id}`, '_blank');
    };
    async function getPortfolio() {
        try {
            const token = localStorage.getItem('accessToken');

            const mocks = await axios
                .get('/my-portfolio/resumes', {
                    headers: { authorization: `Bearer ${token}` },
                })
                .then(res => res.data)
                .then(res => res.data);

            await setRes(mocks);
        } catch (e) {
            console.log(e);
        }
    }
    async function postPortfolio() {
        try {
            const token = localStorage.getItem('accessToken');
            const mocks = await axios.post(
                '/my-portfolio/new-resume',
                {},
                {
                    headers: { authorization: `Bearer ${token}` },
                },
            );

            id = mocks.data.data[0].insertId;
            if (mocks.status === 200) {
                navigate(`/resume/${id}/edit`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getPortfolio();
    }, []);

    return (
        <>
            {' '}
            <Layout style={{ backgroundColor: 'white' }}>
                <Header></Header>
                <Content
                    style={{
                        backgroundColor: 'white',
                        margin: '30px',
                        width: '-webkit-calc(100% - 80px)',
                    }}
                >
                    <ContentElement>
                        <div onClick={postPortfolio}>
                            <div>
                                <div>
                                    <i>+</i>
                                </div>
                                <p>새 이력서 작성</p>
                            </div>
                        </div>
                    </ContentElement>
                    <Alert>{res.length === 0 && <p>작성된 이력서가 없습니다.</p>}</Alert>

                    <Modal
                        title="이력서 삭제"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                    >
                        <p>정말로 해당 이력서를 삭제하시겠습니까?</p>
                    </Modal>
                    <List
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                            md: 4,
                            lg: 4,
                            xl: 6,
                            xxl: 3,
                        }}
                        dataSource={res}
                        renderItem={(e: Mock) => (
                            <List.Item style={{ background: 'white' }}>
                                <Card
                                    onClick={gotoPost}
                                    key={e.resumeId}
                                    id={e.resumeId}
                                    style={{
                                        marginTop: 16,
                                        cursor: 'pointer',
                                        border: '1px solid #dbdbdb',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                                        backgroundColor: 'white',
                                    }}
                                    title={e.resumeName}
                                    bordered={true}
                                    extra={
                                        <div style={{ display: 'flex' }}>
                                            <Button
                                                type="primary"
                                                shape="round"
                                                value={e.resumeId}
                                                onClick={gotoModify}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                shape="round"
                                                style={{ marginLeft: '5px' }}
                                                value={e.resumeId}
                                                onClick={showModal}
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                    }
                                >
                                    {e.updatedAt.split('T')[0]}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Content>
                <Footer style={{ backgroundColor: 'white' }}>Footer</Footer>
            </Layout>
        </>
    );
};

export default ResumeMain;
