import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.json()
    ),
    defaultMeta: { service: 'request-logging' },
    transports: [
        new winston.transports.File({ filename: 'logs.txt' })
    ]
});

const loggerMiddleware = async (req, res, next) => {
    if (!req.url.includes('signin') && !req.url.includes('signup')) {
        const logData = {
            timestamp: new Date().toISOString(),
            url: req.url,
            method: req.method,
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            // Add more fields as needed
        };

        logger.info(logData);
    }

    next();
};

export default loggerMiddleware;
