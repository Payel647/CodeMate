import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const [copiedMessage, setCopiedMessage] = useState(null);
    const chatEndRef = useRef(null);

    const copyToClipboard = async (text, id) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedMessage(id);
            setTimeout(() => setCopiedMessage(null), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }
        if (!prevChats?.length) return;

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);

        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [prevChats, latestReply, newChat]);

    return (
        <>
            {newChat && (
                <div className="emptyState">
                    <h2>Start a new chat</h2>
                    <p>Ask about debugging, code explanations, architecture ideas, or project help.</p>
                </div>
            )}
            <div className="chats">
                {
                    prevChats?.slice(0, -1).map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === 'user' ? (
                                    <p className="userMsg">{chat.content}</p>
                                ) : (
                                    <div className="assistantBubble">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                        <button
                                            className="copyButton"
                                            onClick={() => copyToClipboard(chat.content, `${idx}-${chat.role}`)}
                                        >
                                            {copiedMessage === `${idx}-${chat.role}` ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )
                }



                {
                    prevChats.length > 0 && latestReply !== null &&
                    <div className="gptDiv" key={"typing"}>
                        <div className="assistantBubble">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                            <button
                                className="copyButton"
                                onClick={() => copyToClipboard(latestReply, "typing")}
                            >
                                {copiedMessage === "typing" ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                }

                {
                    prevChats.length > 0 && latestReply === null &&
                    <div className="gptDiv" key={"non-typing"}>
                        <div className="assistantBubble">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                            <button
                                className="copyButton"
                                onClick={() => copyToClipboard(prevChats[prevChats.length - 1].content, "non-typing")}
                            >
                                {copiedMessage === "non-typing" ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                }

                <div ref={chatEndRef} />
            </div>
        </>
    )
}

export default Chat;