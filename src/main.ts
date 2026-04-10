import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { Menu } from './models/Menu'; // Sesuaikan path-nya
import { Kategori } from './models/Kategori'; // Sesuaikan path-nya
import { appConfig } from '../appConfig';

// 1. Inisialisasi Sequelize dengan Model McD
const sequelize = new Sequelize({
    ...appConfig.database, // Pakai config dari .env biar pro
    models: [Kategori, Menu], // Masukkan model baru di sini
}as any);

const app = express();
app.use(express.json());

// 2. Jalur Distribusi (Router)
const menuRouter = express.Router();
app.use('/menu', menuRouter);

// --- CRUD MENU ---

// A. GET ALL MENU (Read)
menuRouter.get('/', async (req, res) => {
    try {
        const records = await Menu.findAll({
            include: [Kategori] // Biar kelihatan kategorinya apa
        });
        res.json({ success: true, data: records });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// B. CREATE MENU (Create)
menuRouter.post('/', async (req, res) => {
    try {
        const { namaProduk, harga, kategoriId } = req.body;
        const menuBaru = await Menu.create({ namaProduk, harga, kategoriId });

        res.status(201).json({
            success: true,
            message: "Menu McD berhasil ditambah!",
            data: menuBaru
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// C. UPDATE MENU (Update)
menuRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { namaProduk, harga, kategoriId } = req.body;
        const menu = await Menu.findByPk(id);
        
        if (!menu) return res.status(404).json({ success: false, message: "Menu ga ada!" });

        await menu.update({ namaProduk, harga, kategoriId });
        res.json({ success: true, data: menu });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// D. DELETE MENU (Delete)
menuRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await Menu.findByPk(id);
        if (!menu) return res.status(404).json({ success: false, message: "Mau hapus apa? Menu ga ada!" });

        await menu.destroy();
        res.json({ success: true, message: "Menu berhasil dimusnahkan!" });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Hello Princess Yemima! Dapur McD Siap Tempur!" });
});

// 3. Nyalakan Server & Sync Database
const PORT = appConfig.server.port;
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        // MANTRA SAKTI: Ini yang gantiin fungsi migration manual!
        await sequelize.sync({ alter: true }); 
        
        console.log("-------------");
        console.log("🍟 Database Connected & Sync Berhasil!");
        console.log("🚀 Server McD di port: " + PORT);
        console.log("-------------");
    } catch (e) {
        console.error("Dapur kebakaran! Gagal konek database:", e);
    }
});