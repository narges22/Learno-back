import http from 'http';
import _ from 'lodash';

const server = http.createServer((req, res) => {
    const number= _.random(0,20 )
    console.log('request mode',number);
});

server.listen(3000, 'localhost', () => {
    console.log('listening')
    
})