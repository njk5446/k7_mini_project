import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
import BoardWrite from './pages/BoardWrite';
import BoardEdit from './pages/BoardEdit';
import MyPage from './pages/Mypage';
import { useState } from 'react';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUser, FaUserCog, FaUserPlus } from "react-icons/fa";
import UserProfile from './pages/UserProfile';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증상태를 초기는 false로 선언
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // 아코디언 열림 닫힘여부, (초기상태는 닫힘(false))

  // 로그인폼으로 로그인시, 호출
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // 마이페이지에서 으로 로그아웃시, 호출
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // 로그인 인증된 사용자는 로그아웃, 마이페이지 아코디언이 보이고,
  // 로그인 인증되지않은 사용자는 로그인, 회원가입이 보인다
  const checkLogin = () => {
    if (sessionStorage.getItem("token") != null) {
      // 토큰값이 null이 아니면(로그인된 상태), 다음 태그를 아코디언에 출력
      return (
        <ul className='mt-2 space-y-2 pl-4'>
          <li>
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 hover:text-blue-400'>
              <FaSignOutAlt className='text-lg' />
              <span>로그아웃</span>
            </button>
          </li>
          <li>
            <Link
              to="/mypage"
              className='flex items-center space-x-2 hover:text-blue-400'>
              <FaUserCog className='text-lg' />
              <span>마이페이지</span>
            </Link>
          </li>
        </ul>

      )
    }
    else return ( // 토큰값이 null이면(로그인 안된 상태) 다음 태그를 아코디언에 출력
      <ul className='mt-2 space-y-2 pl-4'>
        <li>
          <Link
            to="/login"
            className='flex items-center space-x-2 hover:text-blue-400'>
            <FaSignInAlt className='text-lg' />
            <span>로그인</span>
          </Link>
        </li>
        <li>
          <Link
            to="/signup"
            className='flex items-center space-x-2 hover:text-blue-400'>
            <FaUserPlus className='text-lg' />
            <span>회원가입</span>
          </Link>
        </li>
      </ul>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col w-full max-w-screen-lg h-screen mx-auto">
        <header className='flex justify-between items-center text-xl font-bold h-24 p-10 bg-green-400'>

          <ul className='flex justify-center items-center text-sm'>
            <li className='mx-2 p-2 rounded-md
                         hover:bg-white hover:text-blue-600'>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                <FaHome style={{ marginRight: '8px', fontSize: '40px' }} />
              </Link>
            </li>
            <li>
              <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className='flex items-center space-x-2 hover:text-blue-400'>
                <FaUser style={{ marginLeft: '10px', marginRight: '10px', fontSize: '30px' }} />
              </button>
              {isAccordionOpen && 
                checkLogin()
              }
            </li>
            <li className='mx-2 p-2 rounded-md
                         hover:bg-white hover:text-blue-600'>
              <Link to='/board' state={{ refresh: true }} style={{ marginRight: '8px', fontSize: '25px' }}>게시판</Link>
            </li>
          </ul>
        </header>
        <main className='grow w-full flex justify-center items-center overflow-y-auto '>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login'
              element={isAuthenticated ? (<Navigate to="/mypage" />) : (<LoginPage onLogin={handleLogin} />)} />
            {/* 로그인으로 인증되면 true(Navigate훅을 통해 userProfile 컴포넌트로 접근), 
            로그인 안했으면 false(LoginPage 컴포넌트로 접근)
              */}
            {/* onLogin: 로그인폼에서 로그인 시도할때, handleLogin 함수가 호출되어 isAuthenticated=true. */}
            <Route path='/mypage'
              element={isAuthenticated ? (<MyPage onLogout={handleLogout} />) : (<Navigate to="/login" />)} />
            {/* 로그인 인증된것인지(인증후 내비게이트로 이동되었을시, 직접 userProfile로 접근 시) 확인 후 
                true(UserProfile의 로그아웃폼 처리) 
                false(내비게이트 훅을 통해 로그인페이지로 리다이렉트)
                onLogout: 로그아웃폼에서 로그아웃 시도할때, handleLogout 함수가 호출되어 isAuthenticated=false*/}
            <Route path='/signup'
              element={<SignupPage />} />
            <Route path='/board' element={<BoardList />} />
            <Route path='/board/view' element={<BoardDetail />} />
            <Route path='/write' element={<BoardWrite />} />
            <Route path='/edit' element={<BoardEdit />} />
            <Route path='/userProfile'
              element={isAuthenticated ? (<UserProfile onLogout={handleLogout} />) : (<Navigate to='/userProfile' />)} />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;



// const isAuthenticated = !!localStorage.getItem("token");
// localStorage: 웹브라우저에 데이터 저장소, 페이지 새로고침해도 데이터가 사라지지않는다. (브라우저의 영구적인 메모리)
// 명시적으로 삭제하지않는한 계속 유지된다 (DB와는 별개의 저장소이며 클라이언트가 간단한 데이터 저장 및 조회를 위해 사용한다)
