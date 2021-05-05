module.exports = {
  configureWebpack:{
    devtool: 'source-map',
    devServer: {
      proxy: {
        '/ff14/uploads': {
          target: 'https://huiji-public.huijistatic.com/',
          changeOrigin: true,
          secure: false,
          bypass: (req, res) => {
            req.headers.referer = 'https://ff14.huijiwiki.com/';
          },
        },
      },
    },
    output: {
      filename: 'Submarine.js',
      chunkFilename: 'Submarine-chunk.js',
    },
  },
  css:{
    extract: {
      filename: 'Submarine.css',
    },
    loaderOptions:{
      less: {
        globalVars: {
          imgBaseUrl: process.env.NODE_ENV === 'production' ? '"https://huiji-public.huijistatic.com"' : '"http://localhost:8080"'
        }
      }
    },
  },  
  productionSourceMap: false,
  filenameHashing: false,
};
