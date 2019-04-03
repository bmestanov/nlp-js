# NLP Tool for parsing conditions

## Main dependencies
* compromise
* word2vec
* string-similarity

## Setup

1. Download a pre-trained word2vec model. Some links:
  - [Google News (300M words)](https://github.com/eyaler/word2vec-slim/blob/master/GoogleNews-vectors-negative300-SLIM.bin.gz) (~1min load time, tests are run on this model)
  - [Google News (3B words)](https://drive.google.com/file/d/0B7XkCwpI5KDYNlNUTTlSS21pQmM/edit) (Make sure to have >8GB RAM)

2. Since loading the model from disk to memory is expensive and time-consuming, we'd like to do it once. For this, the `word2vec.js` script will initialize a process with a [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) server that will provide scoring for the main application. This way there's no need to load the word2vec model for each restart of the app. Create an `.env` file in the root of the folder with the following values:
```
WORD2VEC_BIN_PATH=
WORD2VEC_SERVER_PORT=
```

3. Install dependencies
```bash
npm install
```

## Start
```bash
node word2vec.js #start word2vec server
```

Now you're ready to use the parser - check exports of `parser.js`.

## How it works

1. Defining templates

Templates are defined in `templates.js`. Each one has the following form:
```js
gt: {
  label: 'gt',
  text: 'x is greater than y',
  statement: enums.statements.gt,
  getParams: getNumberParams,
  tags: ['large', 'big', 'more', 'great', 'high', 'above'],
},
```

The most important thing to note here is the tags. Tags are similar terms to be looked for in the sentence and support the scorers decisions.

2. Scoring

When a sentence is provided, it is cleaned from properties, values, dates to reduce noise. Then a mean vector is calculated of the remaining terms. The vector is compared by distance to the mean vector of each template's tags in the embedding.

As a measure for misspellings and cases like `great / greater`, a fuzzy matcher also is added to the score.

The final score is the distance minus `fuzzyCoeff` * the best match out of the tags.

### The score is a measure of loss, i.e. **the lower the score, the better**.

## Testing
```
npm test
```