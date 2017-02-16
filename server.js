/* eslint no-console: 0 */

import Path from 'path';
import Express from 'express';
import Webpack from 'webpack';
import WebpackMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = new Express;

if (isDeveloping) {
  const compiler = new Webpack(Config);
  const middleware = new WebpackMiddleware(compiler, {
    publicPath: Config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(WebpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(Path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(Express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(Path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
