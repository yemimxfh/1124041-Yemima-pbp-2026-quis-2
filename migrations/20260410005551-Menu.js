'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Menus', { // Nama tabel jamak biasanya 'Menus'
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      namaProduk: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      harga: {
        type: Sequelize.INTEGER, // Harga pake angka biar bisa dihitung
        allowNull: false,
      },
      deskripsi: {
        type: Sequelize.STRING,
        allowNull: true, // Deskripsi boleh kosong lah ya
      },
      // INI BAGIAN PENTING: Relasi ke Kategori
      kategoriId: {
        type: Sequelize.UUID, // Harus sama tipenya dengan ID di tabel Kategori
        allowNull: false,
        references: {
          model: 'Kategoris', // Nama tabel tujuan (Induknya)
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Jangan lupa fungsi buat hapus tabel kalau mau di-undo
    await queryInterface.dropTable('Menus');
  }
};