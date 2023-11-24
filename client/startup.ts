import { createRedisInstance } from '@app/configs/redis';

const start = async () => {
    // Initialize Redis connection
    createRedisInstance();

    // Periodically update cached data
    setInterval(async () => {
        try {
            // console.log('Updating cached data...');
            // TODO: Add a logic to update the cached data
            // console.log('Cached data updated successfully!');
        } catch (error) {
            console.error('Error updating cached data:', error);
        }
    }, 60 * 1000); // Update every 60 seconds
};

// Start the initialization process
start().then((r) => r);