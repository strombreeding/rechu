import { Link } from 'react-router-dom';

const Main = () => {
   return (
      <>
         <h1>Main Page!</h1>
         <Link to="/login">로그인 페이지 바로가기</Link>
      </>
   );
};

export default Main;