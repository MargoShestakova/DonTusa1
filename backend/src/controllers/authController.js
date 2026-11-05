const pool = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

async function register(req, res) {
  try {
    const { full_name, email, phone, password, role_name } = req.body;

    if (!full_name || !email || !password || !role_name) {
      return res.status(400).json({ success: false, message: 'Р’СЃРµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹Рµ РїРѕР»СЏ РґРѕР»Р¶РЅС‹ Р±С‹С‚СЊ Р·Р°РїРѕР»РЅРµРЅС‹' });
    }

    // РџСЂРѕРІРµСЂСЏРµРј СЃСѓС‰РµСЃС‚РІРѕРІР°РЅРёРµ email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃ С‚Р°РєРёРј email СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚' });
    }

    // РќР°С…РѕРґРёРј СЂРѕР»СЊ
    const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [role_name]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'РЈРєР°Р·Р°РЅРЅР°СЏ СЂРѕР»СЊ РЅРµ РЅР°Р№РґРµРЅР°' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (role_id, full_name, email, phone, password_hash, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, full_name, email, role_id, created_at`,
      [roleResult.rows[0].id, full_name, email, phone || null, passwordHash, true]
    );

    const user = result.rows[0];
    const roleName = role_name;

    const accessToken = generateAccessToken({ ...user, role: roleName });
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: 'Р РµРіРёСЃС‚СЂР°С†РёСЏ СѓСЃРїРµС€РЅР°',
      user: { id: user.id, full_name: user.full_name, email: user.email, role: roleName },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё:', err);
    res.status(500).json({ success: false, message: 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР° РїСЂРё СЂРµРіРёСЃС‚СЂР°С†РёРё' });
  }
}

async function login(req, res) {
  try {
    const { login, email, password } = req.body;

    if ((!login && !email) || !password) {
      return res.status(400).json({ success: false, message: 'Р›РѕРіРёРЅ/email Рё РїР°СЂРѕР»СЊ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹' });
    }

    const loginOrEmail = login || email;

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.full_name, u.phone, u.password_hash, u.role_id, u.is_active, u.avatar_path, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE (u.email = $1 OR u.full_name = $1)`,
      [loginOrEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'РќРµРІРµСЂРЅС‹Р№ Р»РѕРіРёРЅ/email РёР»Рё РїР°СЂРѕР»СЊ' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'РЈС‡С‘С‚РЅР°СЏ Р·Р°РїРёСЃСЊ Р·Р°Р±Р»РѕРєРёСЂРѕРІР°РЅР°' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'РќРµРІРµСЂРЅС‹Р№ Р»РѕРіРёРЅ/email РёР»Рё РїР°СЂРѕР»СЊ' });
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role_name,
    });
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Р’С…РѕРґ РІС‹РїРѕР»РЅРµРЅ',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        role: user.role_name,
        avatar_path: user.avatar_path,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('РћС€РёР±РєР° РІС…РѕРґР°:', err);
    res.status(500).json({ success: false, message: 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР° РїСЂРё РІС…РѕРґРµ' });
  }
}

async function me(req, res) {
  try {
    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role_id, u.is_active, u.avatar_path, u.created_at, u.updated_at,
              r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РїСЂРѕС„РёР»СЏ:', err);
    res.status(500).json({ success: false, message: 'РћС€РёР±РєР° СЃРµСЂРІРµСЂР°' });
  }
}

async function logout(req, res) {
  res.json({ success: true, message: 'Р’С‹С…РѕРґ РІС‹РїРѕР»РЅРµРЅ' });
}

module.exports = { register, login, me, logout };

