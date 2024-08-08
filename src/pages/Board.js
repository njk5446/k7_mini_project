import React from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Board = ({ idx, title, content, create_Date, nickname, station_no }) => {
    const navigate = useNavigate();

    const params = new URLSearchParams(useLocation().search);

    let sno = 96;
    // 해당 게시글의 수정페이지로 이동하는 함수
    const moveToUpdate = () => {
        navigate('/edit?idx=' + idx);
    };

    const config = {
        headers: {
            'Authorization': sessionStorage.getItem("token")
        }
    }
    //게시물 삭제 기능 함수
    const deleteBoard = async () => {
        try {
            const resp = await axios.post(`http://192.168.0.126:8080/checkUser?idx=${idx}`, '', config);
            if (resp.status === 200) {
                delBoard();
            }
        } catch (error) {
            if (error.response.status === 401) {
                alert('게시글 작성자가 아니므로 해당 게시물을 삭제 할 수 없습니다.');
                navigate('/board');
            }
        }
    }

};

const delBoard = () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
        // window.confirm: 확인(true), 취소(false)
        axios.post(`http://192.168.0.126:8080/delete?sno=${sno}&idx=${idx}`, '', config)
            .then(resp => {
                if (resp.data === 1) {
                    // (===): value, type 모두 동일한지
                    // (==): value만 동일한지 
                    alert('게시물이 삭제되었습니다.');
                    navigate('/board');
                } else {
                    alert('알 수 없는 오류가 발생했습니다.');
                    console.error();
                }
            })
    }
}

// 뒤로가기(게시판으로 이동)
const moveToList = () => {
    navigate('/board');
}

return (
    <div>
        <div>
            <h2>idx: {idx}</h2>
            <h2>title: {title}</h2>
            <h2>nickname: {nickname}</h2>
            <h2>create_Date: {create_Date}</h2>
            <p>content: {content}</p>
        </div>
        <div className="flex space-x-4">
            <button button className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={moveToUpdate}>수정</button>
            <button button className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={deleteBoard}>삭제</button>
            <button button className="flex w-full justify-center rounded-md bg-green-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                onClick={moveToList}>목록</button>

        </div>
    </div>

);
};

export default Board;