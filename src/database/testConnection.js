const pool = require("./connection");

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexión a MySQL exitosa");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar:", error.message);
  }
}

testConnection();