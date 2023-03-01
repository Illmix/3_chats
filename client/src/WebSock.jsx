import React, {useRef, useState} from 'react';
const WebSock = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false);
    const [username, setUsername] = useState('')

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now(),
            }
            socket.current.send(JSON.stringify(message))
            console.log('Message sended')
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket closed')
        }
        socket.current.onerror = () => {
            console.log('Error')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input type="text"
                           value={username}
                           onChange={event => setUsername(event.target.value)}
                           placeholder="Enter your name"/>
                    <button onClick={connect}>Sign in</button>
                </div>
            </div>
        )
    }

    return (
        <div className="center">
            <div>
                <div className="form">
                    <input type="text" value={value} onChange={e => setValue(e.target.value)}/>
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                            ? <div className="connection_message">
                                    {mess.username} connected
                            </div>
                            : <div className="message">
                                    {mess.username}. {mess.message}
                            </div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;