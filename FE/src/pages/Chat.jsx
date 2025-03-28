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
      console.log(stompClient);

      const messageBody = JSON.stringify({ text: '123' });
      stompClient.publish({ destination: `/app/chat/${movingPlanId}`, body: messageBody }); // 서버로 메시지 전송
    }
  };

  return (
    <>
      <button onClick={sendMessage}>Chat</button>
      {messages.map((message) => {
        return <div>{message.text}</div>;
      })}
    </>
  );
}
