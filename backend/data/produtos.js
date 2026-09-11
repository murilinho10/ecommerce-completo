// Dados fixos em memória — resetam quando o servidor reinicia
let produtos = [
  {
    id: 1,
    nome: 'Fone de Ouvido Bluetooth',
    descricao: 'Fone sem fio com cancelamento de ruído e 20h de bateria.',
    preco: 189.90,
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    categoria: 'Áudio',
    estoque: 15
  },
  {
    id: 2,
    nome: 'Mouse Gamer RGB',
    descricao: 'Mouse óptico com 7200 DPI ajustável e iluminação RGB.',
    preco: 129.90,
    imagem: 'https://images.unsplash.com/photo-1616296425622-4560a2ad83de?w=600&auto=format&fit=crop&q=80',
    categoria: 'Periféricos',
    estoque: 20
  },
  {
    id: 3,
    nome: 'Teclado Mecânico',
    descricao: 'Teclado mecânico switch blue, ABNT2, iluminação branca.',
    preco: 249.90,
    imagem: 'https://images.unsplash.com/photo-1631552638136-6268a113b3c8?w=600&auto=format&fit=crop&q=80',
    categoria: 'Periféricos',
    estoque: 10
  },
  {
    id: 4,
    nome: 'Carregador Portátil 10000mAh',
    descricao: 'Power bank compacto com carga rápida USB-C.',
    preco: 89.90,
    imagem: 'https://images.unsplash.com/photo-1604160687800-f7799a525a33?w=600&auto=format&fit=crop&q=80',
    categoria: 'Acessórios',
    estoque: 30
  },
  {
    id: 5,
    nome: 'Smartwatch Fitness',
    descricao: 'Relógio inteligente com monitor cardíaco e GPS.',
    preco: 349.90,
    imagem: 'https://images.unsplash.com/photo-1523755621014-30c8a5029566?w=600&auto=format&fit=crop&q=80',
    categoria: 'Wearables',
    estoque: 8
  },
  {
    id: 6,
    nome: 'Caixa de Som Bluetooth',
    descricao: 'Caixa portátil à prova d\'água com 12h de autonomia.',
    preco: 159.90,
    imagem: 'https://images.unsplash.com/photo-1549400854-b4300f444934?w=600&auto=format&fit=crop&q=80',
    categoria: 'Áudio',
    estoque: 12
  },
  {
    id: 7,
    nome: 'Webcam Full HD',
    descricao: 'Webcam 1080p com microfone embutido para streaming.',
    preco: 199.90,
    imagem: 'https://images.unsplash.com/photo-1750975314977-374f2290db53?w=600&auto=format&fit=crop&q=80',
    categoria: 'Periféricos',
    estoque: 18
  },
  {
    id: 8,
    nome: 'Suporte para Notebook',
    descricao: 'Suporte ergonômico ajustável em alumínio.',
    preco: 79.90,
    imagem: 'https://images.unsplash.com/photo-1510852151262-05bfbfbe996d?w=600&auto=format&fit=crop&q=80',
    categoria: 'Acessórios',
    estoque: 25
  },
  {
    id: 9,
    nome: 'HD Externo 1TB',
    descricao: 'Armazenamento portátil USB 3.0, compacto e resistente.',
    preco: 299.90,
    imagem: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop&q=80',
    categoria: 'Armazenamento',
    estoque: 14
  },
  {
    id: 10,
    nome: 'Hub USB-C 6 em 1',
    descricao: 'Adaptador com HDMI, USB 3.0, leitor de cartão e USB-C PD.',
    preco: 119.90,
    imagem: 'https://images.unsplash.com/photo-1619459072761-496c0812331b?w=600&auto=format&fit=crop&q=80',
    categoria: 'Acessórios',
    estoque: 22
  }
];

module.exports = {
  listarTodos: () => produtos,
  buscarPorId: (id) => produtos.find(p => p.id === Number(id)),
  reduzirEstoque: (id, quantidade) => {
    const produto = produtos.find(p => p.id === Number(id));
    if (produto) produto.estoque -= quantidade;
    return produto;
  }
};
