const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/perfil', async (req, res) => {
  const usuario = req.query.usuario;
  if (!usuario) return res.status(400).json({ error: 'Usuário não informado' });

  try {
    const response = await axios.get('https://instagram-looter2.p.rapidapi.com/profile', {
      params: { username: usuario },
      headers: {
        'x-rapidapi-key': '256947ffd3msh213f04ed6e5df42p153a86jsnb54889e031ac',
        'x-rapidapi-host': 'instagram-looter2.p.rapidapi.com'
      }
    });

    const data = response.data;

    // Trata foto e bio (sempre públicas no Instagram)
    const foto = data.profile_pic_url_hd || data.profile_pic_url || data.pic || '';
    const bio = data.biography || data.bio || '';
    const isPrivate = data.is_private || false;

    // Mapeamento de métricas
    const rawSeguidores = data.edge_followed_by?.count || data.follower_count || data.followers || data.followers_count || 0;
    const rawPosts = data.edge_owner_to_timeline_media?.count || data.media_count || data.posts || 0;
    const rawSeguindo = data.edge_follow?.count || data.following_count || data.following || 0;

    // Formatação de seguidores
    let seguidoresFormatado = rawSeguidores;
    if (typeof rawSeguidores === 'number' && rawSeguidores > 0) {
      if (rawSeguidores >= 1000000) {
        seguidoresFormatado = (rawSeguidores / 1000000).toFixed(1) + ' mi';
      } else if (rawSeguidores >= 1000) {
        seguidoresFormatado = (rawSeguidores / 1000).toFixed(1) + ' k';
      }
    }

    res.json({
      privado: isPrivate,
      foto: foto,
      posts: rawPosts,
      seguidores: seguidoresFormatado,
      seguindo: rawSeguindo,
      bio: bio
    });

  } catch (error) {
    console.log('ERRO DETALHADO:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Erro ao buscar perfil no Instagram',
      detalhes: error.response ? error.response.data : error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando'));
