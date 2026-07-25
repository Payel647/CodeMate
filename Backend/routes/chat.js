import express from "express";
import getOpenAIAPIResponse from "../utils/openai.js";
import { deleteThreadById, getThreadMessages, listThreads, saveThreadChat } from "../utils/threadStore.js";

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
router.get("/thread", async(req, res) => {
    try {
        const threads = await listThreads();
        return res.json(threads);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Failed to fetch threads", threads: []});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const messages = await getThreadMessages(threadId);

        if (!messages.length) {
            return res.status(404).json({error: "Thread not found", messages: []});
        }

        return res.json(messages);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Failed to fetch chat", messages: []});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await deleteThreadById(threadId);

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        return res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        const assistantReply = await getOpenAIAPIResponse(message);
        const result = await saveThreadChat(threadId, message, assistantReply);
        return res.json(result);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "something went wrong"});
    }
});




export default router;