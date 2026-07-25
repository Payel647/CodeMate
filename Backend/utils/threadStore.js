import mongoose from "mongoose";
import Thread from "../models/Thread.js";

const memoryThreads = [];

const normalizeThread = (thread) => ({
    _id: thread._id || thread.threadId,
    threadId: thread.threadId,
    title: thread.title || "New Chat",
    messages: Array.isArray(thread.messages) ? thread.messages : [],
    createdAt: thread.createdAt || new Date(),
    updatedAt: thread.updatedAt || new Date(),
});

export const isMongoReady = () => mongoose.connection.readyState === 1;

export const listThreads = async () => {
    if (!isMongoReady()) {
        return memoryThreads
            .slice()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map(normalizeThread);
    }

    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    return threads.map(normalizeThread);
};

export const getThreadMessages = async (threadId) => {
    if (!isMongoReady()) {
        const thread = memoryThreads.find((item) => item.threadId === threadId);
        return Array.isArray(thread?.messages) ? thread.messages : [];
    }

    const thread = await Thread.findOne({ threadId });
    return Array.isArray(thread?.messages) ? thread.messages : [];
};

export const saveThreadChat = async (threadId, message, assistantReply) => {
    if (!isMongoReady()) {
        let thread = memoryThreads.find((item) => item.threadId === threadId);

        if (!thread) {
            thread = {
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            memoryThreads.unshift(thread);
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        if (!thread.title || thread.title === "New Chat") {
            thread.title = message;
        }

        return { reply: assistantReply };
    }

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
        thread = new Thread({
            threadId,
            title: message,
            messages: [{ role: "user", content: message }],
        });
    } else {
        thread.messages.push({ role: "user", content: message });
    }

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    return { reply: assistantReply };
};

export const deleteThreadById = async (threadId) => {
    if (!isMongoReady()) {
        const index = memoryThreads.findIndex((item) => item.threadId === threadId);

        if (index === -1) {
            return null;
        }

        memoryThreads.splice(index, 1);
        return { success: true };
    }

    return Thread.findOneAndDelete({ threadId });
};
