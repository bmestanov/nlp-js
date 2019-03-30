/* eslint-disable no-console */
require('dotenv').config();
const dnode = require('dnode');

let instance = null;

class SentenceScorer {
  static getInstance() {
    if (instance) {
      return Promise.resolve(instance);
    }
    return new Promise((resolve, reject) => {
      const client = dnode.connect(process.env.WORD2VEC_SERVER_PORT);
      client
        .on('remote', (remote) => {
          instance = {
            score: sentence => new Promise((res, rej) => {
              remote.getScores(sentence, (err, result) => (err ? rej(err) : res(result)));
            }),
          };
          resolve(instance);
        })
        .on('error', (err) => {
          console.error(err);
          reject(
            new Error('word2vec server is down. Execute "npm run word2vec" first.'),
          );
        });
      process.on('SIGABRT', () => client.end());
    });
  }
}

module.exports = {
  SentenceScorer,
};
