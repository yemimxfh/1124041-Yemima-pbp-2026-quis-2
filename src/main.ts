import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Posts } from '../models/Posts'; // Sesuaikan path-nya
import { Comments } from '../models/Comments'; // Sesuaikan path-nya
import { appConfig } from '../appConfig';

// 1. Inisialisasi Sequelize dengan Model McD
const sequelize = new Sequelize({
    ...appConfig.database, // Pakai config dari .env biar pro
    models: [Posts, Comments], // Masukkan model baru di sini
}as any);

const app = express();
app.use(express.json());

// 2. Jalur Distribusi (Router)
const postRouter = express.Router();
app.use('/api', postRouter);

// --- CRUD post ---

// A. GET ALL post (Read)
postRouter.get('/', async (req, res) => {
    try {
        const records = await Posts.findAll({
            include: [Comments] 
        });
        res.json({ success: true, data: records });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

postRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const records = await Posts.findByPk(id);
        res.json({ success: true, data: records });
        if (!records) return res.status(404).json({ success: false, message: "Post ga ada!" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// B. CREATE post (Create)
postRouter.post('/', async (req, res) => {
    try {
        const { title, content, username } = req.body;
        const postBaru = await Posts.create({ title, content, username });

        res.status(201).json({
            success: true,
            message: "Post berhasil ditambah!",
            data: postBaru
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// C. UPDATE post (Update)
postRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const post = await Posts.findByPk(id);
        
        if (!post) return res.status(404).json({ success: false, message: "Post ga ada!" });

        await post.update({ title, content });
        res.json({ success: true, data: post });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// D. DELETE post (Delete)
postRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Posts.findByPk(id);
        if (!post) return res.status(404).json({ success: false, message: "Mau hapus apa? post ga ada!" });

        await post.destroy();
        res.json({ success: true, message: "post berhasil dimusnahkan!" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Siap Tempur!" });
});

const commentRouter = express.Router();
app.use('/post-comment', commentRouter);

// --- CRUD comments ---

// A. GET ALL comments (Read)
postRouter.get('/:id', async (req, res) => {
    try {
        const records = await Comments.findAll({
            include: [Posts] 
        });
        res.json({ success: true, data: records });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// B. CREATE comments (Create)
postRouter.post('/', async (req, res) => {
    try {
        const { postId, content, username } = req.body;
        const postBaru = await Posts.create({ postId, content, username });

        res.status(201).json({
            success: true,
            message: "Post berhasil ditambah!",
            data: postBaru
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// C. UPDATE post (Update)
postRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = await Comments.findByPk(id);
        
        if (!comment) return res.status(404).json({ success: false, message: "Comment ga ada!" });

        await comment.update({ content });
        res.json({ success: true, data: comment });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// D. DELETE post (Delete)
postRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comments.findByPk(id);
        if (!comment) return res.status(404).json({ success: false, message: "Mau hapus apa? comment ga ada!" });

        await comment.destroy();
        res.json({ success: true, message: "comment berhasil dimusnahkan!" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Siap Tempur!" });
});

// 3. Nyalakan Server & Sync Database
const PORT = appConfig.server.port;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        // MANTRA SAKTI: Ini yang gantiin fungsi migration manual!
        await sequelize.sync({ alter: true }); 
        
        console.log("-------------");
        console.log("📝 Database Connected & Sync Berhasil!");
        console.log("🚀 Server Posts di port: " + PORT);
        console.log("-------------");
    } catch (e) {
        console.error("Dapur kebakaran! Gagal konek database:", e);
    }
});