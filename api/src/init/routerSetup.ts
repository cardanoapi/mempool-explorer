import { Express } from 'express';
import fs from 'fs';
import path from 'path';

const routerSetup = (app: Express) => {
    // Define the directory where your routers are located
    const baseRoutersDirectory = path.join(__dirname, '../routers');

    // Read the directories in the base routers directory
    const versionDirectories = fs.readdirSync(baseRoutersDirectory);

    // Iterate through each version directory
    versionDirectories.forEach((versionDirectory) => {
        const versionDirectoryPath = path.join(
            baseRoutersDirectory,
            versionDirectory
        );

        // Check if it's a directory
        if (fs.statSync(versionDirectoryPath).isDirectory()) {
            // Read the files in the version directory
            const routerFiles = fs.readdirSync(versionDirectoryPath);

            // Iterate through each router file and dynamically import and use it
            routerFiles.forEach((routerFile) => {
                // Extract the route name from the file name (remove "Router.ts" extension)
                const routeName = path
                    .basename(routerFile, path.extname(routerFile))
                    .replace('Router', '');

                // Dynamically import the router module
                const versionedRouter = require(
                    path.join(versionDirectoryPath, routerFile)
                ).default;

                console.log(
                    `Mounting ${versionDirectory}/${routeName} router...`
                );

                // Mount the router with the generated API URL
                app.use(
                    `/api/${versionDirectory}/${routeName}`,
                    versionedRouter
                );
            });
        }
    });
};

export default routerSetup;
