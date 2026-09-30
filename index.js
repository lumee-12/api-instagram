const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/perfil', async (req, res) => {
  const usuario = req.query.usuario;
  if (!usuario) return res.status(400).json({ error: 'Usuário não informado' });

  try {
    const response = await axios.get('https://instagram-looter2.p.rapidapi.com/user/info', {
      params: { username: usuario },
      headers: {
        'x-rapidapi-key': '256947ffd3msh213f04ed6e5df42p153a86jsnb54889e031ac',
        'x-rapidapi-host': 'instagram-looter2.p.rapidapi.com'
      }
    });

    const data = response.data;

    res.json({
      foto: data.profile_pic_url_hd || data.profile_pic_url || '',
      posts: data.media_count !== undefined ? data.media_count : 0,
      seguidores: data.follower_count ? (data.follower_count > 1000000 ? (data.follower_count / 1000000).toFixed(1) + ' mi' : data.follower_count) : '0',
      seguindo: data.following_count !== undefined ? data.following_count : 0,
      bio: data.biography || ''
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil no Instagram' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Servidor rodando na porta ${PORT}));
