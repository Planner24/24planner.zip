import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';

export default function Chat() {
  const { movingPlanId } = useParams();

  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const accessToken = localStorage.getItem('accessToken');

      const messageBody = JSON.stringify({ text: '123' });
      stompClient.publish({
        destination: `/app/chat/${movingPlanId}`,
        headers: { Authorization: `${accessToken}` },
        body: messageBody,
      }); // 서버로 메시지 전송
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mx-60 my-15 box-border max-w-200">
        <div className="w-full">
          <div className="border rounded-3xl border-primary border-2 mb-10 px-18 py-12 h-120 overflow-y-auto"></div>
          <form action="" className="flex items-center w-full">
            <input className="border rounded-xl border-black border-2 px-4 py-3 flex-grow h-10" />
            <button className="cursor-pointer h-10 border-2 rounded-xl px-3 text-black hover:bg-white hover:text-primary ml-3 w-[80px]">
              보내기
            </button>
          </form>
        </div>
      </div>
      <button onClick={sendMessage}>Chat</button>
      {messages.map((message) => {
        console.log(message);

        const { nickname, text } = message;

        return (
          <>
            <div>{nickname}</div>
            <div>{text}</div>
          </>
        );
      })}
    </>
  );
}
