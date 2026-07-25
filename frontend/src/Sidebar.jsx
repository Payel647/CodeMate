import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const normalizeThreads = (payload) => {
        if (Array.isArray(payload)) {
            return payload;
        }

        if (payload && Array.isArray(payload.threads)) {
            return payload.threads;
        }

        return [];
    };

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread`);
            const contentType = response.headers.get("content-type") || "";
            let payload = null;

            if (contentType.includes("application/json")) {
                payload = await response.json();
            } else {
                payload = await response.text();
            }

            if (!response.ok) {
                console.error("Failed to fetch threads:", payload);
                setAllThreads([]);
                return;
            }

            const filteredData = normalizeThreads(payload).map(thread => ({
                threadId: thread.threadId || thread._id,
                title: thread.title || "New Chat"
            }));

            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
            setAllThreads([]);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${newThreadId}`);
            const contentType = response.headers.get("content-type") || "";
            let payload = null;

            if (contentType.includes("application/json")) {
                payload = await response.json();
            } else {
                payload = await response.text();
            }

            if (!response.ok) {
                console.error("Failed to fetch thread history:", payload);
                setPrevChats([]);
                setNewChat(false);
                setReply(null);
                return;
            }

            const messages = Array.isArray(payload) ? payload : payload?.messages || [];
            setPrevChats(messages);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
            setPrevChats([]);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => Array.isArray(prev) ? prev.filter(thread => thread.threadId !== threadId) : []);

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/logo.jpg" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By Payel Mallick &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;