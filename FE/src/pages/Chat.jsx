import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import chatApi from '../api/ChatApi';

export default function Chat() {
  const { movingPlanId } = useParams();

  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputmessage, setInputmessage] = useState({ text: '' });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchChatList() {
      const response = await chatApi.chatlist(movingPlanId);
      setMessages(response.data.data.chats);
    }
    fetchChatList();

    const stomp = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/api/gs-guide-websocket'),
      debug: (str) => console.log(str), // 디버깅 로그 출력
    });

    stomp.onConnect = () => {
      console.log('✅ WebSocket 연결 성공!');

      stomp.subscribe(`/topic/${movingPlanId}`, (message) => {
        console.log('받은 메시지:', message.body); // 메시지 수신 시 출력

        const parsedMessage = JSON.parse(message.body); // JSON 문자열을 객체로

        setMessages((prev) => [...prev, parsedMessage]);
      });

      setStompClient(stomp);
    };

    stomp.onStompError = (frame) => {
      console.error('❌ WebSocket 연결 실패:', frame);
    };

    stomp.activate(); // WebSocket 활성화

    return () => {
      stomp.deactivate(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, []);

  useEffect(() => {
    // messages가 변경될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const textinput = (e) => {
    setInputmessage((prev) => ({ ...prev, text: e.target.value }));
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (inputmessage.text.trim() === '') {
      return;
    }

    if (stompClient && stompClient.connected) {
      const accessToken = localStorage.getItem('accessToken');

      const messageBody = JSON.stringify({
        text: inputmessage.text,
      });

      stompClient.publish({
        destination: `/app/chat/${movingPlanId}`,
        headers: { Authorization: `${accessToken}` },
        body: messageBody,
      });
    }
    setInputmessage({ text: '' });
  };

  const chatdelete = async (e) => {
    const isConfirmed = window.confirm('채팅을 삭제하시겠습니까?'); // 확인 대화상자 띄우기

    if (isConfirmed) {
      const response = await chatApi.chatsdelete(movingPlanId);
      setMessages([]);
    }
  };

  return (
    <>
      <div className="mx-auto my-10 max-w-200">
        <div className="flex justify-between">
          <div className="self-start text-xl ml-2 mb-2">채팅방</div>
          <div
            className="text-gray-500 text-opacity-70 underline cursor-pointer hover:text-primary mr-2"
            onClick={chatdelete}
          >
            채팅 삭제
          </div>
        </div>
        <div className="border rounded-3xl border-primary border-2 mb-10 h-130 w-full overflow-y-auto p-7">
          {messages.map((message) => {
            const { nickname, text, createTime } = message;

            return (
              <div className="w-full mb-5 flex flex-col items-end">
                <div className="mr-1 mb-1">{nickname}</div>
                <div className="flex items-end">
                  <div className="text-sm mr-2 text-gray-500">{createTime}</div>
                  <div className="border-2 rounded-lg border-primary w-fit max-w-140 px-1 break-words">
                    {text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form action="" className="flex w-full" onSubmit={sendMessage}>
          <input
            className="border rounded-xl border-black border-2 px-4 flex-grow h-10"
            onChange={textinput}
            value={inputmessage.text}
          />
          <button className="cursor-pointer w-[80px] h-10 border-2 rounded-xl text-black hover:bg-white hover:text-primary px-3 ml-3">
            보내기
          </button>
        </form>
      </div>
    </>
  );
}
