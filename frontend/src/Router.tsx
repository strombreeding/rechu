import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from 'pages/Main';
import Login from 'pages/Login';
import ResumeEdit from 'pages/ResumeEdit';
import Post from 'pages/Post';
import PostCreate from 'pages/PostCreate';
import Join from 'pages/Join';
import FindPw from 'pages/FindPw';
import ResumeList from 'pages/ResumeList';
import Profile from 'pages/Profile';
import Err404 from 'pages/Err404';
import Admin from 'pages/Admin';
import Resume from 'pages/Resume';
import Loading from 'pages/Loading';
import AdminUser from 'components/Admin/AdminUser';
import AdminContent from 'components/Admin/AdminContent';
const Router = () => {
    const isLogined = localStorage.getItem('accessToken') ? true : false;
    // <Route> => <BasicRouter>, <AdminRouter>, <AuthRouter>
    return (
        <BrowserRouter>
            <Routes>
                {isLogined ? (
                    <>
                        <Route path="/" element={<Main />} />
                        <Route path="/resume/:id" element={<ResumeEdit />} />
                        <Route path="/post/:postId" element={<Post />} />
                        <Route path="/post/:postId/edit" element={<PostCreate />} />
                        <Route path="/post/create" element={<PostCreate />} />
                        <Route path="/myportfolio" element={<ResumeList />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Navigate replace to="/" />} />
                        <Route path="/find-pw" element={<Navigate replace to="/" />} />
                        <Route path="/join" element={<Navigate replace to="/" />} />
                        <Route path="/*" element={<Err404 />} />
                        <Route path="/resume" element={<Resume />} />
                        <Route path="/admin" element={<Admin />}>
                            <Route path="user" element={<AdminUser />} />
                            <Route path="content" element={<AdminContent />} />
                        </Route>
                        <Route path="/loading" element={<Loading />} />
                        <Route path="/*" element={<Err404 />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<Main />} />
                        <Route path="/resume/:id" element={<Navigate replace to="/" />} />
                        <Route path="/post/create" element={<PostCreate />} />
                        <Route path="/post/:postId" element={<Navigate replace to="/" />} />
                        <Route path="/myportfolio" element={<Navigate replace to="/" />} />
                        <Route path="/profile" element={<Navigate replace to="/" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/find-pw" element={<FindPw />} />
                        <Route path="/join" element={<Join />} />
                        <Route path="/*" element={<Err404 />} />
                        <Route path="/admin" element={<Admin />}>
                            <Route path="user" element={<AdminUser />} />
                            <Route path="content" element={<AdminContent />} />
                        </Route>
                        <Route path="/loading" element={<Loading />} />
                        <Route path="/*" element={<Err404 />} />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
