const express = require('express');
const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient('http://localhost:5001');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Welcome to my IPFS app');
});

app.post('/upload', async (req, res) => {
    const data = req.body;
    console.log(data);
    const fileHash = await addFile(data);
    return res.send(`https://gateway.ipfs.io/ipfs/${ fileHash }`);
});

const addFile = async ({ path, content }) => {
    const file = { path: path, content: Buffer.from(content) };
    const filesAdded = await ipfs.add(file);
    return filesAdded[0].hash;
}

app.listen(3000, () => {
    console.log('Server running on port 3000');
});