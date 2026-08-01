import { createServer } from "http";
import { host, port, sites } from "./env";
import { logger } from "./logger";
import { StatusCodes } from "http-status-codes";
import { generateXml } from "./booruApi";

logger.info(`Support enabled for sites: [${sites.map(s => s.host).join(", ")}]`);

const server = createServer((req, res) => {
    try {
        if (req.url?.match('^/.+/rss\\.xml$') ||
            req.url?.match('^/.+/rss$') ||
            req.url?.endsWith('/')
            ) {
            logger.info("Handling request for url " + req.url.toString());
            const site = decodeURI(req.url.substring(1, req.url.lastIndexOf("/")));
            if (!URL.canParse(site)) {
                res.writeHead(StatusCodes.BAD_REQUEST, {"content-type": "text/html"})
                    .write("Site could not be parsed.");
                return res.end();
            }

            const url = new URL(site);
            const siteObject = sites.find(s => s.host === url.host.toLowerCase());
            if (!siteObject) {
                res.writeHead(StatusCodes.FORBIDDEN, {"content-type": "text/html"})
                    .write("Support for this site is not enabled on this instance.");
                return res.end();
            }

            generateXml(url, siteObject.apiKey).then((posts) => {
                res.writeHead(StatusCodes.OK, {
                    "content-type": "application/rss+xml",
                    "content-disposition": "inline; filename=\"rss.xml\""
                })
                    .write(posts);
                res.end();
            }).catch((error) => {
                logger.error(error);
                if (error instanceof Error)
                res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {"content-type": "text/html"})
                    .write("Error 500: " + error.message);
                res.end();
            });
        } else if (!req.url?.endsWith('/')) {
            res.writeHead(StatusCodes.MOVED_PERMANENTLY, {
                'location': req.url + '/'
            });
            res.end();
        } else {
            res.writeHead(StatusCodes.NOT_FOUND, {"content-type": "text/html"})
                .write("404 not found.");
            res.end();
        }
    } catch (e: unknown) {
        logger.error(e);
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {"content-type": "text/html"})
            .write("Internal server error.");
        res.end();
    }
});

server.listen(port, host);
logger.info(`Listening on http://${host}:${port}`);
