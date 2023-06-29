# Mempool Explorer Web Application (Next.js)

![Mempool Explorer](mempool-explorer.png)

This is a web application built using Next.js and Express for exploring and analyzing the transaction mempool of the Cardano blockchain network in real-time.

## Features

-   Real-time Monitoring: Stay updated with the latest transactions in the Cardano mempool.
-   Transaction Details: Access comprehensive information about individual transactions.
-   Fee Analysis: Analyze transaction fees within the Cardano network and track fee trends.
-   Sorting and Filtering: Customize your analysis by sorting and filtering transactions based on various parameters.
-   Visualization Tools: Visualize mempool activity through charts and graphs.
-   Historical Data: Explore past mempool activity and gain insights into transaction dynamics over time.
-   API Integration: Retrieve mempool data programmatically using the provided API.

## Getting Started

This is a mono repo which has both the client and server on the same repository. To run the application, follow the 
steps below:

 - Clone the repository: `git clone https://github.com/sireto/cardano-mempool-explorer-webapp`

After cloning the repository, we navigate to the `cardano-mempool-explorer`. Inside the directory, there are two
sub-directories namely `client` and `server`.

- To run the server, use the command `yarn start:server`
- to run the client , use the command `yarn start:client`

client runs on port `3000`. currently, server side is yet to be implemented.


## Acknowledgements

-   [Cardano](https://www.cardano.org) - The blockchain platform powering the Cardano network.
-   [Next.js](https://nextjs.org) - The React framework used for building this web application.
-   [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - A powerful data fetching and caching library for React and Redux applications. RTK Query is utilized in this project for efficient data retrieval and management from the Cardano network.

## Contact

For any inquiries or feedback, please contact [mempool-explorer@sireto.com]().
