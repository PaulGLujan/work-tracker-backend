const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'paullujan',
    host: 'localhost',
    database: 'scratch',
    password: '',
    port: 5432,
});

const getTimes = (request, response) => {
    pool.query('SELECT * FROM times', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const postTime = (request, response) => {
    const { time } = request.body;
    pool.query(
        'INSERT INTO Times (time) VALUES ($1) RETURNING *',
        [time],
        (error, results) => {
            if (error) {
                throw error;
            }
            response
                .status(201)
                .send(`Time added with timestamp: ${results.rows[0].time}`);
        }
    );
};

module.exports = { getTimes, postTime };
